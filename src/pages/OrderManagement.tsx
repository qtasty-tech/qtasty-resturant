
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowRight, Package } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: Date;
  deliveryAddress?: string;
  deliveryType: 'pickup' | 'delivery';
  specialInstructions?: string;
  paymentMethod: string;
}

// Mock data
const generateMockOrders = (): Order[] => {
  const statuses: Order['status'][] = ['pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'];
  const items: OrderItem[] = [
    { name: 'Classic Cheeseburger', quantity: 1, price: 12.99 },
    { name: 'French Fries', quantity: 1, price: 4.99 },
    { name: 'Chocolate Shake', quantity: 1, price: 5.99 },
    { name: 'Chicken Caesar Salad', quantity: 1, price: 10.99 },
    { name: 'Margherita Pizza', quantity: 1, price: 14.99 },
    { name: 'Chocolate Brownie', quantity: 1, price: 6.99 },
  ];

  const orders: Order[] = [];
  
  // Generate 20 orders
  for (let i = 0; i < 20; i++) {
    const orderItems: OrderItem[] = [];
    const numItems = Math.floor(Math.random() * 3) + 1;
    
    // Add random items to order
    for (let j = 0; j < numItems; j++) {
      const item = items[Math.floor(Math.random() * items.length)];
      const quantity = Math.floor(Math.random() * 2) + 1;
      orderItems.push({
        name: item.name,
        quantity,
        price: item.price
      });
    }
    
    // Calculate total
    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const randomStatus = statuses[Math.floor(Math.random() * (i < 5 ? 2 : statuses.length))];
    const randomHoursAgo = Math.floor(Math.random() * 24);
    
    // Create order
    orders.push({
      id: `ORD-${5000 + i}`,
      customerId: `CUST-${1000 + Math.floor(Math.random() * 1000)}`,
      customerName: ['John D.', 'Sarah M.', 'Robert T.', 'Emma L.', 'Michael K.'][Math.floor(Math.random() * 5)],
      items: orderItems,
      total,
      status: randomStatus,
      createdAt: new Date(Date.now() - randomHoursAgo * 60 * 60 * 1000),
      deliveryAddress: Math.random() > 0.5 ? '123 Main St, Anytown' : undefined,
      deliveryType: Math.random() > 0.3 ? 'delivery' : 'pickup',
      specialInstructions: Math.random() > 0.7 ? 'Extra sauce please.' : undefined,
      paymentMethod: Math.random() > 0.5 ? 'Credit Card' : 'Cash on Delivery',
    });
  }
  
  // Sort by time (newest first)
  return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading orders
    const timer = setTimeout(() => {
      setOrders(generateMockOrders());
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const getStatusBadgeColor = (status: Order['status']) => {
    switch(status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-orange-100 text-orange-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    
    toast({
      title: `Order ${orderId}`,
      description: `Status updated to ${newStatus}`,
    });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Order Management"
        description="View and manage your customer orders"
      />

      <Tabs defaultValue="pending" className="mb-8" onValueChange={setSelectedStatus}>
        <TabsList className="mb-4 grid grid-cols-3 md:grid-cols-7">
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-2">{orders.filter(o => o.status === 'pending').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="ready">Ready</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="all">All Orders</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus} className="mt-0">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden hover:shadow transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{order.id}</h3>
                          <Badge className={getStatusBadgeColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getTimeAgo(order.createdAt)} • {order.customerName} • 
                          <span className="ml-1">
                            {order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
                          </span>
                        </p>
                      </div>
                      <div className="font-semibold text-lg">
                        ${order.total.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="space-y-2 border-b pb-4 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <div>
                            <span className="font-medium">{item.quantity}x</span> {item.name}
                          </div>
                          <div>${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                      
                      {order.specialInstructions && (
                        <div className="text-sm text-muted-foreground mt-2">
                          <span className="font-medium">Note:</span> {order.specialInstructions}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:justify-between md:items-center">
                      <div className="flex items-center text-sm">
                        <Package className="h-4 w-4 mr-1" />
                        <span>
                          {order.deliveryType === 'delivery' ? `Delivery to: ${order.deliveryAddress}` : 'Customer pickup'}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                            >
                              <X className="h-4 w-4 mr-1" /> Decline
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleUpdateStatus(order.id, 'accepted')}
                            >
                              <Check className="h-4 w-4 mr-1" /> Accept
                            </Button>
                          </>
                        )}
                        
                        {order.status === 'accepted' && (
                          <Button 
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, 'preparing')}
                          >
                            Start Preparing <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}
                        
                        {order.status === 'preparing' && (
                          <Button 
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, 'ready')}
                          >
                            Mark as Ready <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}
                        
                        {order.status === 'ready' && (
                          <Button 
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, 'completed')}
                          >
                            Complete Order <Check className="h-4 w-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="font-medium text-lg mb-2">No {selectedStatus !== 'all' ? selectedStatus : ''} orders</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {selectedStatus === 'pending' ? 
                  "You don't have any new orders waiting to be accepted." :
                  `There are no orders with the status "${selectedStatus}" at the moment.`
                }
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderManagement;
