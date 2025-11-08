import { BrowserRouter, Route, Routes } from "react-router-dom"
import { DefaultLayout } from "../components/Layout/Default"
import { DescribeByPeriod } from "../components/Pages/DescribeByPeriod"
import { ActivityDistribution } from "../components/Pages/ActivityDistribution"

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DefaultLayout />}>
                    <Route path="describe-by-period" element={<DescribeByPeriod />} />
                    <Route path="activities-distribution" element={<ActivityDistribution />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}