"use client";
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { CustomerLoanDataTable } from "@/components/customer-loan-data-table"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import axios from "axios"
import { loanApi } from '@/services/api';

import { RouteGuard } from '@/components/route-guard'

export default function CustomerLoansPage() {
    type Loan = {
        id: string
        loanAmount: string
        durationMonths: number
        monthlyIncome: string
        purpose: string
        score: number
        emi: string
        status: string
        updatedAt: string
        user: User
    }

    type ApiResponse = {
        status: number
        data: Loan[]
        message: string
    }
    type User = {
        email: string
        firstName: string
        lastName: string
        phoneNumber: string
    }


    const [data, setData] = useState<Loan[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchCustomers = async () => {
            try {

                const response = await loanApi.getCustomerLoans()

                setData(response.data)

            } catch (error) {
                console.error('Error fetching customers:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCustomers()
    }, [])
    return (
        <RouteGuard allowedRoles={['customer']}>
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

                                {loading ? (
                                    <div>Loading...</div>
                                ) : (
                                    <CustomerLoanDataTable data={data} />

                                )}                        </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </RouteGuard>
    );
} 