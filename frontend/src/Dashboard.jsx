import React, { useState, useEffect } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart 
} from 'recharts';
import { 
  RefreshCw, Store, Car, Briefcase, Menu, X, LayoutDashboard, 
  Home, Lightbulb, TrendingUp, AlertTriangle, CheckCircle2, Database, Plus
} from 'lucide-react';
import axios from 'axios';
import DataLab from './DataLab';

const API_BASE_URL = 'http://localhost:5000';

const Dashboard = ({ defaultIndustry = 'retail', onBackToHome }) => {
  const [industry, setIndustry] = useState(defaultIndustry);
  const [businessId, setBusinessId] = useState('demo');
  const [historicalData, setHistoricalData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('offline');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showDataLab, setShowDataLab] = useState(false);

  const industries = [
    { id: 'retail', name: 'Retail & Marts', icon: <Store size={20} />, unit: '$', desc: 'daily sales' },
    { id: 'automotive', name: 'Car Showrooms', icon: <Car size={20} />, unit: '$', desc: 'inventory value' },
    { id: 'assets', name: 'Asset Management', icon: <Briefcase size={20} />, unit: '$', desc: 'portfolio value' },
  ];

  const fetchData = async (currentIndustry, currentBusiness) => {
    try {
      const [histRes, forecastRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/data/historical?industry=${currentIndustry}&business_id=${currentBusiness}`),
        axios.get(`${API_BASE_URL}/data/forecast?industry=${currentIndustry}&business_id=${currentBusiness}`)
      ]);
      setHistoricalData(histRes.data);
      setForecastData(forecastRes.data);
      setBackendStatus('online');
    } catch (err) {
      console.error('Error fetching data:', err);
      setBackendStatus('offline');
    }
  };

  const triggerForecast = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/data/trigger-forecast`, { 
        industry, 
        business_id: businessId 
      });
      await fetchData(industry, businessId);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(industry, businessId);
  }, [industry, businessId]);

  const handleUploadSuccess = (newBusinessId) => {
    setBusinessId(newBusinessId);
    setShowDataLab(false);
    fetchData(industry, newBusinessId);
  };

  if (showDataLab) {
    return (
      <DataLab 
        industry={industry} 
        onBack={() => setShowDataLab(false)} 
        onUploadSuccess={handleUploadSuccess}
      />
    );
  }

  const combinedData = [
    ...historicalData.map(d => ({ ...d, type: 'historical', y: d.y })),
    ...forecastData.map(d => ({ ...d, type: 'forecast', yhat: d.yhat }))
  ].sort((a, b) => new Date(a.ds) - new Date(b.ds));

  const currentIndustryInfo = industries.find(i => i.id === industry) || industries[0];

  const generateInsights = () => {
    if (forecastData.length === 0) return "Click 'Trigger Aura Forecast' to analyze your newly uploaded business data.";
    const lastHist = historicalData.length > 0 ? historicalData[historicalData.length - 1].y : 0;
    const lastFore = forecastData.length > 0 ? forecastData[forecastData.length - 1].yhat : 0;
    if (lastHist === 0) return "Aura is ready to analyze. Ensure your business data is accurate.";
    const diff = ((lastFore - lastHist) / lastHist * 100).toFixed(1);
    
    return parseFloat(diff) > 0 
      ? `Good news! Our AI predicts your ${currentIndustryInfo.desc} will grow by ${diff}% over the next month. This is an ideal time to expand.`
      : `Caution: Aura predicts a dip of ${Math.abs(diff)}% in ${currentIndustryInfo.desc}. Plan your budget carefully for the next 30 days.`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 animate-in fade-in duration-500">
      {/* Sidebar */}
      <aside className={`
        fixed inset-0 z-50 bg-white border-r border-slate-200 w-64 transform transition-transform duration-200
        md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tighter mb-10">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">A</div>
            AuraForecasting
          </div>
          
          <nav className="space-y-2 flex-1">
            <button 
              onClick={onBackToHome}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-all"
            >
              <Home size={20} /> Home Page
            </button>

            <button 
              onClick={() => setShowDataLab(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all mt-4 shadow-lg shadow-indigo-100"
            >
              <Plus size={20} /> Import My Data
            </button>

            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-8 mb-4">Industries</p>
            {industries.map(ind => (
              <button
                key={ind.id}
                onClick={() => { setIndustry(ind.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  industry === ind.id 
                    ? 'bg-indigo-600/10 text-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {ind.icon} {ind.name}
              </button>
            ))}
          </nav>

          <div className="mt-auto p-4 bg-slate-900 rounded-2xl text-white">
            <p className="text-xs text-slate-400 mb-1 font-bold tracking-widest uppercase">Lead Strategist</p>
            <p className="text-sm font-black truncate">M. Burhan Shahzad</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full">
        <header className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 bg-white rounded-lg border border-slate-200">
              <Menu size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-black uppercase rounded tracking-wider">Live Analysis</span>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{currentIndustryInfo.name}</p>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                {businessId === 'demo' ? 'Sample Business' : businessId.replace(/_/g, ' ').toUpperCase()}
              </h1>
            </div>
          </div>
          
          <button 
            onClick={triggerForecast}
            disabled={loading}
            className="w-full lg:w-auto flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white px-8 py-5 rounded-[1.5rem] font-black transition-all shadow-2xl shadow-slate-200 text-lg group"
          >
            <RefreshCw size={24} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
            {loading ? 'Aura is Thinking...' : 'Trigger Aura Forecast'}
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                <h2 className="text-2xl font-black flex items-center gap-2 tracking-tight">
                  <TrendingUp className="text-indigo-600" /> Projection Map
                </h2>
                <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200 w-full md:w-auto">
                   <Database size={14} className="ml-2 text-slate-400" />
                   <input 
                    type="text"
                    placeholder="Search Business..."
                    value={businessId}
                    onChange={(e) => setBusinessId(e.target.value.toLowerCase())}
                    className="bg-transparent text-xs font-black p-2 w-full md:w-32 focus:w-48 transition-all outline-none"
                  />
                </div>
              </div>
              
              <div className="h-[350px] md:h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={combinedData}>
                    <defs>
                      <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorFore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="ds" 
                      tickFormatter={(ds) => new Date(ds).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      stroke="#94a3b8"
                      fontSize={11}
                      tickMargin={15}
                    />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `${currentIndustryInfo.unit}${val.toLocaleString()}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px' }}
                      itemStyle={{ fontWeight: '900', fontSize: '14px' }}
                      formatter={(value) => [`${currentIndustryInfo.unit}${value.toLocaleString()}`, '']}
                    />
                    <Area type="monotone" dataKey="y" stroke="#6366f1" fillOpacity={1} fill="url(#colorHist)" strokeWidth={5} name="Historical Performance" connectNulls />
                    <Area type="monotone" dataKey="yhat" stroke="#f43f5e" fillOpacity={1} fill="url(#colorFore)" strokeWidth={5} strokeDasharray="12 6" name="Aura AI Prediction" connectNulls />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-t border-slate-50 pt-8">
                <div className="flex items-center gap-3"><div className="w-4 h-4 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200"></div> Past History</div>
                <div className="flex items-center gap-3"><div className="w-8 h-1 bg-rose-500 rounded-full"></div> AI Future Map</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6 font-black tracking-[0.2em] text-[10px] uppercase text-indigo-300">
                  <Lightbulb size={16} className="animate-pulse" /> Neural Insights
                </div>
                <h3 className="text-2xl font-black mb-6 leading-tight tracking-tight">Predictive Summary</h3>
                <p className="text-indigo-50 leading-relaxed mb-8 text-lg font-medium opacity-90">{generateInsights()}</p>
                <div className="flex items-center gap-3 text-xs font-black bg-white/10 w-fit px-5 py-3 rounded-2xl border border-white/20 backdrop-blur-md">
                   <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                   Aura Confidence: 94%
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000"></div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 space-y-8 shadow-sm">
              <h4 className="font-black text-slate-400 uppercase tracking-[0.2em] text-[10px]">Vital Metrics</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Last Recorded Value</p>
                  <p className="text-4xl font-black tracking-tighter">
                    {currentIndustryInfo.unit}{historicalData.length > 0 ? historicalData[historicalData.length-1].y.toLocaleString() : '0'}
                  </p>
                </div>
                <div className="pt-8 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Aura 30-Day Peak</p>
                  <p className="text-4xl font-black text-rose-500 tracking-tighter">
                    {currentIndustryInfo.unit}{forecastData.length > 0 ? Math.max(...forecastData.map(d => d.yhat)).toLocaleString() : '0'}
                  </p>
                </div>
              </div>
              <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex items-start gap-4">
                <AlertTriangle size={24} className="text-indigo-400 shrink-0 mt-1" />
                <p className="text-xs text-slate-300 font-bold leading-relaxed opacity-80 uppercase tracking-wider">
                  Data-driven decisions lead to 22% higher profitability on average.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
