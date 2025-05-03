import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Check, X, Package, TrendingUp, Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import apiConfig from "@/utils/apiConfig";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FixedSizeList } from "react-window";
import { startOfWeek, endOfWeek, format } from "date-fns";

interface Order {
  _id: string;
  user: { _id: string; name: string };
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  status:
    | "pending"
    | "accepted"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled";
  createdAt: string;
  deliveryAddress?: string;
  deliveryType: "pickup" | "delivery";
  paymentMethod: string;
}

interface SalesData {
  name: string;
  sales: number;
}

const Dashboard = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch metrics and orders
  const fetchMetrics = async () => {
    const token = localStorage.getItem("restaurantToken");
    if (!token) throw new Error("No authentication token found");

    // Week in UTC (Monday to Sunday)
    const today = new Date();
    const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });
    const endOfWeekDate = endOfWeek(today, { weekStartsOn: 1 });
    const startOfWeekUTC = new Date(
      Date.UTC(
        startOfWeekDate.getUTCFullYear(),
        startOfWeekDate.getUTCMonth(),
        startOfWeekDate.getUTCDate()
      )
    );
    const endOfWeekUTC = new Date(
      Date.UTC(
        endOfWeekDate.getUTCFullYear(),
        endOfWeekDate.getUTCMonth(),
        endOfWeekDate.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

    const response = await axios.get(
      `${apiConfig.getRestaurantMetrics}/${id}/metrics`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          startDate: startOfWeekUTC.toISOString(),
          endDate: endOfWeekUTC.toISOString(),
          status: "pending",
          page: 1,
          limit: 50,
        },
      }
    );

    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardMetrics", id],
    queryFn: fetchMetrics,
    enabled: !!id,
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: Order["status"];
    }) => {
      const token = localStorage.getItem("restaurantToken");
      await axios.put(
        `${apiConfig.updateOrderstatus}/${orderId}/status/${status}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardMetrics", id] });
      toast({ title: "Success", description: "Order status updated" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update order",
        variant: "destructive",
      });
    },
  });

  // Today's metrics
  const todayMetrics = useMemo(() => {
    if (!data?.metrics?.dailyBreakdown)
      return { totalRevenue: 0, totalOrders: 0, customerCount: 0 };
    const todayStr = format(new Date(), "yyyy-MM-dd");
    const todayData = data.metrics.dailyBreakdown.find(
      (d: any) => d.date === todayStr
    );
    return {
      totalRevenue: todayData?.revenue || 0,
      totalOrders: todayData?.orders || 0,
      customerCount: todayData?.customerCount || 0,
    };
  }, [data]);

  // Sales data for the week
  const salesData = useMemo(() => {
    if (!data?.metrics?.dailyBreakdown) return [];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      const dateStr = format(day, "yyyy-MM-dd");
      const dayData = data.metrics.dailyBreakdown.find(
        (d: any) => d.date === dateStr
      );
      return {
        name: days[i],
        sales: dayData?.revenue || 0,
      };
    });
  }, [data]);

  // Virtualized row for pending orders
  const Row = ({ index, style }: { index: number; style: any }) => {
    const order = data?.orders[index];
    if (!order) return null;
    return (
      <div
        style={style}
        className="flex flex-col p-3 border rounded-lg hover:bg-gray-50"
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-medium"> {`OI-${order._id.slice(-5).toUpperCase()}`}</h4>
            <p className="text-xs text-muted-foreground">
              {getTimeAgo(new Date(order.createdAt))}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              {order.items.length} items
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            className="flex-1"
            variant="outline"
            onClick={() =>
              updateStatusMutation.mutate({
                orderId: order._id,
                status: "cancelled",
              })
            }
          >
            <X className="h-4 w-4 mr-1" /> Decline
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() =>
              updateStatusMutation.mutate({
                orderId: order._id,
                status: "accepted",
              })
            }
          >
            <Check className="h-4 w-4 mr-1" /> Accept
          </Button>
        </div>
      </div>
    );
  };

  if (error) {
    toast({
      title: "Error",
      description: error.message || "Failed to fetch dashboard data",
      variant: "destructive",
    });
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Overview of your restaurant performance"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="dashboard-stat">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="dashboard-stat-value animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              <div className="dashboard-stat-value">
                {todayMetrics.totalOrders}
              </div>
            )}
            <div className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+12% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-stat">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="dashboard-stat-value animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              <div className="dashboard-stat-value text-accent">
                {data?.metrics.pendingOrdersCount || 0}
              </div>
            )}
            <div className="flex items-center text-xs font-medium">
              <Package className="mr-1 h-3 w-3" />
              <span>Requires attention</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-stat">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="dashboard-stat-value animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
            ) : (
              <div className="dashboard-stat-value">
                ${todayMetrics.totalRevenue.toFixed(2)}
              </div>
            )}
            <div className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+8% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-stat">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Customers Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="dashboard-stat-value animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              <div className="dashboard-stat-value">
                {todayMetrics.customerCount}
              </div>
            )}
            <div className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+5% from yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Weekly sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="sales"
                        fill="#5DAA80"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pending Orders</CardTitle>
              <CardDescription>
                Orders awaiting your confirmation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse flex p-3 rounded-lg border"
                    >
                      <div className="w-full space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : data?.orders.length > 0 ? (
                <FixedSizeList
                  height={400}
                  width="100%"
                  itemCount={data.orders.length}
                  itemSize={120}
                >
                  {Row}
                </FixedSizeList>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">All caught up!</h3>
                  <p className="text-muted-foreground text-sm">
                    No pending orders right now.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>System notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      New promotion available
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Boost visibility with featured restaurant placement
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      35 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Weekly payout processed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      $1,245.50 has been sent to your bank account
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      2 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Utility function to format time ago
const getTimeAgo = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;

  const diffHours = Math.floor(diffMins / 60);
  return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
};

export default Dashboard;
