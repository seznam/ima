import React from 'react';

interface OverlayContextValue {
  publicUrl: string;
}

const defaultOverlayContext = {
  publicUrl: 'http://localhost:3101',
};

const OverlayContext = React.createContext<OverlayContextValue>(
  defaultOverlayContext
);

export { OverlayContext, defaultOverlayContext };
