# Envel - Modern Envelope Budgeting App

Envel is a modern, user-friendly envelope budgeting application built with Next.js 15, React 19, and TypeScript. It helps users manage their finances using the envelope budgeting method with a beautiful, intuitive interface.

## Features

- 🎯 Envelope-based budgeting system
- 🔄 Recurring envelope support
- 👥 Share envelopes with other users
- 🔐 Secure authentication with NextAuth.js
- 🌓 Light/Dark mode support
- 📱 Responsive design
- ⚡ Built with performance in mind using Turbopack

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** TailwindCSS
- **UI Components:** Radix UI
- **Form Handling:** React Hook Form with Zod validation
- **Authentication:** NextAuth.js
- **Date Handling:** date-fns
- **Theme:** next-themes
- **Notifications:** Sonner
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- Bun (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/envel.git
   cd envel
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

3. Set up your environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   # Add your environment variables here
   ```

4. Run the development server:
   ```bash
   bun run dev
   # or
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses a relational database with the following main tables:

- `users`: User account information
- `envelopes`: Budget envelopes
- `envelope_amounts`: Amount allocations for envelopes
- `entries`: Transaction entries
- `categories`: Transaction categories
- `shared_envelopes`: Shared envelope permissions
- `share_requests`: Envelope sharing requests

For detailed schema information, see [database.md](database.md).

## Development

- `bun run dev`: Start the development server with Turbopack
- `bun run build`: Build the application for production
- `bun run start`: Start the production server
- `bun run lint`: Run ESLint for code linting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
