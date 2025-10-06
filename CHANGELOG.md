# Changelog

All notable changes to Life Hotlist will be documented in this file.

## [2.5.5] - 2025-01-23

### Added
- **Weekly Outreach Tab**: New "Week" tab above daily outreach showing unique people reached this week
  - Click tab to see detailed breakdown of weekly outreach
  - Modal shows all people contacted with call/message counts and current status
  - Week starts on Sunday, tracks unique contacts
- **Quill WYSIWYG Editor**: Rich text editing for Context Notes
  - Full formatting toolbar with headers, font sizes, bold/italic/underline/strike
  - Support for lists, colors, links, and images
  - Default font size 15px with 1.8 line height
  - HTML content storage for rich formatting
- **Auto-unarchive Scheduled Clients**: Archived clients automatically return to active list when scheduled date arrives
  - Scheduled clients appear in "Scheduled" section, not in main active list
  - When follow-up date passes, archived clients are automatically unarchived
  - Seamless workflow for scheduling future follow-ups

### Fixed
- **Context Notes Modal Layout**: Fixed tabs shifting out of view when switching between tabs
  - Removed overflow from modal container, only editor scrolls
  - Added flex-shrink:0 to header and tabs to prevent layout shifting
  - Added min-height:0 to containers for proper flex layout

## [2.5.4] - 2025-01-23

### Added
- **Context Notes System**: Completely redesigned Essential Questions into flexible Context Notes
  - Renamed from Essential Questions to Context Notes with new 📝 icon
  - Tabbed interface supporting up to 10 notes per context
  - Each tab has editable title and content area
  - Add new tabs with green "+ Add Note" button
  - Delete tabs with × button (minimum 1 tab required)
  - Auto-save functionality - changes save as you type
  - Larger modal width (85% default, expandable to 95%)
  - Expand/Collapse button for width control
  - Perfect for scripts, questions, templates, and reference material
- **Context-Specific Defaults**: Life context now includes two default tabs
  - "Life App Questions" tab with essential application questions
  - "Script" tab for sales scripts and talking points
  - Other contexts get single "Essential Questions" tab
- **Data Migration**: Automatic migration from old Essential Questions format

### Changed
- Modal width increased from 700px to 1200px max width (85% viewport)
- Text area height increased to 400px for better editing experience

## [2.5.3] - 2025-01-23

### Added
- **Interaction History Display**: Shows last 5 interactions with timestamps when editing client notes
  - Displays below notes textarea in a subtle, glanceable format
  - Shows "today's time" for today, "Yesterday" for yesterday, or "MM/DD/YY" for older dates
  - Only appears when client has interaction history
  - Provides quick context on recent client activity

## [2.5.2] - 2025-01-23

### Fixed
- **Edit Icon Visibility for Client Names**: Fixed edit pencil icon display when notes are open
  - Changed from absolute positioning to inline-block display for proper visibility
  - Modified name anchor link to use inline-block with calculated width to allow space for edit icon
  - Edit pencil icon (✏️) now correctly appears when hovering over client names while notes are open
  - Improved CSS specificity for better cross-browser compatibility

## [2.5.1] - 2025-01-23

### Added
- **Client Name Hyperlinks**: Client names now link to Country Passport Navigator search
  - Opens in new tab with client name pre-populated in search
  - Preserves all styling - only cursor changes on hover
  - URL-encodes names for proper special character handling

## [2.5.0] - 2025-01-23

### Added
- **Calendar Integration**: Multiple calendar methods for creating follow-up events
  - Support for Google Calendar, Outlook Calendar, and ICS file download
  - User preference setting in Settings widget
  - Default to Outlook Calendar for follow-up scheduling
- **Enter Key Note Editing**: Improved keyboard shortcuts for notes
  - Press Enter on selected row to open note editing
  - Press Enter while editing to save and close notes
  - Click on notes preview to edit
  - Added blur event saving for better reliability

### Fixed
- **Context Persistence Issue**: Fixed critical bug where home and auto context clients would disappear
  - Added context validation functions to detect and repair missing contexts
  - Automatic repair of existing corrupted data on startup
  - Protection against future context loss with proactive monitoring
- **Notes Saving Issue**: Fixed notes not saving properly or reverting to older versions
  - Implemented debounced saving (500ms after typing stops)
  - Added immediate save on Enter key and blur events
  - Prevents race conditions from rapid consecutive saves
  - Console logging for debugging save operations

### Changed
- **Filters Widget**: Renamed to "Settings" for clarity
- **Follow-up Scheduling**: Default date now 2 days from current date instead of today
- **Quote Display**: Increased font size from 15px to 18px for better readability

### Removed
- **Add All to Calendar**: Disabled bulk calendar event creation due to browser popup blocking

## [1.8.7] - 2025-01-17

