import React from 'react';
import { useKiosk } from '../../context/KioskContext';
import { formatVND } from '../../lib/format';
import { KioskStep } from '../../types/kiosk';
import { Car, Package, Sparkles, CheckSquare, CreditCard, XCircle, ChevronRight, Lock } from 'lucide-react';

interface StepMeta {
  step: KioskStep;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepMeta[] = [
  { step: 'K5', label: 'Xe của bạn', shortLabel: 'Xe', icon: Car },
  { step: 'K6', label: 'Gói dịch vụ', shortLabel: 'Gói', icon: Package },
  { step: 'K7', label: 'Dịch vụ thêm', shortLabel: 'Thêm', icon: Sparkles },
  { step: 'K8', label: 'Xác nhận đơn', shortLabel: 'Đơn', icon: CheckSquare },
  { step: 'K9', label: 'Thanh toán', shortLabel: 'Trả', icon: CreditCard },
];

export const StickyFooterBar: React.FC = () => {
  const {
    step,
    goToStep,
    subtotal,
    discountAmount,
    finalTotal,
    appliedVoucher,
    selectedVehicle,
    selectedPackage,
    initiatePayment,
    cancelCurrentSession,
    showToast,
  } = useKiosk();

  // Only show footer on K5, K6, K7, K8, K9, K10
  const isFooterVisible = ['K5', 'K6', 'K7', 'K8', 'K9', 'K10'].includes(step);
  if (!isFooterVisible) return null;

  const isLocked = step === 'K10';
  const currentStepIndex = STEPS.findIndex((s) => s.step === step);

  // Determine CTA label and disabled state
  let ctaLabel = 'Tiếp tục';
  let ctaDisabled = false;
  let onCtaClick = () => {};

  if (step === 'K5') {
    ctaLabel = 'Tiếp tục chọn gói';
    ctaDisabled = !selectedVehicle;
    onCtaClick = () => {
      if (!selectedVehicle) {
        showToast('Vui lòng chọn hoặc thêm xe để tiếp tục');
        return;
      }
      goToStep('K6');
    };
  } else if (step === 'K6') {
    ctaLabel = 'Tiếp tục: Dịch vụ thêm';
    ctaDisabled = !selectedPackage;
    onCtaClick = () => {
      if (!selectedPackage) {
        showToast('Vui lòng chọn 1 gói rửa chính');
        return;
      }
      goToStep('K7');
    };
  } else if (step === 'K7') {
    ctaLabel = 'Xem đơn hàng & Ưu đãi';
    ctaDisabled = false;
    onCtaClick = () => goToStep('K8');
  } else if (step === 'K8') {
    ctaLabel = 'Thanh toán ngay';
    ctaDisabled = false;
    onCtaClick = () => goToStep('K9');
  } else if (step === 'K9') {
    ctaLabel = 'Quét mã QR thanh toán';
    ctaDisabled = false;
    onCtaClick = () => initiatePayment();
  }

  const handleStepClick = (targetIndex: number) => {
    if (isLocked) {
      showToast('Giao dịch đang xử lý. Thanh điều hướng tạm thời bị khóa.');
      return;
    }
    // Can jump back to any already-passed step
    if (targetIndex < currentStepIndex) {
      goToStep(STEPS[targetIndex].step);
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 z-40 bg-[#1A1A1A] border-t-2 border-[#2A2A2A] text-white shadow-2xl backdrop-blur-md">
      {/* Top micro progress tracker */}
      <div className="bg-[#111111] px-4 py-2 border-b border-[#262626] flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-0.5">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isCurrent = s.step === step;
            const isCompleted = idx < currentStepIndex;
            const isClickable = isCompleted && !isLocked;

            return (
              <React.Fragment key={s.step}>
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => handleStepClick(idx)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isCurrent
                      ? 'bg-brand-green text-matte-black shadow-sm font-black'
                      : isCompleted
                      ? 'bg-[#222222] text-gray-300 hover:text-brand-green hover:bg-[#2c2c2c] cursor-pointer'
                      : 'text-gray-500 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-matte-black' : isCompleted ? 'text-brand-green' : 'text-gray-500'}`} />
                  <span className="hidden sm:inline font-display">{s.label}</span>
                  <span className="sm:hidden font-display">{s.shortLabel}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-gray-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Lock indicator or session cancel button */}
        {isLocked ? (
          <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-800/40">
            <Lock className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-semibold hidden sm:inline">Khóa điều hướng</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={cancelCurrentSession}
            className="flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold text-gray-400 hover:text-red-400 hover:bg-red-950/30 px-2.5 py-1 rounded-lg transition"
            title="Hủy toàn bộ thao tác và kết thúc phiên"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Hủy phiên</span>
          </button>
        )}
      </div>

      {/* Main Footer Control Area */}
      {!isLocked ? (
        <div className="px-5 py-3.5 sm:px-8 sm:py-4 flex items-center justify-between gap-4">
          {/* Left: Total Price Summary */}
          <div className="flex flex-col justify-center">
            <span className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">
              {appliedVoucher ? 'Tổng cộng sau ưu đãi' : 'Tổng tiền tạm tính'}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              {appliedVoucher && discountAmount > 0 && (
                <span className="text-sm line-through text-gray-500 font-sans">
                  {formatVND(subtotal)}
                </span>
              )}
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-brand-green tracking-tight">
                {formatVND(finalTotal)}
              </span>
            </div>
            <span className="text-[10px] text-gray-400">Đã gồm VAT (8%)</span>
          </div>

          {/* Right: Large Touch CTA Button (≥64px height) */}
          <button
            type="button"
            disabled={ctaDisabled}
            onClick={onCtaClick}
            className={`min-h-[64px] px-6 sm:px-10 rounded-2xl font-display font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] shadow-lg ${
              ctaDisabled
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                : 'bg-brand-green hover:bg-brand-green-hover text-matte-black shadow-brand-green/20 hover:shadow-brand-green/30 cursor-pointer'
            }`}
          >
            <span>{ctaLabel}</span>
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      ) : (
        /* K10 locked state info */
        <div className="px-6 py-4 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span>Đang chờ cổng thanh toán VNPay xác nhận...</span>
          </div>
          <span className="font-display font-bold text-brand-green text-base">
            {formatVND(finalTotal)}
          </span>
        </div>
      )}
    </div>
  );
};
