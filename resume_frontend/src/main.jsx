import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Root from './pages/Root';
import Home from './pages/Home';
// import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import GenerateResume from './pages/GenerateResume';
import { Toaster } from 'react-hot-toast';
import ResumeAnalyzer from './pages/ResumeAnalyzer';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Toaster/>  
    {/* // for toast notifications */}
      <Routes>
        <Route path="/" element={<Root />}>
        <Route path="" element={<Home />}/>
        <Route path="about" element={<About />}/>
        <Route path="services" element={<Services/>}/>
        <Route path="contact" element={<Contact/>}/>
        <Route path='generate-resume' element={<GenerateResume/>}/>
        <Route path='resume-analyzer' element={<ResumeAnalyzer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);