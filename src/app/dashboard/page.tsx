"use client";
import React, { useEffect, useState } from "react";
import DashboardBlock from "@/components/Blocks/dashboardBlocks";
import { useUsers } from "@/hooks/useUsers";
import { useTicketSummary } from "@/hooks/useTicketSummary";

interface MaximumFormSubmission {
    submitterName: string;
    submissionCount: number;
}

const Dashboard = () => {
    const { users } = useUsers();
    const { TicketSummary } = useTicketSummary();
    console.log("TicketSummary", TicketSummary)


    // useEffect(() => {
    //     axios
    //         .get(`${process.env.NEXT_PUBLIC_API_URL}/api/refund-stats`)
    //         .then((response) => {
    //             const data = response?.data;
    //             // console.log("data", data);
    //             setTotalRefundedAmount(data.totalRefundedAmount);
    //             setTotalReturnedProducts(data.totalReturnedProducts);
    //             setTotalUser(data.totalUsers);
    //         })
    //         .catch((error) => console.error("Error fetching Refund Stats"));
    // }, []);

    // useEffect(() => {
    //     axios
    //         .get(`${process.env.NEXT_PUBLIC_API_URL}/api/total-valuation-refundAmount`)
    //         .then((response) => {
    //             const data = response?.data;
    //             // console.log("data", data);
    //             setValuationTotalRefundedAmount(data.totalValuationRefundAmount);
    //         })
    //         .catch((error) => console.error("Error fetching Refund Stats"));
    // }, []);

    // useEffect(() => {
    //     axios
    //         .get(`${process.env.NEXT_PUBLIC_API_URL}/api/most-active-submitter`)
    //         .then((response) => {
    //             const data = response?.data;
    //             // console.log("data", data);
    //             setMaximumFormSubmission({
    //                 submitterName: data?._id,
    //                 submissionCount: data?.count,
    //             });
    //         })
    //         .catch((error) => console.error("Error fetching Refund Stats"));
    // }, []);

    return (
        <div className=" overflow-hidden py-10 px-6">
            <h1 className="text-center text-4xl font-bold text-indigo-600 mb-8 ">
                Dashboard
            </h1>
            <div className="w-full">
                <div className="flex gap-4">
                    <DashboardBlock
                        icon="🎫"
                        count={TicketSummary?.totalCount}
                        percentage={20}
                        text="Total Tickets"
                        bgColor="#FF3A6E"
                        label=""
                    />
                    <DashboardBlock
                        icon="🎫"
                        count={TicketSummary?.["In-Progress"]}
                        percentage={20}
                        text="Total Open Tickets"
                        bgColor="#FFA21D"
                        label=""
                    />
                    <DashboardBlock
                        icon="🎫"
                        count={TicketSummary?.Closed}
                        percentage={20}
                        text="Total Closed Tickets"
                        bgColor="#51459D"
                        label=""
                    />
                    <DashboardBlock
                        icon="🎫"
                        count={TicketSummary?.Hold}
                        percentage={20}
                        text="Total Hold Tickets"
                        bgColor="#3EC9D6"
                        label=""
                    />
                    <DashboardBlock
                        icon="👤"
                        count={users?.count}
                        percentage={50}
                        text="Total Users"
                        bgColor="#FFEA6E"
                        label=""
                    />
                    {/* <DashboardBlock
                        icon="📈"
                        count={maximumFormSubmission?.submissionCount?.toString() || ""}
                        percentage={5}
                        text="Most Active Submitter"
                        label={maximumFormSubmission?.submitterName?.toString() || ""}
                    /> */}
                </div>
                {/* <div className="">
                    <div className="">
                        <IssueType />
                    </div>
                    <div className="">
                        <ProductReturnChart />
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default Dashboard;
