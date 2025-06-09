import React, { useState, useEffect } from 'react';
import axios from 'axios';


const StudentTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;

    try {
      const token = localStorage.getItem('student_token');
      if (!token) return;

      await axios.put(
        `https://proiect-licenta-1.onrender.com/api/ticket/${selectedTicket.TicketID}/status`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Update the ticket status locally
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.TicketID === selectedTicket.TicketID
            ? { ...ticket, Status: 'Closed' }
            : ticket
        )
      );
      setSelectedTicket(prev => ({ ...prev, Status: 'Closed' }));
    } catch (err) {
      console.error('Error closing ticket:', err.response?.data || err.message);
      setError('Failed to close ticket');
    }
  };

  const fetchReplies = async (ticketId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('student_token');
      if (!token) return;

      const response = await axios.get(`https://proiect-licenta-1.onrender.com/api/reply/${ticketId}/student`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReplies(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch replies:', err);
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
      const token = localStorage.getItem('student_token');
      if (!token) return;

      await axios.post(`https://proiect-licenta-1.onrender.com/api/reply/${selectedTicket.TicketID}/student`, 
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

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!newReply.trim() || !selectedTicket) return;

    try {
      const token = localStorage.getItem('student_token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      await axios.post(
        `https://proiect-licenta-1.onrender.com/api/reply/${selectedTicket.TicketID}/student`,
        { ReplyText: newReply },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewReply('');
      fetchReplies(selectedTicket.TicketID);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reply');
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('student_token');
        console.log('Token:', token);
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        console.log('Fetching tickets...');
        const response = await axios.get('https://proiect-licenta-1.onrender.com/api/tickets/student', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Tickets response:', response.data);
        console.log('First ticket example:', response.data[0]);
        if (response.data && Array.isArray(response.data)) {
          setTickets(response.data);
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Tickets List */}
      <div className={`w-full md:w-80 bg-white border-r border-gray-200 ${selectedTicket ? 'hidden md:block' : 'block'}`}>
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold">My Support Tickets</h1>
        </div>
      
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4 w-full max-w-4xl">
          {error}
        </div>
      )}

        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          {!tickets || tickets.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-600">No tickets found</p>
              <p className="text-gray-500 text-sm mt-1">
                Create a new ticket for support
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <div
                  key={ticket.TicketID}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedTicket?.TicketID === ticket.TicketID ? 'bg-blue-50' : ''}`}
                  onClick={() => handleTicketClick(ticket)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">{ticket.Title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.Status === 'open' ? 'bg-green-100 text-green-800' :
                    ticket.Status === 'closed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {ticket.Status.charAt(0).toUpperCase() + ticket.Status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{ticket.Description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col h-screen ${!selectedTicket ? 'hidden md:flex' : 'flex'}`}>
        {selectedTicket ? (
          <>
            {/* Header */}
            <div className="p-3 border-b border-gray-200 flex items-center">
              <button
                className="md:hidden mr-4 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md"
                onClick={() => setSelectedTicket(null)}
              >
                Back
              </button>
              <div>
                <h2 className="font-semibold text-lg">{selectedTicket.Title}</h2>
                <p className="text-sm text-gray-500">
                  Created on {new Date(selectedTicket.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* Initial Ticket Message */}
              <div className="bg-blue-50 rounded-lg p-3 max-w-3xl mx-auto mb-4">
                <div className="font-medium mb-2">Ticket Description</div>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.TicketDescription}</p>
              </div>

              {/* Replies */}
              {replies.map((reply) => {
                const isStudentReply = reply.Username === localStorage.getItem('FirstName') + ' ' + localStorage.getItem('LastName');
                return (
                  <div
                    key={reply.ReplyID}
                    className={`flex ${isStudentReply ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div
                      className={`rounded-lg p-3 max-w-[85%] ${
                        isStudentReply
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <p className={`text-xs font-medium mb-1 ${isStudentReply ? 'text-blue-100' : 'text-gray-600'}`}>
                        {reply.Username}
                      </p>
                      <p className="whitespace-pre-wrap text-sm">{reply.ReplyText}</p>
                      <p className={`text-xs mt-1 ${!isStudentReply ? 'text-gray-500' : 'text-blue-100'}`}>
                        {new Date(reply.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={handleCloseTicket}
                  disabled={selectedTicket?.Status === 'Closed'}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedTicket?.Status === 'Closed' ? 'Ticket Closed' : 'Close Ticket'}
                </button>
              </div>
              <form onSubmit={handleSubmitReply} className="flex space-x-4">
                <input
                  type="text"
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder=""
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={selectedTicket?.Status === 'Closed'}
                />
                <button
                  type="submit"
                  disabled={!newReply.trim() || selectedTicket?.Status === 'Closed'}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="hidden md:flex items-center justify-center h-full text-gray-500">
            Select a ticket to view the conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTickets;
