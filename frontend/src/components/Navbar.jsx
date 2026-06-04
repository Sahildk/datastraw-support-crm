import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, FileSpreadsheet, RefreshCw } from 'lucide-react';

export default function Navbar({ syncStatus, isSyncing }) {
  return (
    <nav className="glass-panel sticky top-4 z-40 mx-4 my-4 flex items-center justify-between px-6 py-4">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent shadow-md shadow-brand-primary/20">
          <Ticket className="h-5 w-5 text-white" />
          <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </span>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
            Datastraw <span className="text-xs bg-brand-primary/20 text-brand-primary border border-brand-primary/30 px-2 py-0.5 rounded-full font-semibold">CRM</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-medium">AI Support Operations</p>
        </div>
      </div>

      {/* Nav Actions */}
      <div className="flex items-center gap-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              isActive
                ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-zinc-800/40 border border-transparent'
            }`
          }
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/tickets"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              isActive
                ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-zinc-800/40 border border-transparent'
            }`
          }
        >
          <Ticket className="h-4 w-4" />
          <span>Tickets</span>
        </NavLink>
      </div>

      {/* Sync Status Badge */}
      <div className="hidden sm:flex items-center gap-2 text-xs bg-zinc-900/50 border border-brand-border px-3.5 py-1.5 rounded-xl text-slate-400">
        <RefreshCw className={`h-3 w-3 text-brand-accent ${isSyncing ? 'animate-spin' : ''}`} />
        <span>{syncStatus}</span>
      </div>
    </nav>
  );
}
