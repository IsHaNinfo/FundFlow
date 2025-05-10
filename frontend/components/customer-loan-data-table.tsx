"use client"

import * as React from "react"
import { IconCirclePlusFilled } from "@tabler/icons-react"
import Link from "next/link"
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconDotsVertical,
    IconLayoutColumns,
    IconPlus,
} from "@tabler/icons-react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import { toast } from "sonner"
import { loanApi } from "@/services/api"
import { ErrorMessage } from "@/components/ui/error-message"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

type Loan = {
    id: string
    createdAt: string
    durationMonths: number
    emi: string
    existingLoans: string
    loanAmount: string
    monthlyIncome: string
    purpose: string
    recommandations: string
    score: number
    status: string
    updatedAt: string
    user: User
}

type User = {
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
}

export function CustomerLoanDataTable({ data }: { data: Loan[] }) {
    const [tableData, setTableData] = React.useState<Loan[]>(data)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState<string>("")
    const [formData, setFormData] = useState({
        loanAmount: "",
        durationMonths: "",
        monthlyIncome: "",
        purpose: "",
        existingLoans: ""
    })

    // Update local state when prop changes
    React.useEffect(() => {
        setTableData(data)
    }, [data])

    const handleCreateLoan = async () => {
        try {
            setServerError("")
            setIsLoading(true)

            // Validate form data
            if (!formData.loanAmount || !formData.durationMonths || !formData.monthlyIncome || !formData.purpose) {
                setServerError("All fields are required")
                return
            }

            // Validate numeric values
            if (parseFloat(formData.loanAmount) <= 0 ||
                parseInt(formData.durationMonths) <= 0 ||
                parseFloat(formData.monthlyIncome) <= 0) {
                setServerError("Please enter valid amounts and duration")
                return
            }

            const newLoan = await loanApi.create({
                ...formData,
                loanAmount: parseFloat(formData.loanAmount),
                durationMonths: parseInt(formData.durationMonths),
                monthlyIncome: parseFloat(formData.monthlyIncome),
                existingLoans: parseFloat(formData.existingLoans || "0")
            })
            // Update the table data by adding the new loan at the beginning
            setTableData(prevData => [newLoan.data, ...prevData])

            // Close modal and reset form
            setShowCreateModal(false)
            setFormData({
                loanAmount: "",
                durationMonths: "",
                monthlyIncome: "",
                purpose: "",
                existingLoans: ""
            })
            toast.success("Loan created successfully")
        } catch (error: any) {
            if (error.response?.data?.message) {
                setServerError(error.response.data.message)
            } else if (error.message) {
                setServerError(error.message)
            } else {
                setServerError("Failed to create loan. Please try again.")
            }
            console.error("Create loan error:", error)
        } finally {
            setIsLoading(false)
        }
    }



    // Define columns inside the component to access the functions
    const columns: ColumnDef<Loan>[] = [
        {
            accessorKey: "user",
            header: "Customer Name",
            cell: ({ row }) => {
                const user = row.getValue("user") as User | undefined
                if (!user) return "N/A"
                return `${user.firstName} ${user.lastName}`
            },
        },
        {
            accessorKey: "loanAmount",
            header: "Loan Amount",
            cell: ({ row }) => {
                const value = String(row.getValue("loanAmount"))
                const amount = parseFloat(value)
                if (isNaN(amount)) return "N/A"
                return new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "LKR",
                }).format(amount)
            },
        },
        {
            accessorKey: "durationMonths",
            header: "Duration (months)",
            cell: ({ row }) => {
                const value = String(row.getValue("durationMonths"))
                const months = parseInt(value)
                if (isNaN(months)) return "N/A"
                return `${months}`
            },
        },
        {
            accessorKey: "monthlyIncome",
            header: "Monthly Income",
            cell: ({ row }) => {
                const value = String(row.getValue("monthlyIncome"))
                const amount = parseFloat(value)
                if (isNaN(amount)) return "N/A"
                return new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "LKR",
                }).format(amount)
            },
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "score",
            header: "Credit Score",
        },
        {
            accessorKey: "emi",
            header: "EMI",
            cell: ({ row }) => {
                const value = String(row.getValue("emi"))
                const amount = parseFloat(value)
                if (isNaN(amount)) return "N/A"
                return new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "LKR",
                }).format(amount)
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const loan = row.original
                const [showStatusModal, setShowStatusModal] = useState(false)
                const [showViewModal, setShowViewModal] = useState(false)
                const [showDeleteDialog, setShowDeleteDialog] = useState(false)
                const [isLoading, setIsLoading] = useState(false)
                const [error, setError] = useState<string>("")


                return (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                                    size="icon"
                                >
                                    <IconDotsVertical />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem onClick={() => setShowViewModal(true)}>
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </DropdownMenuContent>
                        </DropdownMenu>



                        {/* View Details Modal */}
                        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Loan Details</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Customer Name</Label>
                                            <div className="text-sm">
                                                {loan.user ? `${loan.user.firstName} ${loan.user.lastName}` : "N/A"}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Email</Label>
                                            <div className="text-sm">{loan.user?.email || "N/A"}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Phone</Label>
                                            <div className="text-sm">{loan.user?.phoneNumber || "N/A"}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Status</Label>
                                            <div className="text-sm">{loan.status}</div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="text-lg font-medium mb-4">Loan Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Loan Amount</Label>
                                                <div className="text-sm">
                                                    {isNaN(parseFloat(String(loan.loanAmount)))
                                                        ? "N/A"
                                                        : new Intl.NumberFormat("en-US", {
                                                            style: "currency",
                                                            currency: "LKR",
                                                        }).format(parseFloat(String(loan.loanAmount)))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Duration</Label>
                                                <div className="text-sm">
                                                    {isNaN(Number(loan.durationMonths)) ? "N/A" : `${loan.durationMonths} months`}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Monthly Income</Label>
                                                <div className="text-sm">
                                                    {isNaN(parseFloat(String(loan.monthlyIncome)))
                                                        ? "N/A"
                                                        : new Intl.NumberFormat("en-US", {
                                                            style: "currency",
                                                            currency: "LKR",
                                                        }).format(parseFloat(String(loan.monthlyIncome)))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">EMI</Label>
                                                <div className="text-sm">
                                                    {isNaN(parseFloat(String(loan.emi)))
                                                        ? "N/A"
                                                        : new Intl.NumberFormat("en-US", {
                                                            style: "currency",
                                                            currency: "LKR",
                                                        }).format(parseFloat(String(loan.emi)))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Credit Score</Label>
                                                <div className="text-sm">{loan.score}</div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Purpose</Label>
                                                <div className="text-sm">{loan.purpose}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => setShowViewModal(false)}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>


                    </>
                )
            },
        },
    ]

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const table = useReactTable({
        data: tableData,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    return (
        <Tabs defaultValue="loans" className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between px-4 lg:px-6">
                <Label htmlFor="view-selector" className="sr-only">
                    View
                </Label>
                <Select defaultValue="loans">
                    <SelectTrigger
                        className="flex w-fit @4xl/main:hidden"
                        size="sm"
                        id="view-selector"
                    >
                        <SelectValue placeholder="Select a view" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="loans">All Loans</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
                <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                    <TabsTrigger value="loans">All Loans</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear hidden sm:flex"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <IconCirclePlusFilled className="h-4 w-4 mr-2" />
                        <span>Create Loan</span>
                    </Button>
                </div>
            </div>

            {/* Create Loan Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Create New Loan</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="loanAmount">Loan Amount</Label>
                                <Input
                                    id="loanAmount"
                                    type="number"
                                    value={formData.loanAmount}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, loanAmount: e.target.value }))
                                        setServerError("")
                                    }}
                                    placeholder="Enter loan amount"
                                    className={serverError ? "border-red-500" : ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="durationMonths">Duration (months)</Label>
                                <Input
                                    id="durationMonths"
                                    type="number"
                                    value={formData.durationMonths}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, durationMonths: e.target.value }))
                                        setServerError("")
                                    }}
                                    placeholder="Enter duration"
                                    className={serverError ? "border-red-500" : ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="monthlyIncome">Monthly Income</Label>
                                <Input
                                    id="monthlyIncome"
                                    type="number"
                                    value={formData.monthlyIncome}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, monthlyIncome: e.target.value }))
                                        setServerError("")
                                    }}
                                    placeholder="Enter monthly income"
                                    className={serverError ? "border-red-500" : ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="purpose">Purpose</Label>
                                <Input
                                    id="purpose"
                                    value={formData.purpose}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, purpose: e.target.value }))
                                        setServerError("")
                                    }}
                                    placeholder="Enter loan purpose"
                                    className={serverError ? "border-red-500" : ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="existingLoans">Existing Loans</Label>
                                <Input
                                    id="existingLoans"
                                    value={formData.existingLoans}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, existingLoans: e.target.value }))
                                        setServerError("")
                                    }}
                                    placeholder="Enter existing loans"
                                    className={serverError ? "border-red-500" : ""}
                                />
                            </div>

                        </div>
                    </div>
                    {serverError && (
                        <ErrorMessage
                            message={serverError}
                            className="mb-4 text-sm text-red-500"
                        />
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowCreateModal(false)
                                setServerError("")
                                setFormData({
                                    loanAmount: "",
                                    durationMonths: "",
                                    monthlyIncome: "",
                                    purpose: "",
                                    existingLoans: "0"
                                })
                            }}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateLoan}
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating..." : "Create Loan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <TabsContent value="loans" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        {table.getFilteredRowModel().rows.length} row(s) total.
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                Rows per page
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                    <SelectValue
                                        placeholder={table.getState().pagination.pageSize}
                                    />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <IconChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <IconChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <IconChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <IconChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="active" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent value="completed" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
        </Tabs>
    )
} 