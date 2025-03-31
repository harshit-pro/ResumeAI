import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [logoHover, setLogoHover] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`navbar fixed top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-base-100/90 backdrop-blur-md shadow-lg' : 'bg-base-100/80'}`}>
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li><Link to={"/about"} className="hover:text-primary">About Us</Link></li>
            <li><Link to={"/services"} className="hover:text-primary">Services</Link></li>
            <li><Link to={"/contact"} className="hover:text-primary">Contact Us</Link></li>
            <li><Link to={"/resume-analyzer"} className="hover:text-primary">Resume Analyzer</Link></li>
          </ul>
        </div>
        <Link 
          to={""} 
          className="btn btn-ghost px-2"
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
        >
          <div className="flex items-center space-x-1">
            {/* Animated Logo */}
            <div className="relative">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary transition-all duration-500 ${logoHover ? 'rotate-12 scale-110' : ''}`}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="white" 
                  className={`w-6 h-6 transition-transform duration-300 ${logoHover ? 'scale-125' : ''}`}
                >
                  <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                  <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                </svg>
              </div>
              {logoHover && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping opacity-75"></div>
              )}
            </div>
            
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Resume<span className="text-accent">X</span>.in
            </span>
          </div>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2">
          <li>
            <Link 
              to={"/about"} 
              className="hover:bg-transparent hover:text-primary font-medium transition-colors"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link 
              to={"/services"} 
              className="hover:bg-transparent hover:text-primary font-medium transition-colors"
            >
              Services
            </Link>
          </li>
          <li>
            <Link 
              to={"/contact"} 
              className="hover:bg-transparent hover:text-primary font-medium transition-colors"
            >
              Contact Us
            </Link>
          </li>
          <li>
            <Link 
              to={"/resume-analyzer"} 
              className="hover:bg-transparent hover:text-primary font-medium transition-colors"
            >
              Resume Analyzer
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
       
      </div>
    </div>
  );
}

export default NavBar;