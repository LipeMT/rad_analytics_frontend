import { BrowserRouter, Route, Routes } from "react-router-dom"
import { DefaultLayout } from "../components/Layout/Default"
import { DescribeByPeriod } from "../components/Pages/DescribeByPeriod"

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DefaultLayout />}>
                    <Route path="describe-by-period" element={<DescribeByPeriod />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}