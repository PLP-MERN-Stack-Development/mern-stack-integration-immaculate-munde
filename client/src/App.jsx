import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">
        Tailwind is working! 🎉
      </h1>
      <p className="mt-4 text-lg text-gray-700">
        If this text is styled, Tailwind is set up correctly.
      </p>
      <button className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
        Test Button
      </button>
    </div>
  );
}

export default App;

