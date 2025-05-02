import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import apiConfig from "@/utils/apiConfig";
import { useQuery } from "@tanstack/react-query";
import { subDays, format, startOfDay, endOfDay } from "date-fns";

interface ChartData {
  name: string;
  revenue?: number;
  orders?: number;
}

interface CategoryData {
  name: string;
  value: number;
}

interface TopSellingItem {
  name: string;
  orders: number;
  change: number;
}

const Analytics = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  // Fetch metrics and orders
  const fetchMetrics = async () => {
    const token = localStorage.getItem("restaurantToken");
    if (!token) throw new Error("No authentication token found");

    const today = new Date();
    const startDate =
      timeRange === "week" ? subDays(today, 6) : subDays(today, 29);
    const startDateUTC = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate()
      )
    );
    const endDateUTC = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
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
          startDate: startDateUTC.toISOString(),
          endDate: endDateUTC.toISOString(),
          page: 1,
          limit: 50,
        },
      }
    );
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["analyticsMetrics", id, timeRange],
    queryFn: fetchMetrics,
    enabled: !!id,
  });

  // Memoized chart data
  const revenueData = useMemo(() => {
    if (!data?.metrics?.dailyBreakdown) return [];
    const days = Array.from(
      { length: timeRange === "week" ? 7 : 30 },
      (_, i) => {
        const day = subDays(new Date(), i);
        return startOfDay(day);
      }
    ).reverse();

    return days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const dayData = data.metrics.dailyBreakdown.find(
        (d: any) => d.date === dateStr
      );
      return {
        name: format(day, timeRange === "week" ? "EEE" : "MMM d"),
        revenue: dayData?.revenue || 0,
      };
    });
  }, [data, timeRange]);

  const ordersData = useMemo(() => {
    if (!data?.metrics?.dailyBreakdown) return [];
    const days = Array.from(
      { length: timeRange === "week" ? 7 : 30 },
      (_, i) => {
        const day = subDays(new Date(), i);
        return startOfDay(day);
      }
    ).reverse();

    return days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const dayData = data.metrics.dailyBreakdown.find(
        (d: any) => d.date === dateStr
      );
      return {
        name: format(day, timeRange === "week" ? "EEE" : "MMM d"),
        orders: dayData?.orders || 0,
      };
    });
  }, [data, timeRange]);

  const hourlyOrdersData = useMemo(() => {
    if (!data?.metrics?.hourlyBreakdown) return [];
    return Array.from({ length: 24 }, (_, i) => {
      const hourData = data.metrics.hourlyBreakdown.find(
        (d: any) => d.hour === i
      );
      return {
        name: `${i % 12 || 12} ${i < 12 ? "AM" : "PM"}`,
        orders: hourData?.orders || 0,
      };
    });
  }, [data]);

  const categoryData = useMemo(() => {
    return data?.metrics.categoryBreakdown || [];
  }, [data]);

  const topSellingItems = useMemo(() => {
    return (data?.metrics.categoryBreakdown || [])
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map((item) => ({
        name: item.name,
        orders: item.value,
        change: 0, // Mock
      }));
  }, [data]);

  if (error) {
    toast({
      title: "Error",
      description: error.message || "Failed to fetch analytics data",
      variant: "destructive",
    });
  }

  const COLORS = ["#5DAA80", "#FAC849", "#F15D36", "#36A2EB", "#9966FF"];

  const renderStats = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="dashboard-stat">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mt-2 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="dashboard-stat">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue ({timeRange === "week" ? "This Week" : "This Month"}
              )
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="dashboard-stat-value">
              ${(data?.metrics.totalRevenue || 0).toFixed(2)}
            </div>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+8% from previous {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-stat">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders ({timeRange === "week" ? "This Week" : "This Month"})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="dashboard-stat-value">
              {data?.metrics.totalOrders || 0}
            </div>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+12% from previous {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-stat">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="dashboard-stat-value">
              ${(data?.metrics.avgOrderValue || 0).toFixed(2)}
            </div>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+2% from previous {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-stat">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unique Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="dashboard-stat-value">
              {data?.metrics.customerCount || 0}
            </div>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+5% from previous {timeRange}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Analytics"
        description="Track your restaurant's performance"
      />

      <Tabs
        defaultValue="week"
        className="mb-6"
        onValueChange={(value) => setTimeRange(value as "week" | "month")}
      >
        <TabsList>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>
      </Tabs>

      {renderStats()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              {timeRange === "week"
                ? "Daily revenue for the current week"
                : "Daily revenue for the current month"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                  <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Bar
                      dataKey="revenue"
                      fill="#5DAA80"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Volume</CardTitle>
            <CardDescription>
              {timeRange === "week"
                ? "Daily orders for the current week"
                : "Daily orders for the current month"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                  <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ordersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, "Orders"]} />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#F15D36"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Peak Hours</CardTitle>
            <CardDescription>Order volume throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                  <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyOrdersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, "Orders"]} />
                    <Bar
                      dataKey="orders"
                      fill="#FAC849"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Menu Category Breakdown</CardTitle>
            <CardDescription>Orders by food category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                  <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, "Orders"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Selling Items</CardTitle>
          <CardDescription>
            Most popular menu items for the {timeRange}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 animate-pulse"
                >
                  <div className="w-48 h-5 bg-gray-200 rounded"></div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-5 bg-gray-200 rounded"></div>
                    <div className="w-20 h-5 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {topSellingItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{item.orders} orders</span>
                    <div
                      className={`flex items-center ${
                        item.change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <span>{Math.abs(item.change)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
