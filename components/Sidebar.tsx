
import React from 'react';
import { LayoutDashboard, Smartphone, Server } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'preview', label: 'My V-Card', icon: Smartphone },
    { id: 'docs', label: 'API Queries', icon: Server },
  ];

  return (
    <div className="w-64 bg-gray-50/50 text-gray-600 h-screen fixed left-0 top-0 flex flex-col border-r border-gray-200 z-50 font-sans backdrop-blur-xl">
      <div className="p-6 pt-8 mb-4">
        <h1 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-900 rounded-md"></div>
          V-Card SaaS
        </h1>
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.05em] mt-3 pl-7">Architect Workspace</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group text-sm ${activeTab === item.id
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200/60 font-medium'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
          >
            <item.icon
              size={18}
              strokeWidth={2}
              className={`transition-colors ${activeTab === item.id ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'
                }`}
            />
            <span>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-medium text-gray-700">Supabase Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
