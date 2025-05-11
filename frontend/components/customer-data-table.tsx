"use client"

import * as React from "react"
import { IconCirclePlusFilled, IconEye, IconEyeOff } from "@tabler/icons-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { customerApi } from "@/services/api"
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
import { ErrorMessage } from "@/components/ui/error-message"

type Customer = {
    id: string
    firstName: string
    lastName: string
    email: string
    nic: string
    phoneNumber: string
    role: string
}

export function CustomerDataTable({
    data,
    onDataChange
}: {
    data: Customer[]
    onDataChange?: (newData: Customer[]) => void
}) {
    const [tableData, setTableData] = React.useState<Customer[]>(data)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [createError, setCreateError] = useState<string>("")
    const [editError, setEditError] = useState<string>("")

    const [createFormData, setCreateFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        nic: '',
        phoneNumber: '',
        password: '',
    })

    // Update local state when prop changes
    React.useEffect(() => {
        setTableData(data)
    }, [data])

    const updateTableData = (updatedCustomer: Customer) => {
        const newData = tableData.map(customer =>
            customer.id === updatedCustomer.id ? updatedCustomer : customer
        )
        setTableData(newData)
        onDataChange?.(newData)
    }

    const removeFromTableData = (customerId: string) => {
        const newData = tableData.filter(customer => customer.id !== customerId)
        setTableData(newData)
        onDataChange?.(newData)
    }

    const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setCreateFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const validateCreateForm = () => {
        if (!createFormData.firstName.trim()) {
            setCreateError("First name is required")
            return false
        }
        if (!createFormData.lastName.trim()) {
            setCreateError("Last name is required")
            return false
        }
        if (!createFormData.email.trim()) {
            setCreateError("Email is required")
            return false
        }
        if (!createFormData.password) {
            setCreateError("Password is required")
            return false
        }
        if (createFormData.password.length < 6) {
            setCreateError("Password must be at least 6 characters long")
            return false
        }
        if (!createFormData.nic.trim()) {
            setCreateError("NIC is required")
            return false
        }
        if (!createFormData.phoneNumber.trim()) {
            setCreateError("Phone number is required")
            return false
        }
        return true
    }

    const handleCreate = async () => {
        if (!validateCreateForm()) {
            return
        }
        try {
            setCreateError("")
            setIsCreating(true)
            const newCustomer = await customerApi.createCustomer(createFormData)
            console.log(newCustomer.data.user)
            // Make sure the newCustomer has all required fields
            const customerToAdd: Customer = {
                id: newCustomer.data.user.id,
                firstName: newCustomer.data.user.firstName,
                lastName: newCustomer.data.user.lastName,
                email: newCustomer.data.user.email,
                nic: newCustomer.data.user.nic,
                phoneNumber: newCustomer.data.user.phoneNumber,
                role: newCustomer.data.user.role || 'customer' // Set a default role if not provided
            }

            // Add the new customer to the table
            const newData = [...tableData, customerToAdd]
            setTableData(newData)
            onDataChange?.(newData)

            setShowCreateModal(false)

            // Reset form
            setCreateFormData({
                firstName: '',
                lastName: '',
                email: '',
                nic: '',
                phoneNumber: '',
                password: '',
            })
        } catch (error: any) {
            if (error.response?.data?.message) {
                // If the error has a message from the server
                setCreateError(error.response.data.message)
            } else if (error.message) {
                // If it's a general error with a message
                setCreateError(error.message)
            } else {
                // Fallback error message
                setCreateError("Failed to create customer")
            }
            console.error("Create customer error:", error)
        } finally {
            setIsCreating(false)
        }
    }

    // Define columns inside the component to access the functions
    const columns: ColumnDef<Customer>[] = [
        {
            accessorKey: "firstName",
            header: "First Name",
        },
        {
            accessorKey: "lastName",
            header: "Last Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "nic",
            header: "NIC",
        },
        {
            accessorKey: "phoneNumber",
            header: "Phone Number",
        },
        {
            accessorKey: "role",
            header: "Role",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const customer = row.original
                const [showEditModal, setShowEditModal] = useState(false)
                const [showViewModal, setShowViewModal] = useState(false)
                const [showDeleteDialog, setShowDeleteDialog] = useState(false)
                const [isLoading, setIsLoading] = useState(false)
                const [formData, setFormData] = useState({
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    email: customer.email,
                    nic: customer.nic,
                    phoneNumber: customer.phoneNumber,
                    role: customer.role
                })

                const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const { id, value } = e.target
                    setFormData(prev => ({
                        ...prev,
                        [id]: value
                    }))
                }

                const handleEdit = async () => {
                    try {
                        setEditError("")
                        setIsLoading(true)
                        await customerApi.update(customer.id, formData)
                        toast.success("Customer updated successfully")
                        setShowEditModal(false)
                        // Update the table data with the new values
                        updateTableData({
                            ...customer,
                            ...formData
                        })
                    } catch (error: any) {
                        setEditError(error.message || "Failed to update customer")
                        console.error(error)
                    } finally {
                        setIsLoading(false)
                    }
                }

                const handleDelete = async () => {
                    try {
                        setIsLoading(true)
                        await customerApi.delete(customer.id)
                        toast.success("Customer deleted successfully")
                        setShowDeleteDialog(false)
                        // Remove the customer from the table
                        removeFromTableData(customer.id)
                    } catch (error) {
                        toast.error("Failed to delete customer")
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
                                <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                                    Edit
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

                        {/* Edit Modal */}
                        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Customer</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="firstName" className="text-right">
                                            First Name
                                        </Label>
                                        <Input
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="lastName" className="text-right">
                                            Last Name
                                        </Label>
                                        <Input
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="nic" className="text-right">
                                            NIC
                                        </Label>
                                        <Input
                                            id="nic"
                                            value={formData.nic}
                                            onChange={handleInputChange}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="phoneNumber" className="text-right">
                                            Phone
                                        </Label>
                                        <Input
                                            id="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            className="col-span-3"
                                        />
                                    </div>

                                </div>
                                <ErrorMessage message={editError} className="mb-4" />
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowEditModal(false)
                                            setEditError("")
                                        }}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleEdit}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* View Details Modal */}
                        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Customer Details</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">First Name</Label>
                                        <div className="col-span-3">{customer.firstName}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Last Name</Label>
                                        <div className="col-span-3">{customer.lastName}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Email</Label>
                                        <div className="col-span-3">{customer.email}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">NIC</Label>
                                        <div className="col-span-3">{customer.nic}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Phone</Label>
                                        <div className="col-span-3">{customer.phoneNumber}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Role</Label>
                                        <div className="col-span-3">{customer.role}</div>
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
                                        This action cannot be undone. This will permanently delete the customer
                                        and remove their data from our servers.
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
        <Tabs defaultValue="customers" className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between px-4 lg:px-6">
                <Label htmlFor="view-selector" className="sr-only">
                    View
                </Label>
                <Select defaultValue="customers">
                    <SelectTrigger
                        className="flex w-fit @4xl/main:hidden"
                        size="sm"
                        id="view-selector"
                    >
                        <SelectValue placeholder="Select a view" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="customers">All Customers</SelectItem>
                    </SelectContent>
                </Select>
                <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                    <TabsTrigger value="customers">All Customers</TabsTrigger>

                </TabsList>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear hidden sm:flex"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <IconCirclePlusFilled className="h-4 w-4 mr-2" />
                        <span>Create Customer</span>
                    </Button>
                </div>
            </div>
            <TabsContent value="customers" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
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
            <TabsContent value="inactive" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>

            {/* Create Customer Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Customer</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName" className="text-right">
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                value={createFormData.firstName}
                                onChange={handleCreateInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName" className="text-right">
                                Last Name
                            </Label>
                            <Input
                                id="lastName"
                                value={createFormData.lastName}
                                onChange={handleCreateInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                value={createFormData.email}
                                onChange={handleCreateInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <div className="col-span-3 relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={createFormData.password}
                                    onChange={handleCreateInputChange}
                                    className="pr-10"
                                    minLength={6}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <IconEyeOff className="h-4 w-4" />
                                    ) : (
                                        <IconEye className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">
                                        {showPassword ? "Hide password" : "Show password"}
                                    </span>
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nic" className="text-right">
                                NIC
                            </Label>
                            <Input
                                id="nic"
                                value={createFormData.nic}
                                onChange={handleCreateInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phoneNumber" className="text-right">
                                Phone
                            </Label>
                            <Input
                                id="phoneNumber"
                                value={createFormData.phoneNumber}
                                onChange={handleCreateInputChange}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <ErrorMessage message={createError} className="mb-4" />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowCreateModal(false)
                                setCreateError("")
                            }}
                            disabled={isCreating}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={isCreating}
                        >
                            {isCreating ? "Creating..." : "Create Customer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Tabs>
    )
} 