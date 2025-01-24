import { motion } from 'framer-motion';

function StatsSection() {
  const stats = [
    { label: 'Tasks Completed', value: '12', icon: 'fa-check-circle', color: '#10B981' },
    { label: 'Notes Created', value: '5', icon: 'fa-note-sticky', color: '#6366F1' },
    { label: 'Contacts', value: '24', icon: 'fa-address-book', color: '#F59E0B' },
  ];

  return (
    <div className="stats-section">
      <h2>Overview</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default StatsSection; 