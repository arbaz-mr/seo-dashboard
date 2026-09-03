"use client";

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Activity, MapPin, CheckCircle2 } from 'lucide-react';

export const OverviewEngine = () => {
  const { activeProject, activities } = useAppContext();

  const seoActivitiesCount = activities.filter(a => !a.category.startsWith('GMB')).length;
  const gmbActivitiesCount = activities.filter(a => a.category.startsWith('GMB')).length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex justify-between items-center mb-8 border-b border-slate-200/60 pb-6">
         <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">{activeProject?.name}</h2>
           <p className="text-slate-500">Project Overview</p>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-8 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all group">
             <div>
                <p className="text-slate-500 mb-2 font-medium">Total SEO Activities</p>
                <p className="text-5xl font-black text-slate-900 tracking-tight">{seoActivitiesCount}</p>
             </div>
             <div className="p-4 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
                <Activity className="w-8 h-8 text-blue-600" />
             </div>
          </div>
          <div className="bg-white rounded-3xl p-8 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all group">
             <div>
                <p className="text-slate-500 mb-2 font-medium">Total GMB Activities</p>
                <p className="text-5xl font-black text-slate-900 tracking-tight">{gmbActivitiesCount}</p>
             </div>
             <div className="p-4 bg-emerald-50 rounded-2xl group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-emerald-600" />
             </div>
          </div>
       </div>

       <div className="mt-8 bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
             <CheckCircle2 className="w-5 h-5 text-blue-600" /> Recent Submissions
          </h3>
          {activities.length === 0 ? (
             <p className="text-slate-500 italic">No activities submitted yet.</p>
          ) : (
             <div className="space-y-4">
                {[...activities].reverse().slice(0, 5).map(activity => (
                   <div key={activity.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                      <div>
                         <p className="text-slate-900 font-bold">{activity.category}</p>
                         <p className="text-sm text-slate-500">{activity.date}</p>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                         activity.category.startsWith('GMB') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                         {activity.category.startsWith('GMB') ? 'GMB' : 'SEO'}
                      </span>
                   </div>
                ))}
             </div>
          )}
       </div>
    </div>
  )
}
