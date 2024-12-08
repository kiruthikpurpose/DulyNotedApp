import React from 'react';
import { Sidebar } from './Sidebar';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Layout({ children, activeView, onViewChange }: LayoutProps) {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar activeView={activeView} onViewChange={onViewChange} />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h1 className="text-2xl font-bold">DulyNoted</h1>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <time className="text-sm text-gray-400">
                {format(time, 'PPpp')}
              </time>
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}