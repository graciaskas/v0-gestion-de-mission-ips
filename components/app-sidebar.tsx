"use client"
import { Building2, ClipboardList, FileText, BarChart3, Home, Settings, Users } from "lucide-react"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const navItems = [
  {
    title: "Tableau de bord",
    url: "/web",
    icon: Home,
  },
  {
    title: "Entreprises",
    url: "/web/entreprises",
    icon: Building2,
  },
  {
    title: "Missions",
    url: "/web/missions",
    icon: ClipboardList,
  },
  {
    title: "Documents",
    url: "/web/documents",
    icon: FileText,
  },
  {
    title: "Rapports",
    url: "/web/rapports",
    icon: BarChart3,
  },
  {
    title: "Utilisateurs",
    url: "/web/utilisateurs",
    icon: Users,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="bg-black border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-emerald-600 shadow-lg shadow-primary/25">
            <ClipboardList className="h-5 w-5 text-white" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">IPS</span>
            <span className="text-xs text-muted-foreground">Gestion de missions</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="rounded-lg transition-all duration-200 hover:bg-accent/80 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold"
                  >
                    <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/40 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="rounded-lg transition-all duration-200 hover:bg-accent/80">
              <Link href="/web/parametres" className="flex items-center gap-3 px-3 py-2">
                <Settings className="h-5 w-5" />
                <span>Paramètres</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
