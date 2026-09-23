import React, { useEffect, useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Sparkles, Eye, Car, Shield, Award } from 'lucide-react';

export const K1_IdleAttract: React.FC = () => {
  const { goToStep, station } = useKiosk();
  const [idleSeconds, setIdleSeconds] = useState(30);

  // Auto transition to Liveview (K1L) after 30s idle
  useEffect(() => {
    const timer = setInterval(() => {
      setIdleSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (idleSeconds === 0) {
      goToStep('K1L');
      setIdleSeconds(30);
    }
  }, [idleSeconds, goToStep]);

  return (
    <div
      onClick={() => goToStep('K2')}
      className="flex-1 flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-950 to-matte-black text-white cursor-pointer select-none"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-green/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-80 h-80 bg-forest-green/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar: Station Identity & Live Status */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-green flex items-center justify-center text-matte-black font-display font-black text-xl shadow-lg shadow-brand-green/20">
            W
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-lg sm:text-xl tracking-wider uppercase text-white">
                WASSUP
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-brand-green/20 text-brand-green px-2 py-0.5 rounded-md border border-brand-green/30">
                Payment Kiosk
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">
              {station.name}
            </p>
          </div>
        </div>

        {/* Realtime Live Pulse */}
        <div className="flex items-center gap-2 bg-stone-800/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-700">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse" />
          <span className="text-xs text-gray-300 font-semibold">3 Buồng Hoạt Động</span>
        </div>
      </div>

      {/* Center Hero: Value Proposition & Visual Callout */}
      <div className="relative z-10 text-center my-auto py-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-brand-green text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-4 h-4 text-brand-green" />
          <span>Hệ Thống Rửa Xe Tự Động Thông Minh</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black uppercase tracking-tight text-white leading-tight max-w-lg mx-auto">
          Rửa Xe Nhanh Chóng <br />
          <span className="text-brand-green drop-shadow-[0_0_25px_rgba(162,198,44,0.35)]">
            Tự Động & Tiết Kiệm
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-300 font-sans mt-4 max-w-md mx-auto leading-relaxed">
          Chạm màn hình để đăng nhập, chọn gói dịch vụ theo phân hạng xe và thanh toán nhanh qua mã QR.
        </p>

        {/* 3 Core Highlights */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mt-8 text-left">
          <div className="bg-stone-900/80 border border-stone-800 p-3.5 rounded-2xl">
            <Car className="w-5 h-5 text-brand-green mb-1.5" />
            <div className="font-display font-bold text-xs text-white uppercase">15 Phút</div>
            <div className="text-[11px] text-gray-400">Rửa sạch sấy khô</div>
          </div>
          <div className="bg-stone-900/80 border border-stone-800 p-3.5 rounded-2xl">
            <Shield className="w-5 h-5 text-brand-green mb-1.5" />
            <div className="font-display font-bold text-xs text-white uppercase">pH 7.0</div>
            <div className="text-[11px] text-gray-400">Bọt sinh học an toàn</div>
          </div>
          <div className="bg-stone-900/80 border border-stone-800 p-3.5 rounded-2xl">
            <Award className="w-5 h-5 text-brand-green mb-1.5" />
            <div className="font-display font-bold text-xs text-white uppercase">Điểm SUP</div>
            <div className="text-[11px] text-gray-400">Tích lũy & giảm giá</div>
          </div>
        </div>
      </div>

      {/* Bottom Actions: Giant Touch Target CTA */}
      <div className="relative z-10 space-y-3 max-w-md mx-auto w-full pt-4">
        {/* Giant Primary Touch Target Button (≥72px) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToStep('K2');
          }}
          className="w-full min-h-[76px] rounded-2xl bg-brand-green hover:bg-brand-green-hover text-matte-black font-display font-black text-lg sm:text-xl uppercase tracking-wider shadow-xl shadow-brand-green/25 hover:shadow-brand-green/40 flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95 animate-pulse cursor-pointer"
        >
          <span>Chạm Để Bắt Đầu</span>
          <span className="text-2xl">→</span>
        </button>

        {/* Secondary: View Live Queue (K1L) */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToStep('K1L');
            }}
            className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-gray-400 hover:text-brand-green transition py-2 px-3 rounded-xl hover:bg-white/5 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-brand-green" />
            <span>Xem xe đang phục vụ tại trạm →</span>
          </button>

          <span className="text-[11px] text-gray-500 font-mono">
            Tự động chiếu TV sau {idleSeconds}s
          </span>
        </div>
      </div>
    </div>
  );
};
