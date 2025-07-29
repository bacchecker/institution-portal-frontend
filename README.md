# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Running with Docker

This project includes Docker configuration for easy development setup.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Environment Configuration**

   Ensure you have a `.env.locale` file in your project root. This file will be automatically renamed to `.env` during the Docker build process.

3. **Run the application**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

   Or for detached mode:
   ```bash
   docker-compose -f docker-compose.dev.yml up --build -d
   ```

4. **Access the application**

   The application will be available at: `http://localhost:5173`

### Docker Commands

- **Start the application:**
  ```bash
  docker-compose -f docker-compose.dev.yml up
  ```

- **Stop the application:**
  ```bash
  docker-compose -f docker-compose.dev.yml down
  ```

- **Rebuild and start:**
  ```bash
  docker-compose -f docker-compose.dev.yml up --build
  ```

- **View logs:**
  ```bash
  docker-compose -f docker-compose.dev.yml logs -f
  ```

### Features

- **Hot Module Replacement (HMR):** Changes to your code will automatically reload in the browser
- **File Watching:** Uses polling for file changes to work reliably across different operating systems
- **Volume Mounting:** Your local code is mounted into the container, so changes are reflected immediately
- **Non-root User:** Runs as a non-privileged user for security

### Troubleshooting

- **Port conflicts:** If port 5173 is already in use, modify the port mapping in `docker-compose.dev.yml`
- **Permission issues:** The Docker setup uses a non-root user (`nextjs`) with appropriate permissions
- **File watching issues:** The configuration includes `CHOKIDAR_USEPOLLING=true` for reliable file watching

### Development Notes

- The application runs on port 5173 inside the container and is exposed to the same port on your host machine
- Node modules are installed in the container and cached using Docker volumes for faster rebuilds
- The `dist` folder is also mounted as a volume for build optimization