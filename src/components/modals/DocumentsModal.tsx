"use client";

import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileText, Image as ImageIcon, Trash2, CheckCircle2, Download, Eye } from 'lucide-react';

import { useAppContext } from '@/context/AppContext';

type Tab = 'pdf' | 'images' | 'logo';

export const DocumentsModal = ({ onClose }: { onClose: () => void }) => {
  const { activeProject } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>('pdf');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [media, setMedia] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  React.useEffect(() => {
    if (!activeProject) return;
    fetch(`/api/upload?projectId=${activeProject.id}`)
      .then(res => res.json())
      .then(setMedia);
  }, [activeProject]);

  const pdfs = media.filter(m => m.type === 'pdf');
  const images = media.filter(m => m.type === 'images');
  const logo = media.find(m => m.type === 'logo')?.url;

  const handleDeleteMedia = async (id: string) => {
    await fetch(`/api/upload?id=${id}`, { method: 'DELETE' });
    setMedia(media.filter(m => m.id !== id));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeProject) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', activeProject.id);
    formData.append('type', activeTab);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const newMedia = await res.json();
      setMedia([newMedia, ...media]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Media & Documents</h2>
            <p className="text-sm text-slate-500 mt-1">Manage project assets, files, and brand imagery.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6 pt-4 space-x-6 bg-slate-50/50 shrink-0">
          {[
            { id: 'pdf', label: 'PDF Documents', icon: FileText },
            { id: 'images', label: 'Images', icon: ImageIcon },
            { id: 'logo', label: 'Brand Logo', icon: CheckCircle2 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`pb-4 px-2 font-medium flex items-center gap-2 border-b-2 transition-all ${
                activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          
          {/* Upload Dropzone (Shared visually) */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="mb-8 w-full border-2 border-dashed border-slate-200 hover:border-blue-400 bg-white rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group shadow-sm hover:shadow-md"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept={activeTab === 'pdf' ? '.pdf' : 'image/*'} 
            />
            <div className="p-4 bg-slate-50 rounded-full mb-4 group-hover:scale-110 group-hover:bg-blue-50 transition-all">
              <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-blue-500" />
            </div>
            <p className="text-slate-700 font-medium mb-1">
              {isUploading ? 'Uploading to Cloudinary...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-slate-500 text-sm">
              {activeTab === 'pdf' ? 'PDF (max. 10MB)' : activeTab === 'images' ? 'SVG, PNG, JPG or GIF (max. 5MB)' : 'PNG or SVG (max. 2MB)'}
            </p>
          </div>

          {activeTab === 'pdf' && (
            <div className="space-y-4">
              {pdfs.map(pdf => (
                <div key={pdf.id} className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl hover:border-blue-300 shadow-sm transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 rounded-xl text-red-500">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="bg-transparent text-slate-900 font-medium">{pdf.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {pdf.url && (
                      <>
                        <a href={pdf.url} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                          <Eye className="w-5 h-5" />
                        </a>
                        <a href={pdf.url} download={pdf.name} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download">
                          <Download className="w-5 h-5" />
                        </a>
                      </>
                    )}
                    <button onClick={() => handleDeleteMedia(pdf.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'images' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map(img => (
                <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                    <a href={img.url} target="_blank" rel="noreferrer" className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-md">
                      <Eye className="w-5 h-5" />
                    </a>
                    <a href={img.url} download={`image-${img.id}.jpg`} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 shadow-md">
                      <Download className="w-5 h-5" />
                    </a>
                    <button onClick={() => handleDeleteMedia(img.id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-150">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'logo' && (
            <div className="flex flex-col items-center justify-center py-8">
              {logo ? (
                <div className="relative group">
                  <div className="w-48 h-48 rounded-full border-4 border-white overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} alt="Project Logo" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 rounded-full transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                    <a href={logo} target="_blank" rel="noreferrer" className="p-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30 transform translate-y-4 group-hover:translate-y-0 duration-300">
                      <Eye className="w-5 h-5" />
                    </a>
                    <a href={logo} download="logo.png" className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
                      <Download className="w-5 h-5" />
                    </a>
                    <button 
                      onClick={() => {
                        const logoMedia = media.find(m => m.type === 'logo');
                        if (logoMedia) handleDeleteMedia(logoMedia.id);
                      }}
                      className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 transform translate-y-4 group-hover:translate-y-0 duration-300 delay-150"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-48 h-48 rounded-full border-4 border-dashed border-slate-200 bg-white shadow-sm flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50 text-slate-300" />
                  <span className="text-sm font-medium">No Logo</span>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
