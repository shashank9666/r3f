"use client";

import { useStore } from '../../../store/useStore';

export function useWalkNavigation() {
  const { isWalking, setIsWalking } = useStore();

  const toggleWalk = () => {
    setIsWalking(!isWalking);
  };

  return { toggleWalk, isWalking };
}
