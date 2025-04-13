import { memo } from 'react';
import Message from './Message';

const MessageList = memo(({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <Message
          key={index}
          content={message.content}
          isUser={message.role === 'user'}
          timestamp={message.timestamp}
        />
      ))}
    </div>
  );
});

export default MessageList;