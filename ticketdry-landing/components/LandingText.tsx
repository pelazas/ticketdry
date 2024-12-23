"use client"
import Head from 'next/head'
import '@/app/globals.css';
import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link';

interface LandingTextProps {
  
}

const LandingText: FC<LandingTextProps> = ({}) => {

  return (
    <>
  
  <section className="relative overflow-hidden bg-[#3E31FA] py-12 md:py-24">
    <div className="container relative px-4 md:px-8 mx-auto">
      <div className="mx-auto max-w-7xl text-center">
        <h1 
          className="font-rubik tracking-tight text-white text-6xl sm:text-8xl md:text-[12rem] leading-[1.1] [text-wrap:balance] mb-12"
          style={{ 
            textShadow: '6px 6px 0px rgba(0,0,0,0.15)',
            animation: 'slideUp 0.8s ease-out forwards'
          }}
        >
          IGNITE THE
          <br />
          WILD
          <span className="inline-block mx-4">
          <Image 
            src="/discoball3.gif"
            alt="Disco ball icon"
            className="my-auto w-14 h-14 sm:w-40 sm:h-40"
            width={150}
            height={150}
          /> 
          </span>
          <br />
          VIBES
        </h1>
        
        <p className="mt-8 text-2xl leading-relaxed text-white/90 max-w-[800px] mx-auto font-changa"
           style={{ animation: 'fadeIn 1s ease-out 0.5s forwards', opacity: 0 }}>
          Where Every Night Becomes A Living Legend
        </p>

        {/* Button without animation */}
        <Link
          href="/cities">
          <button className="mt-12 px-12 py-6 bg-yellow-400 text-white rounded-full text-2xl md:text-3xl font-changa
          transform transition-all duration-300 hover:scale-110 hover:shadow-xl hover:bg-yellow-500"
          style={{ 
            textShadow: '2px 2px 0px rgba(0,0,0,0.2)',
            animation: 'fadeIn 1s ease-out 0.8s forwards',
            opacity: 0
          }}>
          EXPLORAR MÁS
        </button>
        </Link>
      </div>
    </div>
    
    {/* Background effects */}
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div 
        className="absolute left-0 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl"
      />
      <div 
        className="absolute right-0 bottom-1/4 h-[600px] w-[600px] translate-x-1/2 rounded-full bg-white/10 blur-3xl"
      />
    </div>

    {/* Animations */}
    <style jsx>{`
      @keyframes slideUp {
        from {
          transform: translateY(50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </section>
</>
)
}

export default LandingText

