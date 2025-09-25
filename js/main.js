/**
 * Main application entry point
 */

import { config } from './config.js';
import { authManager } from './modules/auth.js';
import { createSyncManager } from './modules/sync.js';

// Global app state
window.app = {
  auth: authManager,
  sync: null,
  state: {
    clients: [],
    quotes: { raw: '', list: [] },
    quotesSettings: { interval: 15, random: true, norepeat: true, recent: [] }
  }
};

/**
 * Initialize the application
 */
async function initApp() {
  console.log('🚀 Initializing modular Hotlist app...');

  // Check if Supabase library is loaded
  if (!window.supabase || !window.supabase.createClient) {
    console.error('Supabase library not loaded. Please include the Supabase script.');
    return;
  }

  // Initialize auth manager
  await authManager.init(config.supabase.url, config.supabase.anonKey);

  // Create sync manager
  window.app.sync = createSyncManager(authManager);

  // Subscribe to auth changes
  authManager.subscribe(async (event, user) => {
    console.log('Auth event:', event, user?.email || 'none');

    if (event === 'user_changed') {
      if (user) {
        console.log('User logged in, handling sync...');

        // Load existing data from localStorage first
        const localData = loadLocalData();

        // Handle initial sync with cloud
        const syncedData = await window.app.sync.handleInitialSync(localData);

        if (syncedData) {
          window.app.state = syncedData;
          saveLocalData(syncedData);
          updateUI();
        }

        // Start periodic sync
        window.app.sync.startPeriodicSync(() => window.app.state, config.sync.interval);

        // Update UI elements
        updateAuthUI(true);

      } else {
        console.log('User logged out');

        // Stop periodic sync
        window.app.sync.stopPeriodicSync();

        // Update UI
        updateAuthUI(false);
      }
    } else if (event === 'auth_error') {
      console.error('Auth error:', user.message);
      alert(user.message);
    }
  });

  // Load initial data
  loadInitialData();

  // Set up UI event handlers
  setupEventHandlers();

  console.log('✅ App initialization complete');
}

/**
 * Load data from localStorage
 */
function loadLocalData() {
  try {
    const stored = localStorage.getItem(config.storage.key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading local data:', error);
  }
  return window.app.state;
}

/**
 * Save data to localStorage
 */
function saveLocalData(data) {
  try {
    localStorage.setItem(config.storage.key, JSON.stringify(data));
    console.log('Data saved locally');
  } catch (error) {
    console.error('Error saving local data:', error);
  }
}

/**
 * Save current state (local + cloud)
 */
async function saveState() {
  // Save locally first
  saveLocalData(window.app.state);

  // Then save to cloud if authenticated
  if (authManager.isSyncEnabled()) {
    await window.app.sync.saveToCloud(window.app.state);
  }
}

/**
 * Load initial data on page load
 */
function loadInitialData() {
  const localData = loadLocalData();
  if (localData) {
    window.app.state = localData;
    updateUI();
  }
}

/**
 * Update auth UI elements
 */
function updateAuthUI(isAuthenticated) {
  const authStatus = document.getElementById('authStatus');
  const teamsLink = document.getElementById('teamsLink');
  const teamsSeparator = document.getElementById('teamsSeparator');
  const signInBtn = document.getElementById('signInBtn');
  const signOutBtn = document.getElementById('signOutBtn');

  if (authStatus) {
    if (isAuthenticated) {
      const user = authManager.getUserInfo();
      authStatus.textContent = `Signed in as ${user.email}`;
      authStatus.style.color = 'var(--green)';
    } else {
      authStatus.textContent = 'Not signed in';
      authStatus.style.color = 'var(--muted)';
    }
  }

  if (teamsLink) {
    teamsLink.style.display = isAuthenticated ? 'inline' : 'none';
  }

  if (teamsSeparator) {
    teamsSeparator.style.display = isAuthenticated ? 'inline' : 'none';
  }

  if (signInBtn) {
    signInBtn.style.display = isAuthenticated ? 'none' : 'inline-block';
  }

  if (signOutBtn) {
    signOutBtn.style.display = isAuthenticated ? 'inline-block' : 'none';
  }
}

/**
 * Update main UI (placeholder - implement based on your needs)
 */
function updateUI() {
  console.log('Updating UI with', window.app.state.clients?.length || 0, 'clients');
  // This will call into your existing render logic
  if (window.render) {
    window.render();
  }
}

/**
 * Set up UI event handlers
 */
function setupEventHandlers() {
  // Sign in button
  const signInBtn = document.getElementById('signInBtn');
  if (signInBtn) {
    signInBtn.addEventListener('click', async () => {
      try {
        await authManager.signInWithOAuth('google');
      } catch (error) {
        console.error('Sign in failed:', error);
        alert('Sign in failed. Please try again.');
      }
    });
  }

  // Sign out button
  const signOutBtn = document.getElementById('signOutBtn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to sign out?')) {
        await authManager.signOut();
      }
    });
  }
}

// Debug functions for console
window.debugAuth = async () => {
  console.log('=== AUTH DEBUG ===');
  console.log('Authenticated:', authManager.isAuthenticated());
  console.log('User:', authManager.getUserInfo());
  console.log('Sync enabled:', authManager.isSyncEnabled());

  const session = await authManager.getSession();
  console.log('Session:', session ? 'Active' : 'None');

  return authManager.getUserInfo();
};

window.debugSync = async () => {
  console.log('=== SYNC DEBUG ===');
  const status = window.app.sync.getSyncStatus();
  console.log('Sync status:', status);

  if (authManager.isAuthenticated()) {
    const cloudData = await window.app.sync.loadFromCloud();
    console.log('Cloud data:', cloudData ? `${cloudData.clients?.length || 0} clients` : 'None');
  }

  return status;
};

window.restoreSession = async () => {
  console.log('Manually checking for existing session...');
  await authManager.checkExistingSession();
  return authManager.isAuthenticated();
};

// Make saveState globally available for your existing code
window.saveState = saveState;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

export { initApp, saveState };