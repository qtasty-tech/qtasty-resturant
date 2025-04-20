
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown, ChartBar } from 'lucide-react';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const weekdayRevenueData = [
    { name: 'Mon', revenue: 580 },
    { name: 'Tue', revenue: 650 },
    { name: 'Wed', revenue: 740 },
    { name: 'Thu', revenue: 620 },
    { name: 'Fri', revenue: 910 },
    { name: 'Sat', revenue: 1150 },
    { name: 'Sun', revenue: 960 },
  ];

  const monthlyRevenueData = [
    { name: 'Jan', revenue: 4200 },
    { name: 'Feb', revenue: 4500 },
    { name: 'Mar', revenue: 5100 },
    { name: 'Apr', revenue: 4800 },
    { name: 'May', revenue: 5300 },
    { name: 'Jun', revenue: 6200 },
    { name: 'Jul', revenue: 6800 },
    { name: 'Aug', revenue: 7100 },
    { name: 'Sep', revenue: 6500 },
    { name: 'Oct', revenue: 5900 },
    { name: 'Nov', revenue: 6300 },
    { name: 'Dec', revenue: 7500 },
  ];

  const weekdayOrdersData = [
    { name: 'Mon', orders: 28 },
    { name: 'Tue', orders: 32 },
    { name: 'Wed', orders: 36 },
    { name: 'Thu', orders: 30 },
    { name: 'Fri', orders: 45 },
    { name: 'Sat', orders: 58 },
    { name: 'Sun', orders: 48 },
  ];

  const monthlyOrdersData = [
    { name: 'Jan', orders: 210 },
    { name: 'Feb', orders: 225 },
    { name: 'Mar', orders: 255 },
    { name: 'Apr', orders: 240 },
    { name: 'May', orders: 265 },
    { name: 'Jun', orders: 310 },
    { name: 'Jul', orders: 340 },
    { name: 'Aug', orders: 355 },
    { name: 'Sep', orders: 325 },
    { name: 'Oct', orders: 295 },
    { name: 'Nov', orders: 315 },
    { name: 'Dec', orders: 375 },
  ];

  const hourlyOrdersData = [
    { hour: '6 AM', orders: 2 },
    { hour: '7 AM', orders: 5 },
    { hour: '8 AM', orders: 10 },
    { hour: '9 AM', orders: 8 },
    { hour: '10 AM', orders: 6 },
    { hour: '11 AM', orders: 12 },
    { hour: '12 PM', orders: 18 },
    { hour: '1 PM', orders: 16 },
    { hour: '2 PM', orders: 9 },
    { hour: '3 PM', orders: 7 },
    { hour: '4 PM', orders: 10 },
    { hour: '5 PM', orders: 15 },
    { hour: '6 PM', orders: 22 },
    { hour: '7 PM', orders: 20 },
    { hour: '8 PM', orders: 18 },
    { hour: '9 PM', orders: 12 },
    { hour: '10 PM', orders: 6 },
  ];

  const categoryData = [
    { name: 'Mains', value: 45 },
    { name: 'Sides', value: 20 },
    { name: 'Drinks', value: 15 },
    { name: 'Desserts', value: 10 },
    { name: 'Salads', value: 10 },
  ];
  
  const COLORS = ['#5DAA80', '#FAC849', '#F15D36', '#36A2EB', '#9966FF'];

  const topSellingItems = [
    { name: 'Classic Cheeseburger', orders: 124, change: 8 },
    { name: 'French Fries', orders: 92, change: 5 },
    { name: 'Margherita Pizza', orders: 87, change: -3 },
    { name: 'Chocolate Brownie', orders: 68, change: 12 },
    { name: 'Caesar Salad', orders: 54, change: 2 },
  ];

  const renderStats = () => {
    if (loading) {
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
              Total Revenue ({timeRange === 'week' ? 'This Week' : 'This Month'})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="dashboard-stat-value">
              ${timeRange === 'week' ? '5,610' : '24,500'}
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
              Total Orders ({timeRange === 'week' ? 'This Week' : 'This Month'})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="dashboard-stat-value">
              {timeRange === 'week' ? '277' : '1,225'}
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
            <div className="dashboard-stat-value">$20.25</div>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+2% from previous {timeRange}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-stat">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Repeat Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="dashboard-stat-value">68%</div>
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

      <Tabs defaultValue="week" className="mb-6" onValueChange={setTimeRange}>
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
              {timeRange === 'week' ? 'Daily revenue for the current week' : 'Monthly revenue for the current year'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeRange === 'week' ? weekdayRevenueData : monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Revenue']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar dataKey="revenue" fill="#5DAA80" radius={[4, 4, 0, 0]} />
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
              {timeRange === 'week' ? 'Daily orders for the current week' : 'Monthly orders for the current year'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeRange === 'week' ? weekdayOrdersData : monthlyOrdersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [value, 'Orders']}
                      labelFormatter={(label) => `${label}`}
                    />
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
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyOrdersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [value, 'Orders']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar dataKey="orders" fill="#FAC849" radius={[4, 4, 0, 0]} />
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
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
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
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
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
          <CardDescription>Most popular menu items for the {timeRange}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 animate-pulse">
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
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{item.orders} orders</span>
                    <div className={`flex items-center ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
