import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Home,
  Menu as MenuIcon,
  Package,
  ChartBar,
  Bell,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useParams } from "react-router-dom";
import apiConfig from "@/utils/apiConfig";

const Sidebar = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const [restaurantName, setRestaurantName] = useState("Restaurant Name");
  const [restaurantImage, setRestaurantImage] = useState("");

  useEffect(() => {
    const fetchRestaurantName = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        const response = await fetch(`${apiConfig.getMyRestaurants}by-id/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      const data = await response.json();
      setRestaurantName(data?.name);
      setRestaurantImage(data?.image);
      } catch (error) {
        console.error("Error fetching restaurant name:", error);
      }
    };

    fetchRestaurantName();
  }, [id]);

  return (
    <>
      {isMobile && (
        <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4">
          <SidebarTrigger />
          <span className="font-semibold">Q-Tasty Partner</span>
        </div>
      )}
      <SidebarContainer>
        <SidebarHeader className="border-b p-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {restaurantImage ? (
              <img src={restaurantImage} alt="Restaurant" className="w-full h-full object-cover" />
              ) : (
              <span className="text-sm text-muted-foreground">N/A</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Q-Tasty Partner</span>
              <span className="text-xs text-muted-foreground truncate">
                {restaurantName}
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={`/${id}`}
                      className={({ isActive }) =>
                        isActive ? "text-primary w-full" : "w-full"
                      }
                    >
                      <Home className="w-5 h-5" />
                      <span>Dashboard</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={`/${id}/menu`}
                      className={({ isActive }) =>
                        isActive ? "text-primary w-full" : "w-full"
                      }
                    >
                      <MenuIcon className="w-5 h-5" />
                      <span>Menu Management</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={`/${id}/orders`}
                      className={({ isActive }) =>
                        isActive ? "text-primary w-full" : "w-full"
                      }
                    >
                      <Package className="w-5 h-5" />
                      <span>Order Management</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={`/${id}/analytics`}
                      className={({ isActive }) =>
                        isActive ? "text-primary w-full" : "w-full"
                      }
                    >
                      <ChartBar className="w-5 h-5" />
                      <span>Analytics</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={`/${id}/marketing`}
                      className={({ isActive }) =>
                        isActive ? "text-primary w-full" : "w-full"
                      }
                    >
                      <Bell className="w-5 h-5" />
                      <span>Marketing</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={`/${id}/finances`}
                      className={({ isActive }) =>
                        isActive ? "text-primary w-full" : "w-full"
                      }
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Finances</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={`/${id}/settings`}
                      className={({ isActive }) =>
                        isActive ? "text-primary w-full" : "w-full"
                      }
                    >
                      <Settings className="w-5 h-5" />
                      <span>Account Settings</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            size="sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
