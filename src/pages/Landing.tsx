import { Link } from "react-router-dom";
import { Check, BarChart3, Package, Users, Zap, Shield, Smartphone, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Landing = () => {
  const features = [
    {
      icon: Package,
      title: "Smart Inventory",
      description: "Track stock levels, get low-stock alerts, and manage products effortlessly"
    },
    {
      icon: BarChart3,
      title: "Sales Analytics",
      description: "Real-time profit tracking, daily/monthly reports, and performance insights"
    },
    {
      icon: Users,
      title: "Vendor Management",
      description: "Manage suppliers, track orders, and maintain vendor relationships"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Optimized for mobile devices with touch-friendly interface"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built for speed with real-time updates and instant sync"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for small businesses just getting started",
      features: [
        "Up to 100 products",
        "Basic sales tracking",
        "5 vendor profiles",
        "Mobile app access",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$19",
      period: "/month",
      description: "Everything you need to scale your business",
      features: [
        "Unlimited products",
        "Advanced analytics",
        "Unlimited vendors",
        "Priority support",
        "Export data",
        "Custom categories",
        "Profit tracking"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$49",
      period: "/month",
      description: "For larger teams and advanced workflows",
      features: [
        "Everything in Professional",
        "Multi-user access",
        "Advanced reporting",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "White-label option"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brand-50/30 to-brand-100/40 dark:from-background dark:via-brand-950/30 dark:to-brand-900/40">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-brand-600 to-brand-700 rounded-lg"></div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">
              StockFlow
            </h1>
          </div>
          <Link to="/auth">
            <Button variant="outline" className="border-brand-200 hover:bg-brand-50 dark:border-brand-800 dark:hover:bg-brand-950">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
            <TrendingUp className="w-3 h-3 mr-1" />
            Inventory Management Made Simple
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 bg-clip-text text-transparent dark:from-brand-400 dark:via-brand-500 dark:to-brand-600">
            Streamline Your Business Operations
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Take control of your inventory, track sales in real-time, and make data-driven decisions with our powerful yet simple business management platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?tab=signup">
              <Button size="lg" className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white px-8 py-3">
                Start Free Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-brand-200 hover:bg-brand-50 dark:border-brand-800 dark:hover:bg-brand-950 px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-500">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help small businesses manage inventory, track sales, and grow efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 border-brand-100 dark:border-brand-900 hover:shadow-lg transition-all duration-300 hover:border-brand-200 dark:hover:border-brand-800">
              <div className="w-12 h-12 bg-gradient-to-r from-brand-600 to-brand-700 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-500">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works for your business. No hidden fees, no complicated contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`p-6 relative ${plan.popular ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-brand-100 dark:border-brand-900'} hover:shadow-lg transition-all duration-300`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-600 text-white">
                  Most Popular
                </Badge>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-brand-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/auth?tab=signup" className="block">
                <Button 
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white' : 'variant-outline border-brand-200 hover:bg-brand-50 dark:border-brand-800 dark:hover:bg-brand-950'}`}
                >
                  {plan.price === "Free" ? "Get Started" : "Start Trial"}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="p-8 md:p-12 text-center bg-gradient-to-r from-brand-600 to-brand-700 border-0">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-brand-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust StockFlow to manage their inventory and boost their profits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?tab=signup">
              <Button size="lg" variant="secondary" className="bg-white text-brand-700 hover:bg-brand-50 px-8 py-3">
                Start Your Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
              Contact Sales
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-brand-100 dark:border-brand-900">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2024 StockFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;