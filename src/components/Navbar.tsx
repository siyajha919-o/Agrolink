import { Link } from "react-router-dom";
import { Sprout, Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('agrolink_token'));
  const [userName, setUserName] = useState(localStorage.getItem('agrolink_user_name') || '');
  const { toast } = useToast();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'buyer' as 'buyer' | 'farmer' 
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(loginData);
      if (response.token) {
        localStorage.setItem('agrolink_user_name', response.user.name);
        setUserName(response.user.name);
        setIsLoggedIn(true);
        setIsOpen(false);
        toast({
          title: "Login Successful!",
          description: `Welcome back, ${response.user.name}!`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: response.message || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authAPI.register(registerData);
      if (response.token) {
        localStorage.setItem('agrolink_user_name', response.user.name);
        setUserName(response.user.name);
        setIsLoggedIn(true);
        setIsOpen(false);
        toast({
          title: "Registration Successful!",
          description: `Welcome to AgroLink, ${response.user.name}!`,
        });
      } else {
        toast({
          title: "Registration Failed",
          description: response.message || "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('agrolink_token');
    localStorage.removeItem('agrolink_user_name');
    setIsLoggedIn(false);
    setUserName('');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "For Farmers", path: "/farmers" },
    { name: "How It Works", path: "/#how-it-works" },
  ];

  const buyerLinks = [
    { name: "My Orders", path: "/my-orders" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Sprout className="h-7 w-7" />
            <span>AgroLink</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {isLoggedIn && buyerLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {userName}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero" size="sm">Login / Register</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Welcome to AgroLink</DialogTitle>
                    <DialogDescription>
                      Login to your account or create a new one
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <input
                            type="email"
                            value={loginData.email}
                            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                            className="w-full px-3 py-2 border rounded-md mt-1"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Password</label>
                          <input
                            type="password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                            className="w-full px-3 py-2 border rounded-md mt-1"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full">Login</Button>
                      </form>
                    </TabsContent>
                    <TabsContent value="register">
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Name</label>
                          <input
                            type="text"
                            value={registerData.name}
                            onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                            className="w-full px-3 py-2 border rounded-md mt-1"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <input
                            type="email"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                            className="w-full px-3 py-2 border rounded-md mt-1"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Password</label>
                          <input
                            type="password"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                            className="w-full px-3 py-2 border rounded-md mt-1"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">I am a</label>
                          <select
                            value={registerData.role}
                            onChange={(e) => setRegisterData({...registerData, role: e.target.value as 'buyer' | 'farmer'})}
                            className="w-full px-3 py-2 border rounded-md mt-1"
                          >
                            <option value="buyer">Buyer</option>
                            <option value="farmer">Farmer</option>
                          </select>
                        </div>
                        <Button type="submit" className="w-full">Register</Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            {isLoggedIn && (
              <span className="text-sm font-medium">{userName.split(' ')[0]}</span>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  {isLoggedIn && buyerLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  {isLoggedIn ? (
                    <Button variant="outline" className="mt-4" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                      <DialogTrigger asChild>
                        <Button variant="hero" className="mt-4">Login / Register</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Welcome to AgroLink</DialogTitle>
                          <DialogDescription>
                            Login to your account or create a new one
                          </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="login" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                          </TabsList>
                          <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Email</label>
                                <input
                                  type="email"
                                  value={loginData.email}
                                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                  className="w-full px-3 py-2 border rounded-md mt-1"
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Password</label>
                                <input
                                  type="password"
                                  value={loginData.password}
                                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                  className="w-full px-3 py-2 border rounded-md mt-1"
                                  required
                                />
                              </div>
                              <Button type="submit" className="w-full">Login</Button>
                            </form>
                          </TabsContent>
                          <TabsContent value="register">
                            <form onSubmit={handleRegister} className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Name</label>
                                <input
                                  type="text"
                                  value={registerData.name}
                                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                                  className="w-full px-3 py-2 border rounded-md mt-1"
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Email</label>
                                <input
                                  type="email"
                                  value={registerData.email}
                                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                                  className="w-full px-3 py-2 border rounded-md mt-1"
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Password</label>
                                <input
                                  type="password"
                                  value={registerData.password}
                                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                                  className="w-full px-3 py-2 border rounded-md mt-1"
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">I am a</label>
                                <select
                                  value={registerData.role}
                                  onChange={(e) => setRegisterData({...registerData, role: e.target.value as 'buyer' | 'farmer'})}
                                  className="w-full px-3 py-2 border rounded-md mt-1"
                                >
                                  <option value="buyer">Buyer</option>
                                  <option value="farmer">Farmer</option>
                                </select>
                              </div>
                              <Button type="submit" className="w-full">Register</Button>
                            </form>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
