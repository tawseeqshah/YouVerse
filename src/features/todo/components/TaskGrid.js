import { motion } from 'framer-motion';

function TaskGrid({ categories, selectedCategory, onCategorySelect }) {
  return (
    <div className="task-grid">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          className={`task-card ${selectedCategory === category.id ? 'selected' : ''}`}
          onClick={() => onCategorySelect(category.id)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.2,
            delay: index * 0.05,
            ease: "easeOut"
          }}
          whileHover={{ 
            scale: 1.03,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.97,
            transition: { duration: 0.1 }
          }}
          style={{
            '--card-color': category.color
          }}
        >
          <div className="card-icon">
            <i className={`fas ${category.icon}`}></i>
          </div>
          <div className="card-content">
            <h3>{category.title}</h3>
            <span className="task-count">{category.count}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default TaskGrid; 