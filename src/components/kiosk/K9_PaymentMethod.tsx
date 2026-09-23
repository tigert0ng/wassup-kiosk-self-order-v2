import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { PaymentMethodType } from '../../types/kiosk';
import { formatVND } from '../../lib/format';
import {
  QrCode,
  CreditCard,
  Banknote,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Building2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Zap,
} from 'lucide-react';

interface PaymentOption {
  id: PaymentMethodType;
  name: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  isDirectNext?: boolean;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'qr_vnpay',
    name: 'Chuyển Khoản QR VietQR',
    subtitle: 'Quét bằng app ngân hàng hoặc MoMo, ZaloPay (Tức thì)',
    icon: QrCode,
    badge: 'Khuyên dùng • Tức thì',
  },
  {
    id: 'visa_mastercard',
    name: 'Thẻ Quốc Tế / Nội Địa',
    subtitle: 'Chạm Visa, Master, JCB, Napas tại đầu đọc POS kiosk',
    icon: CreditCard,
    badge: 'Chạm POS',
  },
  {
    id: 'cash',
    name: 'Tiền Mặt Tại Quầy',
    subtitle: 'Nhận lệnh rửa xe ngay, gửi tiền mặt cho thu ngân trạm',
    icon: Banknote,
    badge: 'Chuyển bước kế tiếp →',
    isDirectNext: true,
  },
  {
    id: 'deferred',
    name: 'Thanh Toán Sau Khi Nhận Xe',
    subtitle: 'Rửa xe trước, nghiệm thu sạch đẹp rồi mới thanh toán',
    icon: Clock,
    badge: 'Chuyển bước kế tiếp →',
    isDirectNext: true,
  },
];

