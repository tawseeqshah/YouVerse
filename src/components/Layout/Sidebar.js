import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import BrandName from '../BrandName';

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const { logout } = useAuth();

  const navigationItems = [
    { path: '/dashboard', icon: 'fa-home', label: 'Dashboard' },
    { path: '/todo', icon: 'fa-list-check', label: 'To-Do' },
    { path: '/contacts', icon: 'fa-address-book', label: 'Contacts' },
    { path: '/notes', icon: 'fa-note-sticky', label: 'Notes' },
    { path: '/more-apps', icon: 'fa-grid-2', label: 'More Apps' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <BrandName />
      </div>
      <nav className="nav-links">
        {navigationItems.map((item) => (
          <li 
            key={item.path}
            onClick={() => handleNavigation(item.path)}
          >
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
          </li>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="theme-toggle" onClick={toggleTheme}>
          <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </div>
        <div 
          className="settings-link"
          onClick={() => handleNavigation('/settings')}
        >
          <i className="fas fa-cog"></i>
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar; 