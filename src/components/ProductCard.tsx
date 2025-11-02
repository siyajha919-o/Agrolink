import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, User, Phone, Mail, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  name: string;
  farmer: string;
  location: string;
  price: string;
  unit: string;
  image: string;
  organic?: boolean;
  farmerId?: string;
  productId?: string;
}

export const ProductCard = ({
  name,
  farmer,
  location,
  price,
  unit,
  image,
  organic = false,
  farmerId,
  productId,
}: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleContactFarmer = () => {
    // Mock phone number - in real app would come from farmer profile
    const phoneNumber = "+91 98765 43210";
    const message = `Hi ${farmer}, I'm interested in buying ${quantity}kg of ${name} at ₹${price}/${unit}. Location: ${location}`;
    
    toast({
      title: "Contact Information",
      description: `You can reach ${farmer} at ${phoneNumber}`,
    });

    // Option to open WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('agrolink_token');
    if (!token) {
      toast({
        title: "Login Required",
        description: "Please login as a buyer to place orders",
        variant: "destructive"
      });
      return;
    }

    if (!productId) {
      toast({
        title: "Error",
        description: "Product ID is missing. Please refresh the page.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: productId,
          quantity: quantity
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Order Placed Successfully! 🎉",
          description: (
            <div className="space-y-2">
              <p>Order for {quantity}kg of {name} at ₹{parseInt(price) * quantity} has been placed.</p>
              <a href="/my-orders" className="text-primary underline block">View My Orders →</a>
            </div>
          ),
        });
        setIsOpen(false);
      } else {
        toast({
          title: "Order Failed",
          description: data.message || "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-[var(--shadow-hover)] transition-[all_0.3s_cubic-bezier(0.4,0,0.2,1)] group">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg">{name}</h3>
          {organic && (
            <Badge variant="secondary" className="ml-2">
              Organic
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{farmer}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
        <div className="text-2xl font-bold text-primary mt-3">
          ₹{price}
          <span className="text-sm font-normal text-muted-foreground">/{unit}</span>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="flex-1" variant="default">
              <MessageCircle className="h-4 w-4 mr-2" />
              Buy Now
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order {name}</DialogTitle>
              <DialogDescription>
                Purchase from {farmer} in {location}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity (kg)</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="text-lg font-semibold">
                Total: ₹{parseInt(price) * quantity}
              </div>
              <Button onClick={handlePlaceOrder} className="w-full">
                Place Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button onClick={handleContactFarmer} variant="outline" size="icon">
          <Phone className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
