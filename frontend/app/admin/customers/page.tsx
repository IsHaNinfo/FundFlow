"use client";
'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { CustomerDataTable } from "@/components/customer-data-table"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import axios from "axios"
import { customerApi } from "@/services/api"
import { RouteGuard } from '@/components/route-guard';

export default function CustomersPage() {
    type Customer = {
        id: string
        firstName: string
        lastName: string
        email: string
        nic: string
        phoneNumber: string
        role: string
    }

    type ApiResponse = {
        status: number
        data: Customer[]
        message: string
    }


    const [data, setData] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const token = localStorage.getItem('token')

                const response = await customerApi.getAll()
                console.log(response.data)
                setData(response.data)

            } catch (error) {
                console.error('Error fetching customers:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCustomers()
    }, [])

    const handleDataChange = (newData: Customer[]) => {
        setData(newData)
    }
    return (
        <RouteGuard allowedRoles={['admin']}>
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
                                    <CustomerDataTable data={data}
                                        onDataChange={handleDataChange}
                                    />

                                )}                        </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </RouteGuard>
    );
} 