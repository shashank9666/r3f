import Image from "next/image";
import { 
  FilePlus, 
  Film, 
  Hammer, 
  BookOpen, 
  Wand2, 
  Search, 
  FolderOpen, 
  History 
} from "lucide-react";

export default function SplashScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-950 font-sans select-none">
      {/* Splash Screen Container */}
      <div className="w-[600px] rounded-lg overflow-hidden shadow-2xl flex flex-col border border-neutral-800">
        
        {/* Top Image Section */}
        <div className="relative h-[300px] w-full bg-black">
          <Image 
            src="/splash_background.png" 
            alt="Splash Background" 
            fill 
            className="object-cover opacity-90"
            priority
          />
          
          {/* Top Header overlay */}
          <div className="absolute top-0 left-0 w-full p-5 flex justify-between items-start bg-gradient-to-b from-black/70 to-transparent">
            {/* Logo and Name */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/20 shadow-lg">
                <Image 
                  src="/r3f_logo.png" 
                  alt="r3f Logo" 
                  fill 
                  className="object-cover"
                />
              </div>
              <h1 className="text-white text-[32px] font-semibold tracking-tight drop-shadow-md">r3f</h1>
            </div>
            
            {/* Version */}
            <div className="text-white text-sm font-medium drop-shadow-md mt-2">
              0.1.0
            </div>
          </div>
        </div>

        {/* Bottom Menu Section */}
        <div className="bg-[#1b1b1b] text-[#cccccc] p-6 flex flex-col gap-6 text-[13.5px]">
          
          {/* Main Content Columns */}
          <div className="flex justify-between">
            {/* New File Column */}
            <div className="flex-1">
              <h3 className="text-[#888888] mb-2 font-medium">New File</h3>
              <ul className="flex flex-col gap-[2px]">
                <li className="flex items-center gap-3 py-1.5 px-2 -mx-2 hover:bg-[#2d4b73] hover:text-white rounded cursor-pointer transition-colors duration-100">
                  <FilePlus className="w-[18px] h-[18px] opacity-80" /> General
                </li>
                <li className="flex items-center gap-3 py-1.5 px-2 -mx-2 hover:bg-[#2d4b73] hover:text-white rounded cursor-pointer transition-colors duration-100">
                  <Film className="w-[18px] h-[18px] opacity-80" /> 2D Animation
                </li>
                <li className="flex items-center gap-3 py-1.5 px-2 -mx-2 hover:bg-[#2d4b73] hover:text-white rounded cursor-pointer transition-colors duration-100">
                  <Hammer className="w-[18px] h-[18px] opacity-80" /> Sculpting
                </li>
                <li className="flex items-center gap-3 py-1.5 px-2 -mx-2 hover:bg-[#2d4b73] hover:text-white rounded cursor-pointer transition-colors duration-100">
                  <BookOpen className="w-[18px] h-[18px] opacity-80" /> Storyboarding
                </li>
                <li className="flex items-center gap-3 py-1.5 px-2 -mx-2 hover:bg-[#2d4b73] hover:text-white rounded cursor-pointer transition-colors duration-100">
                  <Wand2 className="w-[18px] h-[18px] opacity-80" /> VFX
                </li>
              </ul>
            </div>

            {/* Recent Files Column */}
            <div className="flex-1 pl-4">
              <h3 className="text-[#888888] mb-2 font-medium">Recent Files</h3>
              <ul className="flex flex-col gap-[2px]">
                <li className="flex items-center gap-3 py-1.5 px-2 -mx-2 hover:bg-[#2d4b73] hover:text-white rounded cursor-pointer transition-colors duration-100">
                  <Search className="w-[18px] h-[18px] opacity-80" /> More...
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] w-full bg-[#333333]"></div>

          {/* Bottom Actions */}
          <div className="flex justify-between">
            <div className="flex-1">
              <ul className="flex flex-col gap-[2px]">
                <li className="flex items-center gap-3 py-1.5 px-2 -mx-2 hover:bg-[#2d4b73] hover:text-white rounded cursor-pointer transition-colors duration-100">
                  <FolderOpen className="w-[18px] h-[18px] opacity-80" /> Open...
                </li>
                <li className="flex items-center gap-3 py-1.5 px-2 -mx-2 hover:bg-[#2d4b73] hover:text-white rounded cursor-pointer transition-colors duration-100">
                  <History className="w-[18px] h-[18px] opacity-80" /> Recover Last Session
                </li>
              </ul>
            </div>
            <div className="flex-1 pl-4">
              {/* Empty Space since Donate and What's New are removed */}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
