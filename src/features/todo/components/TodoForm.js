import { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { motion } from 'framer-motion';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

function TodoForm({ onSubmit, initialValues = null }) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [dueDate, setDueDate] = useState(initialValues?.dueDate ? new Date(initialValues.dueDate) : null);
  const [priority, setPriority] = useState(initialValues?.priority || 'medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      dueDate: dueDate?.toISOString(),
      priority
    });
    
    if (!initialValues) {
      setTitle('');
      setDescription('');
      setDueDate(null);
      setPriority('medium');
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="todo-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* ... other form fields ... */}
      
      <div className="form-group">
        <label>Due Date & Time</label>
        <DateTimePicker
          onChange={setDueDate}
          value={dueDate}
          className="datetime-picker"
          format="y-MM-dd h:mm a"
          clearIcon={null}
          calendarIcon={null}
          disableClock={true}
          dayPlaceholder="dd"
          monthPlaceholder="mm"
          yearPlaceholder="yyyy"
          hourPlaceholder="hh"
          minutePlaceholder="mm"
          maxDetail="minute"
          minDate={new Date()}
        />
      </div>

      {/* ... rest of the form ... */}
    </motion.form>
  );
}

export default TodoForm; 