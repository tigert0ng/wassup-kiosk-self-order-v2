import React from 'react';
import { useKiosk } from '../../context/KioskContext';
import { AddonService } from '../../types/kiosk';
import { formatVND } from '../../lib/format';
import { Clock, Plus, Check, ArrowLeft, Wind, Disc, ShieldCheck, Cpu, Sparkles, Flame } from 'lucide-react';

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
    <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-6xl mx-auto w-full">
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

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">
            Đã chọn: <strong className="text-brand-green font-bold">{selectedAddons.length} dịch vụ thêm</strong>
          </span>
          {selectedAddons.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          )}
        </div>
      </div>

      <div className="text-center my-3">
        <h1 className="text-xl sm:text-2xl font-display font-black text-matte-black uppercase tracking-tight">
          Chọn Dịch Vụ Lẻ Thêm (Tùy Chọn)
        </h1>
        <p className="text-xs sm:text-sm text-mid-gray mt-1 max-w-lg mx-auto">
          Tăng cường bảo vệ và làm sạch chuyên sâu. Có thể chọn nhiều dịch vụ hoặc tiếp tục ngay.
        </p>
      </div>

      {/* Grid 3 cột cho màn hình Kiosk 24-inch (1080x1920) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-2 flex-1 overflow-y-auto touch-scroll pb-4">
        {addons.map((addon) => {
          const isSelected = selectedAddons.some((a) => a.id === addon.id);
          const price = vehicleClass === '4_5_cho' ? addon.price_4_5 : addon.price_7_9;
          const IconComp = ICON_MAP[addon.icon_name] || Sparkles;
          const isBestSeller = !!addon.is_best_seller;

          return (
            <div
              key={addon.id}
              onClick={() => handleToggle(addon)}
              className={`group rounded-3xl overflow-hidden border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between relative select-none ${
                // Best seller card styles
                isBestSeller
                  ? isSelected
                    ? 'bg-[#1b2612] border-brand-green ring-3 ring-brand-green/30 shadow-lg shadow-brand-green/20 scale-[1.015]'
                    : 'bg-[#181d14] border-brand-green/70 hover:border-brand-green shadow-md shadow-brand-green/10'
                  : isSelected
                  ? 'bg-brand-green-light/90 border-brand-green shadow-md shadow-brand-green/15 scale-[1.01]'
                  : 'bg-white border-stone-200 hover:border-brand-green/50 hover:shadow-xs'
              }`}
            >
              <div>
                {/* Thumbnail Image Container */}
                <div className="relative h-36 w-full overflow-hidden bg-stone-900">
                  <img
                    src={addon.image_url || 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80'}
                    alt={addon.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Best Seller Badge in Brand Green */}
                  {isBestSeller && (
                    <div className="absolute top-3 left-3 bg-brand-green text-matte-black font-display font-black text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-matte-black text-matte-black" />
                      <span>BEST SELLER</span>
                    </div>
                  )}

                  {/* Category Pill */}
                  {!isBestSeller && addon.category && (
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/20">
                      {addon.category === 'interior' ? 'Nội thất' : addon.category === 'exterior' ? 'Ngoại thất' : 'Bảo vệ'}
                    </div>
                  )}

                  {/* Duration Tag */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-lg border border-white/15 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-brand-green" />
                    <span>+{addon.duration_min}p</span>
                  </div>

                  {/* Checkbox Floating Indicator on Thumbnail */}
                  <div
                    className={`absolute bottom-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                      isSelected
                        ? 'bg-brand-green text-matte-black scale-105 ring-2 ring-white/30'
                        : isBestSeller
                        ? 'bg-black/70 text-brand-green border border-brand-green/50'
                        : 'bg-white/90 text-gray-500 border border-stone-300'
                    }`}
                  >
                    {isSelected ? <Check className="w-5 h-5 stroke-[3]" /> : <Plus className="w-4 h-4" />}
                  </div>

                  {/* Floating Icon */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-xs ${
                        isBestSeller
                          ? 'bg-brand-green/30 text-brand-green border border-brand-green/40'
                          : isSelected
                          ? 'bg-brand-green text-matte-black'
                          : 'bg-black/60 text-white border border-white/20'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4">
                  <h3
                    className={`font-display font-black text-sm sm:text-base leading-snug line-clamp-1 ${
                      isBestSeller ? 'text-brand-green' : isSelected ? 'text-matte-black' : 'text-slate-900'
                    }`}
                  >
                    {addon.name}
                  </h3>

                  <p
                    className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${
                      isBestSeller ? 'text-gray-300' : 'text-mid-gray'
                    }`}
                  >
                    {addon.description_md}
                  </p>
                </div>
              </div>

              {/* Card Footer: Price & Selection Status */}
              <div
                className={`px-4 py-3 border-t flex items-center justify-between mt-auto ${
                  isBestSeller
                    ? 'border-stone-800/80 bg-black/30'
                    : isSelected
                    ? 'border-brand-green/20 bg-brand-green/10'
                    : 'border-stone-100 bg-stone-50/70'
                }`}
              >
                <div>
                  <span
                    className={`text-[10px] uppercase font-bold block ${
                      isBestSeller ? 'text-gray-400' : 'text-gray-400'
                    }`}
                  >
                    Phụ thu ({vehicleClass === '4_5_cho' ? '4-5 chỗ' : '7-9 chỗ'})
                  </span>
                  <div
                    className={`font-display font-black text-lg ${
                      isBestSeller ? 'text-brand-green' : isSelected ? 'text-forest-green' : 'text-matte-black'
                    }`}
                  >
                    +{formatVND(price)}
                  </div>
                </div>

                <div
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                    isSelected
                      ? 'bg-brand-green text-matte-black font-extrabold'
                      : isBestSeller
                      ? 'text-brand-green border border-brand-green/40 hover:bg-brand-green/10'
                      : 'text-slate-600 bg-white border border-stone-200'
                  }`}
                >
                  {isSelected ? 'Đã chọn' : '+ Thêm'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skip or Proceed Note */}
      <div className="mt-auto text-center pt-2">
        <p className="text-xs text-gray-500">
          Chưa muốn chọn thêm? Bạn có thể bấm <strong className="text-matte-black">"Xem đơn hàng & Ưu đãi →"</strong> ở thanh bên dưới để tiếp tục ngay.
        </p>
      </div>
    </div>
  );
};
