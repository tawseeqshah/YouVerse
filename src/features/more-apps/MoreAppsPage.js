import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './styles/MoreApps.css';

function MoreAppsPage() {
  const navigate = useNavigate();

  const apps = [
    { 
      id: 'prayer-times',
      name: 'Prayer Times',
      icon: 'fa-mosque',
      color: '#8B5CF6',
      description: 'Track daily prayer times',
      path: '/prayer-times',
      comingSoon: false
    },
    { 
      id: 'ob-calculator',
      name: 'OB Calculator',
      icon: 'fa-calculator',
      color: '#10B981',
      description: 'Obstetric calculations made easy',
      path: '/ob-calculator',
      comingSoon: true
    }
  ];

  const handleAppClick = (app) => {
    if (!app.comingSoon && app.path) {
      navigate(app.path);
    }
  };

  return (
    <div className="more-apps-page">
      <h1>More Apps</h1>
      <div className="apps-grid">
        {apps.map((app) => (
          <motion.div
            key={app.id}
            className={`app-card ${!app.comingSoon ? 'clickable' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: app.comingSoon ? 1 : 1.02 }}
            onClick={() => handleAppClick(app)}
          >
            <div className="app-icon" style={{ backgroundColor: `${app.color}20`, color: app.color }}>
              <i className={`fas ${app.icon}`}></i>
            </div>
            <div className="app-info">
              <h3>{app.name}</h3>
              <p>{app.description}</p>
              {app.comingSoon && (
                <span className="coming-soon-badge">Coming Soon</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default MoreAppsPage; 