import React from 'react';
import { useKiosk } from '../../context/KioskContext';
import { AddonService } from '../../types/kiosk';
import { formatVND } from '../../lib/format';
import { Clock, Plus, Check, ArrowLeft, Wind, Disc, ShieldCheck, Cpu, Sparkles } from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Wind,
  Disc,
  ShieldCheck,
  Cpu,
  Sparkles,
};

export const K7_AddonCatalog: React.FC = () => {
  const { addons, selectedAddons, toggleAddon, selectedVehicle, goToStep, showToast } = useKiosk();

  const vehicleClass = selectedVehicle?.vehicle_class || '4_5_cho';

  const handleToggle = (addon: AddonService) => {
    toggleAddon(addon);
    const isAdding = !selectedAddons.some((a) => a.id === addon.id);
    const price = vehicleClass === '4_5_cho' ? addon.price_4_5 : addon.price_7_9;
    showToast(isAdding ? `Đã thêm: ${addon.name} (+${formatVND(price)})` : `Đã bỏ: ${addon.name}`);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-7 max-w-5xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <button
          type="button"
          onClick={() => goToStep('K6')}
          className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-mid-gray hover:text-matte-black transition py-1 px-2 rounded-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại chọn gói</span>
        </button>

        <span className="text-xs font-semibold text-gray-500">
          Đã chọn: <strong className="text-matte-black">{selectedAddons.length} dịch vụ thêm</strong>
        </span>
      </div>

      <div className="text-center my-3">
        <h1 className="text-2xl sm:text-3xl font-display font-black text-matte-black uppercase tracking-tight">
          Chọn Dịch Vụ Lẻ Thêm (Tùy Chọn)
        </h1>
        <p className="text-xs sm:text-sm text-mid-gray mt-1 max-w-md mx-auto">
          Tăng cường bảo vệ và làm sạch chuyên sâu. Có thể bỏ qua và tiếp tục ngay.
        </p>
      </div>

      {/* Grid of Addons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-3 flex-1 overflow-y-auto touch-scroll pb-4">
        {addons.map((addon) => {
          const isSelected = selectedAddons.some((a) => a.id === addon.id);
          const price = vehicleClass === '4_5_cho' ? addon.price_4_5 : addon.price_7_9;
          const IconComp = ICON_MAP[addon.icon_name] || Sparkles;

          return (
            <div
              key={addon.id}
              onClick={() => handleToggle(addon)}
              className={`rounded-3xl p-5 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between relative min-h-[200px] ${
                isSelected
                  ? 'bg-brand-green-light border-brand-green shadow-md shadow-brand-green/15 scale-[1.01]'
                  : 'bg-white border-stone-200 hover:border-brand-green/50 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition ${
                      isSelected ? 'bg-brand-green text-matte-black' : 'bg-stone-100 text-slate-700'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 bg-stone-100 px-2 py-0.5 rounded-lg">
                    <Clock className="w-3 h-3 text-brand-green" />
                    <span>+{addon.duration_min} phút</span>
                  </div>
                </div>

                <h3 className="font-display font-black text-base text-matte-black leading-snug mt-2">
                  {addon.name}
                </h3>
                <p className="text-xs text-mid-gray mt-1 leading-relaxed">
                  {addon.description_md}
                </p>
              </div>

              {/* Price and Checkbox */}
              <div className="flex items-end justify-between pt-3 border-t border-stone-200/70 mt-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">
                    Phụ thu ({vehicleClass === '4_5_cho' ? '4-5 chỗ' : '7-9 chỗ'})
                  </span>
                  <div className="font-display font-black text-xl text-matte-black">
                    +{formatVND(price)}
                  </div>
                </div>

                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                    isSelected
                      ? 'bg-brand-green text-matte-black shadow-sm'
                      : 'bg-stone-100 text-gray-400 border border-stone-300'
                  }`}
                >
                  {isSelected ? <Check className="w-5 h-5 stroke-[3]" /> : <Plus className="w-4 h-4" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skip or Proceed note */}
      <div className="mt-auto text-center py-2">
        <p className="text-xs text-gray-500">
          Chưa muốn chọn thêm? Bạn có thể bấm <strong className="text-matte-black">"Xem đơn hàng & Ưu đãi →"</strong> ở thanh bên dưới để tiếp tục ngay.
        </p>
      </div>
    </div>
  );
};
