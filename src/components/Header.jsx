import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ChevronDown, Menu } from 'lucide-react';
import logo from './logo-removebg-preview.png'

function Header() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const searchInputRef = useRef(null);
  const genreDropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  
  const genres = {
    column1: ['Action', 'Adventure', 'Comedy', 'Drama'],
    column2: ['Fantasy', 'Music', 'Romance', 'Sci-Fi'],
    column3: ['Seinen', 'Shojo', 'Shonen', 'Slice of life']
  };

  useEffect(() => {
    if (isSearchExpanded) {
      searchInputRef.current?.focus();
    }

    const handleClickOutside = (event) => {
      // Handle genre dropdown close
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target)) {
        setIsGenreDropdownOpen(false);
      }
      
      // Handle search close
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchExpanded]);

  const handleSearchClick = (e) => {
    e.stopPropagation();
    setIsSearchExpanded(!isSearchExpanded);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleMobileMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isSearchExpanded) setIsSearchExpanded(false);
  };

  return (
    <header className="bg-[#23252b] text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
        
         
          <Link to="/" className="text-2xl font-bold text-[#f47521]">
          {/* <img  className='w-10px h-10px' src={logo} alt="" /> */}
          Anime-Hub
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-[#f47521] transition-colors">Home</Link>
            <div className="relative" ref={genreDropdownRef}>
              <button 
                className="hover:text-[#f47521] transition-colors flex items-center gap-1"
                onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
              >
                Browse
                <ChevronDown className={`w-4 h-4 transition-transform ${isGenreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Genre Dropdown */}
              {isGenreDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-[600px] bg-[#2b2d35] shadow-xl rounded-md p-6 grid grid-cols-3 gap-4 z-50 border border-gray-700">
                  {Object.values(genres).map((column, idx) => (
                    <div key={idx}>
                      {column.map(genre => (
                        <Link 
                          key={genre}
                          to={`/genre/${genre.toLowerCase()}`}
                          className="block py-2 hover:text-[#f47521] transition-colors"
                        >
                          {genre}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link to="/admin" className="hover:text-[#f47521] transition-colors">Admin</Link>
            <Link to="/upcoming" className="hover:text-[#f47521] transition-colors">Upcoming</Link>
          </nav>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div ref={searchContainerRef} className="relative">
              {isSearchExpanded ? (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white rounded-md overflow-hidden shadow-lg w-[300px]">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search anime..."
                    className="w-full px-4 py-2 text-black focus:outline-none"
                  />
                  <button
                    onClick={handleSearchClick}
                    className="p-2 hover:bg-gray-100 text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSearchClick}
                  className="p-2 hover:text-[#f47521] transition-colors focus:outline-none"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:text-[#f47521] transition-colors focus:outline-none"
              onClick={handleMobileMenuClick}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 bg-[#2b2d35] mt-2 rounded-md border border-gray-700">
            <nav className="flex flex-col">
              <Link to="/" className="px-4 py-3 hover:bg-[#23252b] hover:text-[#f47521] transition-colors">
                Home
              </Link>
              <button 
                onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                className="px-4 py-3 text-left hover:bg-[#23252b] hover:text-[#f47521] transition-colors flex items-center justify-between w-full"
              >
                Browse
                <ChevronDown className={`w-4 h-4 transition-transform ${isGenreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Mobile Genre Dropdown */}
              {isGenreDropdownOpen && (
                <div className="bg-[#23252b] border-t border-b border-gray-700">
                  {Object.values(genres).flat().map(genre => (
                    <Link
                      key={genre}
                      to={`/genre/${genre.toLowerCase()}`}
                      className="block px-8 py-2 hover:text-[#f47521] transition-colors"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              )}
              <Link to="/upcoming" className="px-4 py-3 hover:bg-[#23252b] hover:text-[#f47521] transition-colors">
                News
              </Link>
              <Link to="/upcoming" className="px-4 py-3 hover:bg-[#23252b] hover:text-[#f47521] transition-colors">
                Upcoming
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;