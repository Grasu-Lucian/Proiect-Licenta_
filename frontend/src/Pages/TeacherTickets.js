import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReplies = async (ticketId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('teacher_token');
      if (!token) return;

      const response = await axios.get(`http://localhost:3307/api/reply/${ticketId}/teacher`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReplies(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch replies:', err.response?.data || err.message);
      setReplies([]);
      setLoading(false);
    }
  };

  const handleTicketClick = (ticket) => {
    console.log('Selected ticket:', ticket);
    setSelectedTicket(ticket);
    fetchReplies(ticket.TicketID);
    setNewReply(''); // Clear any previous reply
  };

  const handleSendReply = async () => {
    if (!newReply.trim() || !selectedTicket) return;

    try {
      const token = localStorage.getItem('teacher_token');
      if (!token) return;

      await axios.post(`http://localhost:3307/api/reply/${selectedTicket.TicketID}/teacher`, 
        { ReplyText: newReply },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Refresh replies after sending
      fetchReplies(selectedTicket.TicketID);
      setNewReply('');
    } catch (err) {
      console.error('Error sending reply:', err.response?.data || err.message);
      setError('Failed to send reply');
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('teacher_token');
        console.log('Token:', token);
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        console.log('Fetching tickets...');
        const response = await axios.get('http://localhost:3307/api/tickets/teacher', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Tickets response:', response.data);
        console.log('First ticket example:', response.data[0]);
        if (response.data && Array.isArray(response.data)) {
          setTickets(response.data);
          // Initialize newReplies state for each ticket
          const repliesState = {};
          response.data.forEach(ticket => {
            repliesState[ticket.TicketID] = [];
          });
          setReplies(repliesState);
          setLoading(false);
        } else {
          setTickets([]);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching tickets:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to fetch tickets');
        setTickets([]);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600 animate-pulse">Loading tickets...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 p-4 gap-4 overflow-hidden">
      {/* Tickets List */}
      <div className={`w-80 bg-white rounded-lg shadow-lg ${selectedTicket ? 'hidden md:block' : 'block'}`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Support Tickets</h2>
        </div>
        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 130px)' }}>
          {tickets.map((ticket) => (
            <div
              key={ticket.TicketID}
              onClick={() => handleTicketClick(ticket)}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                selectedTicket?.TicketID === ticket.TicketID ? 'bg-blue-50' : ''
              }`}
            >
              <h3 className="font-medium">{ticket.Title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className={`flex-1 bg-white rounded-lg shadow-lg flex flex-col ${!selectedTicket ? 'hidden md:block' : 'block'}`}>
        {selectedTicket ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-semibold">{selectedTicket.Title}</h2>
              <p className="text-gray-500 mt-1">
                Created on {new Date(selectedTicket.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* Initial Ticket Message */}
                <div className="bg-blue-50 rounded-lg p-3 max-w-3xl mx-auto mb-4">
                  <div className="font-medium mb-2">Ticket Description</div>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.TicketDescription}</p>
                </div>

                {/* Replies */}
                {replies.map((reply) => {
                  const isTeacherReply = reply.Username === localStorage.getItem('FirstName') + ' ' + localStorage.getItem('LastName');
                  return (
                    <div
                      key={reply.ReplyID}
                      className={`flex ${isTeacherReply ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      <div
                        className={`rounded-lg p-3 max-w-[85%] ${
                          isTeacherReply
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className={`text-xs font-medium mb-1 ${isTeacherReply ? 'text-blue-100' : 'text-gray-600'}`}>
                          {reply.Username}
                        </p>
                        <p className="whitespace-pre-wrap text-sm">{reply.ReplyText}</p>
                        <p className={`text-xs mt-1 ${!isTeacherReply ? 'text-gray-500' : 'text-blue-100'}`}>
                          {new Date(reply.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reply Input - Fixed at Bottom */}
            <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                />
                <button
                  onClick={handleSendReply}
                  disabled={!newReply.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a ticket to view the conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherTickets;
