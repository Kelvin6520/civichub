"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function AdminDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const checkAuth = async () => {
    const { data } = await supabase.from('admin_settings').select('value').eq('key', 'admin_password').single();
    if (data?.value === password) {
      setIsAuthenticated(true);
      fetchReports();
    } else {
      alert("Incorrect Admin Password");
    }
  };

  async function fetchReports() {
    const { data } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
    setReports(data || []);
    setLoading(false);
  }

  const toggleVerify = async (id: string, currentStatus: boolean) => {
    await supabase.from('reports').update({ is_verified: !currentStatus }).eq('id', id);
    fetchReports();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <h1 className="text-2xl font-black text-gray-900 mb-6">Admin Access</h1>
          <input 
            type="password" 
            placeholder="Enter Admin Key"
            className="w-full border-2 border-gray-100 rounded-xl p-4 mb-4 outline-none focus:border-[#006633]"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={checkAuth} className="w-full bg-[#006633] text-white py-4 rounded-xl font-black tracking-widest">
            UNLOCK DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gray-900 text-white py-12 px-6 text-center">
        <h1 className="text-3xl font-black tracking-tight">Verification Control</h1>
        <p className="text-gray-400 font-medium">Review and verify citizen reports</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase">{report.category}</p>
              <h3 className="font-bold text-lg text-gray-900">{report.lga}, {report.state}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">{report.description}</p>
            </div>
            <button 
              onClick={() => toggleVerify(report.id, report.is_verified)}
              className={`px-6 py-3 rounded-xl font-black text-xs uppercase transition-all ${
                report.is_verified ? 'bg-green-100 text-green-700 border-2 border-green-200' : 'bg-gray-100 text-gray-500 border-2 border-transparent'
              }`}
            >
              {report.is_verified ? "✓ VERIFIED" : "MARK VERIFIED"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}