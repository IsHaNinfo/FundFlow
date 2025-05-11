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
import { IconDownload } from "@tabler/icons-react"
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
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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

export function LoanDataTable({ data }: { data: Loan[] }) {
    const [tableData, setTableData] = React.useState<Loan[]>(data)

    // Update local state when prop changes
    React.useEffect(() => {
        setTableData(data)
    }, [data])

    // Add these helper functions
    const updateTableData = (updatedLoan: Loan) => {
        const newData = tableData.map(loan =>
            loan.id === updatedLoan.id ? updatedLoan : loan
        )
        setTableData(newData)
    }

    const removeFromTableData = (loanId: string) => {
        const newData = tableData.filter(loan => loan.id !== loanId)
        setTableData(newData)
    }

    // Add these new states for filters
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [scoreFilter, setScoreFilter] = useState<string>("all")

    // Add this function to filter the data
    const getFilteredData = () => {
        return tableData.filter(loan => {
            const statusMatch = statusFilter === "all" || loan.status === statusFilter
            const scoreMatch = scoreFilter === "all" ||
                (scoreFilter === "excellent" && loan.score >= 75) ||
                (scoreFilter === "good" && loan.score >= 65 && loan.score < 75) ||
                (scoreFilter === "fair" && loan.score >= 60 && loan.score < 65) ||
                (scoreFilter === "poor" && loan.score < 60)
            return statusMatch && scoreMatch
        })
    }

    // Define columns inside the component to access the functions
    const columns: ColumnDef<Loan>[] = [
        {
            accessorKey: "user",
            header: "Customer Name",
            cell: ({ row }) => {
                const user = row.getValue("user") as User
                return `${user.firstName} ${user.lastName}`
            },
        },
        {
            accessorKey: "loanAmount",
            header: "Loan Amount",
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("loanAmount"))
                const formatted = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "LKR",
                }).format(amount)
                return formatted
            },
        },
        {
            accessorKey: "durationMonths",
            header: "Duration (months)",
            cell: ({ row }) => {
                const rate = parseFloat(row.getValue("durationMonths"))
                return `${rate}`
            },
        },
        {
            accessorKey: "monthlyIncome",
            header: "Monthly Income",
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

                const handleStatusUpdate = async (newStatus: string) => {
                    try {
                        setError("")
                        setIsLoading(true)
                        const updatedLoan = await loanApi.updateStatus(loan.id, { status: newStatus })
                        setShowStatusModal(false)
                        // Update the table data with the new values
                        updateTableData({
                            ...loan,
                            status: newStatus
                        })
                    } catch (error: any) {
                        setError(error.message || "Failed to update loan status")
                        console.error(error)
                    } finally {
                        setIsLoading(false)
                    }
                }

                const handleDelete = async () => {
                    try {
                        setIsLoading(true)
                        await loanApi.delete(loan.id)
                        toast.success("Loan deleted successfully")
                        setShowDeleteDialog(false)
                        // Remove the loan from the table
                        removeFromTableData(loan.id)
                    } catch (error: any) {
                        toast.error("Failed to delete loan")
                        console.error(error)
                    } finally {
                        setIsLoading(false)
                    }
                }

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
                                <DropdownMenuItem onClick={() => setShowStatusModal(true)}>
                                    Update Status
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setShowViewModal(true)}>
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() => setShowDeleteDialog(true)}
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Status Update Modal */}
                        <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Update Loan Status</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Current Status</Label>
                                        <div className="col-span-3">{loan.status}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="status" className="text-right">
                                            New Status
                                        </Label>
                                        <Select
                                            onValueChange={(value) => handleStatusUpdate(value)}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select new status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="approved">Approved</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <ErrorMessage message={error} className="mb-4" />
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowStatusModal(false)
                                            setError("")
                                        }}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

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
                                                {loan.user.firstName} {loan.user.lastName}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Email</Label>
                                            <div className="text-sm">{loan.user.email}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Phone</Label>
                                            <div className="text-sm">{loan.user.phoneNumber}</div>
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
                                                    {new Intl.NumberFormat("en-US", {
                                                        style: "currency",
                                                        currency: "LKR",
                                                    }).format(parseFloat(loan.loanAmount))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Duration</Label>
                                                <div className="text-sm">{loan.durationMonths} months</div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Monthly Income</Label>
                                                <div className="text-sm">
                                                    {new Intl.NumberFormat("en-US", {
                                                        style: "currency",
                                                        currency: "LKR",
                                                    }).format(parseFloat(loan.monthlyIncome))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">EMI</Label>
                                                <div className="text-sm">
                                                    {new Intl.NumberFormat("en-US", {
                                                        style: "currency",
                                                        currency: "LKR",
                                                    }).format(parseFloat(loan.emi))}
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

                        {/* Delete Confirmation Dialog */}
                        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the loan
                                        and remove its data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Deleting..." : "Delete"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
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
        data: getFilteredData(),
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

    // Add this function to generate PDF
    const generatePDF = () => {
        const doc = new jsPDF()

        // Add logo (if you have one)
        // doc.addImage(logo, 'PNG', 14, 10, 30, 10)

        // Add title with custom styling
        doc.setFontSize(20)
        doc.setTextColor(41, 128, 185)
        doc.text('Loan Report', 14, 15)

        // Add subtitle
        doc.setFontSize(12)
        doc.setTextColor(100)
        doc.text('FundFlow Loan Management System', 14, 22)

        // Add date with custom styling
        doc.setFontSize(10)
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

        // Add summary information
        doc.setFontSize(10)
        doc.text(`Total Loans: ${getFilteredData().length}`, 14, 37)
        doc.text(`Total Amount: ${new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "LKR",
        }).format(getFilteredData().reduce((sum, loan) => sum + parseFloat(loan.loanAmount), 0))}`, 14, 44)

        // Generate table with more customization
        autoTable(doc, {
            head: [['Customer Name', 'Loan Amount', 'Duration', 'Monthly Income', 'Status', 'Credit Score', 'EMI']],
            body: getFilteredData().map(loan => [
                `${loan.user.firstName} ${loan.user.lastName}`,
                new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "LKR",
                }).format(parseFloat(loan.loanAmount)),
                loan.durationMonths.toString(),
                new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "LKR",
                }).format(parseFloat(loan.monthlyIncome)),
                loan.status,
                loan.score.toString(),
                new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "LKR",
                }).format(parseFloat(loan.emi))
            ]),
            startY: 50,
            styles: {
                fontSize: 8,
                cellPadding: 2,
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontSize: 9,
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
            columnStyles: {
                0: { cellWidth: 40 },
                1: { cellWidth: 30 },
                2: { cellWidth: 20 },
                3: { cellWidth: 30 },
                4: { cellWidth: 25 },
                5: { cellWidth: 25 },
                6: { cellWidth: 30 },
            },
        })

        // Add footer
        const pageCount = doc.internal.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.setFontSize(8)
            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            )
        }

        // Save the PDF
        doc.save('loan-report.pdf')
    }

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

                {/* Add filter controls */}
                <div className="flex gap-4">
                    <Button
                        onClick={generatePDF}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <IconDownload className="h-4 w-4" />
                        Export PDF
                    </Button>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={scoreFilter} onValueChange={setScoreFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by credit score" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Scores</SelectItem>
                            <SelectItem value="excellent">Excellent (750+)</SelectItem>
                            <SelectItem value="good">Good (650-749)</SelectItem>
                            <SelectItem value="fair">Fair (600-649)</SelectItem>
                            <SelectItem value="poor">Poor (600)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
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