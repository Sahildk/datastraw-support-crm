import React from 'react';
import { Calendar, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function TicketList({ tickets, loading, activeTicketId, onSelectTicket }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-panel p-5 animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-zinc-800/50">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-4 w-16 bg-zinc-800 rounded"></div>
                <div className="h-3.5 w-12 bg-zinc-800 rounded-full"></div>
                <div className="h-3.5 w-16 bg-zinc-800 rounded-full"></div>
              </div>
              <div className="h-4 w-2/3 bg-zinc-800 rounded"></div>
              <div className="h-3 w-40 bg-zinc-800/60 rounded"></div>
            </div>
            <div className="h-7 w-20 bg-zinc-800 rounded-full shrink-0"></div>
          </div>
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="glass-panel p-10 text-center flex flex-col items-center justify-center text-zinc-500 border-dashed border-zinc-850">
        <AlertCircle className="h-8 w-8 mb-3 text-zinc-650" />
        <p className="text-sm font-semibold">No tickets found matching current parameters.</p>
        <p className="text-xs text-zinc-600 mt-1">Try modifying your search queries or status filters.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tickets.map((ticket) => {
        const isSelected = activeTicketId === ticket.ticket_id;
        
        // Priority styles
        const priorityColors = {
          High: 'text-rose-400 border-rose-500/20 bg-rose-500/10',
          Medium: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
          Low: 'text-zinc-400 border-zinc-800 bg-zinc-800/40'
        };

        // Status styles
        const statusColors = {
          'Open': 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
          'In Progress': 'text-amber-400 border-amber-500/20 bg-amber-500/10',
          'Closed': 'text-zinc-400 border-zinc-800 bg-zinc-800/40'
        };

        // Sentiment styles
        const sentimentLabels = {
          'Negative': '😡 Negative',
          'Positive': '😊 Positive',
          'Neutral': '😐 Neutral'
        };

        return (
          <div
            key={ticket.ticket_id}
            onClick={() => onSelectTicket(ticket.ticket_id)}
            className={`glass-panel p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 relative overflow-hidden group ${
              isSelected 
                ? 'border-indigo-500/80 ring-1 ring-indigo-500/20 bg-[#1e1e22]/85 shadow-lg shadow-indigo-600/5' 
                : 'hover:border-zinc-700/80 hover:bg-[#161619]'
            }`}
          >
            {/* Indigo active left-border accent bar */}
            {isSelected && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
            )}

            <div className="space-y-2 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-zinc-300 tracking-wider bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                  {ticket.ticket_id}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold tracking-wide ${priorityColors[ticket.priority]}`}>
                  {ticket.priority}
                </span>
                {ticket.sentiment && (
                  <span className="text-[10px] text-zinc-400 font-semibold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                    {sentimentLabels[ticket.sentiment]}
                  </span>
                )}
                {ticket.category && (
                  <span className="text-[10px] bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded text-indigo-400 font-bold uppercase tracking-wider">
                    {ticket.category}
                  </span>
                )}
              </div>
              
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors leading-snug">
                {ticket.subject}
              </h3>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-zinc-600" />
                  <span className="font-medium text-zinc-400">{ticket.customer_name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-zinc-600" />
                  <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 border-zinc-800/50 pt-3.5 sm:pt-0 shrink-0">
              <span className={`text-[11px] px-3 py-1 rounded-full border font-bold ${statusColors[ticket.status]}`}>
                {ticket.status}
              </span>
              <div className="h-8 w-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-zinc-300 transition-colors group-hover:border-zinc-700">
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
