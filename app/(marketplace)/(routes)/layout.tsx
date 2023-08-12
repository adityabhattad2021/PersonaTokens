import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"

export default function MarketPlaceLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <main className="h-full">
            <Navbar/>
            {/* <div className="hidden md:flex mt-14 w-24 flex-col fixed inset-y-0">
                <Sidebar/>
            </div> */}
            <div className=" pt-16 h-full">
                {children}
            </div>
        </main>
    )
}