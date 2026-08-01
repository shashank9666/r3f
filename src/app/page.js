import SplashScreen from "../components/SplashScreen";
import Viewport from "../components/viewport/Viewport";

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#282828]">
      {/* 3D Viewport Layer */}
      <div className="absolute inset-0 z-0">
        <Viewport />
      </div>
      
      {/* Overlay Splash Screen Layer */}
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto w-full h-full">
          <SplashScreen />
        </div>
      </div>
    </main>
  );
}
