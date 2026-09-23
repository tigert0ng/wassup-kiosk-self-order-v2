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
      setAutoReturnSec((prev) => (prev > 0 ? prev - 1 : 0));
      setCountdownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (autoReturnSec === 0) {
      endSessionNextCustomer();
    }
  }, [autoReturnSec, endSessionNextCustomer]);

  const etaMinutesDisplay = Math.floor(countdownSeconds / 60);
  const etaSecondsDisplay = countdownSeconds % 60;

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 max-w-4xl mx-auto w-full text-center">
      {/* Top Success Header */}
      <div>
        <div className="w-16 h-16 rounded-full bg-brand-green/20 text-forest-green flex items-center justify-center mx-auto mb-3 border-2 border-brand-green">
          <CheckCircle2 className="w-10 h-10 text-brand-green" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-display font-black text-matte-black uppercase tracking-tight">
          Đặt Dịch Vụ Thành Công!
        </h1>
        <p className="text-xs sm:text-sm text-mid-gray mt-1">
          Hệ thống đã tạo lệnh rửa xe tự động và gửi thông báo tới kỹ thuật viên.
        </p>

        {/* Assigned Bay Banner */}
        <div className="mt-3 p-3 bg-brand-green text-matte-black font-display font-black text-base sm:text-lg uppercase rounded-2xl shadow-md inline-block px-8 tracking-wider">
          Vui lòng di chuyển xe vào: {currentOrder?.assigned_bay || 'Buồng 02'}
        </div>
      </div>

      {/* Main ETA Card with 2 columns for 24-inch Kiosk */}
      <div className="my-4 bg-white border-2 border-stone-200 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left: ETA Big Countdown Clock */}
          <div className="border-b md:border-b-0 md:border-r border-stone-200 pb-5 md:pb-0 md:pr-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-forest-green" />
                <span className="font-sans font-black text-lg text-matte-black">
                  {currentOrder?.license_plate || '51K-889.24'}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Mã đơn hàng</span>
                <span className="font-mono font-bold text-xs text-matte-black">
                  {currentOrder?.order_id || 'ORD-98241'}
                </span>
              </div>
            </div>

            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center justify-center gap-1.5 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-green" />
              <span>Thời gian hoàn tất dự kiến (ETA):</span>
            </span>

            <div className="font-display font-black text-4xl sm:text-5xl text-brand-green tracking-tight">
              {etaMinutesDisplay < 10 ? `0${etaMinutesDisplay}` : etaMinutesDisplay}:
              {etaSecondsDisplay < 10 ? `0${etaSecondsDisplay}` : etaSecondsDisplay}
            </div>

            <p className="text-[11px] text-gray-500 mt-2 italic">
              * Thời gian thực tế có thể thay đổi tùy tình trạng vết bám thân vỏ.
            </p>
          </div>

          {/* Right: Order Details Box & Print button */}
          <div className="space-y-3 text-left">
            <div className="bg-stone-50 rounded-2xl p-4 text-xs space-y-2 border border-stone-200">
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
              <div className="flex justify-between">
                <span className="text-gray-500">Hình thức thanh toán:</span>
                <span className="font-bold text-matte-black">
                  {currentOrder?.payment_method === 'cash'
                    ? 'Tiền mặt tại quầy (Chưa thu)'
                    : currentOrder?.payment_method === 'deferred'
                    ? 'Thanh toán sau khi nhận xe'
                    : currentOrder?.payment_method === 'visa_mastercard'
                    ? 'Đã thanh toán (Thẻ POS)'
                    : 'Đã thanh toán (VietQR)'}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-stone-200">
                <span className="text-gray-500">Tổng thanh toán:</span>
                <span className="font-bold text-forest-green">{formatVND(currentOrder?.final_amount || 0)}</span>
              </div>
            </div>

            {/* Simulated Thermal Receipt Print Button */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">Hóa đơn SMS đã gửi tới SĐT</span>
              <button
                type="button"
                onClick={() => setPrinted(true)}
                className="text-xs font-display font-bold uppercase tracking-wider text-slate-700 hover:text-matte-black inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 cursor-pointer transition"
              >
                {printed ? <Check className="w-4 h-4 text-forest-green" /> : <Printer className="w-4 h-4 text-brand-green" />}
                <span>{printed ? 'Đã in phiếu nhận xe' : 'In phiếu nhận xe'}</span>
              </button>
            </div>
          </div>
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
