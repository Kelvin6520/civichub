"use client";
import { useState } from 'react';
import { supabase } from '@/utils/supabase'; 
import { statesAndLgas } from '@/utils/nigeriaData'; 

export default function ReportPage() {
  const [selectedState, setSelectedState] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // New State

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const reportData = {
      state: formData.get("state"),
      lga: formData.get("lga"),
      category: formData.get("category"),
      description: formData.get("description"),
    };

    try {
      let mediaUrl = "";
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data, error } = await supabase.storage.from('reports-media').upload(fileName, file);
        if (error) throw error;
        mediaUrl = data.path;
      }
      const { error: dbError } = await supabase.from('reports').insert([{ 
        ...reportData, 
        media_url: mediaUrl,
        created_at: new Date().toISOString() 
      }]);
      
      if (dbError) throw dbError;
      
      setShowSuccess(true); // Show the success UI
      e.target.reset();
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Submission failed. Check your Supabase settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-gray-50 min-h-screen pb-20">
      {/* SUCCESS MODAL OVERLAY */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Report Logged!</h2>
            <p className="text-gray-500 mb-8 font-medium">Your report has been securely uploaded to the public record.</p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="w-full bg-[#006633] text-white py-4 rounded-xl font-bold hover:bg-green-800 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Visual Header */}
      <div className="bg-[#006633] text-white pt-16 pb-32 px-6 text-center">
        <h1 className="text-4xl font-black mb-4 tracking-tight">Report a Civic Issue</h1>
        <p className="text-green-100 max-w-lg mx-auto text-lg opacity-90">
          Help improve your community by documenting issues for public accountability.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="max-w-3xl mx-auto px-6 -mt-20">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Location Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">State</label>
                <select 
                  name="state" 
                  required 
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-4 text-gray-900 font-bold focus:border-green-600 focus:bg-white outline-none transition-all"
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="">Select State</option>
                  {Object.keys(statesAndLgas).sort().map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">LGA</label>
                <select 
                  name="lga" 
                  required 
                  disabled={!selectedState}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-4 text-gray-900 font-bold focus:border-green-600 focus:bg-white outline-none disabled:opacity-60 disabled:bg-gray-100 transition-all"
                >
                  <option value="">Select LGA</option>
                  {selectedState && statesAndLgas[selectedState].sort().map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Category</label>
              <select name="category" required className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-4 text-gray-900 font-bold focus:border-green-600 outline-none">
                <option value="Roads">Roads & Infrastructure</option>
                <option value="Security">Security</option>
                <option value="Health">Healthcare</option>
                <option value="Power">Power/Electricity</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Evidence */}
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Evidence Attachment</label>
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*,video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-[#006633] file:text-white hover:file:bg-green-800 cursor-pointer"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Description</label>
              <textarea 
                name="description" 
                required 
                placeholder="Describe the issue clearly..."
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-gray-900 font-medium h-40 focus:border-green-600 focus:bg-white outline-none transition-all"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#006633] text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-green-800 transition-all transform active:scale-[0.98] disabled:bg-gray-300"
            >
              {loading ? "UPLOADING..." : "SUBMIT OFFICIAL REPORT"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}