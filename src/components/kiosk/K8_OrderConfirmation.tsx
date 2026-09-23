import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { formatVND } from '../../lib/format';
import {
  Tag,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Car,
  Receipt,
  TicketPercent,
  X,
  AlertCircle,
} from 'lucide-react';

export const K8_OrderConfirmation: React.FC = () => {
  const {
    customer,
    selectedVehicle,
    selectedPackage,
    selectedAddons,
    vouchers,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    subtotal,
    discountAmount,
    finalTotal,
    goToStep,
    showToast,
  } = useKiosk();

  const [customVoucherInput, setCustomVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);

  const vehicleClass = selectedVehicle?.vehicle_class || '4_5_cho';

  const handleApplyVoucherCode = (code: string) => {
    setVoucherError(null);
    const res = applyVoucher(code);
    if (res.success) {
      showToast(`Áp dụng mã ${code.toUpperCase()} thành công!`);
      setCustomVoucherInput('');
      setShowManualInput(false);
    } else {
      setVoucherError(res.message || 'Mã không hợp lệ.');
    }
  };

  const totalDuration =
    (selectedPackage?.duration_min || 0) +
    selectedAddons.reduce((acc, a) => acc + a.duration_min, 0);

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-7 max-w-3xl mx-auto w-full">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <button
          type="button"
          onClick={() => goToStep('K7')}
          className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-mid-gray hover:text-matte-black transition py-1 px-2 rounded-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại chỉnh sửa</span>
        </button>

        <span className="text-xs font-semibold text-gray-500">
          Thời gian dự kiến: <strong className="text-matte-black">{totalDuration} phút</strong>
        </span>
      </div>

      <div className="text-center my-3">
        <h1 className="text-2xl sm:text-3xl font-display font-black text-matte-black uppercase tracking-tight">
          Xác Nhận Đơn Hàng & Ưu Đãi
        </h1>
        <p className="text-xs sm:text-sm text-mid-gray mt-1 max-w-md mx-auto">
          Kiểm tra chi tiết dịch vụ, áp dụng mã ưu đãi thành viên trước khi tiến hành thanh toán.
        </p>
      </div>

      {/* Main Order Card */}
      <div className="bg-white border-2 border-stone-200 rounded-3xl p-5 sm:p-6 shadow-sm my-3 flex-1 overflow-y-auto touch-scroll">
        {/* Customer & Vehicle Header Box */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-green/20 text-forest-green flex items-center justify-center">
              <Car className="w-6 h-6 text-forest-green" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-black text-xl text-matte-black">
                  {selectedVehicle?.license_plate || 'Chưa chọn'}
                </span>
                <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                  {vehicleClass === '4_5_cho' ? '4-5 chỗ' : '7-9 chỗ'}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Chủ xe: <strong>{customer?.name}</strong> • {customer?.phone}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => goToStep('K5')}
            className="text-xs font-bold text-mid-gray hover:text-matte-black underline decoration-stone-300"
          >
            Đổi xe
          </button>
        </div>

        {/* Itemized Line items */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-brand-green" />
            <span>Chi Tiết Dịch Vụ Đã Chọn</span>
          </h3>

          {/* Main Package */}
          {selectedPackage && (
            <div className="p-3.5 rounded-2xl bg-brand-green-light/60 border border-brand-green/30 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-xs uppercase px-2 py-0.5 rounded bg-matte-black text-white">
                    {selectedPackage.tier}
                  </span>
                  <span className="font-display font-black text-sm text-matte-black">
                    {selectedPackage.name}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                  <Clock className="w-3 h-3 text-forest-green" />
                  <span>{selectedPackage.duration_min}–{selectedPackage.duration_max} phút</span>
                  <span>• Định mức bọt sinh học pH 7.0</span>
                </div>
              </div>
              <span className="font-display font-black text-base text-matte-black">
                {formatVND(vehicleClass === '4_5_cho' ? selectedPackage.base_price_4_5 : selectedPackage.base_price_7_9)}
              </span>
            </div>
          )}

          {/* Add-on Services */}
          {selectedAddons.map((a) => (
            <div
              key={a.id}
              className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-display font-bold text-slate-900">
                  + {a.name}
                </div>
                <div className="text-gray-500 text-[11px] mt-0.5">
                  +{a.duration_min} phút • {a.category}
                </div>
              </div>
              <span className="font-display font-bold text-slate-900">
                +{formatVND(vehicleClass === '4_5_cho' ? a.price_4_5 : a.price_7_9)}
              </span>
            </div>
          ))}
        </div>

        {/* Voucher Section */}
        <div className="pt-4 border-t border-stone-200 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
              <TicketPercent className="w-4 h-4 text-brand-green" />
              <span>Voucher & Ưu Đãi Thành Viên</span>
            </h3>

            {!showManualInput && (
              <button
                type="button"
                onClick={() => setShowManualInput(true)}
                className="text-xs font-bold text-brand-green hover:underline cursor-pointer"
              >
                + Nhập mã khác
              </button>
            )}
          </div>

          {/* Manual Input Form */}
          {showManualInput && (
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="Nhập mã voucher (vd: WASSUP20K)"
                value={customVoucherInput}
                onChange={(e) => {
                  setCustomVoucherInput(e.target.value.toUpperCase());
                  setVoucherError(null);
                }}
                className="flex-1 h-12 px-3.5 rounded-xl border-2 border-stone-300 focus:border-brand-green focus:outline-hidden text-sm uppercase font-mono tracking-wider text-matte-black"
              />
              <button
                type="button"
                onClick={() => handleApplyVoucherCode(customVoucherInput)}
                className="h-12 px-4 rounded-xl bg-matte-black text-white hover:bg-black font-display font-bold text-xs uppercase cursor-pointer"
              >
                Áp dụng
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowManualInput(false);
                  setVoucherError(null);
                }}
                className="h-12 px-3 rounded-xl border border-stone-300 hover:bg-stone-100 text-xs text-gray-500"
              >
                Hủy
              </button>
            </div>
          )}

          {voucherError && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 mb-3 bg-red-50 p-2 rounded-xl border border-red-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{voucherError}</span>
            </div>
          )}

          {/* Quick Eligible Voucher Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {vouchers.map((v) => {
              const isApplied = appliedVoucher?.code === v.code;
              const isEligible = subtotal >= v.min_order_value;

              return (
                <div
                  key={v.code}
                  onClick={() => {
                    if (isApplied) {
                      removeVoucher();
                      showToast('Đã gỡ mã ưu đãi.');
                    } else if (isEligible) {
                      handleApplyVoucherCode(v.code);
                    } else {
                      showToast(`Đơn hàng tối thiểu ${formatVND(v.min_order_value)} để áp dụng`);
                    }
                  }}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isApplied
                      ? 'bg-brand-green-light border-brand-green shadow-xs'
                      : isEligible
                      ? 'bg-stone-50 hover:bg-stone-100/80 border-stone-200'
                      : 'bg-stone-100/50 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Tag className={`w-4 h-4 ${isApplied ? 'text-forest-green' : 'text-gray-400'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-matte-black">
                          {v.code}
                        </span>
                        {v.badge && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                            {v.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {v.title}
                      </div>
                    </div>
                  </div>

                  {isApplied ? (
                    <div className="flex items-center gap-1 text-xs font-bold text-forest-green">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Đã áp</span>
                      <X className="w-3.5 h-3.5 ml-1 text-gray-400 hover:text-red-500" />
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold text-brand-green uppercase">
                      Chọn áp
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="pt-4 border-t-2 border-stone-200/80 space-y-2 text-sm">
          <div className="flex items-center justify-between text-gray-600">
            <span>Tổng tiền dịch vụ:</span>
            <span className="font-sans font-bold text-matte-black">{formatVND(subtotal)}</span>
          </div>

          {appliedVoucher && discountAmount > 0 && (
            <div className="flex items-center justify-between text-forest-green font-bold">
              <span>Ưu đãi voucher ({appliedVoucher.code}):</span>
              <span>-{formatVND(discountAmount)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Thuế giá trị gia tăng (VAT 8%):</span>
            <span>Đã bao gồm trong giá niêm yết</span>
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-baseline justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-gray-400 block">
                Tổng thanh toán thực tế:
              </span>
              <span className="text-[11px] text-gray-400">Không phụ phí phát sinh</span>
            </div>
            <div className="text-right">
              {appliedVoucher && discountAmount > 0 && (
                <span className="text-sm line-through text-gray-400 block font-sans">
                  {formatVND(subtotal)}
                </span>
              )}
              <span className="text-3xl font-display font-black text-brand-green">
                {formatVND(finalTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
