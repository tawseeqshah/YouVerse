import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

function SearchBar({ value, onChange, placeholder }) {
  const [filterType, setFilterType] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    onChange('', e.target.value);
  };

  return (
    <>
      <motion.div 
        className="search-container"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="search-filter">
          <select 
            value={filterType} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="name">Name</option>
            <option value="designation">Role</option>
            <option value="business">Business</option>
            <option value="phone">Phone</option>
            <option value="email">Email</option>
          </select>
          <FaFilter className="filter-icon" />
        </div>

        <motion.button
          className="search-icon-button"
          onClick={() => setIsSearchOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaSearch />
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="search-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              className="search-modal-content"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <input
                type="text"
                className="search-input"
                value={value}
                onChange={(e) => onChange(e.target.value, filterType)}
                placeholder={`Search ${filterType === 'all' ? 'contacts' : filterType}...`}
                autoFocus
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SearchBar; 