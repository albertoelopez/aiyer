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
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputValue.trim() !== '' || uploadedFile) {
      // Add the user message immediately
      setMessages((prev) => [...prev, { id: prev.length + 1, text: inputValue, sender: 'User' }]);

      const responsesSet = new Set<string>();
      setLoading(true); // Start loading

      try {
        // Make the POST request 10 times
        for (let i = 0; i < 5; i++) {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: inputValue,
            }),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          
          // Collect unique responses in the set
          if (data.results && data.results.length > 0) {
            data.results.forEach((result: string) => {
              responsesSet.add(result);
            });
          }
        }

        // Format all responses as a single message
        const formattedResponse = Array.from(responsesSet).map(response => `"${response}" (holdings.csv),`).join(' ');
        
        // Add the formatted bot response to the chat
        setMessages(prev => [...prev, { id: prev.length + 1, text: formattedResponse, sender: 'Bot' }]);
        
      } catch (error) {
        console.error('Error:', error);
        setMessages((prev) => [...prev, { id: prev.length + 1, text: 'An error occurred. Please try again.', sender: 'Bot' }]);
      } finally {
        setLoading(false); // Stop loading
      }

      // Clear input and uploaded file
      setInputValue('');
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Immediately add a message for the uploaded file
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: `File uploaded: ${file.name}`,
          sender: 'User',
          isFile: true,
          fileName: file.name,
        },
      ]);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar for logo and upload button */}
      <div className="w-24 bg-gray-100 flex flex-col items-center p-4">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden">
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
          className="w-full bg-white text-blue-500 text-sm py-2 px-4 rounded-lg border-[1px] border-neutral-200 hover:bg-blue-50 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center"
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
          {/* Show loading indicator */}
          {loading && (
            <div className="flex justify-center items-center p-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
              <span className="ml-2 text-blue-600">Processing...</span>
            </div>
          )}
        </div>
        
        {/* Input form at the bottom */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center p-4 border-t border-gray-300 bg-white"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 text-black p-2 border border-gray-300 rounded-lg"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="ml-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
