import { useState, useRef, useEffect } from 'react';
import { ChatService } from '../../services/chat.service';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatBox = ({ model, threadId, onThreadUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await ChatService.sendMessage({
        message,
        model,
        thread_id: threadId
      });
      
      setMessages(response.data.chat_history);
      if (!threadId && response.data.thread_id) {
        onThreadUpdate(response.data.thread_id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      <MessageList messages={messages} />
      <div ref={messagesEndRef} />
      <ChatInput 
        onSend={handleSendMessage} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default ChatBox;