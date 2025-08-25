'use client';

import { useEffect, useRef, useState } from 'react';
import Globe from 'globe.gl';
import { gsap } from 'gsap';
import './GlobeComponent.css';
import { projectsApi, Project } from '../../../../apis/earthmap/projectsApi';

export default function GlobeComponent() {
  const mountRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [hasError, setHasError] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectsData = await projectsApi.getPublicProjects();
        setProjects(projectsData);
        console.log('Projects loaded:', projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    // Only initialize globe when projects data is loaded
    if (loading || projects.length === 0) {
      console.log('Waiting for projects data...');
      return;
    }

    console.log('Initializing Globe with projects:', projects.length);
    
    const initGlobe = () => {
      if (!mountRef.current) {
        console.log('mountRef.current is null');
        return;
      }
      
      console.log('Starting Globe.gl setup...');
      
      try {
        // Create globe instance with transparent background
        const globe = new Globe(mountRef.current!)
          .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg')
          .backgroundImageUrl(null)
          .backgroundColor('rgba(0,0,0,0)')
          .showAtmosphere(true)
          .atmosphereColor('#00ffff')
          .atmosphereAltitude(0.2)
          .enablePointerInteraction(true)
          .width(window.innerWidth)
          .height(window.innerHeight);

        globeRef.current = globe;
        console.log('Globe mounted successfully');

        // Auto-rotate
        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = 0.5;

        // Fetch countries data and setup hexPolygons
        console.log('Fetching countries data...');
        fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
          .then(res => {
            console.log('Fetch response status:', res.status);
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(countries => {
            console.log('Countries data loaded:', countries?.features?.length || 0, 'countries');
            
            if (countries?.features?.length > 0) {
              globe
                .hexPolygonsData(countries.features)
                .hexPolygonResolution(3)
                .hexPolygonMargin(0.3)
                .hexPolygonUseDots(true)
                .hexPolygonColor(({ properties }: any) => {
                  // Black theme with neon highlights
                  const country = properties?.ADMIN || properties?.NAME || '';
                  if (country === 'Vietnam' || country === 'Viet Nam') {
                    return 'gray';
                  }
                  // Dark countries
                  return 'gray';
                })
                .polygonLabel(({ properties }: any) => `
                  <b>${properties?.ADMIN || 'Unknown'} (${properties?.ISO_A2 || 'N/A'})</b> <br />
                  Population: <i>${properties?.POP_EST?.toLocaleString() || 'N/A'}</i><br />
                  Continent: <i>${properties?.CONTINENT || 'Unknown'}</i>
                `);
                
              console.log('HexPolygons configured successfully');
              
              // Transform projects data for globe display
              const projectsData = projects.map((project) => {
                // Construct logo URL
                const logoUrl = project.logo && 
                               !project.logo.includes('fakepath') && 
                               !project.logo.startsWith('C:') && 
                               project.logo.trim() !== ''
                  ? project.logo.startsWith('/uploads') 
                    ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${project.logo}`
                    : project.logo
                  : null;

                return {
                  lat: project.lat,
                  lng: project.lng,
                  size: project.size,
                  color: '#00ffff',
                  name: project.projectName,
                  description: project.description,
                  image: logoUrl,
                  xLink: project.xLink,
                  status: project.isActive ? 'Active' : 'Inactive',
                  id: project.id
                };
              });
              
              console.log('Projects markers data:', projectsData);
              console.log('Adding', projectsData.length, 'markers to Globe');
              
              // Add logo markers as HTML elements
              globe
                .htmlElementsData(projectsData)
                .htmlElement((d: any) => {
                  console.log('Creating HTML element for:', d.name, 'with image:', d.image);
                  
                  const el = document.createElement('div');
                  const size = Math.max(50, d.size * 100);
                  
                  el.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    cursor: pointer;
                    border: 1px solid rgba(0, 255, 255, 0.6);
                    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
                    overflow: hidden;
                    background: linear-gradient(135deg, #1f2937, #374151);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: ${Math.max(10, size * 0.2)}px;
                    font-weight: 700;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
                    transform: translate(-50%, -50%);
                    pointer-events: auto;
                  `;

                  // Store project data in element
                  el.setAttribute('data-project-id', d.id);
                  el.setAttribute('data-project-name', d.name);

                  // Add logo image if available
                  if (d.image) {
                    const img = document.createElement('img');
                    img.src = d.image;
                    img.style.cssText = `
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                      border-radius: 50%;
                      pointer-events: none;
                    `;
                    img.onerror = () => {
                      el.textContent = d.name.substring(0, 3).toUpperCase();
                    };
                    el.appendChild(img);
                  } else {
                    el.textContent = d.name.substring(0, 3).toUpperCase();
                  }

                  // Add click handler
                  el.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Logo clicked, target:', e.target);
                    
                    // Get project ID from clicked element or its parent
                    let targetEl = e.target as HTMLElement;
                    while (targetEl && !targetEl.getAttribute('data-project-id')) {
                      targetEl = targetEl.parentElement as HTMLElement;
                    }
                    
                    if (targetEl) {
                      const projectId = targetEl.getAttribute('data-project-id');
                      const projectName = targetEl.getAttribute('data-project-name');
                      console.log('Found project ID:', projectId, 'Name:', projectName);
                      
                      // Find the corresponding project from projectsData
                      const project = projectsData.find(p => p.id === projectId);
                      console.log('Found project:', project);
                      
                      if (project) {
                        setSelectedProject(project);
                      }
                    } else {
                      console.error('Could not find project data in clicked element');
                    }
                  });

                  // Add hover effects
                  el.addEventListener('mouseenter', () => {
                    el.style.transform = 'translate(-50%, -50%) scale(1.2)';
                    el.style.borderWidth = '2px';
                    el.style.borderColor = 'rgba(0, 255, 255, 1)';
                    el.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.6)';
                  });

                  el.addEventListener('mouseleave', () => {
                    el.style.transform = 'translate(-50%, -50%) scale(1)';
                    el.style.borderWidth = '1px';
                    el.style.borderColor = 'rgba(0, 255, 255, 0.6)';
                    el.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.3)';
                  });

                  return el;
                })
                .htmlAltitude(0.01);

              // Find HTC-Studio as main hub
              const htcProject = projectsData.find(p => 
                p.name.toLowerCase().includes('htc') || 
                p.name.toLowerCase().includes('studio')
              );
              
              // Create connection arcs from all projects to HTC-Studio
              const arcsData: Array<{
                startLat: number;
                startLng: number;
                endLat: number;
                endLng: number;
                color: string;
                name?: string;
              }> = [];
              if (htcProject) {
                console.log('Found HTC hub project:', htcProject.name);
                
                projectsData.forEach(project => {
                  // Don't create arc from HTC to itself
                  if (project.id !== htcProject.id) {
                    arcsData.push({
                      startLat: project.lat,
                      startLng: project.lng,
                      endLat: htcProject.lat,
                      endLng: htcProject.lng,
                      color: 'rgba(0, 255, 255, 0.8)',
                      name: `${project.name} → ${htcProject.name}`
                    });
                  }
                });
                
                console.log('Created', arcsData.length, 'arcs connecting to HTC hub');
              } else {
                console.log('HTC hub not found, using mesh connection');
                // Fallback: connect all to first project if HTC not found
                const hubProject = projectsData[0];
                projectsData.slice(1).forEach(project => {
                  arcsData.push({
                    startLat: project.lat,
                    startLng: project.lng,
                    endLat: hubProject.lat,
                    endLng: hubProject.lng,
                    color: 'rgba(0, 255, 255, 0.8)'
                  });
                });
              }

              // Add animated arcs connecting projects
              globe
                .arcsData(arcsData)
                .arcColor('color')
                .arcDashLength(0.4)
                .arcDashGap(0.2)
                .arcDashAnimateTime(2000)
                .arcStroke(0.8)
                .arcAltitude(0.4)
                .arcAltitudeAutoScale(0.6);
            } else {
              console.error('No countries data found');
            }
          })
          .catch(error => {
            console.error('Failed to load countries data:', error);
            console.log('Globe will remain visible without hex polygons');
          });

        // Handle resize
        const handleResize = () => {
          if (globeRef.current && mountRef.current) {
            const rect = mountRef.current.getBoundingClientRect();
            globeRef.current.width(rect.width).height(rect.height);
          }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        console.log('Globe.gl setup complete');

        // Cleanup
        return () => {
          window.removeEventListener('resize', handleResize);
          // Remove overlay markers
          const markers = document.querySelectorAll('.project-marker');
          markers.forEach(marker => marker.remove());
          
          if (globeRef.current) {
            // Globe.gl cleanup
            globeRef.current._destructor?.();
          }
        };
        
      } catch (error) {
        console.error('Globe.gl setup failed:', error);
        setHasError(true);
      }
    };
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(initGlobe, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, [loading, projects]);

  if (hasError) {
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', zIndex: 999}}>
        Failed to load Globe. Check console for errors.
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', zIndex: 999}}>
        <div style={{textAlign: 'center'}}>
          <div style={{marginBottom: '10px'}}>Loading Projects...</div>
          <div style={{fontSize: '12px', opacity: 0.7}}>Please wait while we fetch the latest data</div>
        </div>
      </div>
    );
  }

  console.log('Rendering GlobeComponent, selectedProject:', selectedProject);

  return (
    <>
      <div ref={mountRef} style={{width: '100%', height: '100%'}} />
      
      {/* Project Detail Modal */}
      {selectedProject && (
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          animation: 'modalFadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(15,15,35,0.98) 0%, rgba(25,25,45,0.98) 50%, rgba(35,35,55,0.98) 100%)',
            backdropFilter: 'blur(25px)',
            borderRadius: '20px',
            padding: '30px',
            width: '340px',
            border: '1px solid rgba(0,255,255,0.2)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(0,255,255,0.1)',
            animation: 'modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              style={{
                position: 'absolute',
                top: '15px', right: '15px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                width: '32px', height: '32px',
                cursor: 'pointer',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Project Image */}
            <div style={{
              width: '100%',
              height: '160px',
              borderRadius: '16px',
              background: selectedProject.image 
                ? `url('${selectedProject.image}') center/cover`
                : 'linear-gradient(135deg, #1f2937, #374151)',
              marginBottom: '20px',
              border: '1px solid rgba(0,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '14px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {!selectedProject.image && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                  <span>No Image</span>
                </div>
              )}
            </div>

            {/* Project Info */}
            <h3 style={{
              fontSize: '22px',
              fontWeight: '800',
              marginBottom: '12px',
              background: 'linear-gradient(135deg, #ffffff, #e0e7ff, #c7d2fe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              letterSpacing: '0.5px'
            }}>{selectedProject.name}</h3>

            <p style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '14px',
              lineHeight: '1.6',
              marginBottom: '20px',
              textAlign: 'center',
              padding: '0 8px'
            }}>{selectedProject.description}</p>

            {/* Status and Category */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', justifyContent: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                padding: '8px 16px',
                borderRadius: '20px',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                ✓ {selectedProject.status}
              </div>
            </div>


            {/* X/Twitter Link */}
            {selectedProject.xLink && (
              <div style={{ textAlign: 'center' }}>
                <a 
                  href={selectedProject.xLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    background: 'linear-gradient(135deg, #000000, #1a1a1a)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '25px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Visit on X
                </a>
              </div>
            )}
          </div>
        </div>
      )}

    </>
  );
}