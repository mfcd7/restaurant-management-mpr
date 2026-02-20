import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <ChefHat className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-900">RMS Pro</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-slate-900 transition-colors">Customers</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="font-bold text-slate-600 hover:text-slate-900 transition-colors">Sign In</Link>
          <Link to="/login" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-32 px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          The operating system for <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-emerald-500">modern restaurants</span>
        </h1>
        <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Digitize your entire restaurant workflow. From the kitchen display to the waiter's tablet, manage everything seamlessly with RMS Pro.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
            Start free trial <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors">
            View Live Demo
          </Link>
        </div>

        {/* Mock UI Preview */}
        <div className="mt-20 relative rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-2xl mx-auto max-w-5xl overflow-hidden aspect-video">
          <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Restaurant interior" className="absolute inset-0 w-full h-full object-cover opacity-10 blur-[2px]" />
          <div className="absolute inset-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm flex items-center justify-center">
            <p className="font-bold text-slate-400 text-lg flex items-center gap-2">
              <ChefHat className="w-6 h-6" /> RMS Pro Dashboard Preview
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50 border-t border-slate-200 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Everything you need to run your business</h2>
            <p className="mt-4 text-lg text-slate-500">Built specifically for high-volume restaurants that need reliable, fast, and easy-to-use software.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Waiter App</h3>
              <p className="text-slate-500 leading-relaxed">Take orders right at the table. Instantly send tickets to the kitchen and process payments.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Kitchen Display (KDS)</h3>
              <p className="text-slate-500 leading-relaxed">Streamline your back of house with digital tickets, routing, and prep timers.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Analytics Dashboard</h3>
              <p className="text-slate-500 leading-relaxed">Make data-driven decisions with real-time reporting on sales, staff performance, and inventory.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-900">RMS Pro</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 RMS Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
