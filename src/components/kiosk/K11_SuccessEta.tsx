import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { formatVND } from '../../lib/format';
import {
  CheckCircle2,
  Clock,
  Car,
  Printer,
  Sparkles,
  ArrowRight,
  Home,
  Check,
} from 'lucide-react';

export const K11_SuccessEta: React.FC = () => {
  const { currentOrder, endSessionNextCustomer, goToStep } = useKiosk();

  // 20s auto-return countdown
  const [autoReturnSec, setAutoReturnSec] = useState(20);

  // ETA countdown timer simulation (e.g. 25:00 minutes)
  const etaMinutes = currentOrder?.eta_minutes || 25;
  const [countdownSeconds, setCountdownSeconds] = useState(etaMinutes * 60);
  const [printed, setPrinted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAutoReturnSec((prev) => {
        if (prev <= 1) {
          endSessionNextCustomer();
          return 20;
        }
        return prev - 1;
      });

      setCountdownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [endSessionNextCustomer]);

  const etaMinutesDisplay = Math.floor(countdownSeconds / 60);
  const etaSecondsDisplay = countdownSeconds % 60;

  return (
    <div className="flex-1 flex flex-col justify-between p-5 sm:p-8 max-w-2xl mx-auto w-full text-center">
      {/* Top Success Header */}
      <div>
        <div className="w-20 h-20 rounded-full bg-brand-green/20 text-forest-green flex items-center justify-center mx-auto mb-4 border-2 border-brand-green animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-brand-green" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-black text-matte-black uppercase tracking-tight">
          Đặt Dịch Vụ Thành Công!
        </h1>
        <p className="text-sm text-mid-gray mt-1">
          Hệ thống đã tạo lệnh rửa xe tự động và gửi thông báo tới kỹ thuật viên.
        </p>

        {/* Assigned Bay Banner */}
        <div className="mt-4 p-3 bg-brand-green text-matte-black font-display font-black text-lg uppercase rounded-2xl shadow-md inline-block px-8 tracking-wider">
          Vui lòng di chuyển xe vào: {currentOrder?.assigned_bay || 'Buồng 02'}
        </div>
      </div>

      {/* Main ETA Card */}
      <div className="my-6 bg-white border-2 border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-forest-green" />
            <span className="font-sans font-black text-xl text-matte-black">
              {currentOrder?.license_plate || '51K-889.24'}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Mã đơn hàng</span>
            <span className="font-mono font-bold text-sm text-matte-black">
              {currentOrder?.order_id || 'ORD-98241'}
            </span>
          </div>
        </div>

        {/* Big Countdown ETA Clock (≥40px font-display font-black) */}
        <div className="py-6">
          <span className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center justify-center gap-1.5 mb-2">
            <Clock className="w-4 h-4 text-brand-green" />
            <span>Ước tính thời gian xe hoàn tất (ETA):</span>
          </span>

          <div className="font-display font-black text-5xl sm:text-6xl text-brand-green tracking-tight">
            {etaMinutesDisplay < 10 ? `0${etaMinutesDisplay}` : etaMinutesDisplay}:
            {etaSecondsDisplay < 10 ? `0${etaSecondsDisplay}` : etaSecondsDisplay}
          </div>

          <p className="text-xs text-gray-500 mt-2 italic">
            * Thời gian dự kiến, có thể thay đổi tùy tình trạng vết bám thực tế của xe.
          </p>
        </div>

        {/* Order Details Mini Box */}
        <div className="bg-stone-50 rounded-2xl p-4 text-left text-xs space-y-1.5 border border-stone-200">
          <div className="flex justify-between">
            <span className="text-gray-500">Khách hàng:</span>
            <span className="font-bold text-matte-black">{currentOrder?.customer_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Dịch vụ chính:</span>
            <span className="font-bold text-matte-black">{currentOrder?.items[0]?.name}</span>
          </div>
          {currentOrder && currentOrder.items.length > 1 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Dịch vụ thêm:</span>
              <span className="font-bold text-matte-black">
                {currentOrder.items.slice(1).map((i) => i.name).join(', ')}
              </span>
            </div>
          )}
          <div className="flex justify-between pt-1 border-t border-stone-200">
            <span className="text-gray-500">Tổng thanh toán:</span>
            <span className="font-bold text-forest-green">{formatVND(currentOrder?.final_amount || 0)}</span>
          </div>
        </div>

        {/* Simulated Thermal Receipt Print Button */}
        <div className="mt-4 pt-4 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-gray-500">Hóa đơn điện tử đã gửi tới SĐT</span>
          <button
            type="button"
            onClick={() => setPrinted(true)}
            className="text-xs font-display font-bold uppercase tracking-wider text-slate-700 hover:text-matte-black inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50"
          >
            {printed ? <Check className="w-4 h-4 text-forest-green" /> : <Printer className="w-4 h-4 text-brand-green" />}
            <span>{printed ? 'Đã in phiếu nhận xe' : 'In phiếu nhận xe'}</span>
          </button>
        </div>
      </div>

      {/* Two Prominent Action Buttons (US-K6.2) */}
      <div className="space-y-3 pb-2">
        {/* Primary: Next Customer Button */}
        <button
          type="button"
          onClick={endSessionNextCustomer}
          className="w-full min-h-[64px] rounded-2xl bg-brand-green hover:bg-brand-green-hover text-matte-black font-display font-black text-base uppercase tracking-wider shadow-lg shadow-brand-green/20 flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-95"
        >
          <span>Kết Thúc Phiên, Khách Tiếp Theo</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Secondary: Return to Home */}
        <div className="flex items-center justify-between px-2 text-xs text-gray-400">
          <button
            type="button"
            onClick={() => goToStep('K1')}
            className="hover:text-matte-black flex items-center gap-1 font-bold py-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Quay về màn hình chính</span>
          </button>

          <span className="font-mono">Tự động kết thúc sau {autoReturnSec}s</span>
        </div>
      </div>
    </div>
  );
};
