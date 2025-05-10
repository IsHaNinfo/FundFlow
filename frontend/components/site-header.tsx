"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { IconCirclePlusFilled } from "@tabler/icons-react"
import Link from "next/link"
export function SiteHeader() {
  const pathname = usePathname()
  const isCustomersPage = pathname === "/customers"
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {/*<div className="ml-auto flex items-center gap-2">
          {isCustomersPage && (
            <Button
              variant="ghost"
              asChild
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear hidden sm:flex"
            >
              <Link href="/customers/create" className="flex items-center gap-2">
                <IconCirclePlusFilled className="h-4 w-4" />
                <span>Create Customer</span>
              </Link>
            </Button>
          )}
        </div>*/}
      </div>
    </header>
  )
}
