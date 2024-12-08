import React from 'react';
import {
  Home,
  Pin,
  Tags,
  User,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { clsx } from 'clsx';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const user = useStore((state) => state.user);

  const menuItems = [
    { icon: Home, label: 'Home', id: 'notes' },
    { icon: Pin, label: 'Pinned', id: 'pinned' },
    { icon: Tags, label: 'Tags', id: 'tags' },
    { icon: User, label: 'Profile', id: 'profile' },
    { icon: Trash2, label: 'Recycle Bin', id: 'trash' },
  ];

  return (
    <aside
      className={clsx(
        'bg-gray-800 text-gray-100 h-screen transition-[width] duration-300 ease-in-out border-r border-gray-700 flex flex-col',
        isExpanded ? 'w-64' : 'w-16'
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-4 border-b border-gray-700">
        <button
          className="w-full flex items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded && <span className="font-bold">Menu</span>}
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={clsx(
              'w-full p-4 flex items-center gap-4 transition-colors',
              activeView === item.id
                ? 'bg-gray-700 text-blue-400'
                : 'hover:bg-gray-700'
            )}
          >
            <item.icon className="w-5 h-5 min-w-5" />
            {isExpanded && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{user.name[0].toUpperCase()}</span>
            )}
          </div>
          {isExpanded && (
            <div className="min-w-0">
              <p className="font-medium truncate">{user.name}</p>
              <p className={clsx(
                'text-xs',
                user.isOnline ? 'text-green-400' : 'text-gray-400'
              )}>
                {user.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}