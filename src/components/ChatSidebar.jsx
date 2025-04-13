import React from 'react';

function ChatSidebar({ chatSessions, currentThreadId, onSelectChat, onNewChat, logout, isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    
      <aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:sticky top-0 left-0 z-10 w-64 h-full bg-indigo-800 text-white overflow-y-auto transition-transform duration-300 ease-in-out`}>
        <div className="p-4">
          <h1 className="text-xl font-bold mb-6">AI Chatbot</h1>
          <button
            onClick={onNewChat}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded mb-6 flex items-center justify-center"
          >
            New Chat
          </button>
          
          <div className="mb-6">
            <h2 className="text-sm font-medium text-indigo-300 mb-2">Your Conversations</h2>
            <div className="space-y-1">
              {chatSessions.length > 0 ? (
                chatSessions.map((sessionId, index) => (
                  <button
                    key={sessionId}
                    onClick={() => onSelectChat(sessionId)}
                    className={`w-full text-left truncate py-2 px-3 rounded ${
                      sessionId === currentThreadId ? 'bg-indigo-700' : 'hover:bg-indigo-700'
                    }`}
                  >
                    Chat {index + 1}
                  </button>
                ))
              ) : (
                <p className="text-sm text-indigo-300 italic px-3">No chat history yet</p>
              )}
            </div>
          </div>
          
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default ChatSidebar;