import React from 'react';

function MessageList({ messages }) {
  return (
    <div className="p-4">
      {messages.map((msg, index) => (
        <div key={index} className="mb-4">
          <div className="font-bold mb-1 text-indigo-800">You</div>
          <div className="bg-gray-100 rounded-lg p-3 mb-2">{msg.message}</div>
          
          <div className="font-bold mb-1 text-indigo-600">AI</div>
          <div className="bg-indigo-50 rounded-lg p-3 whitespace-pre-wrap">{msg.response}</div>
        </div>
      ))}
    </div>
  );
}

export default MessageList;