"use client";

import React, { useState } from 'react';
import { FolderGit2, Settings, Home, Activity, MapPin, Menu, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export const Sidebar = () => {
  const { activeProject, setActiveProject, activeView, setActiveView } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Logo Button */}
      <div className="fixed top-4 left-4 md:top-6 md:left-6 z-40">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="flex items-center justify-center hover:opacity-80 transition-all focus:outline-none p-2.5 rounded-xl hover:bg-white/40"
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

      {/* Overlay Background */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-xl border-r border-blue-100/50 flex flex-col shrink-0 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 md:p-6 border-b border-blue-100/50 flex justify-between items-center">
          <h2 className="font-bold text-slate-900 tracking-wide text-lg">Menu</h2>
          <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-900 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => {
              setActiveProject(null);
              setIsOpen(false);
            }}
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
    </>
  );
};
