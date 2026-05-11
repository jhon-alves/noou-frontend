import React, { useEffect, useState } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onComplete()
      }, 800) // Wait for fade out animation
    }, 2000) // Show splash for 2 seconds

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-800 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-label="Splash screen de carregamento"
      role="img"
    >
      <style>
        {`
          @keyframes logoAppear {
            0% {
              opacity: 0;
              transform: scale(0.7) translateY(10px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          .logo-animate {
            animation: logoAppear 1.2s ease-out 0.3s both;
          }
        `}
      </style>
      <div className="flex items-center justify-center">
        {/* Logo with opacity and zoom animation */}
        <img
          src="/logo.webp"
          alt="Logo da Noou"
          className="h-20 w-auto object-contain logo-animate"
        />
      </div>
    </div>
  )
}
