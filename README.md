# Life Hotlist

A client relationship management tool for tracking leads and conversions.

## Features

- Client tracking with status management
- Activity logging and history
- Power hour timer for focused work sessions
- Goal tracking and streak monitoring
- Pipeline analytics and conversion rates
- Follow-up scheduling
- Today's activity queue
- Motivational quotes system
- Customizable widgets and dashboard

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   
   The app will be available at http://localhost:3000

3. For production server:
   ```bash
   npm start
   ```
   
   The app will be available at http://localhost:8080

## Usage

### Keyboard Shortcuts

- **↑/↓ or J/K**: Navigate between clients
- **1-5**: Set status (Quote, App, Signature, Medical, Purchased) 
- **A**: Log a call
- **L**: Log a message/email
- **N**: Toggle notes
- **F**: Queue for today
- **D**: Queue for tomorrow
- **U**: Undo last action

### Quick Add

Type a client name in the search box and press Enter to quickly add a new client.

## Data Storage

All data is stored locally in your browser's localStorage. Make sure to backup your data regularly by exporting if needed.