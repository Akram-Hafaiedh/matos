// app/(private)/layout.tsx
import AdminLayoutContent from './AdminLayoutContent';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AdminLayoutContent>
                {children}
            </AdminLayoutContent>
        </>
    );
}