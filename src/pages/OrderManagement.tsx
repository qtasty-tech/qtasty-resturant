import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Package } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useParams } from "react-router-dom";

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
  status:
    | "pending"
    | "accepted"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled";
  createdAt: Date;
  deliveryAddress?: string;
  deliveryType: "pickup" | "delivery";
  specialInstructions?: string;
  paymentMethod: string;
}

const API_BASE_URL = "http://localhost:7000/api/orders";


const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("pending");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const {id} = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("restaurantToken");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const response = await axios.get(
          `${API_BASE_URL}/restaurant/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetchedOrders: Order[] = response.data.orders.map(
          (order: any) => ({
            id: order._id,
            customerId: order.user._id,
            customerName: order.user.name || "Unknown Customer",
            items: order.items,
            total: order.totalAmount,
            status: order.status,
            createdAt: new Date(order.createdAt),
            deliveryAddress: order.deliveryAddress,
            deliveryType: order.deliveryType,
            specialInstructions: order.specialInstructions,
            paymentMethod: order.paymentMethod,
          })
        );

        setOrders(fetchedOrders);
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to fetch orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      const token = localStorage.getItem("restaurantToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(
        `${API_BASE_URL}/${orderId}/status/${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedOrder = response.data.updatedOrder;
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast({
        title: `Order ${orderId}`,
        description: `Status updated to ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || `Failed to update order ${orderId}`,
        variant: "destructive",
      });
    }
  };

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  const getStatusBadgeColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-orange-100 text-orange-800";
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;

    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Order Management"
        description="View and manage your customer orders"
      />

      <Tabs
        defaultValue="pending"
        className="mb-8"
        onValueChange={setSelectedStatus}
      >
        <TabsList className="mb-4 grid grid-cols-3 md:grid-cols-7">
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-2">
              {orders.filter((o) => o.status === "pending").length}
            </Badge>
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
                <Card
                  key={order.id}
                  className="overflow-hidden hover:shadow transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{order.id}</h3>
                          <Badge className={getStatusBadgeColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getTimeAgo(order.createdAt)} • {order.customerName} •
                          <span className="ml-1">
                            {order.deliveryType === "delivery"
                              ? "Delivery"
                              : "Pickup"}
                          </span>
                        </p>
                      </div>
                      <div className="font-semibold text-lg">
                        ${order.total.toFixed(2)}
                      </div>
                    </div>

                    <div className="space-y-2 border-b pb-4 mb-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <div>
                            <span className="font-medium">
                              {item.quantity}x
                            </span>{" "}
                            {item.name}
                          </div>
                          <div>${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}

                      {order.specialInstructions && (
                        <div className="text-sm text-muted-foreground mt-2">
                          <span className="font-medium">Note:</span>{" "}
                          {order.specialInstructions}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:justify-between md:items-center">
                      <div className="flex items-center text-sm">
                        <Package className="h-4 w-4 mr-1" />
                        <span>
                          {order.deliveryType === "delivery"
                            ? `Delivery to: ${order.deliveryAddress}`
                            : "Customer pickup"}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {order.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(order.id, "cancelled")
                              }
                            >
                              <X className="h-4 w-4 mr-1" /> Decline
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(order.id, "accepted")
                              }
                            >
                              <Check className="h-4 w-4 mr-1" /> Accept
                            </Button>
                          </>
                        )}

                        {order.status === "accepted" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateStatus(order.id, "preparing")
                            }
                          >
                            Start Preparing{" "}
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}

                        {order.status === "preparing" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateStatus(order.id, "ready")
                            }
                          >
                            Mark as Ready{" "}
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}

                        {order.status === "ready" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateStatus(order.id, "completed")
                            }
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
              <h3 className="font-medium text-lg mb-2">
                No {selectedStatus !== "all" ? selectedStatus : ""} orders
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {selectedStatus === "pending"
                  ? "You don't have any new orders waiting to be accepted."
                  : `There are no orders with the status "${selectedStatus}" at the moment.`}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderManagement;
