import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './RoadMapSlide.css';
import PetBanner from '../../../../assets/images/Pet_banner.png';
import chubbyseals from '../../../../assets/images/chubbyseal.jpg';
import tokenSeal from '../../../../assets/images/tokenSeal.gif';
import htcgif from '../../../../assets/images/gifbanner.gif';
import pet1 from '../../../../assets/images/Pet_1_2.jpg';
import pet2 from '../../../../assets/images/Pet_2_3.jpg';
import pet3 from '../../../../assets/images/Pet_3_2.jpg';
import pet4 from '../../../../assets/images/Pet_4_2.jpg';
import banner1 from '../../../../assets/images/Banner_1.jpg';
import banner2 from '../../../../assets/images/Banner_2.jpg';

gsap.registerPlugin(ScrollTrigger);

interface Phase {
  id: string;
  number: string;
  title: string;
  description: string;
  details: string[];
}

const phases: Phase[] = [
  {
    id: 'phase-1',
    number: 'Phase 1',
    title: 'Giai đoạn cộng đồng',
    description: 'Xây dựng cộng đồng mạnh mẽ và tạo nền tảng vững chắc cho dự án.',
    details: [
      'Xây dựng cộng đồng X , Discord , tổ chức event cho cộng đồng',
      'Phát whitelist cho các thành viên tích cực , thực sự cống hiến cho cộng đồng và vinh danh trên website quảng bá sản phẩm nghệ thuật',
      'Xây dựng mạng lưới đối tác chiến lược vững mạnh trong HTC'
    ]
  },
  {
    id: 'phase-2',
    number: 'Phase 2',
    title: 'Chubby Seal',
    description: 'Ra mắt bộ sưu tập NFT đầu tiên với tính năng và tiện ích độc đáo.',
    details: [
      'Số lượng : 999',
      'NFT dùng để sưu tập và mang tính độc quyền',
      'Được giảm giá khi mua đồ handmade',
      'Suất whitelist của các dự án mới hợp tác cùng HTC-studio trong tương lai',
      'Tham gia vào nhóm kín với chúng tôi'
    ]
  },
  {
    id: 'phase-3',
    number: 'Phase 3',
    title: 'Ra mắt sản phẩm web2',
    description: 'Phát triển và triển khai nền tảng web2 với trải nghiệm người dùng tối ưu.',
    details: [
      'Chúng tôi sẽ bán các sản phẩm ra thị trường và vươn mình ra quốc tế để đem lại doanh thu ổn định cho HTC',
      'Ưu đãi tốt cho những người sở hữu và nắm giữ NFT 50% (trên giá sản phẩm)',
      'Sản phẩm trước mắt của chúng tôi sẽ là các mặt hàng thủ công độc đáo và giới hạn.'
    ]
  },
  {
    id: 'phase-4',
    number: 'Phase 4',
    title: 'Mythic Seals',
    description: 'Ra mắt bộ sưu tập NFT thế hệ thứ hai với tính năng và tiện ích độc đáo.',
    details: [
      'Holder Chubby Seal sẽ nhận được whitelist mint 2 Mythic Seals',
      
    ]
  },
  {
    id: 'phase-5',
    number: '05',
    title: 'Token',
    description: 'Ra mắt token chính thức và xây dựng hệ sinh thái DeFi hoàn chỉnh.',
    details: [
      'IDO và listing trên các sàn giao dịch lớn',
      'Phát triển các sản phẩm DeFi (DEX, Farming)',
      'Mở rộng toàn cầu và partnerships'
    ]
  }
];

