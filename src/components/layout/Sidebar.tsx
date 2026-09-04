"use client";

import React from 'react';
import { FolderGit2, Settings, Home, Activity, MapPin } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export const Sidebar = () => {
  const { activeProject, setActiveProject, activeView, setActiveView } = useAppContext();

  return (
    <aside className="w-full md:w-64 bg-white/70 backdrop-blur-xl border-b md:border-b-0 md:border-r border-blue-100/50 flex flex-col md:h-screen shrink-0 shadow-[4px_0_24px_rgba(59,130,246,0.03)] z-20 relative max-h-64 md:max-h-none">
      <div className="p-6 border-b border-blue-100/50">
        <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-br from-blue-700 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center shadow-lg shadow-blue-500/20">
            <div className="w-2 h-3 bg-white rounded-sm transform translate-y-1"></div>
            <div className="w-1.5 h-4 bg-blue-200 rounded-sm ml-0.5"></div>
          </div>
          SEOdash.
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <button 
          onClick={() => setActiveProject(null)}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
            !activeProject 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/20' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
          }`}
        >
          <FolderGit2 className={`w-5 h-5 ${!activeProject ? 'text-white' : ''}`} />
          <span>Projects</span>
        </button>

        {activeProject && (
          <div className="mt-8">
            <div className="pt-4 pb-2 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              Active Project
            </div>
            <div className="px-4 py-2 mb-4 text-sm text-slate-700 font-bold truncate">
              {activeProject.name}
            </div>
          </div>
        )}
      </nav>


    </aside>
  );
};
