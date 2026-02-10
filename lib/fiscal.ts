import { prisma } from './prisma';

export interface FiscalBreakdown {
    baseRevenue: number;
    vatRate: number;
    vatAmount: number;
    stampDuty: number;
    netOutput: number;
}

/**
 * Calculates the internal fiscal breakdown for a given amount.
 * This is used for admin reporting Only.
 */
export async function calculateFiscalBreakdown(amount: number): Promise<FiscalBreakdown> {
    try {
        const settings = await prisma.global_settings.findFirst();

        const vatRate = settings?.vat_rate ?? 0.19; // Default 19%
        const stampDuty = settings?.stamp_duty ?? 1.0; // Default 1.000 DT

        // In the current net-price model, the amount already contains taxes or 
        // we calculate them on top for internal reporting purposes.
        // Assuming amount is the "Total Paid by Customer"

        const vatAmount = amount * vatRate;

        return {
            baseRevenue: amount,
            vatRate,
            vatAmount,
            stampDuty,
            netOutput: amount - vatAmount - stampDuty
        };
    } catch (error) {
        console.error('Fiscal calculation error:', error);
        return {
            baseRevenue: amount,
            vatRate: 0.19,
            vatAmount: amount * 0.19,
            stampDuty: 1.0,
            netOutput: amount - (amount * 0.19) - 1.0
        };
    }
}
