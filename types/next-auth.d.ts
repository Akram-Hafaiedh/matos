import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string
            role?: string | null
            phone?: string | null
            selectedBg?: string | null
            selectedFrame?: string | null
            loyaltyPoints?: number
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        role?: string | null
        phone?: string | null
        selectedBg?: string | null
        selectedFrame?: string | null
        loyaltyPoints?: number
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role?: string | null
        phone?: string | null
        selectedBg?: string | null
        selectedFrame?: string | null
        loyaltyPoints?: number
    }
}
