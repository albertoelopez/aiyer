import React from "react";
import HomeComponent from "./components/Home";

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen w-full px-0 pb-4 sm:pb-8">
      <main className="flex flex-1 w-full bg-white rounded-lg shadow-md">
        <HomeComponent />
      </main>
    </div>
  );
}