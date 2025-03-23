"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, UserCircle, X } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock user data - this would come from auth in real app
  const user = {
    name: "User",
    email: "user@example.com",
    image: null,
  };
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="font-semibold text-xl mr-4">
          Envel
        </Link>
        
        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80%] sm:w-[350px]">
            <div className="flex flex-col h-full">
              <div className="border-b pb-4 pt-2">
                <Link 
                  href="/" 
                  className="font-semibold text-xl mb-4 block"
                  onClick={() => setIsOpen(false)}
                >
                  Envel
                </Link>
              </div>
              <nav className="flex flex-col gap-4 py-4">
                <Link 
                  href="/dashboard" 
                  className={cn(
                    "px-2 py-1 rounded-md text-base font-medium",
                    isActive("/dashboard") ? "bg-accent" : "hover:bg-accent/50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/envelopes" 
                  className={cn(
                    "px-2 py-1 rounded-md text-base font-medium",
                    isActive("/envelopes") ? "bg-accent" : "hover:bg-accent/50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Envelopes
                </Link>
                <Link 
                  href="/categories" 
                  className={cn(
                    "px-2 py-1 rounded-md text-base font-medium",
                    isActive("/categories") ? "bg-accent" : "hover:bg-accent/50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Categories
                </Link>
                <div className="py-1 mb-1 mt-2 font-medium text-base px-2">
                  Sharing
                </div>
                <Link 
                  href="/sharing/shared-with-me" 
                  className={cn(
                    "pl-4 py-1 rounded-md text-base",
                    isActive("/sharing/shared-with-me") ? "bg-accent" : "hover:bg-accent/50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Shared with me
                </Link>
                <Link 
                  href="/sharing/my-shares" 
                  className={cn(
                    "pl-4 py-1 rounded-md text-base",
                    isActive("/sharing/my-shares") ? "bg-accent" : "hover:bg-accent/50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  My shares
                </Link>
                <Link 
                  href="/sharing/requests" 
                  className={cn(
                    "pl-4 py-1 rounded-md text-base",
                    isActive("/sharing/requests") ? "bg-accent" : "hover:bg-accent/50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Requests
                </Link>
              </nav>
              <div className="mt-auto border-t pt-4">
                {user ? (
                  <div className="flex items-center gap-x-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback>
                        <UserCircle className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <Link 
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant="ghost" size="sm">
                        {user.name}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Link 
                    href="/login"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button size="sm" className="ml-2">
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <NavigationMenu className="mx-6 hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/dashboard" legacyBehavior passHref>
                <NavigationMenuLink 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/dashboard") && "bg-accent"
                  )}
                >
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/envelopes" legacyBehavior passHref>
                <NavigationMenuLink 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/envelopes") && "bg-accent"
                  )}
                >
                  Envelopes
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/categories" legacyBehavior passHref>
                <NavigationMenuLink 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/categories") && "bg-accent"
                  )}
                >
                  Categories
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Sharing</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[200px]">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/sharing/shared-with-me"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium">Shared with me</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Envelopes others have shared with you
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/sharing/my-shares"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium">My shares</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Envelopes you've shared with others
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/sharing/requests"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium">Requests</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Pending share requests
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <div className="hidden md:flex items-center gap-x-2">
              <Avatar>
                <AvatarImage src={user.image || ""} />
                <AvatarFallback>
                  <UserCircle className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  {user.name}
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/login" className="hidden md:block">
              <Button size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}; 