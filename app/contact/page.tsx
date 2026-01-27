'use client';

import { useState } from 'react';
import { MapPin, Phone, Clock, Mail, Send, MessageCircle, Instagram, Facebook } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (formData.name && formData.email && formData.subject && formData.message) {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            }, 3000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 py-20">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl md:text-7xl font-black text-white mb-4">
                        Contactez <span className="text-yellow-400">Nous</span>
                    </h1>
                    <p className="text-2xl text-gray-400">On est là pour vous! Posez-nous vos questions</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    {/* Contact Form */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border-2 border-gray-700 shadow-2xl">
                        <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                            <MessageCircle className="w-8 h-8 text-yellow-400" />
                            Envoyez-nous un message
                        </h2>

                        {submitted ? (
                            <div className="bg-green-600 text-white p-8 rounded-2xl text-center animate-bounce-in">
                                <div className="text-6xl mb-4">✅</div>
                                <h3 className="text-2xl font-black mb-2">Message envoyé!</h3>
                                <p className="text-lg">Nous vous répondrons dans les plus brefs délais.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-white font-bold mb-2">Nom Complet *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border-2 border-gray-600 focus:border-yellow-400 focus:outline-none transition"
                                        placeholder="Votre nom"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white font-bold mb-2">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border-2 border-gray-600 focus:border-yellow-400 focus:outline-none transition"
                                            placeholder="votre@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white font-bold mb-2">Téléphone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border-2 border-gray-600 focus:border-yellow-400 focus:outline-none transition"
                                            placeholder="+216 XX XXX XXX"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white font-bold mb-2">Sujet *</label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border-2 border-gray-600 focus:border-yellow-400 focus:outline-none transition"
                                    >
                                        <option value="">Choisissez un sujet</option>
                                        <option value="commande">Commande</option>
                                        <option value="reservation">Réservation</option>
                                        <option value="suggestion">Suggestion</option>
                                        <option value="reclamation">Réclamation</option>
                                        <option value="autre">Autre</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-white font-bold mb-2">Message *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={6}
                                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl border-2 border-gray-600 focus:border-yellow-400 focus:outline-none transition resize-none"
                                        placeholder="Votre message..."
                                    ></textarea>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-yellow-400 text-gray-900 py-4 rounded-full font-black text-xl hover:bg-yellow-300 transition shadow-xl flex items-center justify-center gap-2 transform hover:scale-105"
                                >
                                    <Send className="w-6 h-6" />
                                    Envoyer le message
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        {/* Location */}
                        <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition">
                            <MapPin className="w-12 h-12 text-gray-900 mb-4" />
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Notre Adresse</h3>
                            <p className="text-gray-900 text-lg font-bold mb-4">
                                Avenue Habib Bourguiba<br />
                                Tunis, Tunisie<br />
                                Code Postal: 1000
                            </p>
                            <button className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Obtenir l'itinéraire
                            </button>
                        </div>

                        {/* Phone */}
                        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition">
                            <Phone className="w-12 h-12 text-white mb-4" />
                            <h3 className="text-2xl font-black text-white mb-2">Téléphone</h3>
                            <p className="text-white text-lg font-bold mb-2">+216 XX XXX XXX</p>
                            <p className="text-white text-lg font-bold mb-4">+216 YY YYY YYY</p>
                            <button className="bg-white text-green-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition flex items-center gap-2">
                                <Phone className="w-5 h-5" />
                                Appelez maintenant
                            </button>
                        </div>

                        {/* Hours */}
                        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition">
                            <Clock className="w-12 h-12 text-white mb-4" />
                            <h3 className="text-2xl font-black text-white mb-4">Horaires d'ouverture</h3>
                            <div className="space-y-2 text-white font-bold text-lg">
                                <div className="flex justify-between">
                                    <span>Lundi - Jeudi</span>
                                    <span>11:00 - 23:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Vendredi - Samedi</span>
                                    <span>11:00 - 00:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Dimanche</span>
                                    <span>11:00 - 23:00</span>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition">
                            <Mail className="w-12 h-12 text-white mb-4" />
                            <h3 className="text-2xl font-black text-white mb-2">Email</h3>
                            <p className="text-white text-lg font-bold mb-4">contact@matos-restaurant.tn</p>
                            <button className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition flex items-center gap-2">
                                <Mail className="w-5 h-5" />
                                Envoyez un email
                            </button>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 text-center border-4 border-yellow-400 shadow-2xl">
                    <h2 className="text-4xl font-black text-white mb-6">Suivez-nous sur les réseaux sociaux</h2>
                    <p className="text-xl text-gray-400 mb-8">Restez connectés pour nos dernières offres et actualités!</p>
                    <div className="flex justify-center gap-6">
                        <a href="#" className="bg-gradient-to-br from-pink-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg">
                            <Instagram className="w-8 h-8 text-white" />
                        </a>
                        <a href="#" className="bg-gradient-to-br from-blue-600 to-blue-700 w-16 h-16 rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg">
                            <Facebook className="w-8 h-8 text-white" />
                        </a>
                        <a href="#" className="bg-gradient-to-br from-red-600 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg">
                            <span className="text-2xl">📱</span>
                        </a>
                    </div>
                </div>

                {/* Map Placeholder */}
                <div className="mt-16 bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-700">
                    <div className="h-96 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <div className="text-center">
                            <MapPin className="w-24 h-24 text-yellow-400 mx-auto mb-4" />
                            <p className="text-2xl font-black text-white">Carte Interactive</p>
                            <p className="text-gray-400 mt-2">Intégration Google Maps à venir</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}