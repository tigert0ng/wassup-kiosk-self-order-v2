import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { KioskStep } from '../../types/kiosk';
import {
  Wrench,
  X,
  Play,
  User,
  CreditCard,
  Building2,
  Smartphone,
  Maximize2,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

const STEP_LIST: { step: KioskStep; label: string; desc: string }[] = [
  { step: 'K0', label: 'K0: Ghép Đôi', desc: 'Xác thực & gán trạm' },
  { step: 'K1', label: 'K1: Màn Chờ', desc: 'Attract screen' },
  { step: 'K1L', label: 'K1L: Liveview', desc: 'Bảng tiến độ 3 vùng' },
  { step: 'K2', label: 'K2: Đăng Nhập', desc: 'SĐT + PIN + QR' },
  { step: 'K2_A', label: 'K2-a: Đăng Ký', desc: '3 trường nhanh' },
  { step: 'K5', label: 'K5: Xe Của Bạn', desc: 'Chọn xe & hạng xe' },
  { step: 'K6', label: 'K6: Gói Dịch Vụ', desc: 'Catalog W0–W5' },
  { step: 'K7', label: 'K7: Dịch Vụ Thêm', desc: 'Add-ons tùy chọn' },
  { step: 'K8', label: 'K8: Xác Nhận', desc: 'Chi tiết & Voucher' },
  { step: 'K9', label: 'K9: Phương Thức', desc: '4 cổng thanh toán' },
  { step: 'K10', label: 'K10: Đang Trả', desc: 'QR VNPay & Đếm ngược' },
  { step: 'K11', label: 'K11: Thành Công', desc: 'ETA & Kết thúc phiên' },
];

export const SimActionDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    step,
    goToStep,
    kioskDisplayMode,
    toggleDisplayMode,
    quickFillDemoUser,
    customersList,
    simPaymentSuccess,
    simPaymentFailure,
    unpairDevice,
    station,
    cancelCurrentSession,
    initiatePayment,
    showToast,
  } = useKiosk();

  const handleQuickPopulateCart = () => {
    quickFillDemoUser(0);
    goToStep('K8');
    showToast('Đã nạp giỏ hàng mẫu: Gói W1 + Hút bụi + Mã WASSUP20K');
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-matte-black text-brand-green hover:bg-black px-4 py-2.5 rounded-full border-2 border-brand-green/60 shadow-2xl flex items-center gap-2 font-display font-black text-xs uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Wrench className="w-4 h-4 animate-spin-slow text-brand-green" />
        <span>simAction Tools</span>
        <span className="bg-brand-green text-matte-black text-[10px] px-1.5 py-0.2 rounded-md font-bold">
          {step}
        </span>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-matte-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-[#161616] text-white border-l border-stone-800 h-full flex flex-col p-5 overflow-y-auto touch-scroll shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-brand-green" />
                <h2 className="font-display font-black text-sm uppercase tracking-wider text-brand-green">
                  simAction Testing Toolkit
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-gray-300 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-2 mb-4 leading-relaxed">
              Công cụ kiểm thử toàn bộ luồng Kiosk: đăng nhập, chọn gói catalog, mã ưu đãi và thanh toán QR tự động.
            </p>

            {/* Section 1: Quick Jump To Any Step */}
            <div className="mb-5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                1. Chuyển Nhanh Tới Màn Hình (K0–K11)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {STEP_LIST.map((s) => {
                  const isCurrent = step === s.step;
                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => {
                        goToStep(s.step);
                        setIsOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition text-xs ${
                        isCurrent
                          ? 'bg-brand-green text-matte-black border-brand-green font-black shadow-xs'
                          : 'bg-stone-900 hover:bg-stone-800 border-stone-800 text-gray-300'
                      }`}
                    >
                      <div className="font-display font-bold">{s.label}</div>
                      <div className={`text-[10px] truncate ${isCurrent ? 'text-matte-black/80' : 'text-gray-500'}`}>
                        {s.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Quick Demo Users */}
            <div className="mb-5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                2. Nạp Nhanh Khách Hàng Thử Nghiệm
              </span>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    quickFillDemoUser(0);
                    goToStep('K5');
                    setIsOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-left text-xs flex items-center justify-between transition"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-brand-green" />
                      <span>{customersList[0].name} (Khách Quen)</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      SĐT: {customersList[0].phone} • 2 Xe • PIN: 123456
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-brand-green uppercase bg-brand-green/10 px-2 py-0.5 rounded">
                    Nạp & vào K5
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    quickFillDemoUser(1);
                    goToStep('K5');
                    setIsOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-left text-xs flex items-center justify-between transition"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      <span>{customersList[1].name} (Chưa đặt PIN)</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      SĐT: {customersList[1].phone} • 1 Xe
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase bg-amber-400/10 px-2 py-0.5 rounded">
                    Test Đặt PIN
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickPopulateCart}
                  className="w-full p-2.5 rounded-xl bg-brand-green/15 hover:bg-brand-green/25 border border-brand-green/40 text-left text-xs flex items-center justify-between transition"
                >
                  <div>
                    <div className="font-bold text-brand-green flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5" />
                      <span>Nạp Giỏ Hàng Mẫu Đầy Đủ</span>
                    </div>
                    <div className="text-[11px] text-gray-300 mt-0.5">
                      Xe + Gói W1 + Add-on + Voucher → vào thẳng K8
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-matte-black bg-brand-green px-2 py-0.5 rounded">
                    Nạp ngay
                  </span>
                </button>
              </div>
            </div>

            {/* Section 3: Payment Actions */}
            <div className="mb-5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                3. Mô Phỏng Thanh Toán (simPayment)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (step !== 'K10') initiatePayment();
                    simPaymentSuccess();
                    setIsOpen(false);
                  }}
                  className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Trả thành công →</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    simPaymentFailure();
                    setIsOpen(false);
                  }}
                  className="p-3 rounded-xl bg-red-900/80 hover:bg-red-800 text-white font-display font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Báo thất bại</span>
                </button>
              </div>
            </div>

            {/* Section 4: Kiosk Viewport Toggle */}
            <div className="mb-5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                4. Chế Độ Hiển Thị Kiosk
              </span>
              <button
                type="button"
                onClick={toggleDisplayMode}
                className="w-full p-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-left text-xs flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {kioskDisplayMode === 'portrait_frame' ? (
                    <Smartphone className="w-4 h-4 text-brand-green" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-brand-green" />
                  )}
                  <span>
                    {kioskDisplayMode === 'portrait_frame'
                      ? 'Khung Kiosk Dọc 9:16 (Touchscreen Mode)'
                      : 'Tràn Toàn Màn Hình (Full Viewport)'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded">
                  Đổi kiểu xem
                </span>
              </button>
            </div>

            {/* Section 5: Device Pairing & Station */}
            <div className="mt-auto pt-4 border-t border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-forest-green" />
                  Trạm hiện tại:
                </span>
                <span className="font-bold text-white">{station.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    unpairDevice();
                    setIsOpen(false);
                  }}
                  className="p-2.5 rounded-xl border border-stone-700 text-xs font-bold text-gray-300 hover:text-white hover:bg-stone-800 transition"
                >
                  Thu hồi thiết bị (Về K0)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    cancelCurrentSession();
                    setIsOpen(false);
                  }}
                  className="p-2.5 rounded-xl border border-stone-700 text-xs font-bold text-red-400 hover:bg-red-950/30 transition flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm mới phiên</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
