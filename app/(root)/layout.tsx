import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full">
            <Navbar/>
            <main className="pt-16 h-full">
                {children}
            </main>
        </div>
    )
}