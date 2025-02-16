"use client"

import * as React from "react"
import { BookOpen, SquareTerminal } from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"

// Logo component
function Logo() {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-02-04%2013.53.40%20-%20A%20modern,%20minimalist%20logo%20design%20for%20a%20whey%20protein%20analysis%20app.%20The%20logo%20features%20a%20stylized%20milk%20droplet%20or%20protein%20shaker%20combined%20with%20a%20graph%20or-5lvtp7dDXkUR9wj0YflT5vuP1Y0Etr.webp"
        alt="WheyBetter Logo"
        className="w-10 h-10 object-contain"
      />
      {/* Add group-data-[collapsible=icon]:hidden to hide text when sidebar is collapsed */}
      <span className="font-semibold text-lg text-foreground group-data-[collapsible=icon]:hidden">WheyBetter</span>
    </div>
  )
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    // {
    //   title: "Discover Services",
    //   url: "#",
    //   icon: SquareTerminal,
    //   isActive: true,
    //   items: [
    //     {
    //       title: "Analyze Whey",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "How to",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <div className="mt-6 px-4 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Dark Mode</span>
            <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

