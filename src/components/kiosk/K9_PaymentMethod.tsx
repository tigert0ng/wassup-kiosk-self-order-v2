import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { PaymentMethodType } from '../../types/kiosk';
import { formatVND } from '../../lib/format';
import { QrCode, CreditCard, Banknote, Clock, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

interface PaymentOption {
  id: PaymentMethodType;
  name: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  badge?: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'qr_vnpay',
    name: 'Chuyển Khoản QR VNPay / VietQR',
    subtitle: 'Quét mã qua mọi ứng dụng ngân hàng & ví điện tử (MoMo, ZaloPay)',
    icon: QrCode,
    active: true,
    badge: 'Khuyên dùng • Tức thì',
  },
  {
    id: 'visa_mastercard',
    name: 'Thẻ Quốc Tế Visa / Mastercard',
    subtitle: 'Chạm hoặc quẹt thẻ qua máy POS ngân hàng tích hợp',
    icon: CreditCard,
    active: false,
    badge: 'Sắp ra mắt',
  },
  {
    id: 'cash',
    name: 'Tiền Mặt Tại Quầy',
    subtitle: 'Kiosk tạo đơn, khách thanh toán trực tiếp cho Thu ngân trạm',
    icon: Banknote,
    active: false,
    badge: 'Sắp ra mắt',
  },
  {
    id: 'deferred',
    name: 'Thanh Toán Sau Khi Nhận Xe',
    subtitle: 'Rửa xe trước, thanh toán tại quầy khi xe hoàn tất (cùng lượt ghé)',
    icon: Clock,
    active: false,
    badge: 'Sắp ra mắt',
  },
];

export const K9_PaymentMethod: React.FC = () => {
  const {
    paymentMethod,
    selectPaymentMethod,
    finalTotal,
    goToStep,
    showToast,
    initiatePayment,
  } = useKiosk();

  const [shakeId, setShakeId] = useState<string | null>(null);

  const handleOptionClick = (opt: PaymentOption) => {
    if (!opt.active) {
      setShakeId(opt.id);
      setTimeout(() => setShakeId(null), 500);
      showToast('Phương thức này chưa khả dụng, vui lòng chọn Chuyển khoản QR.');
      return;
    }

    selectPaymentMethod(opt.id);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-7 max-w-3xl mx-auto w-full">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <button
          type="button"
          onClick={() => goToStep('K8')}
          className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-mid-gray hover:text-matte-black transition py-1 px-2 rounded-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại đơn hàng</span>
        </button>

        <span className="text-xs font-semibold text-gray-500">
          Tổng tiền thanh toán: <strong className="text-brand-green font-display font-bold">{formatVND(finalTotal)}</strong>
        </span>
      </div>

      <div className="text-center my-4">
        <h1 className="text-2xl sm:text-3xl font-display font-black text-matte-black uppercase tracking-tight">
          Chọn Phương Thức Thanh Toán
        </h1>
        <p className="text-xs sm:text-sm text-mid-gray mt-1 max-w-md mx-auto">
          Hiện tại hệ thống áp dụng cổng thanh toán Chuyển khoản QR tự động xác nhận tức thì.
        </p>
      </div>

      {/* 4 Payment Cards */}
      <div className="space-y-3.5 my-3 flex-1 overflow-y-auto touch-scroll">
        {PAYMENT_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = paymentMethod === opt.id && opt.active;
          const isShaking = shakeId === opt.id;

          return (
            <div
              key={opt.id}
              onClick={() => handleOptionClick(opt)}
              className={`p-5 rounded-3xl border-2 transition-all duration-200 cursor-pointer relative flex items-center justify-between gap-4 ${
                isShaking ? 'animate-shake' : ''
              } ${
                isSelected
                  ? 'bg-brand-green-light border-brand-green shadow-md shadow-brand-green/20 scale-[1.01]'
                  : opt.active
                  ? 'bg-white border-stone-300 hover:border-brand-green/60 shadow-xs'
                  : 'bg-stone-50/70 border-stone-200 opacity-60 hover:opacity-80'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'bg-brand-green text-matte-black shadow-xs'
                      : opt.active
                      ? 'bg-stone-100 text-slate-800'
                      : 'bg-stone-200 text-gray-400'
                  }`}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-display font-black text-base sm:text-lg ${opt.active ? 'text-matte-black' : 'text-gray-500'}`}>
                      {opt.name}
                    </h3>
                    {opt.badge && (
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          opt.active
                            ? 'bg-brand-green/30 text-forest-green border border-brand-green/40'
                            : 'bg-stone-200 text-gray-500'
                        }`}
                      >
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-mid-gray mt-1 max-w-lg leading-relaxed">
                    {opt.subtitle}
                  </p>
                </div>
              </div>

              {/* Selection Checkmark or Disabled Indicator */}
              <div className="shrink-0">
                {opt.active ? (
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isSelected
                        ? 'bg-brand-green text-matte-black shadow-xs'
                        : 'border-2 border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-5 h-5" />}
                  </div>
                ) : (
                  <div className="text-[11px] text-gray-400 font-bold bg-stone-200 px-2.5 py-1 rounded-lg">
                    Chưa hỗ trợ
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Instruction Note */}
      <div className="bg-brand-green-light/70 border border-brand-green/30 rounded-2xl p-4 flex items-center gap-3 text-xs text-matte-black mt-2">
        <QrCode className="w-5 h-5 text-forest-green shrink-0" />
        <span>
          Mã QR sẽ hiển thị ngay ở bước kế tiếp kèm đồng hồ đếm ngược 60 giây. Sau khi chuyển khoản thành công, hệ thống tự động xuất mã lệnh rửa xe (Work Order) trong vòng ≤3 giây.
        </span>
      </div>
    </div>
  );
};
