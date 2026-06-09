import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, RefreshCw, Activity, X } from 'lucide-react';

export default function Sidebar({ syncStatus, isSyncing, isOpen, onClose }) {
  const isConnected = syncStatus.includes('Connected') || syncStatus.includes('Change');

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`w-64 bg-[#09090b] border-r border-zinc-800/80 flex flex-col justify-between h-screen fixed md:sticky top-0 left-0 z-50 md:z-30 shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand & Logo Area */}
        <div className="p-6">
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-6">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 shadow-lg shadow-indigo-500/10">
                <Ticket className="h-5 w-5 text-white" />
                <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <h1 className="text-md font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
                  Datastraw <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded-md font-semibold">CRM</span>
                </h1>
                <p className="text-[10px] text-zinc-500 font-medium mt-1">AI Support Mission Control</p>
              </div>
            </div>
            {/* Mobile close button */}
            <button 
              onClick={onClose}
              className="md:hidden text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="mt-8 space-y-2">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-3 mb-3">Workspace</p>
            
            <NavLink
              to="/"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 text-sm transition-all duration-300 ${
                  isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
                }`
              }
            >
              <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
              <span className="font-medium">Dashboard</span>
            </NavLink>

            <NavLink
              to="/tickets"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 text-sm transition-all duration-300 ${
                  isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
                }`
              }
            >
              <Ticket className="h-4.5 w-4.5 shrink-0" />
              <span className="font-medium">Tickets Desk</span>
            </NavLink>
          </div>
        </div>

        {/* Connection & Sync Status Footer */}
        <div className="p-4 border-t border-zinc-800/60 bg-[#08080a]/60">
          <div className="flex flex-col gap-2 p-3 bg-[#121214] border border-zinc-800/80 rounded-xl">
            <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-500">
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-indigo-400" /> SYSTEM STATUS
              </span>
              <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
            </div>
            
            <div className="flex items-center gap-2 pt-1">
              <RefreshCw className={`h-3.5 w-3.5 text-indigo-400 shrink-0 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="text-[11px] text-zinc-300 font-medium truncate leading-none">
                {syncStatus}
              </span>
            </div>
          </div>

          {/* Small Mock Profile footer to make it look premium */}
          <div className="flex items-center gap-2.5 mt-4 px-2">
            <div className="h-7 w-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
              DS
            </div>
            <div className="truncate leading-none">
              <p className="text-[11px] font-semibold text-zinc-300">Support Agent</p>
              <p className="text-[9px] text-zinc-500 mt-0.5">agent@datastraw.co</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
