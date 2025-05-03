import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/register" element={<div >hi </div>}  />
      </Routes>
    </div>
  );
}

export default App;