import { Metadata } from 'next';
import ContactContent from './ContactContent';

export const metadata: Metadata = {
    title: "Contactez-nous",
    description: "Une question ? Une suggestion ? L'équipe Mato's est à votre entière disposition. Envoyez-nous un message ou trouvez nos coordonnées.",
    keywords: ["contact matos", "restaurant tunis contact", "service client matos", "commander pizza tunis"]
};

export default function ContactPage() {
    return <ContactContent />;
}
