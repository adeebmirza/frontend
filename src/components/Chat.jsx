import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatSidebar from './ChatSidebar';
import MessageList from './MessageList';
import ModelSelector from './ModelSelector';

function Chat({ logout }) {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Set up authorization header
  const getAuthHeader = () => {
    return { 
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      } 
    };
  };

  // Fetch available models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get('/api/models', getAuthHeader());
        setAvailableModels(response.data.models);
        setSelectedModel(response.data.models[0]);
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };
    fetchModels();
  }, []);

  // Fetch chat sessions
  useEffect(() => {
    const fetchChatSessions = async () => {
      try {
        const response = await axios.get('/api/chats', getAuthHeader());
        setChatSessions(response.data.chats);
      } catch (error) {
        console.error('Error fetching chat sessions:', error);
      }
    };
    fetchChatSessions();
  }, [chatHistory]);

  // Fetch chat history if threadId is provided
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (threadId) {
        try {
          const response = await axios.get(`/api/history/${threadId}`, getAuthHeader());
          setChatHistory(response.data.chat_history);
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      } else {
        setChatHistory([]);
      }
    };
    fetchChatHistory();
  }, [threadId]);

  // Scroll to bottom of chat on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const payload = {
        message: message,
        model: selectedModel,
        thread_id: threadId
      };
      
      const response = await axios.post('/api/chat', payload, getAuthHeader());
      setChatHistory(response.data.chat_history);
      
      if (!threadId) {
        navigate(`/chat/${response.data.thread_id}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  const startNewChat = () => {
    navigate('/chat');
    setChatHistory([]);
    setSidebarOpen(false);
  };

  const selectChat = (id) => {
    navigate(`/chat/${id}`);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-indigo-600 text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? 'Close' : 'Menu'}
      </button>

      {/* Sidebar */}
      <ChatSidebar 
        chatSessions={chatSessions}
        currentThreadId={threadId}
        onSelectChat={selectChat}
        onNewChat={startNewChat}
        logout={logout}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden p-4 md:pl-80">
          <div className="flex-1 overflow-y-auto mb-4 bg-white rounded-lg shadow">
            {chatHistory.length > 0 ? (
              <MessageList messages={chatHistory} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Send a message to start a new chat!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <ModelSelector 
                models={availableModels} 
                selectedModel={selectedModel} 
                onChange={setSelectedModel} 
              />
            </div>
            <form onSubmit={handleSendMessage} className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50"
                disabled={isLoading || !message.trim()}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Chat;