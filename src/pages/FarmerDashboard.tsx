import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Package, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";

const FarmerDashboard = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    price: "",
    unit: "",
    quantity: "",
    description: "",
    organic: "no",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would save to backend
    toast.success("Product listed successfully!");
    setShowAddProduct(false);
    setFormData({
      productName: "",
      category: "",
      price: "",
      unit: "",
      quantity: "",
      description: "",
      organic: "no",
    });
  };

  const stats = [
    { icon: Package, label: "Listed Products", value: "12" },
    { icon: TrendingUp, label: "Total Sales", value: "₹45,000" },
    { icon: Users, label: "Active Buyers", value: "8" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Farmer Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Manage your products and connect with buyers
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Product Button */}
        {!showAddProduct && (
          <div className="mb-8">
            <Button onClick={() => setShowAddProduct(true)} size="lg" variant="hero">
              <Plus className="mr-2 h-5 w-5" />
              List New Product
            </Button>
          </div>
        )}

        {/* Add Product Form */}
        {showAddProduct && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>List New Product</CardTitle>
              <CardDescription>
                Add your fresh produce to the marketplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      placeholder="e.g., Organic Tomatoes"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="fruits">Fruits</SelectItem>
                        <SelectItem value="grains">Grains</SelectItem>
                        <SelectItem value="dairy">Dairy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Price per unit"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value) => setFormData({ ...formData, unit: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                        <SelectItem value="quintal">Quintal</SelectItem>
                        <SelectItem value="ton">Ton</SelectItem>
                        <SelectItem value="piece">Piece</SelectItem>
                        <SelectItem value="dozen">Dozen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Available Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Quantity available"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organic">Organic Certified?</Label>
                    <Select
                      value={formData.organic}
                      onValueChange={(value) => setFormData({ ...formData, organic: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell buyers about your product, farming practices, etc."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" variant="hero">
                    List Product
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddProduct(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* My Products */}
        <Card>
          <CardHeader>
            <CardTitle>My Listed Products</CardTitle>
            <CardDescription>
              Manage your current listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No products listed yet. Add your first product to get started!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FarmerDashboard;
