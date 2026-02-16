/**
 * lib/delivery-estimation.ts
 * 
 * Delivery time estimation system for Mato's
 */

import { prisma } from "@/lib/prisma";

// HQ Coordinates (Mato's Carthage)
export const HQ_LAT = 36.8391486;
export const HQ_LNG = 10.3200549;

interface DeliveryEstimationParams {
    restaurantLat: number;
    restaurantLng: number;
    customerLat: number;
    customerLng: number;
    orderType: 'delivery' | 'pickup';
    cartItems: number; // Total number of items
    timeOfDay: Date;
    dayOfWeek: number; // 0-6
    weatherCondition?: 'clear' | 'rain' | 'heavy_rain';
}

interface DeliveryEstimate {
    prepTime: number; // minutes
    travelTime: number; // minutes
    totalTime: number; // minutes
    confidence: 'low' | 'medium' | 'high';
    range: { min: number; max: number }; // Time range in minutes
}

const TRAFFIC_MULTIPLIERS = {
    // Peak hours (lunch: 12-14h, dinner: 19-21h)
    peak: 1.5,
    // Moderate hours
    moderate: 1.2,
    // Off-peak hours
    offPeak: 1.0
};

const WEATHER_MULTIPLIERS = {
    clear: 1.0,
    rain: 1.4, // Re-tuned significantly for Tunisian roads
    heavy_rain: 1.8
};

const DAY_MULTIPLIERS = {
    weekday: 1.0,
    friday: 1.2, // Fridays can be busier in Tunisia
    weekend: 1.1
};

/**
 * Calculate straight-line distance between two points (Haversine formula)
 */
function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Estimate food preparation time based on order complexity
 */
function estimatePrepTime(cartItems: number): number {
    // Base prep time: 15 minutes
    const baseTime = 15;

    // Add time per item (diminishing returns for bulk prep)
    if (cartItems <= 3) return baseTime;
    if (cartItems <= 6) return baseTime + 5;
    if (cartItems <= 10) return baseTime + 10;
    return baseTime + 15;
}

/**
 * Get traffic multiplier based on time of day
 */
function getTrafficMultiplier(timeOfDay: Date): number {
    const hour = timeOfDay.getHours();

    // Lunch rush: 12:00-14:00
    if (hour >= 12 && hour < 14) return TRAFFIC_MULTIPLIERS.peak;

    // Dinner rush: 19:00-21:00
    if (hour >= 19 && hour < 21) return TRAFFIC_MULTIPLIERS.peak;

    // Moderate traffic: 11:00-12:00, 14:00-19:00, 21:00-22:00
    if ((hour >= 11 && hour < 12) ||
        (hour >= 14 && hour < 19) ||
        (hour >= 21 && hour < 22)) {
        return TRAFFIC_MULTIPLIERS.moderate;
    }

    // Off-peak
    return TRAFFIC_MULTIPLIERS.offPeak;
}

/**
 * Get day-of-week multiplier
 */
function getDayMultiplier(dayOfWeek: number): number {
    if (dayOfWeek === 5) return DAY_MULTIPLIERS.friday; // Friday
    if (dayOfWeek === 0 || dayOfWeek === 6) return DAY_MULTIPLIERS.weekend; // Weekend
    return DAY_MULTIPLIERS.weekday;
}

/**
 * Tracks weather API request counts
 */
async function incrementWeatherCount() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await prisma.geocoding_stats.upsert({
            where: {
                provider_date: {
                    provider: 'openweathermap',
                    date: today
                }
            },
            update: {
                count: {
                    increment: 1
                }
            },
            create: {
                provider: 'openweathermap',
                date: today,
                count: 1
            }
        });
    } catch (error) {
        console.error('Failed to increment weather count:', error);
    }
}

/**
 * Estimate travel time based on distance and conditions
 */
