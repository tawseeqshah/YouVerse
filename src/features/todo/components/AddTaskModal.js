import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { useAddTask } from '../../../hooks/useTasks';
import { useTasks } from '../../../hooks/useTasks';
import "react-datepicker/dist/react-datepicker.css";

function AddTaskModal({ onClose, editTask = null }) {
  const [title, setTitle] = useState(editTask?.title || '');
  const [description, setDescription] = useState(editTask?.description || '');
  const [dueDate, setDueDate] = useState(editTask ? new Date(editTask.dueDate) : new Date());
  const [error, setError] = useState(null);
  const addTask = useAddTask();
  const { updateTask } = useTasks();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!title.trim()) {
        throw new Error('Title is required');
      }

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate.toISOString(),
      };

      if (editTask) {
        await updateTask(editTask.id, taskData);
      } else {
        await addTask(taskData);
      }
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="modal-content"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <h2>{editTask ? 'Edit Task' : 'Add New Task'}</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
              />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="date-picker-input"
                placeholderText="Select due date and time"
                required
              />
            </div>
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="cancel-button">
                Cancel
              </button>
              <button type="submit" className="submit-button">
                {editTask ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AddTaskModal; 