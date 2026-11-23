import { StrictMode, Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource-variable/manrope';
import './styles/app.css';
import App from './App.jsx';
import { registerServiceWorker } from './services/pwa.js';

// The new narrative mode is a separate prototype, loaded only when opened.
const AdventureApp = lazy(() => import('./adventure/AdventureApp.jsx'));

const isAdventure = () => window.location.hash.startsWith('#adventure');

function Root() {
  const [adventure, setAdventure] = useState(isAdventure);
  useEffect(() => {
    const onHash = () => {
      setAdventure(isAdventure());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  if (!adventure) return <App />;
  return (
    <Suspense fallback={<div className="adv-loading">Packing your suitcase…</div>}>
      <AdventureApp onExit={() => (window.location.hash = '')} />
    </Suspense>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);

registerServiceWorker();
