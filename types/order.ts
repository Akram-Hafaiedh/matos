// types/order.ts
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
    id: string;
    orderNumber: string;
    cart: any; // Your cart items
    deliveryInfo: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        notes: string;
        deliveryTime: 'asap' | 'scheduled';
        scheduledTime?: string;
    };
    paymentMethod: 'cash' | 'd17';
    totalPrice: number;
    deliveryFee: number;
    finalTotal: number;
    status: OrderStatus;
    orderDate: string;
    confirmedAt?: string;
    deliveredAt?: string;
    createdAt: string;
    updatedAt: string;
}