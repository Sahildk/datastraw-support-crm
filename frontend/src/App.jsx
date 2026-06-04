import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { api } from './lib/api';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import SearchFilter from './components/SearchFilter';

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('Checking DB Connection...');
  const [isSyncing, setIsSyncing] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Selection State
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // Form Drawer Toggle State
  const [isFormOpen, setIsFormOpen] = useState(false);

  const navigate = useNavigate();

  // Load tickets on mount
  useEffect(() => {
    fetchTickets();

    // Setup Supabase Realtime Listener (trrigers backend refetch on DB changes)
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tickets' },
        (payload) => {
          setIsSyncing(true);
          setSyncStatus('Realtime Syncing...');
          setTimeout(() => {
            fetchTickets();
          }, 400); // Small buffer to show sync rotation
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter computation (instant client-side responsiveness)
  useEffect(() => {
    let result = [...tickets];

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        t => 
          t.ticket_id.toLowerCase().includes(q) ||
          t.customer_name.toLowerCase().includes(q) ||
          t.customer_email.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // 2. Status Option
    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }

    setFilteredTickets(result);
  }, [search, statusFilter, tickets]);

  const fetchTickets = async () => {
    try {
      const data = await api.getTickets();
      setTickets(data || []);
      setSyncStatus('Database Connected ✓');
    } catch (err) {
      console.error('API Error:', err);
      setSyncStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#08080a] text-zinc-100 overflow-hidden">
      {/* Persistent Left Sidebar Navigation */}
      <Sidebar syncStatus={syncStatus} isSyncing={isSyncing} />

      {/* Main Panel Area */}
      <div className="flex-1 h-screen overflow-y-auto px-8 py-6 flex flex-col justify-between custom-scrollbar">
        <main className="mb-8">
          <Routes>
            {/* Dashboard Control Center */}
            <Route 
              path="/" 
              element={
                <div className="space-y-6">
                  <div className="border-b border-zinc-800/60 pb-5">
                    <h2 className="text-xl font-bold text-white tracking-tight">Operations Control Center</h2>
                    <p className="text-xs text-zinc-500 mt-1">Real-time analytical insights, issue categorization, and customer sentiment metrics.</p>
                  </div>
                  <Dashboard 
                    tickets={tickets} 
                    onViewTickets={() => navigate('/tickets')} 
                  />
                </div>
              } 
            />

            {/* Tickets Desk Workspace Route */}
            <Route 
              path="/tickets" 
              element={
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Ticket List Desk Panel */}
                  <div className={`${selectedTicketId ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4 transition-all duration-300`}>
                    <div className="flex justify-between items-center pb-2">
                      <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Support Desk Workspace</h2>
                        <p className="text-xs text-zinc-500 mt-1">Review active customer incidents, filter categories, and log internal updates.</p>
                      </div>
                    </div>

                    {/* Filter, Search & Create Action Bar */}
                    <SearchFilter 
                      search={search} 
                      setSearch={setSearch} 
                      statusFilter={statusFilter} 
                      setStatusFilter={setStatusFilter} 
                      onNewTicketClick={() => setIsFormOpen(true)}
                    />

                    {/* Support Tickets Queue */}
                    <TicketList 
                      tickets={filteredTickets} 
                      loading={loading}
                      activeTicketId={selectedTicketId}
                      onSelectTicket={(id) => setSelectedTicketId(id)}
                    />
                  </div>

                  {/* Right Detail Workspace Drawer */}
                  {selectedTicketId && (
                    <div className="lg:col-span-5 h-fit">
                      <TicketDetail 
                        ticketId={selectedTicketId} 
                        onClose={() => setSelectedTicketId(null)}
                      />
                    </div>
                  )}

                </div>
              } 
            />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="text-[10px] text-zinc-550 border-t border-zinc-800/40 pt-4 flex items-center justify-between mt-auto">
          <span>Datastraw CRM Support Desk v2.0</span>
          <span>© 2026 Datastraw Technologies</span>
        </footer>
      </div>

      {/* Slide-out Ticket Creation Form Drawer Overlay */}
      <TicketForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onTicketCreated={fetchTickets} 
      />
    </div>
  );
}
