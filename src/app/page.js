"use client";

import dynamic from "next/dynamic";
import SplashScreen from "../components/SplashScreen";
import AppLayout from "@/components/layout/AppLayout";
import AppMenu from "../components/AppMenu";
import StatusBar from "../components/StatusBar";
import { useStore } from "../store/useStore";

const Viewport = dynamic(() => import("../components/viewport/Viewport"), {
  ssr: false,
});

export default function Home() {
  const showSplash = useStore((state) => state.showSplash);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#282828]">
      {/* Top Menu Bar */}
      <AppMenu />

      {/* 3D Viewport Layer - Shifted slightly down so it doesn't overlap under menu perfectly if we cared, but absolute overlay is fine */}
      <div className="absolute inset-0 z-0">
        <AppLayout>
          <Viewport />
        </AppLayout>
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
