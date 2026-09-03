"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Project {
  id: string;
  name: string;
  url: string;
}

export interface Keyword {
  id: string;
  keyword: string;
  url: string;
  projectId?: string;
}

export interface Activity {
  id: string;
  category: string;
  keywordId: string;
  targetUrl?: string;
  backlink: string;
  platform?: string;
  spamScore?: number;
  traffic?: number;
  date: string;
  projectId?: string;
}

export interface CategoryProgress {
  name: string;
  completed: number;
  total: number;
}

export type ActiveView = 'sitemap' | 'credentials' | 'keywords' | 'documents' | 'images' | 'logo' | 'activities' | 'gmb' | 'overview' | null;

interface AppContextType {
  projects: Project[];
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  keywords: Keyword[];
  updateKeywords: (newKeywords: Keyword[]) => void;
  activities: Activity[];
  addActivity: (activity: Activity) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>('activities');

  React.useEffect(() => {
    fetch('/api/projects').then(res => res.json()).then(data => {
      setProjects(data);
      if (data.length > 0) setActiveProject(data[0]);
    });
  }, []);

  React.useEffect(() => {
    if (activeProject) {
      fetch(`/api/keywords?projectId=${activeProject.id}`).then(res => res.json()).then(setKeywords);
      fetch(`/api/activities?projectId=${activeProject.id}`).then(res => res.json()).then(setActivities);
    } else {
      setKeywords([]);
      setActivities([]);
    }
  }, [activeProject]);

  const addProject = async (project: Project) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify(project)
    });
    const data = await res.json();
    setProjects((prev) => [data, ...prev]);
    setActiveProject(data);
  };

  const removeProject = async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProject?.id === id) setActiveProject(null);
  };

  const updateKeywords = async (newKeywords: Keyword[]) => {
    if (!activeProject) return;
    await fetch('/api/keywords', {
      method: 'POST',
      body: JSON.stringify({ projectId: activeProject.id, keywords: newKeywords })
    });
    setKeywords(newKeywords);
  };

  const addActivity = async (activity: Activity) => {
    if (!activeProject) return;
    const res = await fetch('/api/activities', {
      method: 'POST',
      body: JSON.stringify({ ...activity, projectId: activeProject.id })
    });
    const data = await res.json();
    setActivities((prev) => [data, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        addProject,
        removeProject,
        activeProject,
        setActiveProject,
        keywords,
        updateKeywords,
        activities,
        addActivity,
        activeView,
        setActiveView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
