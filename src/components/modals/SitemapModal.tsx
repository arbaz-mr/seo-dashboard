"use client";

import React, { useState } from 'react';
import { X, Plus, Trash2, Link as LinkIcon, FileText } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

interface SitemapNode {
  id: string;
  title: string;
  url: string;
}

export const SitemapModal = ({ onClose }: { onClose: () => void }) => {
  const { activeProject } = useAppContext();
  const [nodes, setNodes] = useState<SitemapNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (!activeProject) return;
    fetch(`/api/sitemap?projectId=${activeProject.id}`)
      .then(res => res.json())
      .then(data => {
        setNodes(data.length > 0 ? data : [
          { id: '1', title: 'Home', url: '/' },
          { id: '2', title: 'About Us', url: '/about' }
        ]);
        setIsLoading(false);
      });
  }, [activeProject]);

  const addNode = () => {
    setNodes([...nodes, { id: Date.now().toString(), title: 'New Page', url: '/new-page' }]);
  };

  const updateNode = (id: string, field: 'title' | 'url', value: string) => {
    setNodes(nodes.map(node => node.id === id ? { ...node, [field]: value } : node));
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id));
  };

  const handleSave = async () => {
    if (!activeProject) return;
    await fetch('/api/sitemap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: activeProject.id, urls: nodes })
    });
    onClose();
  };

  if (isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sitemap Editor</h2>
            <p className="text-sm text-slate-500 mt-1">Manage your website structure and pages.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="space-y-4">
            {nodes.map((node, index) => (
              <div key={node.id} className="flex flex-col sm:flex-row items-center gap-4 bg-white border border-slate-200 p-4 rounded-2xl hover:border-blue-300 shadow-sm transition-all group">
                <div className="flex-1 w-full space-y-3 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row items-center">
                  <div className="relative w-full sm:w-1/2 flex items-center bg-slate-50 rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <div className="pl-3 text-slate-400"><FileText className="w-4 h-4" /></div>
                    <input
                      type="text"
                      value={node.title}
                      onChange={(e) => updateNode(node.id, 'title', e.target.value)}
                      className="w-full bg-transparent text-slate-900 px-3 py-2.5 outline-none placeholder-slate-400 font-medium"
                      placeholder="Page Title"
                    />
                  </div>
                  
                  <div className="relative w-full sm:w-1/2 flex items-center bg-slate-50 rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <div className="pl-3 text-slate-400"><LinkIcon className="w-4 h-4" /></div>
                    <input
                      type="text"
                      value={node.url}
                      onChange={(e) => updateNode(node.id, 'url', e.target.value)}
                      className="w-full bg-transparent text-slate-600 px-3 py-2.5 outline-none placeholder-slate-400 text-sm"
                      placeholder="Page URL (/path)"
                    />
                  </div>
                </div>
                
                <button 
                  onClick={() => deleteNode(node.id)}
                  className="p-2.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 rounded-xl transition-all w-full sm:w-auto shadow-sm"
                >
                  <Trash2 className="w-5 h-5 mx-auto" />
                </button>
              </div>
            ))}
            
            <button 
              onClick={addNode}
              className="w-full border-2 border-dashed border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/50 text-slate-500 hover:text-blue-600 p-4 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all shadow-sm"
            >
              <Plus className="w-5 h-5" /> Add New Page
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-slate-700 font-medium bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-6 py-3 rounded-xl text-white font-medium bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};
