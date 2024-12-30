import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
// import AnimePanel from './pages/AnimePanel';
import AdminPanel from './pages/AdminPanel.jsx';
import AdminPage from './pages/AnimePage.jsx';
import Upcoming from './pages/Upcoming';
import GenrePage from './pages/GenrePage.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anime/:animeId" element={<AdminPage />} />
          <Route path="/admin" element={<AdminPanel/>} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/genre/:genre" element={<GenrePage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

