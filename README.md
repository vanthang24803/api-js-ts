# Node.js MongoDB API Boilerplate

This is a Node.js API boilerplate project using MongoDB, TypeScript, Babel, Prettier, ESLint, Husky, Lint-Staged, and Jest.

## Features

- **MongoDB**: Used as the database.
- **TypeScript**: Provides static typing and better tooling.
- **Babel**: Transpile modern JavaScript for compatibility.
- **Prettier**: Ensures consistent code formatting.
- **ESLint**: Enforces code style and best practices.
- **Husky**: Manages Git hooks.
- **Lint-Staged**: Runs linters on Git staged files.
- **Jest**: Used for writing unit tests.

## Project Structure

- **`src/`**: Main source code directory.
  - **`configs/`**: Configuration files.
  - **`controllers/`**: API controller files.
  - **`middlewares/`**: Middleware functions and logic.
  - **`modules/`**: Business logic and service modules.
  - **`types/`**: TypeScript type definitions.
- **`tests/`**: Contains test files.
- **`package.json`**: Contains project metadata and dependencies.
- **`.babelrc`**: Babel configuration file.
- **`.eslintrc.js`**: ESLint configuration file.
- **`.prettierrc.js`**: Prettier configuration file.
- **`jest.config.js`**: Jest configuration file.
- **`tsconfig.json`**: TypeScript configuration file.

## Getting Started

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Setup environment variables:**

   Create a `.env` file in the root directory and configure the necessary environment variables.

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Build for production:**

   ```bash
   npm run build
   ```

6. **Start the production server:**

   ```bash
   npm start
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
