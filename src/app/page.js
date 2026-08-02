"use client";

import SplashScreen from "../components/SplashScreen";
import Viewport from "../components/viewport/Viewport";
import TopMenu from "../components/TopMenu";
import StatusBar from "../components/StatusBar";
import { useStore } from "../store/useStore";

export default function Home() {
  const showSplash = useStore((state) => state.showSplash);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#282828]">
      {/* Top Menu Bar */}
      <TopMenu />

      {/* 3D Viewport Layer - Shifted slightly down so it doesn't overlap under menu perfectly if we cared, but absolute overlay is fine */}
      <div className="absolute inset-0 z-0">
        <Viewport />
      </div>
      
      {/* Bottom Status Bar */}
      <StatusBar />
      
      {/* Overlay Splash Screen Layer */}
      {showSplash && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto w-full h-full">
            <SplashScreen />
          </div>
        </div>
      )}
    </main>
  );
}