export const K9_PaymentMethod: React.FC = () => {
  const {
    paymentMethod,
    selectPaymentMethod,
    finalTotal,
    selectedVehicle,
    goToStep,
    completeOrderWithMethod,
    showToast,
  } = useKiosk();

  const [activeMethod, setActiveMethod] = useState<PaymentMethodType>(paymentMethod || 'qr_vnpay');
  const [countdown, setCountdown] = useState<number>(60);

  // Sync internal state with context
  useEffect(() => {
    setActiveMethod(paymentMethod);
  }, [paymentMethod]);

  // QR Countdown timer
  useEffect(() => {
    if (activeMethod !== 'qr_vnpay') return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);

    return () => clearInterval(timer);
  }, [activeMethod]);

  const handleSelect = (opt: PaymentOption) => {
    if (opt.isDirectNext) {
      // Yêu cầu: "Chọn thanh toán sau hoặc tiền mặt thì chuyển đến bước tiếp theo"
      completeOrderWithMethod(opt.id);
      return;
    }

    setActiveMethod(opt.id);
    selectPaymentMethod(opt.id);
  };

  const handleDirectProceed = (method: PaymentMethodType) => {
    completeOrderWithMethod(method);
  };

  const cleanPlate = selectedVehicle?.license_plate?.replace(/[^a-zA-Z0-9]/g, '') || '51K88924';
  const orderMemo = `WASSUP ${cleanPlate}`;
  const qrTransferUrl = `https://api.vietqr.io/image/970415-102888997788-compact2.jpg?amount=${finalTotal}&addInfo=${encodeURIComponent(
    orderMemo
  )}&accountName=CONG%20TY%20CP%20WASSUP%20AUTO%20CARE`;

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-6xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <button
          type="button"
          onClick={() => goToStep('K8')}
          className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-mid-gray hover:text-matte-black transition py-1 px-2 rounded-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại đơn hàng</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Tổng thanh toán:</span>
          <span className="text-base sm:text-lg font-display font-black text-brand-green">
            {formatVND(finalTotal)}
          </span>
        </div>
      </div>

      <div className="text-center my-3">
        <h1 className="text-xl sm:text-2xl font-display font-black text-matte-black uppercase tracking-tight">
          Chọn Phương Thức Thanh Toán
        </h1>
        <p className="text-xs sm:text-sm text-mid-gray mt-1 max-w-lg mx-auto">
          Chọn Chuyển khoản QR để quét mã ngay trên màn hình, hoặc chọn Tiền mặt / Thanh toán sau để chuyển tiếp.
        </p>
      </div>

      {/* 4:6 Column Layout for 24-inch Kiosk */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 my-2 flex-1 items-stretch">
        {/* Left Column (4 parts): 4 Payment Options */}
        <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
          <span className="text-xs uppercase font-bold text-gray-400 tracking-wider block px-1">
            Danh sách phương thức (4):
          </span>

          {PAYMENT_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = activeMethod === opt.id;

            return (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className={`p-4 sm:p-5 rounded-3xl border-2 transition-all duration-200 cursor-pointer relative flex items-center justify-between gap-3 select-none ${
                  isSelected
                    ? 'bg-brand-green-light border-brand-green shadow-md shadow-brand-green/20 scale-[1.015]'
                    : 'bg-white border-stone-200 hover:border-brand-green/60 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'bg-brand-green text-matte-black shadow-xs'
                        : 'bg-stone-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-black text-sm sm:text-base text-matte-black">
                        {opt.name}
                      </h3>
                    </div>
                    <p className="text-xs text-mid-gray mt-0.5 line-clamp-1">
                      {opt.subtitle}
                    </p>
                    <span
                      className={`inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        opt.isDirectNext
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : isSelected
                          ? 'bg-brand-green text-matte-black'
                          : 'bg-stone-100 text-gray-500'
                      }`}
                    >
                      {opt.badge}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'bg-brand-green text-matte-black shadow-xs'
                      : 'border-2 border-stone-200 bg-stone-50'
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : opt.isDirectNext ? (
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-stone-300" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (6 parts): Interactive display based on selected method */}
        <div className="lg:col-span-6 flex flex-col bg-white border-2 border-stone-200 rounded-3xl p-5 sm:p-6 shadow-xs justify-between relative overflow-hidden">
          {/* Case 1: Chuyển khoản QR (Mở ra hình QR) */}
          {activeMethod === 'qr_vnpay' && (
            <div className="flex-1 flex flex-col justify-between">
              {/* Top QR Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-green/20 text-forest-green flex items-center justify-center">
                    <QrCode className="w-4 h-4 text-brand-green" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-sm uppercase tracking-wider text-matte-black">
                      Mã VietQR Thanh Toán Tự Động
                    </h2>
                    <span className="text-[11px] text-gray-400">NAPAS 247 • Tự động nhận diện ≤3s</span>
                  </div>
                </div>

                {/* Countdown Badge */}
                <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1 rounded-full text-xs font-bold text-slate-700 border border-stone-200">
                  <Clock className={`w-3.5 h-3.5 ${countdown < 15 ? 'text-red-500 animate-pulse' : 'text-brand-green'}`} />
                  <span className={countdown < 15 ? 'text-red-600' : 'text-slate-800'}>
                    00:{countdown < 10 ? `0${countdown}` : countdown}s
                  </span>
                </div>
              </div>

              {/* QR Image on top & Bank Details below */}
              <div className="flex flex-col items-center gap-3.5 my-auto py-2 w-full">
                {/* QR Code Container with Laser Scanning Effect (Top) */}
                <div className="flex flex-col items-center">
                  <div className="relative p-3.5 sm:p-4 rounded-3xl border-2 border-brand-green bg-white w-64 sm:w-72 lg:w-80 max-w-[320px]">
                    <img
                      src={qrTransferUrl}
                      alt="VietQR Code WASSUP"
                      className="w-full aspect-square object-contain rounded-xl"
                    />

                    {/* Animated Scanning Beam */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 h-1.5 bg-gradient-to-r from-transparent via-brand-green to-transparent animate-pulse shadow-[0_0_16px_#A2C62C]" />
                  </div>

                  <span className="text-xs text-gray-500 font-medium mt-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-brand-green" />
                    <span>Quét bằng mọi ứng dụng ngân hàng hoặc MoMo, ZaloPay</span>
                  </span>
                </div>

                {/* Transfer Info Details Box (Below) */}
                <div className="w-full max-w-lg bg-stone-50 border border-stone-200 rounded-2xl p-3.5 sm:p-4 text-xs space-y-2 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2 border-b border-stone-200/70">
                    <div>
                      <span className="text-gray-400 text-[10px] block">Ngân hàng thụ hưởng:</span>
                      <span className="font-bold text-matte-black flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-forest-green shrink-0" />
                        VietinBank (CN Sài Gòn)
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] block">Số tài khoản:</span>
                      <span className="font-mono font-black text-sm text-matte-black tracking-wider">
                        1028 8899 7788
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-400 text-[11px]">Tên thụ hưởng:</span>
                    <span className="font-bold text-matte-black uppercase text-right">
                      CÔNG TY CP WASSUP AUTO CARE
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-200/70">
                    <div>
                      <span className="text-gray-400 text-[10px] block">Số tiền thanh toán:</span>
                      <span className="font-display font-black text-lg text-forest-green">
                        {formatVND(finalTotal)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-gray-400 text-[10px] block">Nội dung chuyển khoản:</span>
                      <span className="font-mono font-bold text-xs text-brand-green bg-brand-green/10 px-2 py-0.5 rounded border border-brand-green/20 inline-block">
                        {orderMemo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Test Action */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setCountdown(60)}
                  className="text-xs text-gray-500 hover:text-matte-black flex items-center gap-1 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-stone-100"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Tải lại mã QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectProceed('qr_vnpay')}
                  className="bg-brand-green hover:bg-brand-green-hover text-matte-black font-display font-black text-xs uppercase tracking-wider py-3 px-5 rounded-xl shadow-md shadow-brand-green/20 flex items-center gap-2 cursor-pointer transition transform active:scale-95 ml-auto"
                >
                  <span>Mô Phỏng Quét QR Thành Công →</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Case 2: Thẻ Visa / Mastercard (POS) */}
          {activeMethod === 'visa_mastercard' && (
            <div className="flex-1 flex flex-col justify-between text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-brand-green/20 text-forest-green flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-8 h-8 text-brand-green" />
              </div>

              <div>
                <h2 className="text-xl font-display font-black text-matte-black uppercase tracking-tight">
                  Đầu Đọc Thẻ Ngân Hàng POS Kiosk
                </h2>
                <p className="text-xs text-mid-gray mt-1 max-w-md mx-auto">
                  Hỗ trợ công nghệ thanh toán một chạm không tiếp xúc (NFC / Contactless) hoặc chèn chip thẻ Visa, Master, Napas.
                </p>
              </div>

              {/* POS Machine Visual */}
              <div className="my-6 bg-stone-900 text-white rounded-2xl p-5 max-w-sm mx-auto w-full border border-stone-800 shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800 text-xs text-gray-400">
                  <span>Thiết bị POS Kiosk: #POS-01</span>
                  <span className="text-brand-green font-bold">● SẴN SÀNG</span>
                </div>

                <div className="py-4">
                  <span className="text-xs text-gray-400 block uppercase">Số tiền thanh toán:</span>
                  <div className="font-display font-black text-2xl text-brand-green mt-1">
                    {formatVND(finalTotal)}
                  </div>
                </div>

                <div className="text-[11px] text-gray-300 bg-stone-800/80 p-2.5 rounded-xl">
                  Chạm thẻ vào biểu tượng sóng phía dưới màn hình
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDirectProceed('visa_mastercard')}
                className="w-full max-w-sm mx-auto min-h-[52px] rounded-2xl bg-brand-green hover:bg-brand-green-hover text-matte-black font-display font-black text-sm uppercase tracking-wider shadow-lg shadow-brand-green/25 flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-95"
              >
                <span>Mô Phỏng Chạm Thẻ POS Thành Công →</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Case 3: Tiền mặt tại quầy */}
          {activeMethod === 'cash' && (
            <div className="flex-1 flex flex-col justify-between text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                <Banknote className="w-8 h-8 text-amber-600" />
              </div>

              <div>
                <h2 className="text-xl font-display font-black text-matte-black uppercase tracking-tight">
                  Thanh Toán Tiền Mặt Tại Quầy
                </h2>
                <p className="text-xs text-mid-gray mt-1 max-w-md mx-auto">
                  Lệnh rửa xe được tạo ngay lập tức. Bạn có thể gửi tiền mặt cho nhân viên thu ngân tại trạm trước hoặc sau khi xe hoàn tất.
                </p>
              </div>

              <div className="my-6 bg-stone-50 border border-stone-200 rounded-2xl p-5 max-w-sm mx-auto w-full text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Biển số xe:</span>
                  <span className="font-bold text-matte-black">{selectedVehicle?.license_plate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Số tiền cần thanh toán:</span>
                  <span className="font-bold text-forest-green text-sm">{formatVND(finalTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Hình thức:</span>
                  <span className="font-bold text-matte-black">Tiền mặt tại trạm</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDirectProceed('cash')}
                className="w-full max-w-sm mx-auto min-h-[52px] rounded-2xl bg-brand-green hover:bg-brand-green-hover text-matte-black font-display font-black text-sm uppercase tracking-wider shadow-lg shadow-brand-green/25 flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-95"
              >
                <span>Xác Nhận & Chuyển Đến Bước Kế Tiếp →</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Case 4: Thanh toán sau khi nhận xe */}
          {activeMethod === 'deferred' && (
            <div className="flex-1 flex flex-col justify-between text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>

              <div>
                <h2 className="text-xl font-display font-black text-matte-black uppercase tracking-tight">
                  Rửa Xe Trước — Thanh Toán Sau
                </h2>
                <p className="text-xs text-mid-gray mt-1 max-w-md mx-auto">
                  Trải nghiệm quy trình dịch vụ trước, kiểm tra xe bóng sạch hoàn hảo rồi mới tiến hành thanh toán tại trạm lúc nhận bàn giao xe.
                </p>
              </div>

              <div className="my-6 bg-stone-50 border border-stone-200 rounded-2xl p-5 max-w-sm mx-auto w-full text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Biển số xe:</span>
                  <span className="font-bold text-matte-black">{selectedVehicle?.license_plate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Số tiền dự kiến:</span>
                  <span className="font-bold text-forest-green text-sm">{formatVND(finalTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Thời điểm thanh toán:</span>
                  <span className="font-bold text-matte-black">Khi nhận bàn giao xe</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDirectProceed('deferred')}
                className="w-full max-w-sm mx-auto min-h-[52px] rounded-2xl bg-brand-green hover:bg-brand-green-hover text-matte-black font-display font-black text-sm uppercase tracking-wider shadow-lg shadow-brand-green/25 flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-95"
              >
                <span>Xác Nhận & Chuyển Đến Bước Kế Tiếp →</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Safety Notice */}
      <div className="mt-auto text-center pt-2">
        <span className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
          <span>Giao dịch bảo mật chuẩn PCI-DSS & mã hóa dữ liệu đầu cuối SSL 256-bit</span>
        </span>
      </div>
    </div>
  );
};
