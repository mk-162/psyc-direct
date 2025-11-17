'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { FolderKanban, FileText, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Content', href: '/content', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored) {
      setIsCollapsed(stored === 'true');
    }
  }, []);

  // Listen for collapse requests from other components
  useEffect(() => {
    const handleCollapseRequest = (event: CustomEvent) => {
      const { collapsed } = event.detail;
      setIsCollapsed(collapsed);
    };

    window.addEventListener('sidebar-collapse-request', handleCollapseRequest as EventListener);
    return () => {
      window.removeEventListener('sidebar-collapse-request', handleCollapseRequest as EventListener);
    };
  }, []);

  // Save collapsed state to localStorage
  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-white transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo & Toggle */}
      <div className="flex h-20 items-center justify-center bg-[#0a0020] px-2 py-4 relative">
        {!isCollapsed && (
          <Image
            src="/LMO_King_Logo.svg"
            alt="LMO King Logo"
            width={120}
            height={40}
            className="object-contain"
            priority
          />
        )}
        {isCollapsed && (
          <Image
            src="/LMO_King_Logo_SQ.svg"
            alt="LMO King Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
        )}
        <button
          onClick={toggleCollapsed}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white border border-slate-200 rounded-full p-1 hover:bg-slate-50 transition-colors shadow-sm"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3 text-slate-600" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-slate-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-lmo-dark-50 text-lmo-dark-700'
                  : 'text-slate-700 hover:bg-slate-100',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t p-2">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-lmo-dark-100 text-lmo-dark-700 text-sm font-medium cursor-pointer hover:bg-lmo-dark-200 transition-colors"
              title={user?.email || 'User'}
            >
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <button
              onClick={() => signOut()}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lmo-dark-100 text-lmo-dark-700 text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user?.email || 'User'}
                </p>
                <p className="text-xs text-slate-500">
                  Free Plan
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
