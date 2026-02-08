'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SupportModalContextType {
    isOpen: boolean;
    openSupportModal: (context?: Partial<SupportModalContextData>) => void;
    closeSupportModal: () => void;
    modalContext: SupportModalContextData;
}

interface SupportModalContextData {
    subject: string;
    description: string;
    orderId: string;
    priority: string;
    module: 'general' | 'orders' | 'cart' | 'loyalty' | 'account' | 'notifications';
}

const defaultContext: SupportModalContextData = {
    subject: '',
    description: '',
    orderId: '',
    priority: 'medium',
    module: 'general'
};

const SupportModalContext = createContext<SupportModalContextType | undefined>(undefined);

export function SupportModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [modalContext, setModalContext] = useState<SupportModalContextData>(defaultContext);

    const openSupportModal = (context?: Partial<SupportModalContextData>) => {
        setModalContext({ ...defaultContext, ...context });
        setIsOpen(true);
    };

    const closeSupportModal = () => {
        setIsOpen(false);
        // Reset after animation
        setTimeout(() => setModalContext(defaultContext), 300);
    };

    return (
        <SupportModalContext.Provider value={{ isOpen, openSupportModal, closeSupportModal, modalContext }}>
            {children}
        </SupportModalContext.Provider>
    );
}

export function useSupportModal() {
    const context = useContext(SupportModalContext);
    if (context === undefined) {
        throw new Error('useSupportModal must be used within a SupportModalProvider');
    }
    return context;
}
