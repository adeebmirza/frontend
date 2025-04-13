import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import ChatBox from '../components/chat/ChatBox';
import ChatSidebar from '../components/chat/ChatSidebar';
import ModelSelector from '../components/chat/ModelSelector';

const ChatPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { 
    messages, 
    threads, 
    loading, 
    sendMessage, 
    activeThread, 
    setActiveThread 
  } = useChat();

  const handleNewChat = () => {
    setActiveThread(null);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar
        threads={threads}
        activeThread={activeThread}
        onSelectThread={setActiveThread}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <ModelSelector />
        </div>

        <div className="flex-1 p-4">
          <ChatBox
            messages={messages}
            loading={loading}
            onSendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
