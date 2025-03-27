import { 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  Share2, 
  Users,
  TicketCheck 
} from "lucide-react";
import { ReactNode } from "react";

export interface NavItem {
  title: string;
  href: string;
  icon: ReactNode;
}

export const mainNavItems: NavItem[] = [
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
    title: "Entries",
    href: "/entries",
    icon: <TicketCheck className="h-5 w-5" />,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: <PieChart className="h-5 w-5" />,
  },
];

export const sharingNavItems: NavItem[] = [
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