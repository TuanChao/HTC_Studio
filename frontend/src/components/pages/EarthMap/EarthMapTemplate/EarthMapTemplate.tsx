import React from 'react';
import EarthMapSection from '../EarthMapOrganisms/EarthMapSection';

interface EarthMapTemplateProps {
  className?: string;
}

export default function EarthMapTemplate({ className }: EarthMapTemplateProps) {
  return (
    <div className={className}>
      <EarthMapSection />
    </div>
  );
}