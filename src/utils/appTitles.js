const appTitles = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Task Management',
  '/contacts': 'Contact Directory',
  '/notes': 'Notes',
  '/calendar': 'Calendar',
  '/prayer-times': 'Prayer Times',
  '/ob-calculator': 'OB Calculator',
  '/settings': 'Settings',
  '/more-apps': 'More Apps'
};

export const getAppTitle = (pathname) => {
  // Remove trailing slash if exists
  const normalizedPath = pathname.replace(/\/$/, '');
  return appTitles[normalizedPath] || 'App';
}; 