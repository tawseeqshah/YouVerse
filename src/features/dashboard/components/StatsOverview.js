import { motion } from 'framer-motion';
import { useContacts } from '../../../hooks/useContacts';
import { useTasks } from '../../../hooks/useTasks';
import { FaUsers, FaTasks, FaCheckCircle, FaClock } from 'react-icons/fa';

function StatsOverview() {
  const { contacts } = useContacts();
  const { tasks } = useTasks();

  // Ensure tasks is an array
  const tasksList = tasks || [];

  // Filter tasks for today using proper date comparison
  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = tasksList.filter(task => {
    // Handle potential undefined or null dueDate
    if (!task.dueDate) return false;
    return task.dueDate.split('T')[0] === today;
  });

  // Count completed and pending tasks
  const completedTodayTasks = todaysTasks.filter(task => task.completed === true).length;
  const pendingTodayTasks = todaysTasks.filter(task => task.completed === false).length;

  const stats = [
    {
      title: 'Today\'s Completed Tasks',
      value: completedTodayTasks || 0,
      icon: <FaCheckCircle />,
      color: 'var(--success-color)'
    },
    {
      title: 'Today\'s Pending Tasks',
      value: pendingTodayTasks || 0,
      icon: <FaClock />,
      color: 'var(--warning-color)'
    },
    {
      title: 'Total Contacts',
      value: contacts?.length || 0,
      icon: <FaUsers />,
      color: 'var(--primary-color)'
    },
    {
      title: 'All Tasks',
      value: tasksList.length || 0,
      icon: <FaTasks />,
      color: 'var(--info-color)'
    }
  ];

  return (
    <motion.div 
      className="stats-overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2>Today's Overview</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            style={{ '--stat-color': stat.color }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default StatsOverview; 