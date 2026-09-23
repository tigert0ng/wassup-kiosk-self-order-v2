import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { KioskProvider } from './context/KioskContext';
import { KioskFrame } from './components/layout/KioskFrame';

export default function App() {
  return (
    <BrowserRouter>
      <KioskProvider>
        <Routes>
          <Route path="/" element={<KioskFrame />} />
          <Route path="/kiosk" element={<KioskFrame />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </KioskProvider>
    </BrowserRouter>
  );
}
