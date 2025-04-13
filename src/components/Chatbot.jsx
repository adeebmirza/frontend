import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000';

const Chatbot = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [allChats, setAllChats] = useState([]);
  const [newThreadName, setNewThreadName] = useState('');
  const [error, setError] = useState('');
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (!token) {
      setError('User not authenticated. Please log in.');
      navigate('/auth/login');
    }
  }, [navigate, token]);

  useEffect(() => {
    fetchModels();
    if (threadId) {
      fetchChatHistory(threadId);
    }
  }, [threadId]);

  const fetchModels = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/models`, axiosConfig);
      setModels(response.data.models);
      if (response.data.models.length > 0 && !selectedModel) {
        setSelectedModel(response.data.models[0]);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const fetchChatHistory = async (currentThreadId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/history/${currentThreadId}`, axiosConfig);
      setChatHistory(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setChatHistory([]);
      } else {
        handleError(error);
      }
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedModel) return;

    let activeThreadId = threadId;

    // If starting a new chat
    if (!threadId && newThreadName.trim()) {
      activeThreadId = newThreadName.trim();
      setThreadId(activeThreadId);
      setNewThreadName('');
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/chat`,
        {
          message,
          model: selectedModel,
          thread_id: activeThreadId,
        },
        axiosConfig
      );

      setChatHistory(response.data.chat_history);
      setThreadId(response.data.thread_id);
      setMessage('');
    } catch (error) {
      handleError(error);
    }
  };

  const deleteChat = async (chatThreadId) => {
    if (!window.confirm(`Are you sure you want to delete chat "${chatThreadId}"?`)) return;
    try {
      const response = await axios.delete(`${API_BASE_URL}/chat/${chatThreadId}`, axiosConfig);
      alert(response.data.message);
      setThreadId(null);
      setChatHistory([]);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchAllChats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chats`, axiosConfig);
      setAllChats(response.data.chats);
    } catch (error) {
      handleError(error);
    }
  };

  const createNewChat = () => {
    const name = prompt('Enter a name for your new chat:');
    if (name) {
      setChatHistory([]);
      setThreadId(null); // will be set on send
      setNewThreadName(name.trim());
      setMessage('');
    }
  };

  const handleError = (error) => {
    console.error('Request error:', error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      navigate('/auth/login');
    } else {
      setError(error.response?.data?.detail || 'An error occurred.');
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Chatbot Interface</h1>
        <div className="flex space-x-2">
          <button
            onClick={createNewChat}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            New Chat
          </button>
          <button
            onClick={fetchAllChats}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            View All Chats
          </button>
        </div>
      </header>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 text-center">{error}</div>
      )}

      <div className="flex flex-grow p-4">
        {/* Chat History */}
        <div
          ref={chatContainerRef}
          className="bg-white shadow-md rounded-md overflow-y-auto flex-grow p-4"
        >
          {chatHistory.map((msg, index) => (
            <div key={index} className="mb-4">
              {msg.message && (
                <div className="mb-2 p-2 rounded-md bg-gray-200 text-gray-800 self-end max-w-xl ml-auto">
                  <div className="font-semibold">You:</div>
                  <div>{msg.message}</div>
                </div>
              )}
              {msg.response && (
                <div className="mb-2 p-2 rounded-md bg-blue-100 text-blue-800 self-start max-w-xl mr-auto">
                  <div className="font-semibold">{selectedModel}:</div>
                  <div>{msg.response}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="ml-4 w-64 bg-gray-200 shadow-md rounded-md p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Options</h2>
          <div>
            <label
              htmlFor="model-select"
              className="block text-gray-700 text-sm font-bold mb-1"
            >
              Select Model:
            </label>
            <select
              id="model-select"
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          {threadId && (
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-1">Current Chat: {threadId}</h3>
              <button
                onClick={() => deleteChat(threadId)}
                className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
              >
                Delete Chat
              </button>
            </div>
          )}

          {allChats.length > 0 && (
            <div className="mt-6">
              <h2 className="text-md font-semibold mb-2">All Chats</h2>
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {allChats.map((tid) => (
                  <li
                    key={tid}
                    className="bg-white p-2 rounded shadow-sm flex justify-between items-center"
                  >
                    <button
                      onClick={() => setThreadId(tid)}
                      className="text-blue-600 hover:underline truncate"
                    >
                      {tid}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 bg-gray-300">
        <div className="flex rounded-md shadow-sm">
          <input
            type="text"
            className="flex-grow border rounded py-2 px-3 text-gray-700"
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
