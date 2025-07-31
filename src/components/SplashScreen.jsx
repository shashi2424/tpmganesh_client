import React, { useEffect, useState, useRef } from 'react';

const SplashScreen = ({ onFinish }) => {
  const [startAnim, setStartAnim] = useState(false);
  const [hide, setHide] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Show text after a delay
    const textTimer = setTimeout(() => {
      setTextVisible(true);
    }, 500);

    const timer1 = setTimeout(() => {
      setStartAnim(true);
    }, 2000);
    // Animation duration is 1.2s for blessed departure effect
    const timer2 = setTimeout(() => {
      setHide(true);
      onFinish();
    }, 3200);
    return () => {
      clearTimeout(textTimer);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  if (hide) return null;

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f9ff 50%, #e1f5fe 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Floating particles background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at 20% 30%, rgba(33, 150, 243, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(3, 169, 244, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 60% 20%, rgba(100, 181, 246, 0.05) 0%, transparent 50%)
        `,
        animation: 'floatingParticles 8s ease-in-out infinite alternate',
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Tiro+Devanagari+Sanskrit:ital,wght@0,400;1,700&display=swap');
        
        @keyframes blessedDeparture {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: brightness(1) blur(0px);
          }
          20% {
            opacity: 0.95;
            transform: scale(1.05) translateY(-10px);
            filter: brightness(1.1) blur(0px);
          }
          40% {
            opacity: 0.9;
            transform: scale(1.1) translateY(-20px);
            filter: brightness(1.2) blur(0px);
          }
          60% {
            opacity: 0.7;
            transform: scale(1.2) translateY(-40px);
            filter: brightness(1.4) blur(1px);
          }
          80% {
            opacity: 0.4;
            transform: scale(1.5) translateY(-80px);
            filter: brightness(1.8) blur(3px);
          }
          100% {
            opacity: 0;
            transform: scale(2) translateY(-120px);
            filter: brightness(2.5) blur(8px);
          }
        }
        
        @keyframes divineGlow {
          0%, 100% {
            box-shadow: 
              0 0 30px rgba(0, 0, 0, 0.1),
              0 0 60px rgba(0, 0, 0, 0.05),
              inset 0 0 20px rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 
              0 0 50px rgba(0, 0, 0, 0.15),
              0 0 100px rgba(0, 0, 0, 0.1),
              inset 0 0 30px rgba(255, 255, 255, 0.2);
          }
        }
        
        @keyframes textReveal {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes textGlow {
          0%, 100% {
            text-shadow: 
              0 0 15px rgba(0, 0, 0, 0.2),
              0 0 25px rgba(0, 0, 0, 0.15),
              0 0 35px rgba(0, 0, 0, 0.1),
              0 3px 8px rgba(0, 0, 0, 0.1);
          }
          50% {
            text-shadow: 
              0 0 25px rgba(0, 0, 0, 0.25),
              0 0 45px rgba(0, 0, 0, 0.2),
              0 0 65px rgba(0, 0, 0, 0.15),
              0 5px 12px rgba(0, 0, 0, 0.15);
          }
        }
        
        @keyframes floatingParticles {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          100% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .blessed-departure {
          animation: blessedDeparture 1.2s ease-out forwards, divineGlow 2s ease-in-out infinite;
        }
        
        .divine-text {
          font-family: 'Tiro Devanagari Sanskrit', 'Kalam', serif;
          color: #333;
          font-size: clamp(1.8rem, 5vw, 3.5rem);
          font-weight: 700;
          letter-spacing: 0.1em;
          text-align: center;
          position: relative;
          animation: textGlow 3s ease-in-out infinite;
          padding: 0.5em 1em;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(0, 0, 0, 0.1);
        }
        
        .divine-text::before {
          content: '';
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          background: linear-gradient(45deg, 
            rgba(0, 0, 0, 0.03) 0%,
            rgba(0, 0, 0, 0.05) 50%,
            rgba(0, 0, 0, 0.03) 100%
          );
          border-radius: 25px;
          z-index: -1;
          filter: blur(10px);
          animation: divineGlow 2.5s ease-in-out infinite;
        }
        
        .text-reveal {
          animation: textReveal 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .image-container {
          position: relative;
          margin-bottom: 2rem;
        }
        
        .image-container::before {
          content: '';
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          background: radial-gradient(circle, 
            rgba(33, 150, 243, 0.08) 0%,
            rgba(3, 169, 244, 0.05) 50%,
            transparent 100%
          );
          border-radius: 50%;
          z-index: -1;
          animation: floatingParticles 4s ease-in-out infinite alternate;
        }
        
        @media (max-width: 600px) {
          .divine-text {
            font-size: 1.6rem;
            padding: 0.3em 0.6em;
            letter-spacing: 0.05em;
          }
        }

        .stars-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 5;
}

.star {
  position: absolute;
  top: -10px;
  width: 6px;
  height: 6px;
  background: gold;
  border-radius: 50%;
  opacity: 0.9;
  box-shadow: 0 0 6px 2px rgba(255, 215, 0, 0.8);
  animation: fallingStar 5s linear infinite, twinkle 2s ease-in-out infinite;

}

@keyframes fallingStar {
  0% {
    transform: translateY(-10px) translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) translateX(30px);
    opacity: 0;
  }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.3; }
}
        
      `}</style>

<div className="stars-container">
  {Array.from({ length: 30 }).map((_, i) => (
    <span
      key={i}
      className="star"
      style={{
        left: `${Math.random() * 100}vw`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
      }}
    />
  ))}
</div>


      
      <div className="image-container">
        <img
          ref={imgRef}
          src="/images/ganesha-splash.jpg"
          alt="Lord Ganesha"
          className={startAnim ? 'blessed-departure' : ''}
          style={{
            width: 220,
            borderRadius: 25,
            willChange: 'transform, opacity, filter',
            border: '3px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          }}
        />
      </div>
      
      <h1
        className={`divine-text ${
          textVisible ? 'text-reveal opacity-100' : 'opacity-0'
        }`}
        style={{
          margin: 0,
        }}
      >
        ఓం గణేశాయ నమః
      </h1>
    </div>
  );
};

export default SplashScreen;