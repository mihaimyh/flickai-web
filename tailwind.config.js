export default {
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        'primary-dark': '#2563eb',
        'primary-light': '#60a5fa',
        accent: '#bef264',
        'accent-hover': '#a3e635',
        background: '#ffffff',
        surface: '#f8fafc',
        'surface-highlight': '#ffffff',
        'text-main': '#0f172a',
        'text-muted': '#64748b',
        'border-color': '#e2e8f0',
        'header-bg': 'rgba(255, 255, 255, 0.8)',
        // Dark Mode Colors
        'dark-background': '#09090b',
        'dark-surface': '#18181b',
        'dark-highlight': '#27272a',
        'dark-text': '#fafafa',
        'dark-muted': '#a1a1aa',
        'dark-border': '#27272a',
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'],
        body: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'],
      },
      borderRadius: {
        btn: '9999px',
        card: '1.5rem',
      },
      backgroundImage: {
        'gradient-hero': 'radial-gradient(circle at top right, #dbeafe 0%, transparent 40%), radial-gradient(circle at bottom left, #f0fdf4 0%, transparent 40%)',
        'gradient-hero-dark': 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
      }
    }
  },
  plugins: [],
}
