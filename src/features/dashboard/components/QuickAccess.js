import { useNavigate } from 'react-router-dom';

function QuickAccess() {
  const navigate = useNavigate();

  const quickAccessItems = [
    { path: '/todo', icon: 'fa-list-check', label: 'To-Do' },
    { path: '/contacts', icon: 'fa-address-book', label: 'Contacts' },
    { path: '/notes', icon: 'fa-note-sticky', label: 'Notes' },
    { path: '/more-apps', icon: 'fa-grid-2', label: 'More Apps' },
  ];

  return (
    <div className="quick-access-section">
      <h2>Quick Access</h2>
      <div className="shortcuts-grid">
        {quickAccessItems.map((item) => (
          <div
            key={item.path}
            className="shortcut-card"
            onClick={() => navigate(item.path)}
          >
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="today-todos">
        <h3><i className="fas fa-list-check"></i> Today's Tasks</h3>
        <div className="todo-preview">
          <p>No tasks for today</p>
          {/* You can add todo items preview here */}
        </div>
      </div>
    </div>
  );
}

export default QuickAccess; 