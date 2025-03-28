import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Car,
  Settings,
  MoveHorizontal,
  LogOut,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  onLogout?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar = ({
  onLogout = () => console.log("Logout clicked"),
  isCollapsed = false,
  onToggleCollapse = () => {},
}: SidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      name: "Terminübersicht",
      path: "/dashboard",
      icon: <Calendar className="h-5 w-5" />,
      exact: true,
    },
    {
      name: "Terminverteilung",
      path: "/dashboard/distribution",
      icon: <MoveHorizontal className="h-5 w-5" />,
    },
    {
      name: "Fahrzeugverwaltung",
      path: "/dashboard/vehicles",
      icon: <Car className="h-5 w-5" />,
    },
    {
      name: "Einstellungen",
      path: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div
      className={cn(
        "h-full bg-gray-100 border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "border-b border-gray-200 flex items-center",
          isCollapsed ? "justify-center py-4" : "p-4 justify-between",
        )}
      >
        {!isCollapsed && (
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Krankentransport
            </h2>
            <p className="text-sm text-gray-500">Mitarbeiter-Dashboard</p>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-md hover:bg-gray-200 transition-colors"
          aria-label={isCollapsed ? "Sidebar ausklappen" : "Sidebar einklappen"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className={cn("flex-1 p-4 space-y-1", isCollapsed && "px-2")}>
        {navItems.map((item) => {
          const isActive = item.exact
            ? currentPath === item.path
            : currentPath.startsWith(item.path);

          return (
            <TooltipProvider key={item.path}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center rounded-md transition-colors",
                      isCollapsed
                        ? "justify-center p-2"
                        : "px-3 py-2 space-x-3",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:bg-gray-200",
                    )}
                  >
                    {item.icon}
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </nav>

      <div
        className={cn(
          "border-t border-gray-200 space-y-2",
          isCollapsed ? "p-2" : "p-4",
        )}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/"
                className={cn(
                  "flex items-center rounded-md text-gray-700 hover:bg-gray-200 transition-colors",
                  isCollapsed ? "justify-center p-2" : "px-3 py-2 space-x-3",
                )}
              >
                <Home className="h-5 w-5" />
                {!isCollapsed && <span>Zur Startseite</span>}
              </Link>
            </TooltipTrigger>
            <TooltipContent side={isCollapsed ? "right" : "bottom"}>
              <p>Öffentliche Buchungsseite anzeigen</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onLogout}
                className={cn(
                  "flex items-center rounded-md text-gray-700 hover:bg-gray-200 transition-colors",
                  isCollapsed
                    ? "justify-center p-2 w-full"
                    : "w-full px-3 py-2 space-x-3",
                )}
              >
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span>Abmelden</span>}
              </button>
            </TooltipTrigger>
            <TooltipContent side={isCollapsed ? "right" : "bottom"}>
              <p>Von Mitarbeiterbereich abmelden</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;
