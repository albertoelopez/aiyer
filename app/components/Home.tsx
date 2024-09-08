"use client";  // This line marks the component as a Client Component

import React, { useState } from 'react';

interface Message {
  text: string;
}

const Home: React.FC = () => {
  const [message, setMessage] = useState<Message>({ text: 'Hello, World!' });

  return (
    <div>
      <h1>{message.text}</h1>
      <button onClick={() => setMessage({ text: 'New message!' })}>
        Update Message
      </button>
    </div>
  );
};

export default Home;
