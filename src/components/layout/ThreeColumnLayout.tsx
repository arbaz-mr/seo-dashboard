"use client";

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { 
  FileText, Key, Tags, FolderOpen, MapPin, Activity, 
  Image as ImageIcon, Hexagon, X, Home
} from 'lucide-react';
import { ActivitiesEngine } from '@/components/project/ActivitiesEngine';
import { GMBEngine } from '@/components/project/GMBEngine';
import { OverviewEngine } from '@/components/project/OverviewEngine';
import { ActivityForm } from '@/components/project/ActivityForm';
import { KeywordsModal } from '@/components/modals/KeywordsModal';
import { SitemapModal } from '@/components/modals/SitemapModal';
import { CredentialsModal } from '@/components/modals/CredentialsModal';
import { DocumentsModal } from '@/components/modals/DocumentsModal';

export type RightSidebarView = 'sitemap' | 'credentials' | 'keywords' | 'documents' | 'images' | 'logo' | 'activities' | 'gmb' | null;
export type LeftSidebarState = { isOpen: boolean; type: string | null; defaultCategory?: string };
export type ModalState = 'keywords' | 'sitemap' | 'credentials' | 'documents' | null;

export const ThreeColumnLayout = () => {
  const { activeProject, activeView, setActiveView } = useAppContext();
  const [leftSidebar, setLeftSidebar] = useState<LeftSidebarState>({ isOpen: false, type: null });
  const [activeModal, setActiveModal] = useState<ModalState>(null);

  const rightMenuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'activities', label: 'Activities Engine', icon: Activity },
    { id: 'gmb', label: 'GMB Engine', icon: MapPin },
    { id: 'sitemap', label: 'Sitemap', icon: FileText },
    { id: 'credentials', label: 'Credentials', icon: Key },
    { id: 'keywords', label: 'Keywords', icon: Tags },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
  ] as const;

  const handleRightMenuClick = (id: string) => {
    if (id === 'keywords' || id === 'sitemap' || id === 'credentials' || id === 'documents') {
      setActiveModal(id as ModalState);
    } else {
      setActiveView(id as 'activities' | 'gmb' | 'overview');
    }
  };

  if (!activeProject) return null;

  return (
    <div className="flex-1 flex flex-col xl:flex-row overflow-y-auto xl:overflow-hidden bg-transparent relative">
      
      {/* Left Sidebar (Action Form) */}
      <div className={`
        ${leftSidebar.isOpen ? 'w-full xl:w-80 border-b xl:border-b-0 xl:border-r' : 'h-0 xl:h-auto xl:w-0 border-0'} 
        transition-all duration-300 ease-in-out shrink-0 bg-white/80 backdrop-blur-xl border-blue-100/50 flex flex-col overflow-hidden shadow-[20px_0_40px_rgba(59,130,246,0.05)] z-10
      `}>
        {leftSidebar.isOpen && (
          <div className="flex-1 overflow-y-auto w-full xl:w-80 flex flex-col max-h-[50vh] xl:max-h-none">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center shrink-0 bg-white">
              <h3 className="font-bold text-slate-900 tracking-wide text-sm">Action Menu</h3>
              <button onClick={() => setLeftSidebar({ isOpen: false, type: null })} className="text-slate-400 hover:text-slate-900 p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {(leftSidebar.type === 'submitActivity' || leftSidebar.type === 'submitGMB') && leftSidebar.defaultCategory && (
                <ActivityForm 
                  category={leftSidebar.defaultCategory} 
                  onClose={() => setLeftSidebar({ isOpen: false, type: null })} 
                  isGMB={leftSidebar.type === 'submitGMB'}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Center Area */}
      <div className="flex-1 xl:overflow-y-auto flex flex-col p-4 md:p-8 pb-32 order-1 xl:order-none">
        <div className="max-w-6xl mx-auto w-full">
          {activeView === 'overview' && <OverviewEngine />}
          {activeView === 'activities' && (
            <ActivitiesEngine 
              onOpenAction={(category) => setLeftSidebar({ isOpen: true, type: 'submitActivity', defaultCategory: category })} 
              onOpenKeywords={() => setActiveModal('keywords')}
            />
          )}
          {activeView === 'gmb' && (
            <GMBEngine 
              onOpenAction={(category) => setLeftSidebar({ isOpen: true, type: 'submitGMB', defaultCategory: category })} 
              onOpenKeywords={() => setActiveModal('keywords')}
            />
          )}
          {activeView !== 'overview' && activeView !== 'activities' && activeView !== 'gmb' && (
            <div className="flex-1 flex items-center justify-center h-96">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-slate-400">Select an engine</h3>
                <p className="text-slate-500">Use the right sidebar to access project resources.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full xl:w-72 bg-white/70 backdrop-blur-xl border-t xl:border-t-0 xl:border-l border-blue-100/50 shrink-0 flex flex-col xl:overflow-y-auto shadow-[-4px_0_24px_rgba(59,130,246,0.03)] z-10 order-first xl:order-none">
        <div className="p-6 border-b border-blue-100/50 bg-white/40">
          <h2 className="font-bold text-slate-900 tracking-wide text-lg">Resources & Tools</h2>
          <p className="text-xs text-slate-500 mt-1">Manage project assets</p>
        </div>
        <nav className="p-4 space-y-1">
          {rightMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleRightMenuClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeView === item.id 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/20' 
                  : 'text-slate-600 hover:bg-white hover:text-blue-700 border border-transparent hover:shadow-[0_2px_10px_rgba(59,130,246,0.08)]'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Modals */}
      {activeModal === 'keywords' && <KeywordsModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'sitemap' && <SitemapModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'credentials' && <CredentialsModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'documents' && <DocumentsModal onClose={() => setActiveModal(null)} />}

    </div>
  );
};
