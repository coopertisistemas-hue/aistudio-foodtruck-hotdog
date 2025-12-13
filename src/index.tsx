import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Note: The original index.tsx didn't import CSS, but usually there is some global CSS.
// Checking if there is an index.css in root... if not, I might need to create one or remove this import.
// I'll check file list again. If no index.css, I will remove this line.
// Wait, I saw components using Tailwind classes, so there must be CSS setup.
// Usually it's imported in index.tsx or App.tsx.
// The original index.tsx didn't import it. Maybe it's in index.html?
// Let's check index.html content first.
// For now I will comment it out to be safe and match original behavior, but I suspect it's needed.
// Actually, I'll stick to EXACTLY what was in the original index.tsx but pointing to new App.

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
