// app/(private)/layout.tsx
import { Providers } from '@/app/providers';
import AdminLayoutContent from './AdminLayoutContent';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            <AdminLayoutContent>
                {children}
            </AdminLayoutContent>
        </Providers>
    );
}