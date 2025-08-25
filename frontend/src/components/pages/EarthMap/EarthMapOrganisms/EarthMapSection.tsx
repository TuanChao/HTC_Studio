import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import styles from './EarthMapSection.module.css';

// Dynamically import the Globe component
const DynamicGlobe = lazy(() => import('./GlobeComponent'));

interface EarthMapSectionProps {
  className?: string;
}

export default function EarthMapSection({ className }: EarthMapSectionProps) {
  return (
    <section className={`${styles.earthMapSection} ${className || ''}`}>
      <div className={styles.content}>
        <h2 className={styles.title}>HTC studio connections</h2>
        <p className={styles.description}>
          ecosystem on HTC <br /> 
        </p>
      </div>
      <div className={styles.canvasContainer}>
        <Suspense fallback={
          <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', zIndex: 999}}>
            Loading Globe...
          </div>
        }>
          <DynamicGlobe />
        </Suspense>
      </div>
    </section>
  );
}