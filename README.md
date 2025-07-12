# Group Finder Frontend

This is the NextJS Frontend of the Group Finder System.

## Overview

Group Finder is a web application designed to help users find and create groups. This repository contains the frontend codebase built with NextJS, offering a modern and responsive user interface.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
Group_Finder_FE/
├── public/           # Static files
├── src/
│   ├── app/          # Next.js app router pages
│   ├── components/   # Reusable UI components
│   ├── data/         # Data models and constants
│   ├── lib/          # Utility functions and shared code
│   ├── services/     # API service implementations
│   └── store/        # Zustand state management
├── .gitignore        # Git ignore file
├── eslint.config.mjs # ESLint configuration
├── jsconfig.json     # JavaScript configuration
├── next.config.mjs   # Next.js configuration
├── package.json      # Project dependencies
└── postcss.config.mjs # PostCSS configuration
```

## Getting Started

### Prerequisites

- Node.js (version 18 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ModithaM/Group_Finder_FE.git
   cd Group_Finder_FE
   ```

2. Install dependencies:
   ```bash
   npm install
   
   ```

3. Start the development server:
   ```bash
   npm run dev
   
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Features

- User authentication and authorization
- Group creation and management
- User profile management
- Responsive design for desktop and mobile
- Real-time updates

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

Project Maintainer: [ModithaM](https://github.com/ModithaM)

---

*Last Updated: 2025-07-12*
