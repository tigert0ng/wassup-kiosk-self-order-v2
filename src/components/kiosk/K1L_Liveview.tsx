import React from 'react';
import { useKiosk } from '../../context/KioskContext';
import { MOCK_LIVEVIEW_DATA } from '../../data/mockKioskData';
import { ArrowLeft, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

export const K1L_Liveview: React.FC = () => {
  const { goToStep, station } = useKiosk();

  const handleReturn = () => {
    goToStep('K1');
  };

  return (
    <div
      onClick={handleReturn}
      className="flex-1 flex flex-col p-5 sm:p-7 bg-[#121212] text-white select-none overflow-y-auto touch-scroll cursor-pointer"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleReturn();
            }}
            className="w-11 h-11 rounded-xl bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-gray-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-white">
                Tiến Độ Xe Tại Trạm
              </h1>
              <span className="bg-brand-green/20 text-brand-green text-[10px] uppercase font-extrabold px-2 py-0.5 rounded border border-brand-green/30">
                LIVE VIEW
              </span>
            </div>
            <p className="text-xs text-gray-400">{station.name}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-gray-400 block">Chạm bất kỳ để</span>
          <span className="text-xs font-display font-bold text-brand-green uppercase">Bắt Đầu Rửa Xe →</span>
        </div>
      </div>

      {/* 3 Zones Stack Layout */}
      <div className="space-y-6 my-4">
        {/* Zone 1: ĐANG XỬ LÝ (Processing) */}
        <section>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-sky-400 font-display font-black text-sm uppercase tracking-wider">
              <PlayCircle className="w-4 h-4 animate-spin text-sky-400" />
              <span>1. Đang Xử Lý Trong Buồng ({MOCK_LIVEVIEW_DATA.processing.length})</span>
            </div>
            <span className="text-[11px] text-gray-500">Áp lực cao & Bọt sinh học</span>
          </div>

          <div className="space-y-3">
            {MOCK_LIVEVIEW_DATA.processing.map((item) => (
              <div
                key={item.bay}
                className="bg-[#1A1A1A] border-2 border-sky-500/40 p-4 sm:p-5 rounded-2xl shadow-lg relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-lg mb-1">
                      {item.bay}
                    </span>
                    <div className="font-sans font-black text-3xl sm:text-4xl text-white tracking-tight">
                      {item.plate}
                    </div>
                    <div className="text-xs text-gray-300 font-medium mt-1">
                      {item.package_name} • <span className="text-gray-400">{item.vehicle_class}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-display font-black text-sky-400">
                      {item.minutes_left}p
                    </span>
                    <span className="text-[11px] text-gray-400 block">còn lại</span>
                  </div>
                </div>

                {/* Progress Bar & Current Sub-step */}
                <div className="mt-4 pt-3 border-t border-stone-800">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="text-sky-300">{item.step_name}</span>
                    <span className="text-gray-400 font-mono font-bold">{item.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-brand-green rounded-full transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Zone 2: HÀNG CHỜ TIẾP NHẬN (Queued) */}
        <section>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-amber-400 font-display font-black text-sm uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>2. Hàng Đợi Chờ Vào Buồng ({MOCK_LIVEVIEW_DATA.waiting.length})</span>
            </div>
            <span className="text-[11px] text-gray-500">Ước tính chờ ~10-15 phút</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MOCK_LIVEVIEW_DATA.waiting.map((item, idx) => (
              <div
                key={item.order_id}
                className="bg-[#1A1A1A] border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">{item.order_id}</span>
                  </div>
                  <div className="font-sans font-black text-2xl text-white">
                    {item.plate}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    {item.package_name}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-amber-400 font-bold block">
                    ~{item.est_wait_min} phút
                  </span>
                  <span className="text-[10px] text-gray-500">dự kiến vào</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Zone 3: XONG — MỜI NHẬN XE (Completed) */}
        <section>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-brand-green font-display font-black text-sm uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-brand-green" />
              <span>3. Đã Hoàn Tất — Mời Nhận Xe ({MOCK_LIVEVIEW_DATA.completed.length})</span>
            </div>
            <span className="text-[11px] text-gray-500">Vui lòng lấy xe</span>
          </div>

          <div className="space-y-2.5">
            {MOCK_LIVEVIEW_DATA.completed.map((item) => (
              <div
                key={item.plate}
                className="bg-[#162111] border border-brand-green/40 p-4 rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-green/20 text-brand-green flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="font-sans font-black text-2xl sm:text-3xl text-brand-green tracking-tight">
                      {item.plate}
                    </div>
                    <div className="text-xs text-gray-300 font-medium">
                      {item.ready_text}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 font-medium block">
                    {item.completed_at}
                  </span>
                  <span className="text-[11px] text-brand-green font-bold bg-brand-green/10 px-2 py-0.5 rounded">
                    Mời nhận xe
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer Banner */}
      <div className="mt-auto pt-4 text-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToStep('K2');
          }}
          className="w-full min-h-[64px] rounded-2xl bg-brand-green hover:bg-brand-green-hover text-matte-black font-display font-black text-base uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition"
        >
          <span>Chạm vào đây để đăng nhập & rửa xe ngay</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
