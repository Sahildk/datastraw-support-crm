import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { 
  User, Mail, Calendar, Clock, 
  MessageSquare, Send, Sparkles, AlertCircle, X 
} from 'lucide-react';

export default function TicketDetail({ ticketId, onClose }) {
  const [ticket, setTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails();
    }
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    setLoading(true);
    try {
      // Fetch details and notes in a single backend call
      const data = await api.getTicketDetails(ticketId);
      setTicket(data);
      setNotes(data.notes || []);
      setStatus(data.status);
    } catch (err) {
      console.error("Error loading ticket detail:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setSavingStatus(true);
    try {
      await api.updateTicket(ticketId, { status: newStatus });
      
      // Update local state
      setTicket(prev => ({ ...prev, status: newStatus }));
      setStatus(newStatus);
    } catch (err) {
      console.error("Error updating status:", err.message);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSavingNote(true);
    try {
      // Append note via PUT request
      await api.updateTicket(ticketId, { notes: newNote });

      // Re-fetch ticket details to load the updated notes list
      // This ensures we get the database-generated ID and created_at timestamps
      const data = await api.getTicketDetails(ticketId);
      setNotes(data.notes || []);
      setNewNote('');
    } catch (err) {
      console.error("Error saving note:", err.message);
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-6 animate-pulse space-y-5 border-zinc-800/50">
        <div className="flex justify-between items-center pb-4 border-b border-zinc-800/50">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-zinc-800 rounded"></div>
            <div className="h-5 w-48 bg-zinc-800 rounded"></div>
          </div>
          <div className="h-8 w-8 bg-zinc-800 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4 bg-zinc-900/40 rounded-xl">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-4 w-28 bg-zinc-800/60 rounded"></div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-3 w-24 bg-zinc-800 rounded"></div>
          <div className="h-20 w-full bg-zinc-800 rounded-xl"></div>
        </div>
        <div className="h-8 w-32 bg-zinc-800 rounded-lg"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="glass-panel p-8 text-center text-zinc-500 flex flex-col items-center justify-center border-zinc-800/50 min-h-[300px]">
        <AlertCircle className="h-10 w-10 mb-3 text-zinc-700" />
        <p className="text-sm font-semibold">Select a ticket from the support desk to open details.</p>
        <p className="text-xs text-zinc-650 mt-1">Review metrics, update progress, and log internal communication notes.</p>
      </div>
    );
  }

  // Priority layout settings
  const priorityStyles = {
    High: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    Medium: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    Low: 'bg-zinc-800 border-zinc-700/60 text-zinc-400'
  };

  return (
    <div className="glass-panel p-6 flex flex-col h-auto min-h-[500px] lg:h-[calc(100vh-140px)] lg:sticky lg:top-6 justify-between shadow-2xl">
      {/* Scrollable Workspace Container */}
      <div className="overflow-y-auto pr-1 space-y-6 flex-1 custom-scrollbar">
        
        {/* Header Metadata */}
        <div className="flex items-start justify-between border-b border-zinc-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-zinc-300 tracking-wider bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                {ticket.ticket_id}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold uppercase tracking-wider ${priorityStyles[ticket.priority]}`}>
                {ticket.priority}
              </span>
            </div>
            <h2 className="text-md font-bold text-white leading-tight tracking-tight mt-1">
              {ticket.subject}
            </h2>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-200 bg-[#18181b] border border-zinc-800 p-1.5 rounded-xl transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#09090b]/60 p-4 border border-zinc-800/50 rounded-xl">
          <div className="flex items-center gap-2 truncate">
            <User className="h-3.5 w-3.5 text-zinc-555 shrink-0" />
            <span className="text-zinc-400">Customer:</span>
            <span className="text-zinc-200 font-semibold truncate">{ticket.customer_name}</span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <Mail className="h-3.5 w-3.5 text-zinc-555 shrink-0" />
            <span className="text-zinc-400">Email:</span>
            <span className="text-zinc-200 font-semibold truncate hover:text-indigo-400 transition-colors">
              {ticket.customer_email}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-zinc-555 shrink-0" />
            <span className="text-zinc-400">Filed On:</span>
            <span className="text-zinc-200 font-semibold">
              {new Date(ticket.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-zinc-555 shrink-0" />
            <span className="text-zinc-400">Last Action:</span>
            <span className="text-zinc-200 font-semibold">
              {new Date(ticket.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* AI Analysis Badges */}
        {(ticket.sentiment || ticket.category) && (
          <div className="flex flex-col sm:flex-row gap-2.5 bg-zinc-800/10 border border-zinc-800 rounded-xl p-3.5 items-start sm:items-center">
            <div className="flex items-center gap-1.5 shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">AI Classifier</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold px-2.5 py-0.5 rounded-md">
                CATEGORY: <span className="text-indigo-400">{ticket.category}</span>
              </span>
              <span className={`text-[10px] border px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                ticket.sentiment === 'Negative' 
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                  : ticket.sentiment === 'Positive'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
              }`}>
                SENTIMENT: {ticket.sentiment === 'Negative' ? '😡 Negative' : ticket.sentiment === 'Positive' ? '😊 Positive' : '😐 Neutral'}
              </span>
            </div>
          </div>
        )}

        {/* Ticket Description */}
        <div className="space-y-2">
          <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Issue Description</span>
          <div className="bg-[#09090b]/40 border border-zinc-800/80 rounded-xl p-4 text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed">
            {ticket.description}
          </div>
        </div>

        {/* Change Ticket Status Dropdown */}
        <div className="space-y-2">
          <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Update CRM Ticket Status</span>
          <select
            value={status}
            disabled={savingStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="select-field text-xs"
          >
            <option value="Open">🟢 Open</option>
            <option value="In Progress">🟡 In Progress</option>
            <option value="Closed">🔴 Closed</option>
          </select>
        </div>

        {/* Internal Notes / Comments System */}
        <div className="space-y-4 border-t border-zinc-800/80 pt-5">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-indigo-400" />
            <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Internal Notes History ({notes.length})</span>
          </div>
          
          <div className="space-y-3.5">
            {notes.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-zinc-800/60 rounded-xl bg-zinc-900/10">
                <p className="text-[11px] text-zinc-500 italic">No internal agent notes logged for this case.</p>
              </div>
            ) : (
              <div className="space-y-3 pl-1 border-l-2 border-zinc-800/60 ml-2.5">
                {notes.map((note) => (
                  <div key={note.id} className="relative pl-5 group">
                    {/* Circle dot on the vertical timeline */}
                    <div className="absolute -left-1 top-1.5 h-2 w-2 rounded-full bg-indigo-500 border border-zinc-955" />
                    
                    <div className="bg-[#09090b] border border-zinc-800 rounded-xl p-3.5 space-y-1.5 transition-all">
                      <div className="flex items-center justify-between text-[10px] text-zinc-500">
                        <span className="font-bold text-indigo-400">DS Agent Console</span>
                        <span>
                          {new Date(note.created_at).toLocaleDateString()} {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-200 leading-relaxed">{note.note_text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add New Note Input Form */}
      <form onSubmit={handleAddNote} className="flex gap-2 border-t border-zinc-800/80 pt-4 mt-4 shrink-0 bg-[#121214]">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Type internal agent note to log updates..."
          className="input-field py-3 text-xs flex-1 bg-[#09090b]"
        />
        <button
          type="submit"
          disabled={savingNote || !newNote.trim()}
          className="btn-primary py-3 px-4 flex items-center justify-center rounded-xl shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
