import FAQContent from './FAQContent';

const faqs = [
    {
        category: "Commandes & Livraison",
        icon: "Truck",
        questions: [
            {
                q: "Quels sont vos délais de livraison ?",
                a: "Nous livrons généralement en 30 à 45 minutes selon votre zone. Pendant les heures de pointe, ce délai peut varier légèrement, mais nous faisons toujours de notre mieux pour vous servir chaud !"
            },
            {
                q: "Livrez-vous dans tout le Grand Tunis ?",
                a: "Actuellement, nous couvrons la zone de la Goulette, Le Kram, Carthage et La Marsa. Nous prévoyons de nous étendre très prochainement à d'autres zones."
            }
        ]
    },
    {
        category: "Paiements & Fidélité",
        icon: "CreditCard",
        questions: [
            {
                q: "Quels modes de paiement acceptez-vous ?",
                a: "Nous acceptons les paiements en espèces à la livraison, ainsi que les tickets restaurants. Le paiement par carte bancaire sera disponible very soon sur notre plateforme."
            },
            {
                q: "Comment fonctionne le programme de fidélité ?",
                a: "C'est simple : 1 DT dépensé = 1 Point. Cumulez vos points et échangez-les contre des cadeaux exclusifs ou des réductions sur vos prochaines commandes via votre espace client."
            }
        ]
    },
    {
        category: "Qualité & Produits",
        icon: "ShieldCheck",
        questions: [
            {
                q: "D'où proviennent vos ingrédients ?",
                a: "Nous privilégions les circuits courts et les producteurs locaux. Nos viandes sont fraîches de la journée et nos légumes sont sélectionnés chaque matin pour garantir une qualité Mato's irréprochable."
            },
            {
                q: "Avez-vous des options végétariennes ?",
                a: "Absolument ! Notre carte propose plusieurs options végétariennes, notamment nos pizzas signature et nos salades fraîches composées."
            }
        ]
    }
];

export default function FAQPage() {
    return <FAQContent faqs={faqs} />;
}
