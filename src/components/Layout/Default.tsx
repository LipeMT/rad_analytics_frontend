import { Outlet } from "react-router-dom"
import { Header } from "./components/Header"


export const DefaultLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pt-14">
                <Outlet />
            </main>
        </div>
    )
}