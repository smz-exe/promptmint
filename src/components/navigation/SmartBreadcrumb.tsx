"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Users, Settings, Plus, Search } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

const routeConfig = {
  "/": { label: "Home", icon: Home },
  "/feed": { label: "Feed", icon: Search },
  "/cards": { label: "Cards", icon: null },
  "/cards/create": { label: "Create Card", icon: Plus },
  "/profile": { label: "Profile", icon: Users },
  "/settings": { label: "Settings", icon: Settings },
};

interface SmartBreadcrumbProps {
  customItems?: Array<{
    label: string;
    href?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

export function SmartBreadcrumb({ customItems }: SmartBreadcrumbProps) {
  const pathname = usePathname();

  // Generate breadcrumb items based on current path
  const generateBreadcrumbItems = () => {
    const items = [];

    // Always start with Home
    items.push({
      label: "Home",
      href: "/",
      icon: Home,
    });

    // If we're not on home page, add current page
    if (pathname !== "/") {
      // Handle dynamic routes
      if (pathname.startsWith("/cards/") && pathname !== "/cards/create") {
        items.push({
          label: "Feed",
          href: "/feed",
          icon: Search,
        });
        items.push({
          label: "Card Details",
          href: undefined, // Current page
          icon: null,
        });
      } else if (pathname.startsWith("/profile/") && pathname !== "/profile") {
        items.push({
          label: "Profile",
          href: undefined, // Current page
          icon: Users,
        });
      } else {
        // Handle known routes
        const config = routeConfig[pathname as keyof typeof routeConfig];
        if (config) {
          items.push({
            label: config.label,
            href: undefined, // Current page
            icon: config.icon,
          });
        }
      }
    }

    // Add custom items if provided
    if (customItems) {
      items.push(...customItems);
    }

    return items;
  };

  const items = generateBreadcrumbItems();

  // Don't render if only home item
  if (items.length <= 1) {
    return null;
  }

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link href={item.href} className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="flex items-center gap-2">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