### Fixed
- **Windows PWA Icon**: Reverted to emoji-based fire icon for better Windows compatibility
  - Windows PWA installations now properly show fire emoji instead of "L"
  - Added rounded corners to icon background for modern appearance
  - Removed custom SVG icon files that weren't rendering on Windows

## [1.8.6] - 2025-01-17

### Changed
- **Favicon Revert**: Reverted browser favicon to emoji fire icon for better visibility
  - Kept custom SVG fire icons for PWA installation
  - Browser tab shows emoji fire, PWA uses custom graphics

## [1.8.5] - 2025-01-17

### Added
- **Custom Fire Icon**: Created stylized SVG fire icon for PWA installation
  - New icon-192.svg and icon-512.svg files with animated flame effect
  - Replaced emoji-based icons with professional fire graphics
  - Updated manifest.json to reference new icon files
  - Updated apple-touch-icon and favicon in index.html

## [1.8.4] - 2025-01-17

### Changed
- **Row Padding Adjustments**: Optimized spacing for both density modes
  - Comfortable mode: 8px 12px padding for better readability
  - Compact mode: 2px 8px padding for maximum space efficiency

## [1.8.3] - 2025-01-17

### Changed
- **Simplified Density Modes**: Removed ultra-compact mode, now only comfortable and compact
- **Compact Mode Enhancement**: Compact mode now hides status labels for cleaner interface
- **Removed Complexity**: Eliminated ultra-compact CSS and JavaScript logic for maintainability

### Fixed
- **Density Select Display**: Fixed issue where density dropdown wasn't showing the current selection
- **Default Density**: Ensured comfortable mode is properly set as default when no preference exists

### Removed
- **Ultra-Compact Mode**: Completely removed ultra-compact density option and all related code

## [1.8.2] - 2025-01-17

### Fixed
- **Density Setting Persistence**: Switched from localStorage to cookie-based storage for density settings
- **Ultra-Compact Status Icons**: Fixed status tracker icons shrinking after clicking in ultra-compact mode
- **Cache-Resistant Settings**: Density settings now persist through browser cache clearing and hard refreshes
- **Status Tracker Cookie Integration**: Fixed ultra-compact detection to use cookies instead of UI object
- **Ultra-Compact CSS Targeting**: Fixed CSS selectors to work without compact class in ultra-compact mode
- **Nuclear CSS Override**: Added aggressive CSS overrides with min/max sizing to prevent any status icon shrinking
- **Inline Style Force Override**: Added inline styles with !important to force ultra-compact icon sizing at render time

### Changed
- **Density Storage Method**: Replaced complex IndexedDB/localStorage density logic with simple, reliable cookies
- **Immediate Density Application**: Density settings now apply instantly on page load without async dependencies

## [1.8.1] - 2025-01-17

### Added
- **Demo Data System**: Load Demo Data button (📋) in header to add 3 sample clients
- **Clear Demo Data Section**: Prominent section above client list to remove demo clients
- **Smart Demo Detection**: Automatic detection and management of demo vs real client data

### Fixed
- **Demo Data Visibility**: Fixed issue where demo data controls weren't appearing
- **Cache Management**: Updated service worker cache version for proper deployment

### Changed
- **Demo UX Flow**: Moved clear demo functionality from header to above client list for better user experience
- **Button Positioning**: Load demo in header, clear demo above data for natural workflow

## [1.8.0] - 2024-01-16

### Added
- **Persistent Storage with IndexedDB**: Data now persists even when browser cache is cleared
- **Dual Storage Strategy**: IndexedDB as primary storage with localStorage as automatic backup
- **Storage Manager Tool**: New diagnostic page (`reset-storage.html`) for managing and debugging storage
- **Storage Test Tool**: Test page (`test-storage.html`) to verify persistence functionality
- **Re-celebration Support**: Can celebrate multiple times per day when goals are increased
- **Smart Celebration Tracking**: Tracks goal level achieved to prevent duplicate celebrations

### Fixed
- **Celebration Bug**: Fixed issue where celebration would trigger on every page refresh
- **Data Persistence**: Fixed clients disappearing after page refresh
- **Null Reference Errors**: Fixed "Cannot read properties of null" errors during initialization
- **Asynchronous Storage**: Improved handling of async storage operations
- **Database Reconnection**: Added automatic reconnection when IndexedDB connection is lost

### Changed
- **Storage Architecture**: Migrated from localStorage-only to IndexedDB + localStorage
- **Celebration Logic**: Now tracks the goal level celebrated at, not just whether celebrated
- **Error Handling**: Improved error handling with automatic fallbacks
- **Initialization**: Better initialization sequence to prevent race conditions

## [1.7.2] - Previous Release

### Features
- Daily outreach tracking with celebration animations
- Queue management (Today/Tomorrow)
- Hot client marking
- Follow-up scheduling
- Activity tracking and history
- Pipeline visualization
- Quote rotation system
- Power Hour timer
- Keyboard shortcuts
- Import/Export functionality
- PWA support with offline capabilities