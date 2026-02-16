/**
 * lib/geocoding.ts
 * 
 * Multi-provider geocoding with fallback support
 */

import { prisma } from '@/lib/prisma';

interface GeocodingResult {
    lat: number;
    lng: number;
    displayName: string;
    confidence?: number;
}

/**
 * Tracks geocoding request counts by provider
 */
async function incrementGeocodingCount(provider: string) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await prisma.geocoding_stats.upsert({
            where: {
                provider_date: {
                    provider,
                    date: today
                }
            },
            update: {
                count: {
                    increment: 1
                }
            },
            create: {
                provider,
                date: today,
                count: 1
            }
        });
    } catch (error) {
        console.error(`Failed to increment geocoding count for ${provider}:`, error);
    }
}

/**
 * Cleans the address to avoid redundancy and improve matching
 */
function cleanAddress(address: string, city: string = 'Tunis'): string {
    let cleaned = address.trim();

    // Remove trailing "Tunisia" or "Tunisie" or "Tunis" if present to avoid doubling up
    cleaned = cleaned.replace(/,\s*tunisia$/i, '');
    cleaned = cleaned.replace(/,\s*tunisie$/i, '');
    cleaned = cleaned.replace(/,\s*tunis$/i, '');

    const lowerAddr = cleaned.toLowerCase();
    const lowerCity = city.toLowerCase();

    // If the address already contains the city, don't append it again
    if (lowerAddr.includes(lowerCity)) {
        return `${cleaned}, Tunisia`;
    }

    return `${cleaned}, ${city}, Tunisia`;
}

/**
 * LocationIQ geocoder - Better accuracy than Nominatim
 */
async function geocodeWithLocationIQ(address: string, city: string = 'Tunis'): Promise<GeocodingResult | null> {
    const LOCATIONIQ_API_KEY = process.env.LOCATIONIQ_API_KEY;
    if (!LOCATIONIQ_API_KEY) {
        console.warn('LocationIQ API key not configured, skipping...');
        return null;
    }

    try {
        await incrementGeocodingCount('locationiq');
        const fullAddress = cleanAddress(address, city);
        const encodedAddress = encodeURIComponent(fullAddress);

        const url = `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_API_KEY}&q=${encodedAddress}&format=json&limit=1&countrycodes=tn`;

        const response = await fetch(url, {
            next: { revalidate: 86400 } // Cache for 24 hours
        });

        if (!response.ok) {
            console.error('LocationIQ API error:', response.statusText);
            return null;
        }

        const data = await response.json();

        if (data && data.length > 0) {
            // Check if it's just returning the city center (low importance)
            if (data[0].importance < 0.2 && data[0].display_name.toLowerCase().startsWith('tunis')) {
                console.warn('LocationIQ returned low confidence city center, ignoring...');
                return null;
            }

            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                displayName: data[0].display_name,
                confidence: data[0].importance // LocationIQ confidence score
            };
        }

        return null;
    } catch (error) {
        console.error('LocationIQ geocoding failed:', error);
        return null;
    }
}

/**
 * Nominatim geocoder - Free fallback
 */
async function geocodeWithNominatim(address: string, city: string = 'Tunis'): Promise<GeocodingResult | null> {
    try {
        await incrementGeocodingCount('nominatim');
        const fullAddress = cleanAddress(address, city);
        const encodedAddress = encodeURIComponent(fullAddress);

        const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&countrycodes=tn&addressdetails=1`;

        // Respect Nominatim usage policy: 1 req/second
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(url, {
            headers: {
                'User-Agent': "Matos-Food-App (contact: hello@matos.tn)"
            },
            next: { revalidate: 86400 }
        });

        if (!response.ok) {
            console.error('Nominatim API error:', response.statusText);
            return null;
        }

        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                displayName: data[0].display_name
            };
        }

        return null;
    } catch (error) {
        console.error('Nominatim geocoding failed:', error);
        return null;
    }
}

/**
 * OpenCage geocoder - Another free option
 */
async function geocodeWithOpenCage(address: string, city: string = 'Tunis'): Promise<GeocodingResult | null> {
    const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

    if (!OPENCAGE_API_KEY) {
        console.warn('OpenCage API key not configured, skipping...');
        return null;
    }

    try {
        await incrementGeocodingCount('opencage');
        const fullAddress = cleanAddress(address, city);
        const encodedAddress = encodeURIComponent(fullAddress);

        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${OPENCAGE_API_KEY}&countrycode=tn&limit=1`;

        const response = await fetch(url, {
            next: { revalidate: 86400 }
        });

        if (!response.ok) {
            console.error('OpenCage API error:', response.statusText);
            return null;
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const result = data.results[0];

            // Check if it's just a city/state result (Confidence 6 means city level usually)
            if (result.confidence <= 6 && (result.components._type === 'city' || result.components._type === 'state')) {
                console.warn('OpenCage returned low confidence city center, ignoring...');
                return null;
            }

            return {
                lat: result.geometry.lat,
                lng: result.geometry.lng,
                displayName: result.formatted,
                confidence: result.confidence
            };
        }

        return null;
    } catch (error) {
        console.error('OpenCage geocoding failed:', error);
        return null;
    }
}

/**
 * Main geocoding function with multi-provider fallback and degrading search
 */
export async function geocodeAddress(address: string, city: string = 'Tunis'): Promise<GeocodingResult | null> {
    if (!address) return null;

    // 1. Try full cleaned address
    let result = await geocodeWithLocationIQ(address, city);
    if (result) {
        console.log('✓ Geocoded with LocationIQ (High Confidence)');
        return result;
    }

    result = await geocodeWithOpenCage(address, city);
    if (result) {
        console.log('✓ Geocoded with OpenCage (High Confidence)');
        return result;
    }

    // 2. Degrading fallback: If the full address failed, try simpler versions
    // Often users put zip codes or neighborhood names that confuse the geocoder
    const addressParts = address.split(',').map(p => p.trim()).filter(p => p);

    if (addressParts.length > 1) {
        console.log('Trying simplified address fallback...');

        // Strategy A: Only the first part (street) + City
        // "2 rue ibn kouldoun, carthage amilcar 2016" -> "2 rue ibn kouldoun, Tunis"
        const simplifiedAddress = addressParts[0];
        result = await geocodeWithOpenCage(simplifiedAddress, city);
        if (result) {
            console.log(`✓ Geocoded with simplified address: ${simplifiedAddress}`);
            return result;
        }

        // Strategy B: If the address contained another city name (like Carthage)
        // search for that city explicitly
        for (const part of addressParts) {
            const lowerPart = part.toLowerCase();
            if (lowerPart !== city.toLowerCase() && ['carthage', 'marsa', 'goulette', 'ariana', 'bardo'].includes(lowerPart)) {
                console.log(`Found alternative city/neighborhood in address: ${part}. Retrying...`);
                result = await geocodeWithOpenCage(simplifiedAddress, part);
                if (result) return result;
            }
        }
    }

    // 3. Nominatim as last resort (no confidence check here usually)
    result = await geocodeWithNominatim(address, city);
    if (result) {
        console.log('✓ Geocoded with Nominatim (Fallback)');
        return result;
    }

    console.error('All geocoding providers failed for:', address);
    return null;
}
