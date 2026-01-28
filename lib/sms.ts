export async function sendSMSToRestaurant(order: any) {
    // Example using a generic SMS API
    try {
        const message = `🔔 Nouvelle commande #${order.orderNumber}
        Client: ${order.deliveryInfo.fullName}
        Tel: ${order.deliveryInfo.phone}
        Total: ${order.finalTotal} DT
        Adresse: ${order.deliveryInfo.address}`;

        // TODO: Replace with your SMS provider API
        // const response = await fetch('YOUR_SMS_API_ENDPOINT', {
        //     method: 'POST',
        //     headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
        //     body: JSON.stringify({
        //         to: 'RESTAURANT_PHONE',
        //         message
        //     })
        // });

        console.log('SMS to restaurant:', message);
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
}

export async function sendSMSToCustomer(order: any) {
    try {
        const message = `Merci! Votre commande #${order.orderNumber} a été reçue. 
        Montant: ${order.finalTotal} DT
        Livraison: 30-45 min
        Mato's Restaurant`;

        // TODO: Replace with your SMS provider
        console.log('SMS to customer:', message);
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
}