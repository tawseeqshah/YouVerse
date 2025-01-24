import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useUpdateTask } from '../../../hooks/useTasks';

function TaskList({ category, tasks, loading, onEditTask, onDeleteTask }) {
  const updateTask = useUpdateTask();
  const [animatingId, setAnimatingId] = useState(null);

  const filteredTasks = tasks.filter(task => {
    if (!task.dueDate) return false;

    const now = new Date();
    const taskDate = new Date(task.dueDate);
    
    const isToday = (date) => {
      const today = new Date();
      return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
    };
    
    switch(category) {
      case 'today':
        return !task.completed && isToday(taskDate);
      case 'upcoming':
        return !task.completed && taskDate > now;
      case 'overdue':
        return !task.completed && taskDate < now && !isToday(taskDate);
      case 'completed':
        return task.completed;
      default:
        return true;
    }
  });

  const toggleTaskCompletion = async (taskId, completed) => {
    try {
      setAnimatingId(taskId);
      await updateTask(taskId, { completed: !completed });
      setTimeout(() => setAnimatingId(null), 500); // Reset after animation
    } catch (error) {
      console.error('Error updating task:', error);
      setAnimatingId(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="task-list">
      <AnimatePresence>
        {filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            className={`task-item ${task.completed ? 'completed' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            layout
          >
            <div className="task-checkbox">
              <motion.div 
                className={`checkbox-wrapper ${animatingId === task.id ? 'animating' : ''}`}
                whileTap={{ scale: 0.9 }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id, task.completed)}
                />
                <span className="checkmark">
                  <i className="fas fa-check"></i>
                </span>
              </motion.div>
            </div>
            <div className="task-content">
              <h3>{task.title}</h3>
              {task.description && <p>{task.description}</p>}
              <div className="task-meta">
                <span className="due-date">
                  <i className="fas fa-calendar-alt"></i>
                  {new Date(task.dueDate).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="task-actions">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="edit-button"
                onClick={() => onEditTask(task)}
              >
                <i className="fas fa-edit"></i>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="delete-button"
                onClick={() => onDeleteTask(task.id)}
              >
                <i className="fas fa-trash-alt"></i>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {filteredTasks.length === 0 && (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <i className="fas fa-tasks"></i>
          <p>No tasks found</p>
        </motion.div>
      )}
    </div>
  );
}

export default TaskList; 