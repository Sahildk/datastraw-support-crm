import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { analyzeTicketAI } from '../utils/aiHelper';
import { PlusCircle, Sparkles, CheckCircle2, X } from 'lucide-react';

export default function TicketForm({ isOpen, onClose, onTicketCreated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState('');

  // AI Live Suggestion States (snappy client-side feedback during typing)
  const [aiTriage, setAiTriage] = useState({ sentiment: 'Neutral', category: 'General' });

  // Update AI recommendations as user types
  useEffect(() => {
    if (subject.trim() || description.trim()) {
      const result = analyzeTicketAI(subject, description);
      setAiTriage(result);
    } else {
      setAiTriage({ sentiment: 'Neutral', category: 'General' });
    }
  }, [subject, description]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !description) return;

    setIsSubmitting(true);
    try {
      // POST to backend API - backend handles TKT numbering and final AI classification
      const result = await api.createTicket({
        customer_name: name,
        customer_email: email,
        subject: subject,
        description: description,
        priority: priority
      });

      setSuccessId(result.ticket_id);
      setName('');
      setEmail('');
      setSubject('');
      setDescription('');
      setPriority('Medium');
      if (onTicketCreated) onTicketCreated();
    } catch (err) {
      console.error("Submission Error: ", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        className="h-full max-w-lg w-full bg-[#121214] border-l border-zinc-800/80 shadow-2xl p-6 md:p-8 flex flex-col justify-between overflow-y-auto animate-slide-in relative"
      >
        {/* Header Block */}
        <div>
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <PlusCircle className="h-5 w-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white leading-none">Create Support Ticket</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 p-1.5 rounded-xl transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {successId ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
                <CheckCircle2 className="h-9 w-9 animate-bounce" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">Ticket Filed & Ready</h3>
              <p className="text-xs text-zinc-400 mb-6 max-w-xs">
                The support ticket has been committed to database under serial reference ID:{' '}
                <span className="font-mono font-bold text-cyan-400 block mt-1 text-sm">{successId}</span>
              </p>

              <div className="flex flex-col gap-2 w-full max-w-xs">
                <button 
                  onClick={() => setSuccessId('')}
                  className="btn-primary w-full py-3"
                >
                  Create Another Ticket
                </button>
                <button 
                  onClick={onClose}
                  className="btn-secondary w-full py-3"
                >
                  Done & Close Desk
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Customer Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sahil"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Customer Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sahil@example.com"
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Priority Selection & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Subject Title</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Issue summary description..."
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="select-field"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Description Details</label>
                  <textarea
                    required
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide full description of the customer request..."
                    className="input-field resize-none"
                  />
                </div>
              </div>

              {/* Realtime AI Preview */}
              {(subject.trim() || description.trim()) && (
                <div className="p-4 bg-zinc-800/10 border border-zinc-800 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-indigo-350 uppercase tracking-wider">Realtime AI Triage Simulator</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] bg-zinc-950 border border-zinc-800 text-zinc-300 font-bold px-2 py-1 rounded">
                      CATEGORY: <span className="text-cyan-400">{aiTriage.category}</span>
                    </span>
                    <span className={`text-[10px] border font-bold px-2 py-1 rounded uppercase tracking-wider ${
                      aiTriage.sentiment === 'Negative' 
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                        : aiTriage.sentiment === 'Positive'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                    }`}>
                      SENTIMENT: {aiTriage.sentiment === 'Negative' ? '😡 Negative' : aiTriage.sentiment === 'Positive' ? '😊 Positive' : '😐 Neutral'}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? 'Recording Ticket...' : 'File Ticket & Analyze'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
