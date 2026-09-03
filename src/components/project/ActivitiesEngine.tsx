"use client";
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Activity as ActivityIcon, List } from 'lucide-react';
import { ViewActivityModal } from '@/components/modals/ViewActivityModal';

const CATEGORIES = [
  'Blog Writing', 'Guest Posting', 'Directory Submission', 
  'Profile Creation', 'Social Bookmarking', 'Forum Commenting',
  'Article Submission', 'Web 2.0 Submission', 'Infographic Submission',
  'Classified Submission', 'Image Submission', 'Video Submission'
];

export const ActivitiesEngine = ({ onOpenAction, onOpenKeywords }: { onOpenAction: (category: string) => void, onOpenKeywords: () => void }) => {
  const { activeProject, activities } = useAppContext();
  const [viewingCategory, setViewingCategory] = React.useState<string | null>(null);

  // Calculate mock progress (normally driven by real data limits vs completed)
  const getProgress = (cat: string) => {
    const completed = activities.filter(a => a.category === cat).length;
    const total = 10; // Mock total quota
    return { completed, total };
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex justify-between items-center mb-8 border-b border-slate-200/60 pb-6">
         <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">{activeProject?.name}</h2>
           <p className="text-slate-500">SEO Activities Dashboard</p>
         </div>
         <button 
           onClick={onOpenKeywords}
           className="bg-white hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-xl font-semibold transition-all shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-md"
         >
           Manage Keywords
         </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {CATEGORIES.map(cat => {
            const { completed, total } = getProgress(cat);
            const percentage = Math.min((completed / total) * 100, 100);

            return (
              <div key={cat} className="bg-white border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] rounded-3xl p-6 transition-all duration-300 group hover:-translate-y-1 relative">
                  {/* Step Badge */}
                  <div className="absolute top-6 right-6">
                    <span className="bg-blue-50 text-blue-600 text-xs font-black tracking-wider px-3 py-1 rounded-full border border-blue-100">
                      STEP {String(CATEGORIES.indexOf(cat) + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
                      <ActivityIcon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{cat}</h3>
                  
                  <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2 font-medium">
                      <span className="text-slate-500">Progress</span>
                      <span className="text-blue-600">{completed} / {total}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col 2xl:flex-row gap-3">
                    <button 
                      onClick={() => onOpenAction(cat)} 
                      className="flex-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-600 hover:to-indigo-600 hover:text-white text-blue-700 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group/btn border border-blue-500/10 hover:border-transparent hover:shadow-lg hover:shadow-indigo-500/20"
                    >
                      <ActivityIcon className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> Submit
                    </button>
                    <button 
                      onClick={() => setViewingCategory(cat)}
                      className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <List className="w-4 h-4" /> View
                    </button>
                  </div>
              </div>
            );
          })}
       </div>

       {viewingCategory && (
         <ViewActivityModal 
           category={viewingCategory} 
           onClose={() => setViewingCategory(null)} 
         />
       )}
    </div>
  )
}
