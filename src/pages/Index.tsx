import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { FeatureCard } from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Handshake, Shield, Leaf, TrendingDown } from "lucide-react";
import heroImage from "@/assets/hero-farmer.jpg";

const Index = () => {
  const features = [
    {
      icon: TrendingDown,
      title: "No Middlemen",
      description: "Direct connection between farmers and buyers means better prices for both parties.",
    },
    {
      icon: TrendingUp,
      title: "Fair Pricing",
      description: "Farmers set their own prices and earn what they deserve for their hard work.",
    },
    {
      icon: Shield,
      title: "Transparent Deals",
      description: "Complete transparency in transactions with secure payment systems.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Supporting local farmers and building stronger agricultural communities.",
    },
    {
      icon: Leaf,
      title: "Fresh & Organic",
      description: "Direct from farm means fresher produce and support for organic farming.",
    },
    {
      icon: Handshake,
      title: "Trust & Quality",
      description: "Build lasting relationships between farmers and buyers based on quality.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Farmers List Products",
      description: "Farmers create profiles and list their fresh produce with prices they set.",
    },
    {
      number: "02",
      title: "Buyers Browse",
      description: "Local buyers, restaurants, and co-ops browse available produce directly.",
    },
    {
      number: "03",
      title: "Direct Connection",
      description: "Buyers contact farmers directly - no middlemen, just fair trade.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(28, 74, 45, 0.95), rgba(28, 74, 45, 0.7)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary-foreground">
              Farm Fresh, Farmer Direct
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              Connecting farmers directly to buyers. No middlemen. Fair prices. Fresh produce.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="hero" asChild>
                <Link to="/marketplace">
                  Browse Marketplace <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link to="/farmers">I'm a Farmer</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose AgroLink?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering farmers and ensuring fair trade through direct connections
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent, and direct - connecting farms to markets in three easy steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-block text-6xl font-bold text-primary/20 mb-4">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-foreground">
            Ready to Start Trading Directly?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of farmers and buyers who are already benefiting from direct trade
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
              <Link to="/farmers">Start Selling</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/marketplace">Start Buying</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-xl text-primary mb-4">
                <Leaf className="h-6 w-6" />
                <span>AgroLink</span>
              </div>
              <p className="text-muted-foreground">
                Connecting farmers directly to markets for fair trade and fresh produce.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link></li>
                <li><Link to="/farmers" className="hover:text-primary transition-colors">For Farmers</Link></li>
                <li><Link to="/#how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 AgroLink. Empowering farmers, feeding communities.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
