"use client";

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export const ActivityForm = ({ 
  category, 
  onClose,
  isGMB = false
}: { 
  category: string; 
  onClose: () => void;
  isGMB?: boolean;
}) => {
  const { keywords, addActivity } = useAppContext();
  const [formData, setFormData] = useState({
    keywordId: keywords[0]?.id || '',
    targetUrl: '',
    backlink: '',
    platform: '',
    spamScore: 0,
    traffic: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addActivity({
      id: Date.now().toString(),
      category,
      keywordId: formData.keywordId,
      targetUrl: formData.targetUrl,
      backlink: formData.backlink,
      platform: formData.platform,
      spamScore: Number(formData.spamScore),
      traffic: Number(formData.traffic),
      date: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-y-auto p-4 space-y-4">
      <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">
        {category}
      </h3>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase">Target Keyword</label>
        <select 
          value={formData.keywordId}
          onChange={e => setFormData({...formData, keywordId: e.target.value})}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
          required
        >
          {keywords.map(kw => (
            <option key={kw.id} value={kw.id}>{kw.keyword}</option>
          ))}
        </select>
      </div>

      {!isGMB && (
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">Target URL</label>
          <input 
            type="url" 
            value={formData.targetUrl}
            onChange={e => setFormData({...formData, targetUrl: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            required
          />
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase">{isGMB ? 'Post URL / Link' : 'Backlink Created'}</label>
        <input 
          type="url" 
          value={formData.backlink}
          onChange={e => setFormData({...formData, backlink: e.target.value})}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          required
        />
      </div>

      {!isGMB && (
        <>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Platform/Website</label>
            <input 
              type="text" 
              value={formData.platform}
              onChange={e => setFormData({...formData, platform: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="space-y-1 flex-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Spam Score</label>
              <input 
                type="number" 
                value={formData.spamScore}
                onChange={e => setFormData({...formData, spamScore: Number(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-1 flex-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Traffic</label>
              <input 
                type="number" 
                value={formData.traffic}
                onChange={e => setFormData({...formData, traffic: Number(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </>
      )}

      <div className="pt-6 mt-auto border-t border-slate-200">
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20">
          Save Activity
        </button>
      </div>
    </form>
  );
}
