"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { Keyboard } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showShortcutTip, setShowShortcutTip] = useState(true);
  const { toast } = useToast();

  // Show keyboard shortcut tip on first load
  useEffect(() => {
    if (showShortcutTip) {
      const timer = setTimeout(() => {
        toast({
          title: "Keyboard Shortcut Available",
          description: "Press Alt+S to toggle the sidebar",
          action: <Keyboard className="h-4 w-4" />,
        });
        // Only show once per session
        setShowShortcutTip(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showShortcutTip, toast]);

  // Listen for sidebar collapse state
  // In a real app, this would use context or state management
  // For demo purposes using a custom event
  useEffect(() => {
    const handleSidebarToggle = (e: CustomEvent) => {
      setIsSidebarCollapsed(e.detail.collapsed);
    };

    window.addEventListener('sidebarToggle' as any, handleSidebarToggle as any);
    
    return () => {
      window.removeEventListener('sidebarToggle' as any, handleSidebarToggle as any);
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main content area */}
      <div className={`flex-1 flex flex-col ${isSidebarCollapsed ? 'md:ml-[70px]' : 'md:ml-[250px]'}`}>
        <header className="h-16 border-b flex items-center px-4 md:px-6 sticky top-0 z-10 bg-background">
          {/* Mobile Sidebar - only visible on mobile */}
          <div className="md:hidden">
            <MobileSidebar />
          </div>
          
          <div className="ml-auto">
            {/* Any header icons or notifications can go here */}
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
        
        <footer className="border-t py-4">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Envel - Envelope Budgeting
          </div>
        </footer>
      </div>
      <Toaster />
    </div>
  );
} 