"use client";

import React, { useState } from 'react';
import { FolderGit2, Settings, Home, Activity, MapPin, Menu, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export const Sidebar = () => {
  const { activeProject, setActiveProject, activeView, setActiveView } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className={`w-full ${isOpen ? 'md:w-64' : 'md:w-auto'} transition-all duration-300 bg-white/70 backdrop-blur-xl border-b md:border-b-0 md:border-r border-blue-100/50 flex flex-col md:h-screen shrink-0 shadow-[4px_0_24px_rgba(59,130,246,0.03)] z-20 relative max-h-[50vh] md:max-h-none`}>
      <div className="p-4 md:p-6 border-b border-blue-100/50 flex justify-center items-center">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="flex items-center justify-center hover:opacity-80 transition-opacity focus:outline-none p-2 rounded-xl hover:bg-slate-50"
          title="Toggle Projects"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="14" width="3.5" height="8" rx="1.5" fill="#4DD0E1" />
            <rect x="7.5" y="10" width="3.5" height="12" rx="1.5" fill="#4DD0E1" />
            <rect x="13" y="6" width="3.5" height="16" rx="1.5" fill="#4DD0E1" />
            <rect x="18.5" y="2" width="3.5" height="20" rx="1.5" fill="#4DD0E1" />
          </svg>
        </button>
      </div>
      
      <nav className={`flex-1 p-4 space-y-2 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
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


      </nav>


    </aside>
  );
};
