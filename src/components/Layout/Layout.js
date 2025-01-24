import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import './Layout.css';

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();

  // Check if current route is an auth route
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isAuthPage) {
    return (
      <div className={`app ${theme}`}>
        <main className="auth-content">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className={`app ${theme}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isMobile && isSidebarOpen && (
        <div 
          className="overlay active" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div 
        className="main-container"
        style={{ marginLeft: !isMobile && isSidebarOpen ? '280px' : '0' }}
      >
        <TopBar onMenuClick={toggleSidebar} />
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout; 