import React, { useState } from 'react';
import Papa from 'papaparse';
import { 
  Upload, FileType, CheckCircle2, AlertCircle, Trash2, 
  ArrowLeft, Table as TableIcon, Database, Save, Info 
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const DataLab = ({ industry, onBack, onUploadSuccess }) => {
  const [businessName, setBusinessName] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [mode, setMode] = useState('csv'); 

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
            setMessage({ type: 'success', text: `Successfully loaded ${validData.length} rows from CSV.` });
          }
        }
      });
    }
  };

  const saveData = async () => {
    if (!businessName) {
      setMessage({ type: 'error', text: 'Please enter your Business/Shop Name.' });
      return;
    }
    if (csvData.length === 0) {
      setMessage({ type: 'error', text: 'No data to save.' });
      return;
    }

    setLoading(true);
    const bId = businessName.toLowerCase().replace(/\s+/g, '_');
    try {
      await axios.post(`${API_BASE_URL}/data/upload`, {
        industry: industry,
        business_id: bId,
        data: csvData.map(row => ({ ds: row.ds, y: parseFloat(row.y) })),
        clear_existing: true
      });
      setMessage({ type: 'success', text: 'Aura has learned your data! Redirecting to your dashboard...' });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        onUploadSuccess(bId);
      }, 2000);

    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save data: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-900 animate-in fade-in duration-500">
      <header className="max-w-4xl mx-auto mb-10 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tighter">
          <Database size={24} /> Aura Data Lab
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-slate-200">
          <h2 className="text-3xl font-black mb-2 tracking-tight">Teach Aura About Your Business</h2>
          <p className="text-slate-500 mb-10 text-lg">Upload your past performance, and Aura will predict your future growth.</p>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Step 1: Your Brand Name</label>
              <input 
                type="text" 
                placeholder="Enter Business Name (e.g. Burhan Motors)"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:outline-none transition-all font-bold text-xl placeholder:text-slate-300"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Step 2: Upload Performance CSV</label>
              <div className="relative group">
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`p-12 border-2 border-dashed rounded-[2rem] flex flex-col items-center gap-4 transition-all ${
                  csvData.length > 0 ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 group-hover:border-indigo-400 bg-slate-50'
                }`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                    csvData.length > 0 ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400'
                  }`}>
                    {csvData.length > 0 ? <CheckCircle2 size={32} /> : <Upload size={32} />}
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">{csvData.length > 0 ? `${csvData.length} Records Loaded` : 'Drop your CSV here'}</p>
                    <p className="text-slate-400 text-sm">{csvData.length > 0 ? 'Aura is ready to analyze this data' : 'Ensure columns are "ds" and "y"'}</p>
                  </div>
                </div>
              </div>
            </div>

            {message.text && (
              <div className={`p-5 rounded-2xl flex items-center gap-3 font-bold text-sm animate-pulse ${
                message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                {message.text}
              </div>
            )}

            {csvData.length > 0 && !loading && (
              <button 
                onClick={saveData}
                className="w-full bg-slate-900 text-white p-6 rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3"
              >
                <Save size={24} /> Save & Predict Future
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataLab;
