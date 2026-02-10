import { Metadata } from 'next';
import ReservationContent from './ReservationContent';

export const metadata: Metadata = {
    title: "Réreservez votre table",
    description: "Réservez votre table chez Mato's pour une expérience culinaire d'exception. Pizzas artisanales, Burgers gourmets et ambiance premium.",
    keywords: ["réreservation matos", "réserver table tunis", "matos carthage", "restaurant premium tunisie"]
};

export default function ReservationPage() {
    return <ReservationContent />;
}
