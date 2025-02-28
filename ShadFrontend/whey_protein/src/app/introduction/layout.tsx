// app/howTo/layout.tsx
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function HowToLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
        <SidebarInset>
            <div style={{ display: "flex" }}>
                <AppSidebar style={{ width: "250px" }} />
                    <main style={{ flex: 1 }}>
                        
                        {children}
                    </main>
            </div>
        </SidebarInset>
    </SidebarProvider>
  )
}
