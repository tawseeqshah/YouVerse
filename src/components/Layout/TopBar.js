import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import BrandName from '../BrandName';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { getAppTitle } from '../../utils/appTitles';

function TopBar({ onMenuClick }) {
  const location = useLocation();
  const appTitle = getAppTitle(location.pathname);

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <button className="menu-button" onClick={onMenuClick}>
          <i className="fas fa-bars"></i>
        </button>
      </div>
      
      <div className="brand-container">
        <BrandName />
        <div className="app-subtitle">{appTitle}</div>
      </div>
      
      <div className="top-bar-right">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default TopBar; 