"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"
import { jwtDecode } from "jwt-decode"
import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"

interface DecodedToken {
  id: string
  email: string
  role: string
  iat: number
  exp: number
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userRole, setUserRole] = React.useState<string>("");
  const router = useRouter()

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserRole(decoded.role);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Admin navigation items
  const adminNavItems = [
    {
      title: "Customers",
      url: "/admin/customers",
      icon: IconUsers,
    },
    {
      title: "Loans",
      url: "/admin/loans",
      icon: IconListDetails,
    },
  ];

  // Customer navigation items
  const customerNavItems = [
    {
      title: "My Loans",
      url: "/customer/loans",
      icon: IconChartBar,
    },
    {
      title: "My Profile",
      url: "/customer/profile",
      icon: IconFolder,
    },
  ];

  // Common secondary navigation items
  const secondaryNavItems = [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ];
  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (userRole === 'admin') {
      router.push('/admin/dashboard')
    } else if (userRole === 'customer') {
      router.push('/customer/dashboard')
    } else {
      router.push('/login')
    }
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#" onClick={handleDashboardClick}>
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Fund Flow.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={userRole === 'admin' ? adminNavItems : customerNavItems}
        />
        <NavSecondary items={secondaryNavItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: userRole === 'admin' ? 'Admin User' : 'Customer User',
          email: "user@example.com",
          avatar: "/avatars/default.jpg",
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
