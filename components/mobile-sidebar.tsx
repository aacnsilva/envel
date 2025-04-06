"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  UserCircle,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mainNavItems, sharingNavItems } from "@/lib/navigation";
import { mockUser } from "@/lib/mock-data";

export const MobileSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  
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
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] sm:w-[350px] p-0 z-50">
          <div className="flex flex-col h-full">
            <div className="border-b p-4 flex items-center justify-between">
              <Link 
                href="/" 
                className="font-semibold text-xl block"
                onClick={() => setIsOpen(false)}
              >
                Envel
              </Link>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </SheetTrigger>
            </div>
            <div className="flex-1 overflow-auto">
              <nav className="flex flex-col gap-1 p-2">
                <div className="pb-1 mb-1 font-medium text-xs text-muted-foreground px-3 pt-4">
                  Main
                </div>
                {mainNavItems.map((item, index) => (
                  <Link 
                    key={index}
                    href={item.href} 
                    className={cn(
                      "flex items-center gap-x-3 px-3 py-2 text-sm rounded-md",
                      isActive(item.href) ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 text-muted-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                ))}

                <div className="pb-1 mb-1 font-medium text-xs text-muted-foreground px-3 pt-4">
                  Sharing
                </div>
                {sharingNavItems.map((item, index) => (
                  <Link 
                    key={index}
                    href={item.href} 
                    className={cn(
                      "flex items-center gap-x-3 px-3 py-2 text-sm rounded-md",
                      isActive(item.href) ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 text-muted-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-auto p-4 border-t">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-x-3 cursor-pointer">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={mockUser.image || ""} alt={mockUser.name} />
                      <AvatarFallback className="bg-primary/10">
                        <UserCircle className="h-5 w-5 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium truncate">{mockUser.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{mockUser.email}</p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
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
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}; 