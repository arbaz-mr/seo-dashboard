"use client";

import React, { useState } from 'react';
import { useAppContext, Keyword } from '@/context/AppContext';
import { X, Check, Save } from 'lucide-react';

export const KeywordsModal = ({ onClose }: { onClose: () => void }) => {
  const { keywords, updateKeywords } = useAppContext();
  const [localKeywords, setLocalKeywords] = useState<Keyword[]>(keywords);

  const handleUpdate = (id: string, field: 'keyword' | 'url', value: string) => {
    setLocalKeywords(prev => prev.map(k => k.id === id ? { ...k, [field]: value } : k));
  };

  const handleSave = () => {
    updateKeywords(localKeywords);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Keywords Tracker</h2>
            <p className="text-sm text-slate-500 mt-1">Manage your target keywords and connected URLs.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-50/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-700">Your Keywords</h3>
            <button 
              onClick={() => setLocalKeywords([...localKeywords, { id: Date.now().toString(), keyword: '', url: '' }])}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              + Add Keyword
            </button>
          </div>
          
          {localKeywords.length === 0 ? (
             <div className="text-center py-12 text-slate-400">No keywords added yet. Click 'Add Keyword' to start tracking.</div>
          ) : (
            localKeywords.map((kw, idx) => (
              <div key={kw.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-sm transition-colors group relative">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-400 font-bold text-xs shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={kw.keyword}
                    onChange={e => handleUpdate(kw.id, 'keyword', e.target.value)}
                    className="w-full bg-transparent text-slate-900 font-semibold text-lg border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none px-1 py-0.5 transition-colors placeholder-slate-400"
                    placeholder="Target Keyword"
                  />
                  <input
                    type="url"
                    value={kw.url}
                    onChange={e => handleUpdate(kw.id, 'url', e.target.value)}
                    className="w-full bg-transparent text-slate-500 text-sm border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none px-1 py-0.5 transition-colors placeholder-slate-400"
                    placeholder="Connected URL (e.g. /services/plumbing)"
                  />
                </div>
                <button 
                  onClick={() => setLocalKeywords(localKeywords.filter(k => k.id !== kw.id))}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-slate-700 font-medium bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
            <Save className="w-5 h-5" /> Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};
