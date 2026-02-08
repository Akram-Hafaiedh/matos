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
            selected_bg?: string | null
            selected_frame?: string | null
            loyalty_points?: number
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        role?: string | null
        phone?: string | null
        selected_bg?: string | null
        selected_frame?: string | null
        loyalty_points?: number
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role?: string | null
        phone?: string | null
        selected_bg?: string | null
        selected_frame?: string | null
        loyalty_points?: number
    }
}
