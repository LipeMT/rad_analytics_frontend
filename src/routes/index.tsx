import { BrowserRouter, Route, Routes } from "react-router-dom"
import { DefaultLayout } from "../components/Layout/Default"
import { ActivitiesByPeriod } from "../components/Pages/ActivitiesByPeriod"
import { ActivityDistribution } from "../components/Pages/ActivityDistribution"
import { ActivityVariation } from "../components/Pages/ActivityVariation"
import { DescribeByPeriod } from "../components/Pages/DescribeByPeriod"
import { DocentsByActivity } from "../components/Pages/DocentsByActivity"
import Home from "../components/Pages/Home"

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DefaultLayout />}>
                    <Route index element={<Home />} />
                    <Route path="describe-by-period" element={<DescribeByPeriod />} />
                    <Route path="activities-distribution" element={<ActivityDistribution />} />
                    <Route path="activities-by-period" element={<ActivitiesByPeriod />} />
                    <Route path="activity-variation" element={<ActivityVariation />} />
                    <Route path="docents_by_activity" element={<DocentsByActivity />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}