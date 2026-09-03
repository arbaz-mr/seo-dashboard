"use client";

import React, { useState } from 'react';
import { X, Save, Eye, EyeOff, MessageCircle, Send, Camera, Briefcase, Mail, Globe, Server, Database, Plus, Trash2 } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

type Tab = 'social' | 'gmail' | 'website';

export const CredentialsModal = ({ onClose }: { onClose: () => void }) => {
  const { activeProject } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>('social');
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [gmailAccounts, setGmailAccounts] = useState<{id: string}[]>([{ id: '1' }]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (!activeProject) return;
    fetch(`/api/credentials?projectId=${activeProject.id}`)
      .then(res => res.json())
      .then((data: any[]) => {
        const loadedValues: Record<string, string> = {};
        const gmails = new Set<string>();
        data.forEach(cred => {
          loadedValues[cred.key] = cred.value;
          if (cred.category === 'gmail') {
            const match = cred.key.match(/gmail-[a-z]+-(.+)/);
            if (match) gmails.add(match[1]);
          }
        });
        setValues(loadedValues);
        if (gmails.size > 0) {
          setGmailAccounts(Array.from(gmails).map(id => ({ id })));
        }
        setIsLoading(false);
      });
  }, [activeProject]);

  const togglePassword = (key: string) => {
    setShowPassword(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const InputRow = ({ label, icon: Icon, type = 'text', id }: { label: string, icon: any, type?: string, id: string }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
        <input 
          type={type === 'password' && showPassword[id] ? 'text' : type}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-400"
          placeholder={`Enter ${label}`}
          value={values[id] || ''}
          onChange={(e) => setValues(prev => ({ ...prev, [id]: e.target.value }))}
        />
        {type === 'password' && (
          <button 
            type="button" 
            onClick={() => togglePassword(id)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword[id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );

  const handleSave = async () => {
    if (!activeProject) return;
    
    // Map values back to database format
    const credentialsToSave = Object.entries(values).filter(([_, val]) => val.trim() !== '').map(([key, value]) => {
      let category = 'website';
      if (key.startsWith('gmail-')) category = 'gmail';
      else if (['Facebook', 'Twitter / X', 'Instagram', 'LinkedIn'].some(social => key.startsWith(social))) category = 'social';
      
      return { category, key, value };
    });

    await fetch('/api/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: activeProject.id, credentials: credentialsToSave })
    });
    onClose();
  };

  if (isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Credentials Vault</h2>
            <p className="text-sm text-slate-500 mt-1">Securely manage all project credentials.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6 pt-4 space-x-6 bg-slate-50/50 shrink-0">
          {[
            { id: 'social', label: 'Social Media', icon: MessageCircle },
            { id: 'gmail', label: 'Gmail', icon: Mail },
            { id: 'website', label: 'Website', icon: Globe },
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
          
          {activeTab === 'social' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: 'Facebook', icon: MessageCircle },
                { name: 'Twitter / X', icon: Send },
                { name: 'Instagram', icon: Camera },
                { name: 'LinkedIn', icon: Briefcase },
              ].map(social => (
                <div key={social.name} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                    <social.icon className="w-5 h-5 text-blue-500" /> {social.name}
                  </h3>
                  <InputRow id={`${social.name}-url`} label="Profile URL" icon={Globe} />
                  <InputRow id={`${social.name}-user`} label="Username / Email" icon={Mail} />
                  <InputRow id={`${social.name}-pass`} label="Password" icon={Key} type="password" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'gmail' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="w-6 h-6 text-red-500" /> Gmail Accounts
                  <span className="text-sm font-normal text-slate-500 ml-2">({gmailAccounts.length} / 20)</span>
                </h3>
                {gmailAccounts.length < 20 && (
                  <button 
                    onClick={() => setGmailAccounts([...gmailAccounts, { id: Date.now().toString() }])}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Account
                  </button>
                )}
              </div>

              {gmailAccounts.map((account, index) => (
                <div key={account.id} className="max-w-2xl mx-auto bg-white border border-slate-200 p-8 rounded-3xl space-y-6 relative group shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                    <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      Account {index + 1}
                      {index === 0 && <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full border border-emerald-100 ml-2">Primary</span>}
                    </h4>
                    {gmailAccounts.length > 1 && (
                      <button 
                        onClick={() => setGmailAccounts(gmailAccounts.filter(a => a.id !== account.id))}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  <InputRow id={`gmail-email-${account.id}`} label="Email Address" icon={Mail} />
                  <InputRow id={`gmail-pass-${account.id}`} label="Password" icon={Key} type="password" />
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 mt-6">
                    <InputRow id={`gmail-rec-email-${account.id}`} label="Recovery Email" icon={Mail} />
                    <InputRow id={`gmail-rec-phone-${account.id}`} label="Recovery Phone" icon={Mail} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'website' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Globe className="w-5 h-5 text-blue-500" /> CMS / WordPress
                </h3>
                <InputRow id="cms-url" label="Admin URL" icon={Globe} />
                <InputRow id="cms-user" label="Username" icon={Mail} />
                <InputRow id="cms-pass" label="Password" icon={Key} type="password" />
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Server className="w-5 h-5 text-blue-500" /> Hosting
                </h3>
                <InputRow id="host-provider" label="Provider Name" icon={Database} />
                <InputRow id="host-url" label="Login URL" icon={Globe} />
                <InputRow id="host-user" label="Username" icon={Mail} />
                <InputRow id="host-pass" label="Password" icon={Key} type="password" />
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 md:col-span-2 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                  <Database className="w-5 h-5 text-blue-500" /> Domain & DNS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputRow id="dns-reg" label="Registrar" icon={Globe} />
                  <InputRow id="dns-domain" label="Domain Name" icon={Globe} />
                  <InputRow id="dns-user" label="Login Username" icon={Mail} />
                  <InputRow id="dns-pass" label="Login Password" icon={Key} type="password" />
                  <div className="md:col-span-2">
                     <InputRow id="dns-ns" label="Nameservers" icon={Server} />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-slate-700 font-medium bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
            Close
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
            <Save className="w-5 h-5" /> Save Vault
          </button>
        </div>

      </div>
    </div>
  );
};

// Dummy component for key icon to avoid circular dependencies in this file
const Key = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
)
