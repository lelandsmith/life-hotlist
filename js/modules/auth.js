/**
 * Authentication Module - Single source of truth for auth state
 * Handles all Supabase authentication logic
 */

export class AuthManager {
  constructor() {
    this.supabase = null;
    this.currentUser = null;
    this.syncEnabled = false;
    this.listeners = new Set();
    this.initialized = false;
  }

  /**
   * Initialize Supabase client and set up auth listeners
   */
  async init(supabaseUrl, supabaseKey) {
    if (this.initialized) {
      console.log('AuthManager already initialized');
      return;
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials not provided');
      return;
    }

    try {
      console.log('🔧 Initializing Supabase client...');
      console.log('URL:', supabaseUrl);
      console.log('Key length:', supabaseKey?.length);

      // Initialize Supabase client
      this.supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      });

      console.log('✅ Supabase client initialized');

      // Set up auth state change listener FIRST
      this.supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'no session');

        if (event === 'SIGNED_IN' && session) {
          this.setUser(session.user, true);

          // Clear URL tokens after successful auth
          if (window.location.hash && window.location.hash.includes('access_token')) {
            window.history.replaceState(null, null, window.location.pathname);
          }
        } else if (event === 'SIGNED_OUT') {
          this.setUser(null, false);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        } else if (event === 'USER_UPDATED' && session) {
          this.setUser(session.user, true);
        }
      });

      // Then check for existing session
      console.log('🔍 Checking for existing session...');
      await this.checkExistingSession();

      // Process any OAuth tokens in URL
      await this.processAuthTokens();

      this.initialized = true;
      console.log('✅ AuthManager initialization complete');
      console.log('Current user:', this.currentUser?.email || 'none');
      console.log('Sync enabled:', this.syncEnabled);

    } catch (error) {
      console.error('Failed to initialize AuthManager:', error);
    }
  }

  /**
   * Check for existing session on page load
   */
  async checkExistingSession() {
    if (!this.supabase) {
      console.log('No Supabase client, cannot check session');
      return;
    }

    try {
      console.log('Calling getSession()...');
      const { data: { session }, error } = await this.supabase.auth.getSession();

      if (error) {
        console.error('Error checking existing session:', error);
        return;
      }

      console.log('Session result:', session ? 'Found' : 'None');

      if (session && session.user) {
        console.log('🔵 Found existing session:', session.user.email);
        console.log('Session expires at:', new Date(session.expires_at * 1000));
        this.setUser(session.user, true);
      } else {
        console.log('⚠️ No existing session found');
        console.log('Checking localStorage for Supabase keys...');
        const keys = Object.keys(localStorage).filter(k => k.includes('supabase'));
        console.log('Supabase keys in localStorage:', keys);
      }
    } catch (error) {
      console.error('Failed to check existing session:', error);
    }
  }

  /**
   * Process OAuth tokens from URL
   */
  async processAuthTokens() {
    const hashString = window.location.hash.substring(1);
    const hasAuthTokens = hashString && (
      hashString.includes('access_token=') ||
      hashString.includes('error=')
    );

    if (!hasAuthTokens) return;

    console.log('Processing auth tokens from URL...');

    // Check for auth errors
    if (hashString.includes('error=')) {
      const params = new URLSearchParams(hashString);
      const errorCode = params.get('error');
      const errorDesc = params.get('error_description');

      console.error('Auth error in URL:', errorCode, errorDesc);

      // Clear error from URL
      window.history.replaceState(null, null, window.location.pathname);

      if (errorCode === 'otp_expired') {
        this.notifyListeners('auth_error', {
          message: 'Magic link expired. Please request a new one.'
        });
      } else if (errorCode === 'access_denied') {
        this.notifyListeners('auth_error', {
          message: 'Access denied. Sign-in was cancelled.'
        });
      }
      return;
    }

    // OAuth tokens will be processed by Supabase's detectSessionInUrl
    // We just need to wait for the auth state change
    console.log('OAuth tokens detected, waiting for Supabase to process...');
  }

  /**
   * Set current user and notify listeners
   */
  setUser(user, syncEnabled) {
    const userChanged = this.currentUser?.id !== user?.id;

    this.currentUser = user;
    this.syncEnabled = syncEnabled;

    // Also set global for backward compatibility
    window.currentUser = user;

    if (userChanged) {
      console.log(`User ${user ? 'logged in' : 'logged out'}:`, user?.email || 'none');
      this.notifyListeners('user_changed', user);
    }
  }

  /**
   * Sign in with OAuth provider
   */
  async signInWithOAuth(provider = 'google') {
    if (!this.supabase) {
      throw new Error('Supabase not initialized');
    }

    const redirectUrl = window.location.href.split('#')[0].split('?')[0];
    console.log('Starting OAuth with redirect URL:', redirectUrl);

    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl
      }
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign in with magic link
   */
  async signInWithEmail(email) {
    if (!this.supabase) {
      throw new Error('Supabase not initialized');
    }

    const { error } = await this.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.href,
        shouldCreateUser: true
      }
    });

    if (error) throw error;
  }

  /**
   * Sign out
   */
  async signOut() {
    if (!this.supabase) return;

    try {
      await this.supabase.auth.signOut();
      this.setUser(null, false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  /**
   * Get current session
   */
  async getSession() {
    if (!this.supabase) return null;

    const { data: { session }, error } = await this.supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    return session;
  }

  /**
   * Subscribe to auth changes
   */
  subscribe(callback) {
    this.listeners.add(callback);
    // Immediately call with current state
    callback('user_changed', this.currentUser);

    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners of auth changes
   */
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in auth listener:', error);
      }
    });
  }

  /**
   * Get user display info
   */
  getUserInfo() {
    if (!this.currentUser) return null;

    return {
      id: this.currentUser.id,
      email: this.currentUser.email,
      provider: this.currentUser.app_metadata?.provider || 'email'
    };
  }

  /**
   * Force refresh session from Supabase
   */
  async forceRefreshSession() {
    if (!this.supabase) {
      console.error('No Supabase client');
      return false;
    }

    try {
      console.log('Force refreshing session...');

      // Try to get the session
      const { data: { session }, error } = await this.supabase.auth.getSession();

      if (error) {
        console.error('Session refresh error:', error);
        return false;
      }

      if (session && session.user) {
        console.log('✅ Session found and restored:', session.user.email);
        this.setUser(session.user, true);
        return true;
      } else {
        console.log('No session to restore');

        // Try to refresh the session
        const { data: { session: refreshedSession }, error: refreshError } =
          await this.supabase.auth.refreshSession();

        if (refreshedSession && refreshedSession.user) {
          console.log('✅ Session refreshed:', refreshedSession.user.email);
          this.setUser(refreshedSession.user, true);
          return true;
        }

        return false;
      }
    } catch (error) {
      console.error('Force refresh failed:', error);
      return false;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.currentUser;
  }

  /**
   * Check if sync is enabled
   */
  isSyncEnabled() {
    return this.syncEnabled && this.isAuthenticated();
  }
}

// Create singleton instance
export const authManager = new AuthManager();