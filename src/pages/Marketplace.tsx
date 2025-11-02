import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { productsAPI } from "@/lib/api";

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsAPI.getAll();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Mock data - in real app this would come from backend
  const mockProducts = [
    {
      id: 1,
      name: "Organic Tomatoes",
      farmer: "Rajesh Kumar",
      location: "Punjab",
      price: "40",
      unit: "kg",
      image: new URL("@/assets/tomatoes.jpg", import.meta.url).href,
      organic: true,
      category: "vegetables",
    },
    {
      id: 2,
      name: "Fresh Wheat",
      farmer: "Priya Sharma",
      location: "Haryana",
      price: "25",
      unit: "kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
      organic: false,
      category: "grains",
    },
    {
      id: 3,
      name: "Organic Cauliflower",
      farmer: "Amit Patel",
      location: "Gujarat",
      price: "35",
      unit: "kg",
      image: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400",
      organic: true,
      category: "vegetables",
    },
    {
      id: 4,
      name: "Fresh Spinach",
      farmer: "Sunita Devi",
      location: "Uttar Pradesh",
      price: "30",
      unit: "kg",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
      organic: true,
      category: "vegetables",
    },
    {
      id: 5,
      name: "Basmati Rice",
      farmer: "Harjeet Singh",
      location: "Punjab",
      price: "80",
      unit: "kg",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
      organic: false,
      category: "grains",
    },
    {
      id: 6,
      name: "Fresh Potatoes",
      farmer: "Mohan Lal",
      location: "Madhya Pradesh",
      price: "20",
      unit: "kg",
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
      organic: false,
      category: "vegetables",
    },
  ];

  // Use real products if available, fallback to mock data
  const displayProducts = products.length > 0 ? products : mockProducts;

  const filteredProducts = displayProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.farmer?.toLowerCase() || product.farmerId?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Fresh Produce Marketplace</h1>
          <p className="text-xl text-muted-foreground">
            Browse fresh produce directly from local farmers
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search produce or farmers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="vegetables">Vegetables</SelectItem>
              <SelectItem value="grains">Grains</SelectItem>
              <SelectItem value="fruits">Fruits</SelectItem>
              <SelectItem value="dairy">Dairy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                productId={product._id}
                farmerId={product.farmerId?._id || product.farmerId}
                name={product.name}
                farmer={product.farmerId?.name || product.farmer || 'Unknown Farmer'}
                location={product.location}
                price={product.pricePerKg?.toString() || product.price}
                unit={product.unit || 'kg'}
                image={product.imageUrl || product.image || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400'}
                organic={product.organic}
              />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
