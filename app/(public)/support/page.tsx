import { Metadata } from 'next';
import SupportContent from './SupportContent';

export const metadata: Metadata = {
    title: "Centre de Support",
    description: "Besoin d'aide avec votre commande Mato's ? Notre centre de support est là pour vous aider. Ouvrez un ticket ou consultez notre FAQ.",
    keywords: ["support matos", "aide restaurant", "reclamation matos", "suivi commande matos"]
};

export default function SupportPage() {
    return <SupportContent />;
}
