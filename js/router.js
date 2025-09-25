/**
 * Simple client-side router to remove .html extensions
 * Maintains exact same functionality, just cleaner URLs
 */

export class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
  }

  // Register a route
  route(path, handler) {
    this.routes[path] = handler;
    return this;
  }

  // Navigate to a path
  navigate(path, pushState = true) {
    // Remove .html extension if present
    path = path.replace('.html', '');

    // Handle teams route
    if (path === '/teams-dashboard' || path === '/teams') {
      if (pushState) {
        history.pushState(null, '', '/teams');
      }
      this.loadTeams();
      return;
    }

    // Default route
    if (pushState) {
      history.pushState(null, '', path || '/');
    }

    // Execute route handler
    const handler = this.routes[path] || this.routes['/'];
    if (handler) {
      this.currentRoute = path;
      handler();
    }
  }

  // Load teams page without .html
  async loadTeams() {
    // Check if user is authenticated
    if (!window.currentUser) {
      alert('Please sign in through the main Hotlist app.');
      this.navigate('/');
      return;
    }

    // Load teams content dynamically
    try {
      const response = await fetch('/teams-dashboard.html');
      const html = await response.text();

      // Parse and inject the content
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const content = doc.querySelector('.app');

      if (content) {
        document.getElementById('app').innerHTML = content.innerHTML;

        // Re-initialize teams functionality
        if (window.initializeTeams) {
          window.initializeTeams();
        }
      }
    } catch (error) {
      console.error('Failed to load teams page:', error);
      this.navigate('/');
    }
  }

  // Initialize router
  init() {
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname, false);
    });

    // Intercept all internal links
    document.addEventListener('click', (e) => {
      // Check if it's a link
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return; // External link or anchor
      }

      // Prevent default and use router
      e.preventDefault();
      this.navigate(href);
    });

    // Initial route
    this.navigate(window.location.pathname, false);
  }
}