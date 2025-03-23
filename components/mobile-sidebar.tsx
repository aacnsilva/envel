"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  Share2, 
  UserCircle,
  Users
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const MobileSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock user data - this would come from auth in real app
  const user = {
    name: "User",
    email: "user@example.com",
    image: null,
  };
  
  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    
    if (path !== "/dashboard" && pathname.startsWith(path)) {
      return true;
    }
    
    return false;
  };

  const mainNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Envelopes",
      href: "/envelopes",
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      title: "Categories",
      href: "/categories",
      icon: <PieChart className="h-5 w-5" />,
    },
  ];

  const sharingNavItems = [
    {
      title: "Shared with me",
      href: "/sharing/shared-with-me",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "My shares",
      href: "/sharing/my-shares",
      icon: <Share2 className="h-5 w-5" />,
    },
  ];

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
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
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
            <div className="mt-auto border-t p-4">
              <div className="flex items-center gap-x-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback>
                    <UserCircle className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <Link 
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}; 