import { motion } from 'framer-motion';

function RecentActivities() {
  const activities = [
    { text: 'Created a new note', time: '2 hours ago', icon: 'fa-note-sticky', color: '#6366F1' },
    { text: 'Completed task: "Review project"', time: '4 hours ago', icon: 'fa-check', color: '#10B981' },
    { text: 'Added new contact', time: 'Yesterday', icon: 'fa-user-plus', color: '#F59E0B' },
  ];

  return (
    <div className="activities-section">
      <h2>Recent Activities</h2>
      <div className="activities-list">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            className="activity-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="activity-icon" style={{ backgroundColor: `${activity.color}20`, color: activity.color }}>
              <i className={`fas ${activity.icon}`}></i>
            </div>
            <div className="activity-content">
              <p>{activity.text}</p>
              <span>{activity.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivities; 