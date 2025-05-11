"use client";

import { RouteGuard } from '@/components/route-guard';
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
import { customerProfileApi, customerApi } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { jwtDecode } from "jwt-decode"
import { ErrorMessage } from "@/components/ui/error-message"
import { IconCirclePlusFilled } from '@tabler/icons-react';

interface DecodedToken {
    id: string
    email: string
    role: string
    iat: number
    exp: number
}
interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    nic: string;
}

interface CustomerProfile {
    id: string;
    userId: string;
    monthlyIncome: string;
    occupation: string;
    address: string;
    creditScore: number;
    user: UserData;
}

export default function CustomerProfilePage() {
    const [customerData, setCustomerData] = useState<CustomerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [form, setForm] = useState({
        monthlyIncome: '',
        occupation: '',
        address: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // Get userId from token on client only
    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode<DecodedToken>(token);
                const id = decoded.id
                setUserId(id)
            }
        }
    }, []);

    useEffect(() => {
        if (!userId) return;
        const fetchCustomerData = async () => {
            try {
                setLoading(true);
                // First get user data
                const userResponse = await customerApi.getById(userId);
                console.log("User Response:", userResponse);

                // Then get profile data
                const profileResponse = await customerProfileApi.getCustomerProfileByUserId(userId);
                console.log("Profile Response:", profileResponse);

                // Combine the data
                if (profileResponse.data) {
                    const combinedData = {
                        ...profileResponse.data,
                        user: userResponse.data
                    };
                    console.log("Combined Data:", combinedData);
                    setCustomerData(combinedData);

                    // Pre-fill form if profile exists
                    setForm({
                        monthlyIncome: profileResponse.data.monthlyIncome || '',
                        occupation: profileResponse.data.occupation || '',
                        address: profileResponse.data.address || ''
                    });
                } else {
                    const defaultData = {
                        id: '',
                        userId: userId,
                        monthlyIncome: '',
                        occupation: '',
                        address: '',
                        creditScore: 0,
                        user: userResponse.data
                    };
                    console.log("Default Data:", defaultData);
                    setCustomerData(defaultData);
                }
            } catch (err) {
                setError('Failed to load customer data');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomerData();
    }, [userId]);

    const handleAddProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const profileData = {
                monthlyIncome: Number(form.monthlyIncome),
                occupation: form.occupation,
                address: form.address,
                userId: userId!,
            };
            console.log("Submitting Profile Data:", profileData);

            if (customerData?.id) {
                // Update existing profile
                await customerProfileApi.update(customerData.id, profileData);
            } else {
                // Create new profile
                await customerProfileApi.createCustomerProfile(profileData);
            }

            setShowDialog(false);

            // Refetch profile
            const profileResponse = await customerProfileApi.getCustomerProfileByUserId(userId!);
            const userResponse = await customerApi.getById(userId!);
            console.log("Updated Profile Response:", profileResponse);
            console.log("Updated User Response:", userResponse);

            if (profileResponse.data) {
                const updatedData = {
                    ...profileResponse.data,
                    user: userResponse.data
                };
                console.log("Updated Combined Data:", updatedData);
                setCustomerData(updatedData);
            }
        } catch (err: any) {
            console.error("Error in handleAddProfile:", err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to save profile data. Please try again later.");
            }
        } finally {
            setSubmitting(false);
        }
    };

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
                    <div className="p-6 relative">

                        <div className="absolute top-6 right-6">

                            <Button
                                variant="ghost"
                                size="sm"
                                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear hidden sm:flex"
                                onClick={() => setShowDialog(true)}
                            >
                                <IconCirclePlusFilled className="h-4 w-4 mr-2" />
                                <span>{customerData?.id ? 'Update Profile' : 'Add Profile Data'}</span>
                            </Button>
                        </div>


                        <div className="space-y-4">
                            <h1 className="text-2xl font-bold">Customer Profile</h1>
                            <div className="p-6 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-semibold">Name:</p>
                                        <p>
                                            {customerData?.user?.firstName && customerData?.user?.lastName
                                                ? `${customerData.user.firstName} ${customerData.user.lastName}`
                                                : "Not set"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Email:</p>
                                        <p>{customerData?.user?.email || "Not set"}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Phone Number:</p>
                                        <p>{customerData?.user?.phoneNumber || "Not set"}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">NIC:</p>
                                        <p>{customerData?.user?.nic || "Not set"}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Monthly Income:</p>
                                        <p>
                                            {customerData?.monthlyIncome
                                                ? `LKR ${parseFloat(customerData.monthlyIncome).toLocaleString()}`
                                                : "Not set"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Occupation:</p>
                                        <p>{customerData?.occupation || "Not set"}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Address:</p>
                                        <p>{customerData?.address || "Not set"}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Credit Score:</p>
                                        <p>{customerData?.creditScore || "Not set"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Add Profile Dialog */}
                        {showDialog && (
                            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {customerData?.id ? 'Update Profile Data' : 'Add Profile Data'}
                                        </DialogTitle>
                                        <DialogDescription>
                                            Please fill in your profile information below.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-6 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="monthlyIncome">Monthly Income</Label>
                                                <Input
                                                    id="monthlyIncome"
                                                    type="number"
                                                    value={form.monthlyIncome}
                                                    onChange={e => setForm(f => ({ ...f, monthlyIncome: e.target.value }))}
                                                    placeholder="Enter monthly income"
                                                    className={error ? "border-red-500" : ""}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="occupation">Occupation</Label>
                                                <Input
                                                    id="occupation"
                                                    type="text"
                                                    value={form.occupation}
                                                    onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))}
                                                    placeholder="Enter occupation"
                                                    className={error ? "border-red-500" : ""}
                                                />
                                            </div>
                                            <div className="space-y-2 col-span-2">
                                                <Label htmlFor="address">Address</Label>
                                                <Input
                                                    id="address"
                                                    type="text"
                                                    value={form.address}
                                                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                                    placeholder="Enter address"
                                                    className={error ? "border-red-500" : ""}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <ErrorMessage message={error || undefined} className="mb-4" />
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowDialog(false);
                                                setError(null);
                                                setForm({
                                                    monthlyIncome: '',
                                                    occupation: '',
                                                    address: ''
                                                });
                                            }}
                                            disabled={submitting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleAddProfile}
                                            disabled={submitting}
                                        >
                                            {submitting ? "Saving..." : customerData?.id ? "Update Profile" : "Save Profile"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </RouteGuard>
    );
} 