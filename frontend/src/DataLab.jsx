import React, { useState } from 'react';
import Papa from 'papaparse';
import { 
  Upload, FileType, CheckCircle2, AlertCircle, Trash2, 
  ArrowLeft, Database, Save, Info 
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = ''; 

const DataLab = ({ industry: initialIndustry, onBack, onUploadSuccess }) => {
  const [businessName, setBusinessName] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Intelligent Industry Detection
  const detectIndustry = (name) => {
    const lowName = name.toLowerCase();
    if (lowName.includes('showroom') || lowName.includes('motors') || lowName.includes('car') || lowName.includes('auto')) {
      return 'automotive';
    }
    if (lowName.includes('asset') || lowName.includes('wealth') || lowName.includes('portfolio') || lowName.includes('invest')) {
      return 'assets';
    }
    if (lowName.includes('mart') || lowName.includes('shop') || lowName.includes('store') || lowName.includes('retail')) {
      return 'retail';
    }
    return initialIndustry; // Fallback to current selection
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const validData = results.data.filter(row => row.ds && row.y);
          if (validData.length === 0) {
            setMessage({ type: 'error', text: 'Invalid CSV format. Please ensure you have "ds" and "y" columns.' });
          } else {
            setCsvData(validData);
            setMessage({ type: 'success', text: `Successfully loaded ${validData.length} records.` });
          }
        }
      });
    }
  };

  const saveData = async () => {
    if (!businessName) {
      setMessage({ type: 'error', text: 'Please enter your Business Name.' });
      return;
    }
    
    const detectedIndustry = detectIndustry(businessName);
    const bId = businessName.toLowerCase().replace(/\s+/g, '_');
    
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/data/upload`, {
        industry: detectedIndustry,
        business_id: bId,
        data: csvData.map(row => ({ ds: row.ds, y: parseFloat(row.y) })),
        clear_existing: true
      });
      
      setMessage({ 
        type: 'success', 
        text: `Aura categorized "${businessName}" as ${detectedIndustry.toUpperCase()}. Redirecting...` 
      });
      
      setTimeout(() => {
        onUploadSuccess(bId, detectedIndustry);
      }, 2500);

    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save data: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900 animate-in fade-in duration-500">
      <header className="max-w-4xl mx-auto mb-10 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tighter">
          <Database size={24} /> Aura Data Lab
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-200">
          <h2 className="text-3xl font-black mb-2 tracking-tight">Personalize Your Aura</h2>
          <p className="text-slate-500 mb-10 text-lg">Aura will automatically detect your business type based on the name.</p>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Business Name</label>
              <input 
                type="text" 
                placeholder="e.g. Burhan Motors or City Mart"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:outline-none transition-all font-bold text-xl"
              />
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest italic">
                * Tip: Include "Motors", "Mart", or "Asset" in the name for better categorization.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Upload CSV History</label>
              <div className="relative group">
                <input type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className={`p-12 border-2 border-dashed rounded-[2rem] flex flex-col items-center gap-4 transition-all ${
                  csvData.length > 0 ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 group-hover:border-indigo-400 bg-slate-50'
                }`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                    csvData.length > 0 ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400'
                  }`}>
                    {csvData.length > 0 ? <CheckCircle2 size={32} /> : <Upload size={32} />}
                  </div>
                  <p className="font-bold text-lg">{csvData.length > 0 ? `${csvData.length} Records Ready` : 'Select your CSV file'}</p>
                </div>
              </div>
            </div>

            {message.text && (
              <div className={`p-5 rounded-2xl flex items-center gap-3 font-bold text-sm ${
                message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                {message.text}
              </div>
            )}

            {csvData.length > 0 && !loading && (
              <button onClick={saveData} className="w-full bg-slate-900 text-white p-6 rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-2xl flex items-center justify-center gap-3">
                <Save size={24} /> Initialize Intelligent Forecast
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataLab;
