# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Start Development Server
```bash
npm run dev
```
Starts live-server on localhost:3000 with auto-reload for development.

### Start Production Server
```bash
npm start
```
Starts live-server on localhost:8080 for production testing.

### Install Dependencies
```bash
npm install
```
Installs live-server (the only dependency) for local development.

### Deploy to Vercel
The project is configured for Vercel deployment via `vercel.json`. Simply push to connected Git repository or use Vercel CLI.

## Architecture Overview

### Dual Architecture System
**Life Hotlist** has evolved into a hybrid application with two architectural approaches:

1. **Original Monolithic SPA** (`index.html`) - Single file (~7,000 lines) with everything inlined
2. **New Modular Architecture** (`index-modular.html` + `js/` modules) - Separated concerns with ES6 modules

### Original Monolithic Architecture
The main `index.html` contains:
- **Storage**: Browser localStorage exclusively (keys: `hotlistStable`, `hotlistUI`)
- **State Management**: Global `state` object with reactive `preserveUIAndRender()` pattern
- **Multi-Context System**: Insurance contexts (Life, Home & Auto, Commercial, Farm, Networking)
- **Widget System**: Draggable sidebar widgets with persistence
- **Keyboard Navigation**: Comprehensive shortcuts (↑/↓, J/K, 1-6 for statuses)

### New Modular Architecture
The modular system introduces:
- **ES6 Modules**: Separated into `js/main.js`, `js/config.js`, `js/router.js`, and `js/modules/`
- **Authentication**: Supabase OAuth integration via `js/modules/auth.js`
- **Cloud Sync**: Two-way sync with Supabase via `js/modules/sync.js` 
- **Router**: Clean URL routing without .html extensions via `js/router.js`
- **Teams Feature**: Multi-user collaboration support

### Data Architecture Comparison

**Monolithic Version:**
```javascript
state = {
  clients: [],
  quotes: { raw: '', list: [] },
  // All data in single object
}
```

**Modular Version:**
```javascript
window.app = {
  auth: authManager,      // Authentication state
  sync: syncManager,      // Cloud sync manager
  state: {                // Application data
    clients: [],
    quotes: { raw: '', list: [] }
  }
}
```

### Authentication & Cloud Sync
The modular version adds:
- **Supabase Integration**: OAuth with Google, session management
- **Hybrid Storage**: localStorage + cloud sync for authenticated users
- **Data Migration**: Seamless migration from local-only to cloud-synced data
- **Teams Support**: Shared workspaces via `teams-dashboard.html`

### Storage Strategy
- **Local-First**: All data works offline via localStorage
- **Cloud Backup**: Authenticated users get automatic cloud sync every 30 seconds
- **Conflict Resolution**: Cloud data takes precedence during initial sync
- **Migration Path**: Local data automatically migrates to cloud when user signs in

### Context System Evolution
Both versions support insurance contexts with:
- Status stages and workflow progression
- Context-specific goals and KPI tracking
- Client categorization by insurance type
- Configurable icons and abbreviations

## Key Functions & Data Flow

### Client Management
- `addClient()` - Creates new client records
- `buildRow()` - Renders client rows with all UI controls
- `setStatus()` - Updates client status with history tracking
- `incrementCall/Msg()` - Activity logging with timestamps

### Rendering Pipeline
1. `render()` - Main render function triggered by state changes
2. Context filtering applied based on `currentContext`
3. UI updates via DOM manipulation (no virtual DOM)
4. Selection state preserved across renders

### Storage Functions
- `save(state)` - Persists main data to localStorage
- `saveUI(ui)` - Persists UI preferences
- `load()` - Initializes app state from localStorage

## Development Guidelines

### Adding New Features
- All JavaScript code should be added within the main IIFE in `index.html`
- Follow the existing pattern of global state mutation with `preserveUIAndRender()`
- Use the established CSS custom property system for theming
- Maintain keyboard navigation compatibility

### Context System Expansion
To add new insurance contexts:
1. Add entry to `CONTEXTS` object with stages, icons, and abbreviations
2. Update context pills in HTML
3. Add goal tracking configuration
4. Test multi-context data integrity

### Widget Development
New widgets should:
- Include `data-key` attribute for drag/drop
- Follow established `widget-head`/`widget-body` structure
- Be draggable between sidebars
- Support collapse functionality

### Performance Considerations
- DOM queries cached in `els` object
- Event delegation used for dynamic elements
- Efficient sorting algorithms for large client lists
- Debounced search functionality

## File Structure

```
/
├── index.html                 # Main SPA (contains all JS/CSS/HTML)
├── manifest.json             # PWA manifest
├── sw.js                     # Service worker
├── vercel.json              # Deployment configuration
├── package.json             # Dependencies and scripts
└── *.html                   # Test/prototype files (can be ignored)
```

## Testing & Debugging

### Demo Data System
- App detects first-time users and offers demo data
- `clearDemoData()` function for resetting
- Demo clients help test all features

### Browser Dev Tools
- State inspection via console: `state.clients`
- UI preferences: `ui`
- Storage debugging: `localStorage.getItem('hotlistStable')`

### Common Debugging Commands
```javascript
// View current state
console.log(state);

// Check UI preferences
console.log(ui);

// Clear all data (reset app)
localStorage.clear(); location.reload();

// Export data for backup
console.log(JSON.stringify(state, null, 2));
```

## Deployment Notes

### Vercel Configuration
- Configured for PWA deployment with proper headers
- Service worker and manifest caching rules in `vercel.json`
- No build process required (static files)

### PWA Installation
- Installable on desktop and mobile
- Offline functionality via service worker
- Push notification support for scheduled follow-ups

### Performance
- Entire app loads from single HTML file
- CSS and JS inlined for optimal loading
- localStorage-only persistence ensures instant startup

## Version & Updates

Current version is tracked in `VERSION` variable and `CHANGELOG` array. The app supports:
- Automatic version display
- Changelog modal for users
- Migration system for data structure changes

This architecture enables rapid development while maintaining a production-ready, installable web application with comprehensive CRM functionality.