function estimateTravelTime(
    distance: number,
    timeOfDay: Date,
    dayOfWeek: number,
    weatherCondition: string = 'clear'
): number {
    // Average speed in Tunis: 20 km/h in city traffic
    const baseSpeed = 20; // km/h

    // Calculate base travel time
    let travelTime = (distance / baseSpeed) * 60; // Convert to minutes

    // Apply traffic multiplier
    const trafficMultiplier = getTrafficMultiplier(timeOfDay);
    travelTime *= trafficMultiplier;

    // Apply day multiplier
    const dayMultiplier = getDayMultiplier(dayOfWeek);
    travelTime *= dayMultiplier;

    // Apply weather multiplier
    const weatherMultiplier = WEATHER_MULTIPLIERS[weatherCondition as keyof typeof WEATHER_MULTIPLIERS] || 1.0;
    travelTime *= weatherMultiplier;

    // Add buffer for parking/finding address (3 minutes)
    travelTime += 3;

    return Math.round(travelTime);
}

/**
 * Main estimation function
 */
export async function estimateDeliveryTime(params: DeliveryEstimationParams): Promise<DeliveryEstimate> {
    const {
        restaurantLat,
        restaurantLng,
        customerLat,
        customerLng,
        orderType,
        cartItems,
        timeOfDay,
        dayOfWeek,
        weatherCondition = 'clear'
    } = params;

    // For pickup orders, only estimate prep time
    if (orderType === 'pickup') {
        let prepTime = estimatePrepTime(cartItems);

        // Multiplier for peaks even during pickup
        const hour = timeOfDay.getHours();
        if (hour >= 19 && hour <= 22) {
            prepTime *= getDayMultiplier(dayOfWeek);
        }

        const totalTime = Math.round(prepTime);
        return {
            prepTime: totalTime,
            travelTime: 0,
            totalTime,
            confidence: 'high',
            range: {
                min: Math.max(totalTime - 5, 10),
                max: totalTime + 5
            }
        };
    }

    // Calculate distance
    const distance = calculateDistance(
        restaurantLat,
        restaurantLng,
        customerLat,
        customerLng
    );

    // Estimate prep time
    let prepTime = estimatePrepTime(cartItems);
    const hour = timeOfDay.getHours();
    if (hour >= 19 && hour <= 22) {
        prepTime *= getDayMultiplier(dayOfWeek);
    }

    // Estimate travel time
    const travelTime = estimateTravelTime(
        distance,
        timeOfDay,
        dayOfWeek,
        weatherCondition
    );

    const totalTime = Math.round(prepTime + travelTime);

    // Determine confidence based on distance and conditions
    let confidence: 'low' | 'medium' | 'high' = 'high';

    if (distance > 5) {
        confidence = 'low';
    } else if (distance > 3 || weatherCondition !== 'clear') {
        confidence = 'medium';
    }

    // Peak hours reduce confidence
    if ((hour >= 12 && hour < 14) || (hour >= 19 && hour < 21)) {
        confidence = confidence === 'high' ? 'medium' : 'low';
    }

    // Calculate time range based on confidence
    const variance = confidence === 'high' ? 0.1 : confidence === 'medium' ? 0.15 : 0.2;
    const range = {
        min: Math.round(totalTime * (1 - variance)),
        max: Math.round(totalTime * (1 + variance))
    };

    return {
        prepTime: Math.round(prepTime),
        travelTime,
        totalTime,
        confidence,
        range
    };
}

/**
 * Format delivery estimate for display
 */
export function formatDeliveryEstimate(estimate: DeliveryEstimate): string {
    const { totalTime, range, confidence } = estimate;

    if (confidence === 'high') {
        return `${totalTime} min`;
    }

    return `${range.min}-${range.max} min`;
}

/**
 * Get weather condition via OpenWeatherMap API
 */
export async function getCurrentWeather(lat: number, lng: number): Promise<string> {
    try {
        const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
        if (!WEATHER_API_KEY) return 'clear';

        await incrementWeatherCount();

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}`,
            { next: { revalidate: 1800 } } // Cache for 30 minutes
        );

        if (!response.ok) return 'clear';

        const data = await response.json();
        const weatherMain = data.weather[0]?.main?.toLowerCase();

        if (weatherMain === 'rain' || weatherMain === 'drizzle') return 'rain';
        if (weatherMain === 'thunderstorm') return 'heavy_rain';

        return 'clear';
    } catch (error) {
        console.error('Weather fetch failed:', error);
        return 'clear';
    }
}