const RoadMapSlide: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    if (!wrapperRef.current || !containerRef.current) return;

    // ScrollTrigger cho scroll horizontal
    ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      pin: containerRef.current,
      onUpdate: (self) => {
        const progress = self.progress;
        const phaseIndex = Math.floor(progress * phases.length);
        const clampedIndex = Math.min(phaseIndex, phases.length - 1);
        
        // Update current phase
        setCurrentPhase(clampedIndex);
        
        // Move phases container với smooth animation
        gsap.to('.phases-list', {
          x: -clampedIndex * 20 + '%',
          duration: 0.1,
          ease: "none"
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const goToPhase = (index: number) => {
    setCurrentPhase(index);
    gsap.set('.phase-card', { className: 'phase-card' });
    gsap.set(`.phase-card-${index}`, { className: 'phase-card active' });
    gsap.to('.phases-list', {
      x: -index * 20 + '%',
      duration: 1,
      ease: "power3.inOut"
    });
  };

  return (
    <div className="roadmap-scroll-wrapper" ref={wrapperRef}>
      <div className="roadmap-container" ref={containerRef}>
      {/* Fixed Header */}
      {/* <div className="roadmap-header">
        <h1 className="roadmap-title">Lộ trình phát triển</h1>
        <p className="roadmap-subtitle">Hành trình xây dựng hệ sinh thái Web3 hoàn chỉnh</p>
      </div> */}

      {/* Horizontal Phases */}
      <div className="phases-list">
        {phases.map((phase, index) => (
          <div 
            key={phase.id} 
            className={`phase-card phase-card-${index} ${index === currentPhase ? 'active' : ''}`}
          >
            <div className="logo-under-ground"></div>
            <div className="logo-under-ground1"></div>
            <div className="logo-under-ground2"></div>
            <div className="logo-under-ground3"></div>
            <div className="phase-card-content">
              {index === 0 ? (
                // Phase 1: Details on left, image on right
                <>
                  <div className="phase-left">
                    <div className="phase-number">{phase.number}</div>
                    <h2 className="phase-title">{phase.title}</h2>
                    <p className="phase-description">{phase.description}</p>
                    <div className="phase-details">
                      {phase.details.map((detail, idx) => (
                        <div key={idx} className="detail-item">
                          <div className="detail-bullet"></div>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                    <div className="social-icons">
                      <div className="social-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </div>
                      <div className="social-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="phase-right">
                    <div className="phase-image">
                      <img src={PetBanner} alt="Pet Banner" />
                    </div>
                  </div>
                </>
              ) : index === 1 ? (
                // Phase 2: Details on left, chubbyseal image on right
                <>
                  <div className="phase-left">
                    <div className="phase-number">{phase.number}</div>
                    <h2 className="phase-title">{phase.title}</h2>
                    <p className="phase-description">{phase.description}</p>
                    <div className="phase-details">
                      {phase.details.map((detail, idx) => (
                        <div key={idx} className="detail-item">
                          <div className="detail-bullet"></div>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                    <div className="phase-gallery">
                      <img src={pet1} alt="Pet 1" className="gallery-img" />
                      <img src={pet2} alt="Pet 2" className="gallery-img" />
                      <img src={pet3} alt="Pet 3" className="gallery-img" />
                      <img src={pet4} alt="Pet 4" className="gallery-img" />
                      <img src={banner1} alt="Banner 1" className="gallery-img" />
                      <img src={banner2} alt="Banner 2" className="gallery-img" />
                    </div>
                  </div>
                  
                  <div className="phase-right">
                    <div className="phase-image">
                      <img src={chubbyseals} alt="Chubby Seal" />
                    </div>
                  </div>
                </>
              ) : index === 4 ? (
                // Phase 5: Special layout - gif on left, button on right
                <>
                  <div className="phase-content-row">
                    <div className="phase-left">
                      <div className="phase-number">{phase.number}</div>
                      <h2 className="phase-title">{phase.title}</h2>
                      <div className="phase-gif">
                        <img src={tokenSeal} alt="HTC Gif" />
                      </div>
                    </div>
                    
                    <div className="phase-right">
                      <div className="whitepaper-section">
                        <button className="whitepaper-btn">WhitePaper</button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Other phases: Details on left, tokenSeal.gif on right
                <>
                  <div className="phase-left">
                    <div className="phase-number">{phase.number}</div>
                    <h2 className="phase-title">{phase.title}</h2>
                    <p className="phase-description">{phase.description}</p>
                    <div className="phase-details">
                      {phase.details.map((detail, idx) => (
                        <div key={idx} className="detail-item">
                          <div className="detail-bullet"></div>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="phase-right">
                    <div className="phase-image">
                      <img src={tokenSeal} alt="Token Seal" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="nav-dots" style={{ '--progress': currentPhase } as React.CSSProperties}>
        {phases.map((_, index) => (
          <div 
            key={index}
            className={`nav-dot ${
              index === currentPhase ? 'active' : 
              index < currentPhase ? 'completed' : ''
            }`}
            onClick={() => goToPhase(index)}
          >
            {index + 1}
          </div>
        ))}
      </div>
      </div>
       
    </div>
    
  );
};

export default RoadMapSlide;