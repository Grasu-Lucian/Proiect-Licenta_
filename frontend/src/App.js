import React from 'react';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<div >hello </div>} />
        <Route path="/register" element={<div >hi </div>}  />
      </Routes>
    </div>
  );
}

export default App;