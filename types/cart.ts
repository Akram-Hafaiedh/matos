import { MenuItem, Promotion } from "./menu";

export interface CartItem {
    item: MenuItem | Promotion;
    type: 'menuItem' | 'promotion';
    quantity: number;
    selectedSize?: string;
    choices?: any;
}