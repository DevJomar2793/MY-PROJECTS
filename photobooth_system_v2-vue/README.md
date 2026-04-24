# Photobooth System v2 📸

A modern, web-based photobooth application built with Vue 3 and Vite. This application allows users to capture, review, and manage photos directly from their browser.

## Features ✨

*   **Interactive Camera UI**: Real-time camera feed and photo capture functionality.
*   **Photo Gallery**: View and manage previously captured photos.
*   **Theming**: Support for Light and Dark modes for a better user experience.
*   **Responsive Design**: Built with Bootstrap 5 to ensure a seamless experience across different devices.
*   **Fast Performance**: Powered by Vite for lightning-fast Hot Module Replacement (HMR) and optimized builds.

## Tech Stack 🛠️

*   [Vue 3](https://vuejs.org/) - The Progressive JavaScript Framework
*   [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
*   [Vue Router 4](https://router.vuejs.org/) - Official router for Vue.js
*   [Bootstrap 5](https://getbootstrap.com/) - Responsive CSS framework

## Getting Started 🚀

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1.  Clone the repository or download the source code.
2.  Navigate to the project directory:
    ```bash
    cd photobooth_system_v2-vue
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

Start the development server with HMR:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure 📁

```
photobooth_system_v2-vue/
├── src/
│   ├── assets/       # Static assets (images, global css)
│   ├── components/   # Reusable Vue components
│   ├── services/     # API integration and service logic
│   ├── views/        # Page components (Index, Gallery, etc.)
│   ├── App.vue       # Root component
│   └── main.js       # Application entry point
├── static/           # Public static files
├── index.html        # Main HTML file
├── package.json      # Project metadata and dependencies
└── vite.config.js    # Vite configuration
```
