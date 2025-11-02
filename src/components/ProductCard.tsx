import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, User } from "lucide-react";

interface ProductCardProps {
  name: string;
  farmer: string;
  location: string;
  price: string;
  unit: string;
  image: string;
  organic?: boolean;
}

export const ProductCard = ({
  name,
  farmer,
  location,
  price,
  unit,
  image,
  organic = false,
}: ProductCardProps) => {
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
      <CardFooter>
        <Button className="w-full" variant="default">
          Contact Farmer
        </Button>
      </CardFooter>
    </Card>
  );
};
