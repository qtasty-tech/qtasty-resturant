
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Check, X, Package, TrendingUp, Bell } from 'lucide-react';

const Dashboard = () => {
  const [todayOrders, setTodayOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [todayCustomers, setTodayCustomers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setTodayOrders(28);
      setPendingOrders(4);
      setTodaySales(842.50);
      setTodayCustomers(24);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const salesData = [
    { name: 'Mon', sales: 580 },
    { name: 'Tue', sales: 650 },
    { name: 'Wed', sales: 740 },
    { name: 'Thu', sales: 620 },
    { name: 'Fri', sales: 910 },
    { name: 'Sat', sales: 1150 },
    { name: 'Sun', sales: 960 },
  ];

  const pendingOrdersList = [
    { id: 'ORD-5421', time: '10 mins ago', customer: 'John D.', total: '$42.50', items: 4 },
    { id: 'ORD-5420', time: '15 mins ago', customer: 'Sarah M.', total: '$28.75', items: 2 },
    { id: 'ORD-5419', time: '22 mins ago', customer: 'Robert T.', total: '$36.99', items: 3 },
    { id: 'ORD-5418', time: '30 mins ago', customer: 'Emma L.', total: '$51.25', items: 5 },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Overview of your restaurant performance"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="dashboard-stat">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="dashboard-stat-value animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              <div className="dashboard-stat-value">{todayOrders}</div>
            )}
            <div className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+12% from yesterday</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-stat">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="dashboard-stat-value animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              <div className="dashboard-stat-value text-accent">{pendingOrders}</div>
            )}
            <div className="flex items-center text-xs font-medium">
              <Package className="mr-1 h-3 w-3" />
              <span>Requires attention</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-stat">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="dashboard-stat-value animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
            ) : (
              <div className="dashboard-stat-value">${todaySales.toFixed(2)}</div>
            )}
            <div className="flex items-center text-xs text-green-600 font-medium">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+8% from yesterday</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-stat">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customers Today</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="dashboard-stat-value animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              <div className="dashboard-stat-value">{todayCustomers}</div>
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
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#5DAA80" radius={[4, 4, 0, 0]} />
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
              <CardDescription>Orders awaiting your confirmation</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse flex p-3 rounded-lg border">
                      <div className="w-full space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : pendingOrders > 0 ? (
                <div className="space-y-2">
                  {pendingOrdersList.map((order) => (
                    <div key={order.id} className="flex flex-col p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{order.id}</h4>
                          <p className="text-xs text-muted-foreground">{order.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{order.total}</p>
                          <p className="text-xs text-muted-foreground">{order.items} items</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" className="flex-1" variant="outline">
                          <X className="h-4 w-4 mr-1" /> Decline
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Check className="h-4 w-4 mr-1" /> Accept
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">All caught up!</h3>
                  <p className="text-muted-foreground text-sm">No pending orders right now.</p>
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
                    <p className="text-sm font-medium">New promotion available</p>
                    <p className="text-xs text-muted-foreground">Boost visibility with featured restaurant placement</p>
                    <p className="text-xs text-muted-foreground mt-1">35 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Weekly payout processed</p>
                    <p className="text-xs text-muted-foreground">$1,245.50 has been sent to your bank account</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
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

export default Dashboard;
