import { useState } from 'react';
import { motion } from 'framer-motion';
import TaskGrid from './components/TaskGrid';
import TaskList from './components/TaskList';
import AddTaskButton from './components/AddTaskButton';
import AddTaskModal from './components/AddTaskModal';
import { useTasks } from '../../hooks/useTasks';
import './styles/Todo.css';

function TodoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('today');
  const [selectedTask, setSelectedTask] = useState(null);
  const { tasks, loading, error, deleteTask } = useTasks();

  // Helper function for date comparison
  const getStartOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const categories = [
    { 
      id: 'today', 
      title: "Today's Tasks", 
      icon: 'fa-calendar-day',
      color: '#10B981',
      count: tasks.filter(task => {
        const today = getStartOfDay(new Date());
        const taskDate = getStartOfDay(new Date(task.dueDate));
        return !task.completed && taskDate.getTime() === today.getTime();
      }).length
    },
    { 
      id: 'upcoming', 
      title: 'Upcoming', 
      icon: 'fa-calendar-alt',
      color: '#6366F1',
      count: tasks.filter(task => {
        const today = getStartOfDay(new Date());
        const taskDate = getStartOfDay(new Date(task.dueDate));
        return !task.completed && taskDate > today;
      }).length
    },
    { 
      id: 'overdue', 
      title: 'Overdue', 
      icon: 'fa-exclamation-circle',
      color: '#EF4444',
      count: tasks.filter(task => {
        if (!task.dueDate) return false;
        const now = new Date();
        const taskDate = new Date(task.dueDate);
        
        // Use the same isToday function as TaskList
        const isToday = (date) => {
          const today = new Date();
          return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
        };
        
        // Only count tasks that are before today (not including today)
        return !task.completed && taskDate < now && !isToday(taskDate);
      }).length
    },
    { 
      id: 'completed', 
      title: 'Completed', 
      icon: 'fa-check-circle',
      color: '#8B5CF6',
      count: tasks.filter(task => task.completed).length
    }
  ];

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  return (
    <motion.div 
      className="todo-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <TaskGrid 
        categories={categories} 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      <TaskList 
        category={selectedCategory}
        tasks={tasks}
        loading={loading}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />

      <AddTaskButton onClick={() => setIsModalOpen(true)} />
      
      {isModalOpen && (
        <AddTaskModal 
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
          editTask={selectedTask}
        />
      )}
    </motion.div>
  );
}

export default TodoPage; 