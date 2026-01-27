import { MenuItem } from "./menu";

export interface CartItem {
    item: MenuItem;
    quantity: number;
    selectedSize?: string; // For pizzas (xl/xxl) and tacos
}