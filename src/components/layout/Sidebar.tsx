
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
} from '@/components/ui/sidebar';
import { 
  Home, 
  Menu as MenuIcon, 
  Package, 
  ChartBar, 
  Bell, 
  CreditCard,
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const isMobile = useIsMobile();
  const [restaurantName, setRestaurantName] = useState('Restaurant Name');

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
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              Q
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Q-Tasty Partner</span>
              <span className="text-xs text-muted-foreground truncate">{restaurantName}</span>
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
                    <NavLink to="/" className={({ isActive }) => 
                      isActive ? "text-primary w-full" : "w-full"
                    }>
                      <Home className="w-5 h-5" />
                      <span>Dashboard</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/menu" className={({ isActive }) => 
                      isActive ? "text-primary w-full" : "w-full"
                    }>
                      <MenuIcon className="w-5 h-5" />
                      <span>Menu Management</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/orders" className={({ isActive }) => 
                      isActive ? "text-primary w-full" : "w-full"
                    }>
                      <Package className="w-5 h-5" />
                      <span>Order Management</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/analytics" className={({ isActive }) => 
                      isActive ? "text-primary w-full" : "w-full"
                    }>
                      <ChartBar className="w-5 h-5" />
                      <span>Analytics</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/marketing" className={({ isActive }) => 
                      isActive ? "text-primary w-full" : "w-full"
                    }>
                      <Bell className="w-5 h-5" />
                      <span>Marketing</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/finances" className={({ isActive }) => 
                      isActive ? "text-primary w-full" : "w-full"
                    }>
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
                    <NavLink to="/settings" className={({ isActive }) => 
                      isActive ? "text-primary w-full" : "w-full"
                    }>
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
          <Button variant="outline" className="w-full justify-start gap-2" size="sm">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
