export const api = {
  // 1. GET /api/tickets
  async getTickets(status = 'all', search = '') {
    const params = new URLSearchParams();
    if (status && status !== 'all') {
      params.append('status', status);
    }
    if (search.trim()) {
      params.append('search', search.trim());
    }
    
    const res = await fetch(`/api/tickets?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to fetch tickets');
    }
    return data;
  },

  // 2. GET /api/tickets/{ticket_id}
  async getTicketDetails(ticketId) {
    const res = await fetch(`/api/tickets/${ticketId}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to fetch ticket details');
    }
    return data;
  },

  // 3. POST /api/tickets
  async createTicket(ticketData) {
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to create ticket');
    }
    return data;
  },

  // 4. PUT /api/tickets/{ticket_id}
  async updateTicket(ticketId, updateData) {
    const res = await fetch(`/api/tickets/${ticketId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to update ticket');
    }
    return data;
  }
};
