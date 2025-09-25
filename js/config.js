/**
 * Application Configuration
 */

export const config = {
  supabase: {
    url: 'https://yoxzlejphrhtuisnptor.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlveHpsZWpwaHJodHVpc25wdG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NjIwNDIsImV4cCI6MjA3NDEzODA0Mn0.azXNn6AQQcB5iJzn7ebhAh5cSBESgKwEV2aSviX8yeY'
  },
  storage: {
    key: 'hotlistData',
    dbName: 'HotlistDB',
    dbVersion: 1
  },
  sync: {
    interval: 30000, // 30 seconds
    enabled: true
  }
};