import React from 'react';
import StandardTemplate from './StandardTemplate';
import TacticalTemplate from './TacticalTemplate';

interface InvoiceRendererProps {
    order: any;
    settings: any;
}

export default function InvoiceRenderer({ order, settings }: InvoiceRendererProps) {
    const template = settings?.invoice_template || 'standard';

    if (template === 'tactical') {
        return <TacticalTemplate order={order} settings={settings} />;
    }

    return <StandardTemplate order={order} settings={settings} />;
}
