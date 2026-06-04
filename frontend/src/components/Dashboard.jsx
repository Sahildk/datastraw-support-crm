import React from 'react';
import { 
  Ticket, ClipboardCheck, Clock, 
  AlertCircle, BarChart3, TrendingUp, Sparkles 
} from 'lucide-react';

export default function Dashboard({ tickets, onViewTickets }) {
  // 1. Calculate Stats
  const total = tickets.length;
  const open = tickets.filter(t => t.status === 'Open').length;
  const inProgress = tickets.filter(t => t.status === 'In Progress').length;
  const closed = tickets.filter(t => t.status === 'Closed').length;

  // 2. Priority breakdown
  const highPriority = tickets.filter(t => t.priority === 'High' && t.status !== 'Closed').length;

  // 3. Sentiment breakdown
  const negativeSentiment = tickets.filter(t => t.sentiment === 'Negative').length;
  const positiveSentiment = tickets.filter(t => t.sentiment === 'Positive').length;
  const neutralSentiment = tickets.filter(t => t.sentiment === 'Neutral').length;

  // 4. Categories breakdown
  const categories = tickets.reduce((acc, t) => {
    const cat = t.category || 'General';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { 
      label: 'Total Volume', 
      value: total, 
      icon: Ticket, 
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
      glow: 'shadow-indigo-500/5'
    },
    { 
      label: 'Open Tickets', 
      value: open, 
      icon: AlertCircle, 
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      glow: 'shadow-emerald-500/5'
    },
    { 
      label: 'In Progress', 
      value: inProgress, 
      icon: Clock, 
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      glow: 'shadow-amber-500/5'
    },
    { 
      label: 'Closed Cases', 
      value: closed, 
      icon: ClipboardCheck, 
      color: 'text-zinc-400',
      bgColor: 'bg-zinc-800/40 border-zinc-800/40',
      glow: 'shadow-zinc-500/2'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className={`glass-panel p-6 flex items-center justify-between hover:border-zinc-700/80 hover:-translate-y-0.5 shadow-md ${stat.glow}`}
            >
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-white tracking-tight leading-none">
                  {stat.value}
                </h3>
              </div>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${stat.bgColor}`}>
                <Icon className={`h-5.5 w-5.5 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Operations insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Breakdown */}
        <div className="glass-panel p-6 lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-400" />
              <span>E-commerce Issue Category Share</span>
            </h3>
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold">
              Auto Classified
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {Object.keys(categories).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500 text-xs italic">
                <BarChart3 className="h-8 w-8 text-zinc-700 mb-2" />
                <p>No issues logged to generate distribution chart.</p>
              </div>
            ) : (
              Object.entries(categories).map(([name, count]) => {
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={name} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-300 font-medium">{name}</span>
                      <span className="text-zinc-400 font-semibold">{count} tickets ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-[#09090b] border border-zinc-800/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-1000" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* AI Sentiment Analysis Box */}
        <div className="glass-panel p-6 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-4 mb-5">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">AI Sentiment Breakdown</h3>
            </div>
            
            <div className="space-y-3">
              {/* Negative Gauge */}
              <div className="flex items-center justify-between bg-rose-500/5 border border-rose-500/10 hover:border-rose-500/20 rounded-xl p-3.5 transition-all">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <span>😡</span> Negative Customers
                </span>
                <span className="text-base font-extrabold text-rose-300">{negativeSentiment}</span>
              </div>

              {/* Neutral Gauge */}
              <div className="flex items-center justify-between bg-zinc-800/20 border border-zinc-800 hover:border-zinc-700/80 rounded-xl p-3.5 transition-all">
                <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                  <span>😐</span> Neutral Support
                </span>
                <span className="text-base font-extrabold text-zinc-300">{neutralSentiment}</span>
              </div>

              {/* Positive Gauge */}
              <div className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/20 rounded-xl p-3.5 transition-all">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span>😊</span> Pleased Customers
                </span>
                <span className="text-base font-extrabold text-emerald-300">{positiveSentiment}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-500 flex items-center justify-between">
            <span className="font-semibold uppercase tracking-wider">SLA Health Index</span>
            <span className="text-emerald-400 font-extrabold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {total > 0 ? Math.round(((positiveSentiment + neutralSentiment) / total) * 100) : 100}% Good
            </span>
          </div>
        </div>

      </div>

      {/* Action panel */}
      {highPriority > 0 && (
        <div className="p-4 bg-rose-500/5 border border-rose-500/15 rounded-2xl flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-200">Urgent Backlog Warning</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">There are {highPriority} high priority pending support requests requiring response SLA action.</p>
            </div>
          </div>
          <button 
            onClick={onViewTickets}
            className="text-xs bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/20 hover:border-rose-500/30 px-4 py-2 rounded-xl font-bold transition-all duration-300 active:scale-95 shrink-0"
          >
            Resolve Now
          </button>
        </div>
      )}
    </div>
  );
}
