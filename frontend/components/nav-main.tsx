"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"

interface NavMainProps {
  items: {
    title: string
    url: string
    icon: React.ComponentType<{ className?: string }>
  }[]
  className?: string
}

export function NavMain({ items, className }: NavMainProps) {
  const pathname = usePathname()

  return (
    <SidebarMenu className={className}>
      {items.map((item, index) => {
        const Icon = item.icon
        const isActive = pathname === item.url

        return (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
            >
              <Link href={item.url}>
                <Icon className="!size-5" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
