import { prisma } from './prisma';

async function getSMSConfig() {
    try {
        const config = await prisma.sms_settings.findFirst({
            where: { id: 1 }
        });
        return config;
    } catch (error) {
        console.error('Error fetching SMS config:', error);
        return null;
    }
}

export async function sendSMSToRestaurant(order: any) {
    const config = await getSMSConfig();
    if (!config || !config.is_active) {
        console.log('🚫 SMS to restaurant disabled or not configured');
        return;
    }

    const message = `🔔 Nouvelle commande #${order.orderNumber}
Client: ${order.customer_name}
Tel: ${order.customer_phone}
Total: ${order.total_amount} DT
Adresse: ${order.delivery_address}`;

    // Router-based provider selection
    switch (config.provider) {
        case 'simulator':
            console.log('📟 [SMS SIMULATOR] To Restaurant:', message);
            break;
        case 'twilio':
            console.log('☁️ [TWILIO] Routing SMS to restaurant via Twilio API...');
            break;
        case 'ooredoo':
            console.log('🔴 [OOREDOO] Routing SMS to restaurant via Ooredoo Tunisia Gateway...');
            break;
        case 'tt':
            console.log('🔵 [TT] Routing SMS to restaurant via Tunisie Telecom API...');
            break;
        case 'orange':
            console.log('🟠 [ORANGE] Routing SMS to restaurant via Orange Tunisia API...');
            break;
        default:
            console.log(`⚠️ Provider ${config.provider} not implemented`);
    }
}

export async function sendSMSToCustomer(order: any, messageType: 'confirmation' | 'ready' | 'delivery') {
    const config = await getSMSConfig();
    if (!config || !config.is_active) return;

    let message = '';
    const name = order.customer_name?.split(' ')[0] || 'Client';

    if (messageType === 'confirmation') {
        message = `✅ Salut ${name}, ta commande #${order.orderNumber} est confirmée. Total: ${order.total_amount} DT. Merci de ta confiance ! - Mato's`;
    } else if (messageType === 'ready') {
        message = `🔥 Bonne nouvelle ${name} ! Ta commande #${order.orderNumber} est prête. À table ! - Mato's`;
    } else if (messageType === 'delivery') {
        message = `🛵 ${name}, ton livreur est en route avec ta commande #${order.orderNumber}. Prépare-toi à déguster ! - Mato's`;
    }

    switch (config.provider) {
        case 'simulator':
            console.log(`📟 [SMS SIMULATOR] To Customer (${order.customer_phone}):`, message);
            break;
        case 'twilio':
            console.log(`☁️ [TWILIO] Sending SMS to ${order.customer_phone} via Twilio...`);
            break;
        case 'ooredoo':
            console.log(`🔴 [OOREDOO] Sending SMS to ${order.customer_phone} via Ooredoo Tunisia...`);
            break;
        case 'tt':
            console.log(`🔵 [TT] Sending SMS to ${order.customer_phone} via TT...`);
            break;
        case 'orange':
            console.log(`🟠 [ORANGE] Sending SMS to ${order.customer_phone} via Orange...`);
            break;
        default:
            console.log(`⚠️ Provider ${config.provider} not implemented`);
    }
}

export async function sendReservationSMS(reservation: any, type: 'pending' | 'confirmed' | 'cancelled') {
    const config = await getSMSConfig();
    if (!config || !config.is_active) return;

    const name = reservation.customer_name?.split(' ')[0] || 'Client';
    const date = new Date(reservation.reservation_date).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
    });

    let message = '';
    if (type === 'pending') {
        message = `🕒 Salut ${name}, nous avons bien reçu ta demande de réservation pour le ${date}. On te confirme ça vite ! - Mato's`;
    } else if (type === 'confirmed') {
        message = `✨ Confirmé ! ${name}, ta table est réservée pour le ${date}${reservation.table_number ? ` (Table #${reservation.table_number})` : ''}. À bientôt ! - Mato's`;
    } else if (type === 'cancelled') {
        message = `🙏 Désolé ${name}, nous ne pouvons pas honorer ta réservation pour le ${date}. N'hésite pas à essayer un autre créneau ! - Mato's`;
    }

    switch (config.provider) {
        case 'simulator':
            console.log(`📟 [SMS SIMULATOR] Reservation (${reservation.customer_phone}):`, message);
            break;
        case 'twilio':
            console.log(`☁️ [TWILIO] Reservation SMS to ${reservation.customer_phone} via Twilio...`);
            break;
        case 'ooredoo':
            console.log(`🔴 [OOREDOO] Reservation SMS to ${reservation.customer_phone} via Ooredoo TN...`);
            break;
        case 'tt':
            console.log(`🔵 [TT] Reservation SMS to ${reservation.customer_phone} via TT...`);
            break;
        case 'orange':
            console.log(`🟠 [ORANGE] Reservation SMS to ${reservation.customer_phone} via Orange...`);
            break;
        default:
            console.log(`⚠️ Provider ${config.provider} for reservation not implemented`);
    }
}