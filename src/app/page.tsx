"use client";

import { useAppContext } from '@/context/AppContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProjectList } from '@/components/dashboard/ProjectList';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';

export default function Home() {
  const { activeProject } = useAppContext();

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-slate-50 to-slate-100">
      <Sidebar />
      {activeProject ? (
        <ThreeColumnLayout />
      ) : (
        <ProjectList />
      )}
    </main>
  );
}
