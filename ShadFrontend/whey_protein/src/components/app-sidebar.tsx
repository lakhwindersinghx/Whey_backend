"use client"

import * as React from "react"
import { BookOpen, SquareTerminal } from "lucide-react"

// If these are from your own UI library, adjust imports accordingly:
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

// Logo component
function Logo() {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-02-04%2013.53.40%20-%20A%20modern,%20minimalist%20logo%20design%20for%20a%20whey%20protein%20analysis%20app.%20The%20logo%20features%20a%20stylized%20milk%20droplet%20or%20protein%20shaker%20combined%20with%20a%20graph%20or-5lvtp7dDXkUR9wj0YflT5vuP1Y0Etr.webp"
        alt="WheyBetter Logo"
        className="w-10 h-10 object-contain"
      />
      <span className="font-semibold text-lg text-foreground group-data-[collapsible=icon]:hidden">
        WheyBetter
      </span>
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
    // "How to" is collapsible because it has an 'items' array.
    {
      title: "How to",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "/introduction",
        },
      ],
    },
    // "Analyze Whey" is a normal link (no sub-items).
    {
      title: "Analyze Whey",
      url: "/dashboard", // or any route for your dashboard
      icon: SquareTerminal,
      // No 'items' => it's rendered as a simple link/button
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  // Toggles dark mode on the <html> element
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
        {/* Main Navigation */}
        <NavMain items={data.navMain} />

        {/* Extra sections in sidebar (optional) */}
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
