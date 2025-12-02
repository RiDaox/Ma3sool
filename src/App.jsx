import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
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
        <LoadingScreen onComplete={() => setPhase('main')} />
      )}

      {phase === 'main' && <SmoothCarousel />}
    </>
  );
}

export default App;