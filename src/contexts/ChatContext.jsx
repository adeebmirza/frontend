import { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [activeThread, setActiveThread] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');

  const value = {
    activeThread,
    setActiveThread,
    selectedModel,
    setSelectedModel
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};