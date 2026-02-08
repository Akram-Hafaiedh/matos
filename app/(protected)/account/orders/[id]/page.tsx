'use client';

import { useParams } from 'next/navigation';
import OrderDetailsView from '@/components/OrderDetailsView';

export default function OrderDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    return (
        <div className="animate-in fade-in duration-1000">
            <OrderDetailsView id={id} />
        </div>
    );
}
