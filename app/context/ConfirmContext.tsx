'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ConfirmModal from '@/components/ConfirmModal';

interface ConfirmOptions {
    title: string;
    message: string;
    type?: 'danger' | 'warning' | 'success' | 'info';
    confirmText?: string;
    cancelText?: string;
    children?: ReactNode;
}

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        options: ConfirmOptions;
        resolve: (value: boolean) => void;
    } | null>(null);

    const confirm = useCallback((options: ConfirmOptions) => {
        return new Promise<boolean>((resolve) => {
            setModalState({
                isOpen: true,
                options,
                resolve
            });
        });
    }, []);

    const handleConfirm = useCallback(() => {
        if (modalState) {
            modalState.resolve(true);
            setModalState(null);
        }
    }, [modalState]);

    const handleCancel = useCallback(() => {
        if (modalState) {
            modalState.resolve(false);
            setModalState(null);
        }
    }, [modalState]);

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {modalState && (
                <ConfirmModal
                    isOpen={modalState.isOpen}
                    onClose={handleCancel}
                    onConfirm={handleConfirm}
                    title={modalState.options.title}
                    message={modalState.options.message}
                    type={modalState.options.type}
                    confirmText={modalState.options.confirmText}
                    cancelText={modalState.options.cancelText}
                >
                    {modalState.options.children}
                </ConfirmModal>
            )}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const context = useContext(ConfirmContext);
    if (context === undefined) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context.confirm;
}
