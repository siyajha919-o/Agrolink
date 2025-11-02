import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ordersAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Package, Clock, CheckCircle, XCircle, Loader2, MapPin, Calendar } from "lucide-react";

interface Order {
  _id: string;
  productId: {
    _id: string;
    name: string;
    pricePerKg: number;
    imageUrl?: string;
    location: string;
  };
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  payment?: {
    status: string;
    method: string;
  };
}

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('agrolink_token');
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login to view your orders",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const data = await ordersAPI.getMyOrders();
      setOrders(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Package className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      confirmed: "default",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive",
    };
    
    return (
      <Badge variant={variants[statusLower] || "outline"} className="capitalize">
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Orders</h1>
          <p className="text-xl text-muted-foreground">
            Track your orders and delivery status
          </p>
        </div>

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-semibold mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders. Start shopping in the marketplace!
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Browse Products
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {order.productId?.imageUrl ? (
                        <img
                          src={order.productId.imageUrl}
                          alt={order.productId.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {order.productId?.name || 'Product'}
                        </h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{order.productId?.location || 'Location not available'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Quantity</p>
                          <p className="font-semibold">{order.quantity} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Price per kg</p>
                          <p className="font-semibold">₹{order.productId?.pricePerKg}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="font-semibold text-primary text-lg">₹{order.totalPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Payment</p>
                          <p className="font-semibold capitalize">
                            {order.payment?.status || 'Pending'}
                          </p>
                        </div>
                      </div>

                      {/* Order Status Timeline */}
                      <div className="pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">Status:</span>
                          <span className="text-muted-foreground">
                            {order.status === 'pending' && 'Your order is being processed'}
                            {order.status === 'confirmed' && 'Order confirmed by farmer'}
                            {order.status === 'shipped' && 'Order is on the way'}
                            {order.status === 'delivered' && 'Order has been delivered'}
                            {order.status === 'cancelled' && 'Order has been cancelled'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-3">
                    {order.status === 'pending' && (
                      <Button variant="outline" size="sm">
                        Cancel Order
                      </Button>
                    )}
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        Order Again
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
