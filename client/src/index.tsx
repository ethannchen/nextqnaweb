/**
 * This is the application entry point that renders the root React component.
 * It sets up the UserProvider context and mounts the main FakeStackOverflow component
 * to the DOM.
 *
 * @module index
 * @requires react-dom/client
 * @requires ./index.css
 * @requires ./components/fakestackoverflow
 * @requires ./contexts/UserContext
 */
import { createRoot } from "react-dom/client";
import "./index.css";
import FakeStackOverflow from "./components/fakestackoverflow";
import { UserProvider } from "./contexts/UserContext";

/**
 * Find the root DOM element where the React application will be mounted.
 * @constant {HTMLElement|null} container - The DOM element with id "root"
 */
const container = document.getElementById("root");

/**
 * If the root container exists, create a React root and render the application.
 * The application is wrapped in UserProvider to make user authentication context
 * available throughout the component tree.
 */
if (container) {
  /**
   * Create a React root for rendering
   * @constant {Root} root - The React root created from the container
   */
  const root = createRoot(container);

  /**
   * Render the application to the DOM.
   * The FakeStackOverflow component is wrapped in UserProvider to provide
   * user authentication context to all child components.
   */
  root.render(
    <>
      <UserProvider>
        <FakeStackOverflow />
      </UserProvider>
    </>
  );
}
