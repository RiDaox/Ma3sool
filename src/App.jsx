import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen'; // Keep old if needed or delete
import HoneycombLoader from './components/HoneycombLoader';
import CustomCursor from './components/CustomCursor';
import SmoothCarousel from './scenes/SmoothCarousel';

function App() {
  const [phase, setPhase] = useState('loading');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      <CustomCursor />

      {phase === 'loading' && (
        <HoneycombLoader onComplete={() => setPhase('main')} />
      )}

      {phase === 'main' && <SmoothCarousel />}
    </>
  );
}

export default App;