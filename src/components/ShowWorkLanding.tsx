import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Menu, 
  X, 
  Code2, 
  Zap, 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Star,
  Twitter,
  Github,
  Linkedin,
  Youtube,
  Instagram
} from 'lucide-react';

// Import portfolio images - temporarily commented out due to missing assets
// import portfolioWebApp from '@/assets/portfolio-web-app.jpg';
// import portfolioMobileApp from '@/assets/portfolio-mobile-app.jpg';
// import portfolioEcommerce from '@/assets/portfolio-ecommerce.jpg';
// import demoWorkspace from '@/assets/demo-workspace.jpg';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

const ShowWorkLanding = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [email, setEmail] = useState('');

  // Debug logging
  console.log('🏠 ShowWorkLanding component is rendering!');
  console.log('📍 Current location:', window.location.pathname);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "ShowWork transformed how I showcase my projects. The AI content generation saves me hours every week.",
      name: "Sarah Chen",
      role: "Fullstack Developer", 
      avatar: "https://images.pexels.com/photos/7652243/pexels-photo-7652243.jpeg",
    },
    {
      id: 2,
      quote: "Finally, a platform that understands indie hackers. My portfolio looks professional and drives real engagement.",
      name: "Marcus Rodriguez",
      role: "Indie Hacker",
      avatar: "https://images.pexels.com/photos/33530479/pexels-photo-33530479.jpeg", 
    },
    {
      id: 3,
      quote: "The multi-platform posting feature is a game-changer. I reach my audience everywhere with one click.",
      name: "Alex Kim",
      role: "Creative Developer",
      avatar: "https://images.pexels.com/photos/7552373/pexels-photo-7552373.jpeg",
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => prev === 0 ? testimonials.length - 1 : prev - 1);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 group hover:scale-105 transition-all duration-300">
              <div className="w-8 h-8 logo-bg rounded-lg flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground group-hover:logo-text transition-colors duration-300">ShowWork</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-foreground-muted hover:text-foreground transition-all duration-300 hover:scale-110 transform hover:-translate-y-1">Features</a>
              <a href="#demo" className="text-foreground-muted hover:text-foreground transition-all duration-300 hover:scale-110 transform hover:-translate-y-1">Demo</a>  
              <a href="#testimonials" className="text-foreground-muted hover:text-foreground transition-all duration-300 hover:scale-110 transform hover:-translate-y-1">Reviews</a>
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-foreground-muted hover:scale-105 transition-all duration-300 hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button 
                className="logo-bg hover:opacity-90 shadow-lg hover:scale-110 hover:shadow-xl transform transition-all duration-300 text-white"
                onClick={() => navigate('/login')}
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-surface border-t border-card-border">
              <nav className="px-4 py-4 space-y-4">
                <a href="#features" className="block text-foreground-muted hover:text-foreground">Features</a>
                <a href="#demo" className="block text-foreground-muted hover:text-foreground">Demo</a>
                <a href="#testimonials" className="block text-foreground-muted hover:text-foreground">Reviews</a>
                <div className="pt-4 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full logo-bg text-white"
                    onClick={() => navigate('/login')}
                  >
                    Get Started
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-subtle opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-slide-in-right"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in transform hover:scale-105 transition-all duration-500">
              <span className="text-foreground animate-fade-in">
                Showcase Your Work
              </span>
              <br />
              <span className="text-foreground animate-fade-in animation-delay-300">Like Never Before</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto mb-8 animate-fade-in animation-delay-500 transform hover:translate-y-1 transition-all duration-300">
              Turn your projects into compelling portfolios with AI-powered content generation and seamless multi-platform publishing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in animation-delay-700">
              <Button 
                size="lg" 
                className="logo-bg shadow-lg text-lg px-8 py-4 hover:scale-110 hover:shadow-2xl transform transition-all duration-300 text-white hover:opacity-90"
                onClick={() => navigate('/login')}
              >
                Start Building Free
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 hover:scale-105 transform transition-all duration-300 hover:bg-gradient-to-r hover:from-accent/20 hover:to-primary/20 hover:text-primary"
                onClick={() => navigate('/login')}
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Portfolio Preview Grid */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group cursor-pointer transform hover:scale-110 transition-all duration-500 animate-fade-in animation-delay-100 hover:rotate-1">
                <div className="bg-surface rounded-xl overflow-hidden shadow-lg hover:shadow-2xl border border-card-border relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img 
                    src="https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    alt="Web App Portfolio"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-6 relative z-10">
                    <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">Web Applications</h3>
                    <p className="text-foreground-muted transform group-hover:translate-x-2 transition-transform duration-300">Showcase full-stack projects with interactive demos</p>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer transform hover:scale-110 transition-all duration-500 animate-fade-in animation-delay-300 hover:-rotate-1">
                <div className="bg-surface rounded-xl overflow-hidden shadow-lg hover:shadow-2xl border border-card-border relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img 
                    src="https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    alt="Mobile App Portfolio"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-6 relative z-10">
                    <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-accent transition-colors duration-300">Mobile Apps</h3>
                    <p className="text-foreground-muted transform group-hover:translate-x-2 transition-transform duration-300">Present iOS and Android apps beautifully</p>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer transform hover:scale-110 transition-all duration-500 animate-fade-in animation-delay-500 hover:rotate-1">
                <div className="bg-surface rounded-xl overflow-hidden shadow-lg hover:shadow-2xl border border-card-border relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img 
                    src="https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    alt="E-commerce Portfolio"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-6 relative z-10">
                    <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">E-commerce Sites</h3>
                    <p className="text-foreground-muted transform group-hover:translate-x-2 transition-transform duration-300">Display online stores and shopping experiences</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-20 bg-surface-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 animate-scale-in hover:scale-105 transition-transform duration-500">
              Everything You Need to Shine
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-surface rounded-xl p-8 border border-card-border hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-4 animate-fade-in animation-delay-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 logo-bg rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative z-10">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:logo-text transition-colors duration-300 relative z-10">AI Content Generation</h3>
              <p className="text-foreground-muted mb-6 relative z-10 group-hover:translate-x-2 transition-transform duration-300">
                Generate compelling project descriptions, technical details, and marketing copy with AI assistance.
              </p>
              <Button variant="ghost" className="logo-text hover:opacity-80 p-0 group-hover:scale-110 transition-all duration-300 relative z-10">
                Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </div>

            <div className="group bg-surface rounded-xl p-8 border border-card-border hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-4 animate-fade-in animation-delay-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 logo-bg rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative z-10">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:logo-text transition-colors duration-300 relative z-10">Multi-Platform Publishing</h3>
              <p className="text-foreground-muted mb-6 relative z-10 group-hover:translate-x-2 transition-transform duration-300">
                Share your work across social media, job boards, and professional networks with one click.
              </p>
              <Button variant="ghost" className="logo-text hover:opacity-80 p-0 group-hover:scale-110 transition-all duration-300 relative z-10">
                Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </div>

            <div className="group bg-surface rounded-xl p-8 border border-card-border hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-4 animate-fade-in animation-delay-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 logo-bg rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative z-10">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:logo-text transition-colors duration-300 relative z-10">Professional Templates</h3>
              <p className="text-foreground-muted mb-6 relative z-10 group-hover:translate-x-2 transition-transform duration-300">
                Choose from dozens of stunning portfolio templates designed by professionals for developers.
              </p>
              <Button variant="ghost" className="logo-text hover:opacity-80 p-0 group-hover:scale-110 transition-all duration-300 relative z-10">
                Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              See ShowWork in Action  
            </h2>
            <p className="text-xl text-foreground-muted max-w-3xl mx-auto mb-8">
              Watch how easy it is to create stunning portfolios that get you noticed by employers and clients.
            </p>
            <Button 
              size="lg" 
              className="logo-bg shadow-lg text-white hover:opacity-90"
              onClick={() => navigate('/login')}
            >
              Watch Full Demo
            </Button>
          </div>

          <div className="relative">
            <div className="bg-surface rounded-2xl overflow-hidden shadow-2xl border border-card-border">
              <img 
                src="https://images.pexels.com/photos/593325/pexels-photo-593325.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                alt="ShowWork Demo Workspace"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h4 className="text-2xl font-bold text-foreground mb-2">Create Professional Portfolios in Minutes</h4>
                <p className="text-foreground-muted">Our intuitive builder makes it easy to showcase your best work.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-surface-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Loved by Developers Worldwide
            </h2>
            <p className="text-xl text-foreground-muted max-w-3xl mx-auto">
              Join thousands of developers who've transformed their careers with ShowWork.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-surface rounded-2xl p-8 md:p-12 shadow-lg border border-card-border">
              <blockquote className="text-xl md:text-2xl text-center mb-8 text-foreground">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              
              <div className="flex items-center justify-center space-x-4">
                <img 
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="text-center">
                  <div className="font-semibold text-foreground">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-foreground-muted">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:flex"
              onClick={prevTestimonial}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline" 
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex"
              onClick={nextTestimonial}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Dots Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'logo-bg' : 'bg-border'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Ready to Showcase Your Work?
          </h2>
          <p className="text-xl text-foreground-muted mb-8">
            Join thousands of developers building impressive portfolios with ShowWork.
          </p>
          
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12"
              required
            />
            <Button type="submit" size="lg" className="logo-bg text-white hover:opacity-90">
              Get Started Free
            </Button>
          </form>
          
          <p className="text-sm text-foreground-muted">
            No credit card required. Start building in minutes.
          </p>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Newsletter */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <form onSubmit={handleEmailSubmit} className="mb-4">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-3 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                />
                <Button type="submit" className="logo-bg text-white hover:opacity-90">
                  Subscribe
                </Button>
              </form>
              <p className="text-sm text-primary-foreground/80">
                Get the latest updates and portfolio tips.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <div className="space-y-2">
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground">Features</a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground">Templates</a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground">Pricing</a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground">Integrations</a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground">API</a>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <div className="space-y-2">
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground">About</a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground">Blog</a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground">Careers</a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground">Contact</a>
                <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground">Help</a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 logo-bg rounded-lg flex items-center justify-center">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">ShowWork</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-8 mt-8 text-center">
            <p className="text-primary-foreground/80">
              © 2024 ShowWork. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground text-sm">Privacy Policy</a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground text-sm">Terms of Service</a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShowWorkLanding;