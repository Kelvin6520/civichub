"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function FeedPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    const { data, error } = await supabase
      .from('reports')
      .select('*, likes(id), comments(*)')
      .order('created_at', { ascending: false });
    
    if (!error) {
      setReports(data);
      setFilteredReports(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    const results = reports.filter(report =>
      report.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReports(results);
  }, [searchTerm, reports]);

  const handleLike = async (reportId: string) => {
    await supabase.from('likes').insert([{ report_id: reportId }]);
    fetchReports(); // Refresh counts
  };

  const handleAddComment = async (reportId: string) => {
    if (!newComment.trim()) return;
    await supabase.from('comments').insert([{ report_id: reportId, content: newComment }]);
    setNewComment("");
    fetchReports(); // Refresh data
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-[#006633] text-white pt-16 pb-24 px-6 text-center">
        <h1 className="text-4xl font-black mb-2 tracking-tight">Public Record</h1>
        <p className="text-green-100 opacity-90 font-medium mb-8">Nigeria's voice for accountability.</p>
        
        <div className="max-w-xl mx-auto relative">
          <input 
            type="text"
            placeholder="Search by State..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border-2 border-white/20 rounded-2xl py-4 px-6 text-white placeholder:text-green-200 focus:bg-white focus:text-gray-900 focus:outline-none transition-all shadow-lg font-bold"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-10">
        {loading ? (
          <div className="text-center py-20 font-bold text-gray-400 animate-pulse">Syncing civic data...</div>
        ) : (
          <div className="space-y-6">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="bg-green-100 text-[#006633] px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                        {report.category}
                      </span>
                      <span className="text-gray-400 text-xs font-bold uppercase">
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* LOCATION & VERIFICATION BADGE */}
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-black text-gray-900">
                        {report.lga}, {report.state} State
                      </h3>
                      {report.is_verified && (
                        <div className="bg-blue-500 text-white rounded-full p-0.5 flex items-center justify-center shadow-sm" title="Verified by Admin">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 font-medium leading-relaxed">{report.description}</p>
                  </div>
                  
                  {report.media_url && (
                    <div className="md:w-48 h-48 bg-gray-100 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                      <img 
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/reports-media/${report.media_url}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        alt="Evidence"
                      />
                    </div>
                  )}
                </div>

                {/* INTERACTION BAR */}
                <div className="flex items-center space-x-6 border-t pt-4">
                  <button 
                    onClick={() => handleLike(report.id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors group"
                  >
                    <div className="p-2 rounded-full group-hover:bg-red-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <span className="font-bold text-sm">{report.likes?.length || 0}</span>
                  </button>

                  <button 
                    onClick={() => setActiveCommentId(activeCommentId === report.id ? null : report.id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group"
                  >
                    <div className="p-2 rounded-full group-hover:bg-blue-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <span className="font-bold text-sm">{report.comments?.length || 0}</span>
                  </button>
                </div>

                {/* COMMENT SECTION */}
                {activeCommentId === report.id && (
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-3">
                      {report.comments?.length > 0 ? (
                        report.comments.map((c: any) => (
                          <div key={c.id} className="bg-white p-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 shadow-sm">
                            {c.content}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 font-bold text-center py-2 italic uppercase tracking-widest">No comments yet</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#006633] transition-all"
                      />
                      <button 
                        onClick={() => handleAddComment(report.id)}
                        className="bg-[#006633] text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-green-800 transition-colors"
                      >
                        POST
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}