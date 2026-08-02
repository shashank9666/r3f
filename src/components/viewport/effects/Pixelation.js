import React, { forwardRef, useMemo } from 'react';
import { PixelationEffect } from 'postprocessing';

export const Pixelation = forwardRef(({ granularity = 5 }, ref) => {
  const effect = useMemo(() => new PixelationEffect(granularity), [granularity]);
  return <primitive ref={ref} object={effect} dispose={null} />;
});
