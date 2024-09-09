"use client"; // Marks the component as a Client Component

import React, { useState, useRef } from 'react';
import { FaFile } from 'react-icons/fa'; // Make sure to install react-icons
import Image from 'next/image';
import AiyerLogo from '../public/img/aiyer_logo.svg';

interface Message {
  id: number;
  text: string;
  sender: 'User' | 'Bot';
  isFile?: boolean;
  fileName?: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello! How can I assist you today?', sender: 'Bot' }
  ]); // Initial message from Bot
  const [inputValue, setInputValue] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to simulate bot response
  const getBotResponse = (userMessage: string): string => {
    return `You asked: "${userMessage}". Here's a placeholder response from the bot.`; // Update logic here if necessary.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== '' || uploadedFile) {
      const formData = new FormData();
      if (inputValue.trim() !== '') {
        formData.append('text', inputValue);
      }
      if (uploadedFile) {
        formData.append('file', uploadedFile);
      }

      try {
        // Actual fetch code (commented out for now)
        /*
        const response = await fetch('/api/chat', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        */

        // Mock response data
        const mockResponse = {
          response: `This is a mock response to: "${inputValue}". ${uploadedFile ? `File received: ${uploadedFile.name}` : ''}`
        };

        // Add user message for text input
        if (inputValue.trim() !== '') {
          setMessages(prev => [...prev, { id: prev.length + 1, text: inputValue, sender: 'User' }]);
        }

        // Add bot response
        setMessages(prev => [...prev, { id: prev.length + 1, text: mockResponse.response, sender: 'Bot' }]);

        // Clear input and uploaded file
        setInputValue('');
        setUploadedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle error (e.g., show an error message to the user)
      }
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Immediately add a message for the uploaded file
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: `File uploaded: ${file.name}`,
        sender: 'User',
        isFile: true,
        fileName: file.name
      }]);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar for logo and upload button */}
      <div className="w-24 bg-gray-100 flex flex-col items-center p-4">
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
            <Image src={AiyerLogo} alt="Logo" width={72} height={72} />
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-white text-blue-500 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-50 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center"
        >
          Upload
        </button>
      </div>

      {/* Main chat area */}
      <div className="flex flex-col flex-1 bg-gradient-to-b from-gray-100 to-gray-200">
        {/* Message history */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 w-full max-h-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-xl max-w-[75%] shadow-md transition-transform transform ${
                message.sender === 'User'
                  ? 'bg-blue-600 text-white self-end animate-bounce-right'
                  : 'bg-gray-300 text-gray-900 self-start animate-bounce-left'
              }`}
            >
              {message.isFile ? (
                <div className="flex items-center">
                  <FaFile className="mr-2" />
                  <span>{message.fileName}</span>
                </div>
              ) : (
                message.text
              )}
            </div>
          ))}
        </div>
        
        {/* Input form at the bottom */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center p-4 bg-white border-t border-gray-300 w-full shadow-inner"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border rounded-full text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            type="submit"
            className="ml-4 bg-blue-500 text-white py-3 px-6 rounded-full shadow-md hover:bg-blue-600 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
