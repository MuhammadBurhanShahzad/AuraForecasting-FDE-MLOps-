import React from 'react';
import { TrendingUp, BarChart3, ShieldCheck, ArrowRight, User } from 'lucide-react';

const LandingPage = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Hero Section */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-2xl tracking-tighter">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">A</div>
          AuraForecasting
        </div>
        <button 
          onClick={() => onStart('retail')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          Get Started
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 bg-indigo-50 text-indigo-600 rounded-full text-sm font-semibold tracking-wide uppercase">
          Predictive Intelligence for Business
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
          See the Future of Your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Business Assets</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
          AuraForecasting empowers shopkeepers, car showroom owners, and asset managers with AI-driven insights. Stop guessing, start growing.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-24">
          <button 
            onClick={() => onStart('retail')}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-800 transition-all"
          >
            Launch Suite <ArrowRight size={20} />
          </button>
          <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all">
            Watch Demo
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-indigo-600">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Retail & Marts</h3>
            <p className="text-slate-500">Inventory forecasting and seasonal demand peaks to optimize your stock levels daily.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-indigo-600">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Car Showrooms</h3>
            <p className="text-slate-500">Track vehicle resale trends and market demand to flip inventory at the highest possible margin.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-indigo-600">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Asset Management</h3>
            <p className="text-slate-500">Real-time portfolio growth tracking with AI-predicted risk assessment for long-term wealth.</p>
          </div>
        </div>

        {/* CEO Vision */}
        <div className="mt-40 bg-indigo-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-indigo-500/30 rounded-full flex items-center justify-center mb-8 border border-white/20">
              <User size={40} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 italic leading-relaxed">
              "Our vision is to democratize advanced data intelligence for every business owner, 
              from local shops to global asset firms. Aura is the heartbeat of future-ready business."
            </h2>
            <div className="text-center">
              <p className="text-xl font-bold">Muhammad Burhan Shahzad</p>
              <p className="text-indigo-300 font-medium">Founder & CEO, AuraForecasting</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
        </div>
      </main>

      <footer className="p-10 text-center text-slate-400 border-t border-slate-100">
        <p>© 2026 AuraForecasting Intelligence. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
