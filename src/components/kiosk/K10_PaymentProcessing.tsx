import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { formatVND } from '../../lib/format';
import {
  QrCode,
  Clock,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Copy,
  Building2,
  Sparkles,
} from 'lucide-react';

export const K10_PaymentProcessing: React.FC = () => {
  const {
    currentOrder,
    finalTotal,
    simPaymentSuccess,
    simPaymentFailure,
    goToStep,
    cancelCurrentSession,
    showToast,
  } = useKiosk();

  const [countdown, setCountdown] = useState(60);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // 60-second countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const orderId = currentOrder?.order_id || 'ORD-98241';
  const qrTransferUrl = `https://api.vietqr.io/image/970415-10887654321-compact2.jpg?amount=${finalTotal}&addInfo=${orderId}&accountName=WASSUP%20AUTO%20CARE`;

  const handleCopyContent = () => {
    navigator.clipboard?.writeText?.(orderId);
    setCopied(true);
    showToast('Đã sao chép nội dung chuyển khoản!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-4xl mx-auto w-full">
      {/* Top Warning / Status */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>Đang chờ cổng thanh toán xác nhận...</span>
        </div>

        {/* Cancel button with confirm modal */}
        <button
          type="button"
          onClick={() => setShowCancelModal(true)}
          className="text-xs font-display font-bold uppercase tracking-wider text-red-600 hover:text-red-700 hover:bg-red-50 py-1.5 px-3 rounded-xl border border-red-200 transition cursor-pointer"
        >
          Hủy giao dịch
        </button>
      </div>

      <div className="text-center my-3">
        <h1 className="text-xl sm:text-2xl font-display font-black text-matte-black uppercase tracking-tight">
          Quét Mã QR Thanh Toán
        </h1>
        <p className="text-xs sm:text-sm text-mid-gray mt-1">
          Mở ứng dụng ngân hàng hoặc MoMo / ZaloPay để quét mã QR bên dưới.
        </p>
      </div>

      {/* Center QR Display Card with 2 columns for 24-inch Kiosk */}
      <div className="bg-white border-2 border-stone-200 rounded-3xl p-6 sm:p-7 shadow-xs my-3 flex-1 flex flex-col justify-center relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-3xl mx-auto w-full">
          {/* Left: Countdown Badge & QR Image */}
          <div className="flex flex-col items-center">
            {/* Countdown Badge */}
            <div className="flex items-center gap-2 bg-stone-100 px-4 py-1.5 rounded-full border border-stone-300 text-xs font-bold text-slate-700 mb-4">
              <Clock className={`w-4 h-4 ${countdown < 15 ? 'text-red-500 animate-pulse' : 'text-brand-green'}`} />
              <span>Thời gian quét mã còn lại: </span>
              <span className={`font-mono text-sm ${countdown < 15 ? 'text-red-600 font-black' : 'text-matte-black'}`}>
                00:{countdown < 10 ? `0${countdown}` : countdown}s
              </span>
            </div>

            {/* QR Image Container with Scanning Beam Effect */}
            <div className="relative p-3.5 rounded-3xl border-4 border-brand-green bg-white shadow-xl max-w-[240px] w-full mb-3">
              <img
                src={qrTransferUrl}
                alt="VietQR Payment Code"
                className="w-full aspect-square object-contain rounded-xl"
              />

              {/* Simulated Scanner Line */}
              <div className="absolute top-4 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-brand-green to-transparent animate-pulse shadow-[0_0_12px_#A2C62C]" />
            </div>

            <p className="text-[11px] text-gray-400">Hỗ trợ tất cả ngân hàng tại Việt Nam (NAPAS 247)</p>
          </div>

          {/* Right: Bank Details Table & Retry Prompt */}
          <div className="w-full space-y-3">
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Ngân hàng:</span>
                <span className="font-bold text-matte-black flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-forest-green" />
                  VietinBank (Công Thương)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Số tài khoản:</span>
                <span className="font-mono font-bold text-sm text-matte-black">
                  1088 7654 321
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Tên người thụ hưởng:</span>
                <span className="font-bold text-matte-black">WASSUP AUTO CARE</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-stone-200">
                <span className="text-gray-500">Số tiền:</span>
                <span className="font-display font-black text-lg text-brand-green">
                  {formatVND(finalTotal)}
                </span>
              </div>

              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-stone-300">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Nội dung chuyển khoản (bắt buộc):</span>
                  <span className="font-mono font-black text-sm text-matte-black">{orderId}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyContent}
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-700 transition cursor-pointer"
                  title="Sao chép nội dung"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Timeout / Retry Prompt */}
            {countdown === 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl w-full flex items-center justify-between text-xs text-amber-800">
                <span>Mã QR đã hết hiệu lực (quá 60s).</span>
                <button
                  type="button"
                  onClick={() => setCountdown(60)}
                  className="font-bold text-matte-black underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Tạo lại mã mới
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simulation Action Bar for Testers (Prominent in UI) */}
      <div className="bg-stone-900 border-2 border-brand-green/50 rounded-2xl p-4 text-white my-2 shadow-lg">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-green" />
            <span className="text-xs font-display font-black uppercase tracking-wider text-brand-green">
              simAction Testing Tools (Mô phỏng thanh toán)
            </span>
          </div>
          <span className="text-[10px] text-gray-400">Webhook Callback Test</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={simPaymentSuccess}
            className="min-h-[50px] rounded-xl bg-brand-green hover:bg-brand-green-hover text-matte-black font-display font-black text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mô phỏng Quét & Trả Thành Công →</span>
          </button>

          <button
            type="button"
            onClick={() => {
              simPaymentFailure();
              goToStep('K9');
            }}
            className="min-h-[50px] rounded-xl bg-[#262626] hover:bg-[#333333] text-gray-200 border border-[#3a3a3a] font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <XCircle className="w-4 h-4 text-red-400" />
            <span>Mô phỏng Thất Bại / Đổi Phương Thức</span>
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Modal (US-K3.2: Confirm dialog before cancelling in K10) */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-matte-black/75 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-display font-black text-matte-black">
              Giao dịch đang xử lý!
            </h3>
            <p className="text-xs text-mid-gray mt-2 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn hủy giao dịch này? Nếu bạn đã chuyển khoản qua ngân hàng, vui lòng liên hệ nhân viên hỗ trợ tại trạm để được ghi nhận.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="min-h-[54px] rounded-xl border border-stone-300 hover:bg-stone-100 font-display font-bold text-xs uppercase text-slate-700 transition cursor-pointer"
              >
                Tiếp tục quét mã
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  cancelCurrentSession();
                }}
                className="min-h-[54px] rounded-xl bg-red-600 hover:bg-red-700 font-display font-black text-xs uppercase text-white shadow-md transition cursor-pointer"
              >
                Xác nhận hủy phiên
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
