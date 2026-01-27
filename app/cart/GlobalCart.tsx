'use client';

import { useState } from "react";
import { useCart } from "./CartContext";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

export default function GlobalCart() {

    const [cartOpen, setCartOpen] = useState(false);

    const { cart, removeFromCart, addToCart, clearCart, getTotalPrice, getTotalItems } = useCart();

    const totalItems = getTotalItems();

    // Don't show anything if cart is empty
    if (totalItems === 0) {
        return null;
    }
    return (
        <>
            {/* Floating Cart Button - Bottom Right */}
            <button
                onClick={() => setCartOpen(true)}
                className="fixed bottom-8 right-8 bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-4 rounded-full shadow-2xl font-black text-lg z-40 flex items-center gap-3 transition transform hover:scale-105 animate-bounce-in"
            >
                <ShoppingBag className="w-6 h-6" />
                <span>{totalItems}</span>
                <span className="hidden sm:inline">{getTotalPrice().toFixed(1)} DT</span>
            </button>

            {/* Cart Sidebar - Slides from right */}
            <div
                className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ${cartOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">

                    {/* Header */}
                    <div className="bg-gray-800 p-6 flex items-center justify-between border-b border-gray-700">
                        <h2 className="text-2xl font-black text-white flex items-center gap-2">
                            <ShoppingBag className="w-6 h-6" />
                            Votre Panier
                        </h2>
                        <button
                            onClick={() => setCartOpen(false)}
                            className="text-gray-400 hover:text-white transition"
                            aria-label="Fermer le panier"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Cart Items - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {Object.entries(cart).map(([key, cartItem]) => {
                            const { item, quantity, selectedSize } = cartItem;

                            // Calculate price for this item
                            let itemPrice = 0;
                            if (typeof item.price === 'number') {
                                itemPrice = item.price;
                            } else if (item.price && typeof item.price === 'object' && selectedSize) {
                                itemPrice = item.price[selectedSize] || 0;
                            }

                            return (
                                <div
                                    key={key}
                                    className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition"
                                >
                                    <div className="flex items-start gap-3">

                                        {/* Item Image */}
                                        <div className="w-12 h-12 flex-shrink-0 bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                                            {item.image.startsWith('/') ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-2xl">{item.image}</span>
                                            )}
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white text-sm">
                                                {item.name}
                                                {selectedSize && (
                                                    <span className="ml-2 text-yellow-400 text-xs">
                                                        ({selectedSize.toUpperCase()})
                                                    </span>
                                                )}
                                            </h3>

                                            {/* Show ingredients if available */}
                                            {item.ingredients && (
                                                <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                                                    {item.ingredients}
                                                </p>
                                            )}

                                            {/* Price */}
                                            {itemPrice > 0 && (
                                                <p className="text-yellow-400 font-bold text-lg mt-2">
                                                    {(itemPrice * quantity).toFixed(1)} DT
                                                </p>
                                            )}
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
                                                <button
                                                    onClick={() => removeFromCart(key)}
                                                    className="bg-gray-600 hover:bg-red-600 text-white p-1.5 rounded-lg transition"
                                                    aria-label="Diminuer la quantité"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>

                                                <span className="text-white font-bold w-8 text-center">
                                                    {quantity}
                                                </span>

                                                <button
                                                    onClick={() => addToCart(item, selectedSize)}
                                                    className="bg-gray-600 hover:bg-yellow-400 hover:text-gray-900 text-white p-1.5 rounded-lg transition"
                                                    aria-label="Augmenter la quantité"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer - Total & Actions */}
                    <div className="bg-gray-800 p-6 border-t border-gray-700 space-y-4">

                        {/* Total Price */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xl font-bold text-white">Total</span>
                            <span className="text-3xl font-black text-yellow-400">
                                {getTotalPrice().toFixed(1)} DT
                            </span>
                        </div>

                        {/* Order Button */}
                        <button
                            className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-4 rounded-xl font-black text-lg transition shadow-lg"
                            onClick={() => {
                                // TODO: Implement order functionality
                                alert('Commande à implémenter !');
                            }}
                        >
                            Commander Maintenant
                        </button>

                        {/* Clear Cart Button */}
                        <button
                            onClick={() => {
                                if (confirm('Voulez-vous vraiment vider le panier ?')) {
                                    clearCart();
                                    setCartOpen(false);
                                }
                            }}
                            className="w-full bg-gray-700 hover:bg-red-600 text-white py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Vider le panier
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay - Dark background when cart is open */}
            {cartOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-slide-down"
                    onClick={() => setCartOpen(false)}
                />
            )}
        </>
    )
}