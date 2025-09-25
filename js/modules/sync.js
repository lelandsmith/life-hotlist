/**
 * Data Sync Module - Handles Supabase data synchronization
 */

export class SyncManager {
  constructor(authManager) {
    this.auth = authManager;
    this.syncInterval = null;
    this.lastSyncTime = null;
  }

  /**
   * Save data to Supabase
   */
  async saveToCloud(data) {
    if (!this.auth.isSyncEnabled()) {
      console.log('Sync not enabled, skipping cloud save');
      return false;
    }

    const user = this.auth.getUserInfo();
    if (!user) {
      console.log('No user, cannot save to cloud');
      return false;
    }

    try {
      console.log('Saving to cloud for user:', user.email);

      const { error } = await this.auth.supabase
        .from('hotlist_data')
        .upsert({
          user_id: user.id,
          data: JSON.stringify(data),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Cloud save error:', error);
        if (error.message && error.message.includes('hotlist_data')) {
          console.error('Table may not exist. Run setup SQL in Supabase.');
        }
        return false;
      }

      this.lastSyncTime = new Date();
      console.log('Cloud saved successfully at:', this.lastSyncTime.toLocaleTimeString());
      return true;

    } catch (error) {
      console.error('Cloud save failed:', error);
      return false;
    }
  }

  /**
   * Load data from Supabase
   */
  async loadFromCloud() {
    if (!this.auth.isAuthenticated()) {
      console.log('Not authenticated, cannot load from cloud');
      return null;
    }

    const user = this.auth.getUserInfo();
    if (!user) return null;

    try {
      console.log('Loading from cloud for user:', user.email);

      const { data, error } = await this.auth.supabase
        .from('hotlist_data')
        .select('data, updated_at')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No cloud data found for user');
        } else {
          console.error('Cloud load error:', error);
        }
        return null;
      }

      if (data && data.data) {
        const parsedData = JSON.parse(data.data);
        console.log('Cloud data loaded:', {
          clients: parsedData.clients?.length || 0,
          updated: data.updated_at
        });
        return parsedData;
      }

      return null;

    } catch (error) {
      console.error('Cloud load failed:', error);
      return null;
    }
  }

  /**
   * Handle initial sync when user signs in
   */
  async handleInitialSync(localData) {
    console.log('Handling initial sync...');

    if (!this.auth.isAuthenticated()) {
      console.log('Not authenticated, skipping initial sync');
      return localData;
    }

    try {
      // Load cloud data
      const cloudData = await this.loadFromCloud();

      if (cloudData && Object.keys(cloudData).length > 0) {
        // Cloud has data - use it as source of truth
        console.log('Using cloud data as source of truth');
        return cloudData;
      } else {
        // No cloud data - migrate local data if it exists
        console.log('No cloud data found');

        if (localData && localData.clients && localData.clients.length > 0) {
          console.log('Migrating local data to cloud:', localData.clients.length, 'clients');
          await this.saveToCloud(localData);
        }

        return localData;
      }
    } catch (error) {
      console.error('Initial sync failed:', error);
      return localData;
    }
  }

  /**
   * Set up periodic sync
   */
  startPeriodicSync(saveCallback, interval = 30000) {
    this.stopPeriodicSync();

    if (!this.auth.isSyncEnabled()) {
      console.log('Sync not enabled, not starting periodic sync');
      return;
    }

    console.log('Starting periodic sync every', interval / 1000, 'seconds');

    this.syncInterval = setInterval(() => {
      if (this.auth.isSyncEnabled()) {
        const data = saveCallback();
        if (data) {
          this.saveToCloud(data);
        }
      }
    }, interval);
  }

  /**
   * Stop periodic sync
   */
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('Periodic sync stopped');
    }
  }

  /**
   * Track activity metrics
   */
  async trackActivity(activityType, value = 1) {
    if (!this.auth.isAuthenticated()) return;

    const user = this.auth.getUserInfo();
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      // Check for existing metric
      const { data: existing } = await this.auth.supabase
        .from('activity_metrics')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .eq('activity_type', activityType)
        .single();

      if (existing) {
        // Update existing
        await this.auth.supabase
          .from('activity_metrics')
          .update({
            count: existing.count + value,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        // Create new
        await this.auth.supabase
          .from('activity_metrics')
          .insert({
            user_id: user.id,
            date: today,
            activity_type: activityType,
            count: value
          });
      }

      console.log('Activity tracked:', activityType, value);
    } catch (error) {
      console.error('Failed to track activity:', error);
    }
  }

  /**
   * Log activity to feed
   */
  async logActivity(eventType, eventData) {
    if (!this.auth.isAuthenticated()) return;

    const user = this.auth.getUserInfo();
    if (!user) return;

    try {
      await this.auth.supabase
        .from('activity_feed')
        .insert({
          user_id: user.id,
          event_type: eventType,
          event_data: eventData
        });

      console.log('Activity logged:', eventType);
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return {
      enabled: this.auth.isSyncEnabled(),
      lastSync: this.lastSyncTime,
      user: this.auth.getUserInfo()
    };
  }
}

export const createSyncManager = (authManager) => new SyncManager(authManager);