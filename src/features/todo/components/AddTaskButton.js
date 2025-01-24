import { motion } from 'framer-motion';

function AddTaskButton({ onClick }) {
  return (
    <motion.button
      className="add-task-button"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <i className="fas fa-plus"></i>
    </motion.button>
  );
}

export default AddTaskButton; 