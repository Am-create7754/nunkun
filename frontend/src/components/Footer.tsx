import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer id="say-hi" className="bg-[#C96B4B] text-white pt-24 pb-8 px-4 md:px-12 relative overflow-hidden">
      
      {/* Decorative Blue Sparkles */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="absolute left-[3%] top-[15%] text-[#1F4ED8]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M2 12h20M4.929 4.929l14.142 14.142M4.929 19.071L19.071 4.929"/>
        </svg>
      </motion.div>

      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="absolute left-[35%] top-[60%] text-[#1F4ED8]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M2 12h20M4.929 4.929l14.142 14.142M4.929 19.071L19.071 4.929"/>
        </svg>
      </motion.div>

      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center md:items-start relative z-10 gap-16 md:gap-0">
        
        {/* Left Column */}
        <div className="flex-1 space-y-8 text-center md:text-left">
          <h3 className="font-heading italic text-5xl text-white tracking-wide">Nun Kun Bakery</h3>
          
          <div className="font-body text-[15px] text-white/90 space-y-1">
            <p>Meherchand Market</p>
            <p>Lodhi Estate, Delhi</p>
          </div>
          
          <div className="font-body text-[15px] text-white/90 space-y-1 pt-2">
            <p>Contact Us +91 11 1233</p>
            <p>nunkunbakerita.com</p>
          </div>
        </div>

        {/* Center Column */}
        <div className="flex-1 flex justify-center items-center">
          <p className="font-heading italic text-3xl text-white mt-12 md:mt-24">
            Made with love & butter.
          </p>
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col items-center md:items-end w-full">
          <div className="text-center md:text-right md:pr-4">
            <p className="font-body text-[15px] text-white/90 mb-4">Say hi on socials</p>
            <div className="flex justify-center md:justify-end gap-3">
              <a href="#" className="w-10 h-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
            </div>
          </div>

          <div className="mt-16 flex items-end justify-center md:justify-end gap-6 relative right-0 md:right-8">
            <button className="px-6 py-2 rounded-full border border-white font-heading italic text-xl hover:bg-white hover:text-[#C96B4B] transition-colors mb-4">
              Hi Pals
            </button>
            
            {/* Panda Doodle SVG */}
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative top-4">
              {/* Ears */}
              <path d="M25 35 C20 15, 40 10, 35 30" />
              <path d="M75 35 C80 15, 60 10, 65 30" />
              {/* Face */}
              <path d="M15 60 C10 35, 90 35, 85 60 C80 85, 20 85, 15 60 Z" />
              {/* Eyes */}
              <circle cx="35" cy="55" r="2.5" fill="white" stroke="none" />
              <circle cx="65" cy="55" r="2.5" fill="white" stroke="none" />
              {/* Nose */}
              <circle cx="50" cy="65" r="3" fill="white" stroke="none" />
              {/* Mouth */}
              <path d="M50 68 V72" />
              <path d="M45 72 C48 75, 52 75, 55 72" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1400px] mx-auto mt-16 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[13px] text-white/80 font-body">© 2026 Nun Kun Bakery</p>
        <p className="text-[13px] text-white/80 font-body md:pr-12">Delhi, IN</p>
      </div>

    </footer>
  );
}
