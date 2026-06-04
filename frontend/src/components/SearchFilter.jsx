import React from 'react';
import { Search, Plus, X } from 'lucide-react';

export default function SearchFilter({ search, setSearch, statusFilter, setStatusFilter, onNewTicketClick }) {
  const statuses = [
    { label: 'All', value: 'all' },
    { label: 'Open', value: 'Open' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Closed', value: 'Closed' }
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between p-4 bg-[#121214] border border-zinc-800/80 rounded-2xl mb-6 shadow-md shadow-black/10">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer name, email, subject, or TKT-ID..."
          className="input-field pl-11 pr-10 py-3"
        />
        {search && (
          <button 
            onClick={() => setSearch('')}
            className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs & Add Button Wrapper */}
      <div className="flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center">
        {/* Status Filter Tabs (Segmented Control style) */}
        <div className="flex items-center gap-1 p-1 bg-[#09090b] border border-zinc-800/80 rounded-xl overflow-x-auto">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                statusFilter === status.value
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        {/* Create Ticket Trigger Button */}
        {onNewTicketClick && (
          <button
            onClick={onNewTicketClick}
            className="btn-primary flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>New Ticket</span>
          </button>
        )}
      </div>
    </div>
  );
}
