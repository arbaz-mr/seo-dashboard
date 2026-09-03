"use client";

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Plus, Trash2, Globe, ArrowRight } from 'lucide-react';

export const ProjectList = () => {
  const { projects, addProject, removeProject, setActiveProject } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', url: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.url) return;
    addProject({
      id: Date.now().toString(),
      name: newProject.name,
      url: newProject.url
    });
    setNewProject({ name: '', url: '' });
    setIsAdding(false);
  };

  return (
    <div className="flex-1 p-10 bg-transparent overflow-y-auto z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Projects</h1>
            <p className="text-slate-500">Manage your SEO and GMB campaigns.</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20 transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </button>
        </div>

        {isAdding && (
          <div className="mb-8 p-6 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-blue-900/5">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Add New Project</h2>
            <form onSubmit={handleAdd} className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Project Name" 
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-400"
                />
              </div>
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Website URL (https://... or www...)" 
                  value={newProject.url}
                  onChange={e => setNewProject({...newProject, url: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-400"
                />
              </div>
              <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md shadow-indigo-500/20">
                Save
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-medium transition-all">
                Cancel
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="group bg-white rounded-3xl p-8 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-slate-100/50 relative overflow-hidden"
              onClick={() => setActiveProject(project)}
            >
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeProject(project.id); }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors relative z-10 tracking-tight">{project.name}</h3>
              <p className="text-slate-500 mb-8 truncate relative z-10">{project.url}</p>
              
              <div className="mt-auto flex items-center justify-between text-sm font-bold text-blue-600 relative z-10">
                <span className="bg-blue-50 px-4 py-2 rounded-xl">View Dashboard</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          ))}
          
          {projects.length === 0 && !isAdding && (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50">
              <p className="text-slate-500 mb-4 text-lg font-medium">No projects found. Get started by adding one!</p>
              <button 
                onClick={() => setIsAdding(true)}
                className="text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center justify-center gap-2 mx-auto bg-blue-50 px-6 py-3 rounded-xl"
              >
                <Plus className="w-5 h-5" /> Add First Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
