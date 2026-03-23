// Theme management utility
export const getTheme = () => {
  const saved = localStorage.getItem('theme');
  return saved || 'light';
};

export const setTheme = (theme) => {
  localStorage.setItem('theme', theme);
  applyTheme(theme);
};

export const toggleTheme = () => {
  const current = getTheme();
  const newTheme = current === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
};

export const applyTheme = (theme) => {
  const root = document.documentElement;
  root.dataset.theme = theme;
  
  if (theme === 'dark') {
    root.style.colorScheme = "dark";
    root.style.setProperty('--bg', '#0f1419');
    root.style.setProperty('--bg-card', 'rgba(26, 31, 46, 0.92)');
    root.style.setProperty('--bg-hover', '#242a3a');
    root.style.setProperty('--card', '#1a1f2e');
    root.style.setProperty('--text', '#f4f7fb');
    root.style.setProperty('--text-light', '#ffffff');
    root.style.setProperty('--text-muted', '#a8b2c5');
    root.style.setProperty('--text-placeholder', '#7a8292');
    root.style.setProperty('--border', '#292f3f');
    root.style.setProperty('--border-light', '#1f2430');
    root.style.setProperty('--navy', '#dbe7f3');
    root.style.setProperty('--surface-strong', 'rgba(20, 25, 39, 0.94)');
    root.style.setProperty('--surface-soft', 'rgba(26, 31, 46, 0.76)');
    root.style.setProperty('--surface-muted', 'rgba(36, 42, 58, 0.84)');
    root.style.setProperty('--hover-light-bg', 'rgba(141, 187, 1, 0.18)');
    root.style.setProperty('--text-on-light-hover', '#0f1720');
    root.style.setProperty('--field-bg', '#ffffff');
    root.style.setProperty('--field-text', '#111111');
    root.style.setProperty('--field-placeholder', '#6b7280');
    root.style.setProperty('--page-gradient', 'radial-gradient(circle at top left, rgba(141,187,1,0.08), transparent 22%), linear-gradient(180deg, #111722 0%, #0f1419 100%)');
    root.style.setProperty('--shadow', '0 18px 48px rgba(0, 0, 0, 0.32)');
    root.style.setProperty('--shadow-sm', '0 6px 18px rgba(0, 0, 0, 0.22)');
    root.style.setProperty('--shadow-lg', '0 32px 72px rgba(0, 0, 0, 0.4)');
  } else {
    root.style.colorScheme = "light";
    root.style.setProperty('--bg', '#f8f9fa');
    root.style.setProperty('--bg-card', 'rgba(255, 255, 255, 0.92)');
    root.style.setProperty('--bg-hover', '#fafbfc');
    root.style.setProperty('--card', '#ffffff');
    root.style.setProperty('--text', '#0B1220');
    root.style.setProperty('--text-light', '#ffffff');
    root.style.setProperty('--text-muted', '#7a8292');
    root.style.setProperty('--text-placeholder', '#a8b2c5');
    root.style.setProperty('--border', '#e8e9ec');
    root.style.setProperty('--border-light', '#f0f1f4');
    root.style.setProperty('--navy', '#0c3a57');
    root.style.setProperty('--surface-strong', 'rgba(255, 255, 255, 0.94)');
    root.style.setProperty('--surface-soft', 'rgba(255, 255, 255, 0.76)');
    root.style.setProperty('--surface-muted', 'rgba(244, 245, 242, 0.84)');
    root.style.setProperty('--hover-light-bg', '#f3f5f0');
    root.style.setProperty('--text-on-light-hover', '#0f1720');
    root.style.setProperty('--field-bg', '#ffffff');
    root.style.setProperty('--field-text', '#111111');
    root.style.setProperty('--field-placeholder', '#6b7280');
    root.style.setProperty('--page-gradient', 'radial-gradient(circle at top left, rgba(141,187,1,0.06), transparent 22%), linear-gradient(180deg, #efefec 0%, #ececeb 100%)');
    root.style.setProperty('--shadow', '0 18px 48px rgba(15, 19, 15, 0.1)');
    root.style.setProperty('--shadow-sm', '0 6px 18px rgba(15, 19, 15, 0.06)');
    root.style.setProperty('--shadow-lg', '0 32px 72px rgba(15, 19, 15, 0.14)');
  }
};

// Initialize theme on app load
export const initializeTheme = () => {
  const theme = getTheme();
  applyTheme(theme);
};
