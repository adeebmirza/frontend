import { useState, useEffect } from 'react';
import { ChatService } from '../services/chat.service';

export const useChat = (threadId = null) => {
  const [messages, setMessages] = useState([]);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchThreadHistory = async (id) => {
    try {
      setLoading(true);
      const response = await ChatService.getThreadHistory(id);
      setMessages(response.data.messages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllThreads = async () => {
    try {
      setLoading(true);
      const response = await ChatService.getAllThreads();
      setThreads(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content) => {
    try {
      setLoading(true);
      const response = await ChatService.sendMessage({
        content,
        threadId
      });
      setMessages(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (threadId) {
      fetchThreadHistory(threadId);
    }
    fetchAllThreads();
  }, [threadId]);

  return {
    messages,
    threads,
    loading,
    error,
    sendMessage,
    refreshThreads: fetchAllThreads
  };
};