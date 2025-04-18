"use client";

import { useState, ReactNode, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChevronLeft, 
  ChevronRight, 
  UserCircle,
  User,
  Settings,
  LogOut
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mainNavItems, sharingNavItems } from "@/lib/navigation";
import { mockUser } from "@/lib/mock-data";

interface SidebarProps {
  children?: ReactNode;
}

export const Sidebar = ({ children }: SidebarProps) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Toggle sidebar collapsed state
  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);
  
  // Handle keyboard shortcut (Alt+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 's') {
        toggleSidebar();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleSidebar]);
  
  // Emit event when collapsed state changes
  useEffect(() => {
    // Create and dispatch custom event
    const event = new CustomEvent('sidebarToggle', { 
      detail: { collapsed: isCollapsed } 
    });
    window.dispatchEvent(event);
  }, [isCollapsed]);
  
  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    
    if (path !== "/dashboard" && pathname.startsWith(path)) {
      return true;
    }
    
    return false;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className={cn(
        "fixed h-screen bg-background border-r flex flex-col overflow-hidden z-30",
        isCollapsed ? "w-[70px]" : "w-[250px]"
      )}>
        <div className="h-16 flex items-center px-4 border-b">
          <Link
            href="/"
            className={cn(
              "font-semibold flex items-center",
              isCollapsed ? "justify-center" : "text-xl"
            )}
          >
            {isCollapsed ? (
              <span className="font-bold text-xl">E</span>
            ) : (
              "Envel"
            )}
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-[-12px] top-7 h-8 w-8 rounded-full border bg-background hidden md:flex items-center justify-center z-40 shadow-sm"
          onClick={toggleSidebar}
          title="Toggle sidebar (Alt+S)"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-foreground" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-foreground" />
          )}
          <span className="sr-only">
            {isCollapsed ? "Expand" : "Collapse"}
          </span>
        </Button>

        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {mainNavItems.map((item, index) => (
              <NavItem
                key={index}
                item={item}
                isActive={isActive(item.href)}
                isCollapsed={isCollapsed}
              />
            ))}

            <div className={cn(
              "mt-4 mb-2 flex",
              isCollapsed ? "justify-center" : "px-4"
            )}>
              <div className={cn(
                "h-px w-full bg-border",
                !isCollapsed && "mx-2"
              )} />
            </div>

            <div
              className={cn(
                "text-muted-foreground font-medium",
                isCollapsed ? "sr-only" : "px-4 mb-2 text-xs"
              )}
            >
              Sharing
            </div>
            
            {sharingNavItems.map((item, index) => (
              <NavItem
                key={index}
                item={item}
                isActive={isActive(item.href)}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>
        </ScrollArea>

        <div className="mt-auto p-4 border-t">
          <div className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "gap-x-3"
          )}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={mockUser.image || ""} alt={mockUser.name} />
                    <AvatarFallback className="bg-primary/10">
                      <UserCircle className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium">{mockUser.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{mockUser.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {!isCollapsed && (
              <div className="flex flex-col">
                <p className="text-sm font-medium truncate">{mockUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">{mockUser.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {children}
    </TooltipProvider>
  );
};

interface NavItemProps {
  item: {
    title: string;
    href: string;
    icon: ReactNode;
  };
  isActive: boolean;
  isCollapsed: boolean;
}

const NavItem = ({ item, isActive, isCollapsed }: NavItemProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
            isActive
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50 text-muted-foreground",
            isCollapsed && "justify-center"
          )}
        >
          {item.icon}
          {!isCollapsed && <span>{item.title}</span>}
        </Link>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right">
          {item.title}
        </TooltipContent>
      )}
    </Tooltip>
  );
}; 