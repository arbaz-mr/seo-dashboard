"use client";

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { X, ExternalLink } from 'lucide-react';

export const ViewActivityModal = ({ category, onClose }: { category: string, onClose: () => void }) => {
  const { activities, keywords } = useAppContext();
  
  const categoryActivities = activities.filter(a => a.category === category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Activity Log: {category}</h2>
            <p className="text-sm text-slate-500 mt-1">View all submitted activities for this category.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {categoryActivities.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 bg-white shadow-sm rounded-2xl">
              <p className="text-slate-500 font-medium">No activities submitted yet for {category}.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Keyword</th>
                    <th className="px-4 py-3">Target URL</th>
                    <th className="px-4 py-3">Backlink</th>
                    <th className="px-4 py-3">Metrics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categoryActivities.map((activity, idx) => {
                    const keywordStr = keywords.find(k => k.id === activity.keywordId)?.keyword || 'Unknown';
                    return (
                      <tr key={activity.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">{activity.date}</td>
                        <td className="px-4 py-4 font-medium text-slate-900">{keywordStr}</td>
                        <td className="px-4 py-4 truncate max-w-xs">{activity.targetUrl || '-'}</td>
                        <td className="px-4 py-4 truncate max-w-xs">
                          {activity.backlink ? (
                            <a href={activity.backlink} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
                              {activity.backlink} <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {activity.spamScore !== undefined || activity.traffic !== undefined ? (
                            <div className="flex flex-col gap-1 text-xs font-medium">
                              {activity.spamScore !== undefined && <span>SS: <span className={activity.spamScore > 5 ? 'text-orange-600' : 'text-emerald-600'}>{activity.spamScore}</span></span>}
                              {activity.traffic !== undefined && <span>Traffic: {activity.traffic}</span>}
                            </div>
                          ) : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
