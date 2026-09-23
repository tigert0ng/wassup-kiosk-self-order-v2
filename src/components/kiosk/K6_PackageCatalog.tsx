import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { ServicePackage } from '../../types/kiosk';
import { formatVND } from '../../lib/format';
import { Clock, Sparkles, CheckCircle2, Info, ArrowLeft } from 'lucide-react';

export const K6_PackageCatalog: React.FC = () => {
  const { packages, selectedPackage, selectPackage, selectedVehicle, goToStep, showToast } = useKiosk();
  const [detailModalPackage, setDetailModalPackage] = useState<ServicePackage | null>(null);

  const vehicleClass = selectedVehicle?.vehicle_class || '4_5_cho';

  const handleSelect = (pkg: ServicePackage) => {
    selectPackage(pkg);
    const price = vehicleClass === '4_5_cho' ? pkg.base_price_4_5 : pkg.base_price_7_9;
    showToast(`Đã chọn gói: ${pkg.name} (${formatVND(price)})`);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-7 max-w-5xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <button
          type="button"
          onClick={() => goToStep('K5')}
          className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-mid-gray hover:text-matte-black transition py-1 px-2 rounded-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Đổi xe khác</span>
        </button>

        {selectedVehicle && (
          <div className="flex items-center gap-2 bg-stone-100 border border-stone-300 px-3 py-1 rounded-xl">
            <span className="font-sans font-bold text-xs text-matte-black">
              {selectedVehicle.license_plate}
            </span>
            <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              {vehicleClass === '4_5_cho' ? '4-5 chỗ' : '7-9 chỗ'}
            </span>
          </div>
        )}
      </div>

      <div className="text-center my-3">
        <h1 className="text-xl sm:text-2xl font-display font-black text-matte-black uppercase tracking-tight">
          Chọn Dịch Vụ
        </h1>
        <p className="text-xs sm:text-sm text-mid-gray mt-1 max-w-lg mx-auto">
          Giá tự động điều chỉnh theo phân hạng xe đã chọn ({vehicleClass === '4_5_cho' ? '4-5 chỗ' : '7-9 chỗ'}). Chạm thẻ để chọn gói.
        </p>
      </div>

      {/* Grid 2 cột các gói dịch vụ (W0 - W5) cho màn hình đứng 24 inch */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 my-3 flex-1 overflow-y-auto touch-scroll pb-4">
        {packages.map((pkg, idx) => {
          const isSelected = selectedPackage?.id === pkg.id;
          const price = vehicleClass === '4_5_cho' ? pkg.base_price_4_5 : pkg.base_price_7_9;
          const isW2 = pkg.tier === 'W2';
          const isPopular = !!pkg.popular || pkg.tier === 'W1';
          const isLastPremium = idx === packages.length - 1 || pkg.tier === 'W5';

          // Specific color theming requested:
          // 1. Gói xịn nhất cuối cùng (W5): Màu đen, text warm gold (#AC9653), premium look
          // 2. Gói cao cấp W2: Warm Gold (#AC9653)
          // 3. Gói phổ biến (W1): Brand Green Volt (#A2C62C)
          // 4. Các gói khác: Nền trắng sạch sẽ

          let cardClasses = 'border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden min-h-[270px] rounded-3xl p-5';

          if (isLastPremium) {
            // Gói xịn nhất cuối cùng: Nền đen sang trọng, text warm gold
            cardClasses += isSelected
              ? ' bg-[#121212] text-white border-[#AC9653] shadow-xl shadow-[#AC9653]/25 ring-2 ring-[#AC9653] scale-[1.01]'
              : ' bg-[#181818] text-white border-[#AC9653]/50 hover:border-[#AC9653] shadow-md';
          } else if (isW2) {
            // Gói cao cấp W2: Warm Gold (#AC9653)
            cardClasses += isSelected
              ? ' bg-[#FAF7EE] text-matte-black border-[#AC9653] shadow-lg shadow-[#AC9653]/20 ring-2 ring-[#AC9653]/50 scale-[1.01]'
              : ' bg-[#FCFAF5] text-matte-black border-[#AC9653]/50 hover:border-[#AC9653] shadow-xs';
          } else if (isPopular) {
            // Gói phổ biến: Brand Green Volt (#A2C62C)
            cardClasses += isSelected
              ? ' bg-brand-green-light text-matte-black border-brand-green shadow-md shadow-brand-green/25 ring-2 ring-brand-green/50 scale-[1.01]'
              : ' bg-[#F9FCF0] text-matte-black border-brand-green/50 hover:border-brand-green shadow-xs';
          } else {
            // Gói thông thường
            cardClasses += isSelected
              ? ' bg-brand-green-light text-matte-black border-brand-green shadow-md shadow-brand-green/15 scale-[1.01]'
              : ' bg-white text-matte-black border-stone-200 hover:border-stone-400 shadow-xs';
          }

          return (
            <div
              key={pkg.id}
              onClick={() => handleSelect(pkg)}
              className={cardClasses}
            >
              {/* Top Tag & Duration */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Tier Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-lg font-display font-black text-xs uppercase tracking-wider ${
                      isLastPremium
                        ? 'bg-[#AC9653] text-[#121212]'
                        : isW2
                        ? 'bg-[#AC9653] text-white'
                        : isPopular
                        ? 'bg-brand-green text-matte-black'
                        : 'bg-matte-black text-white'
                    }`}
                  >
                    {pkg.tier}
                  </span>

                  {/* Highlights badge */}
                  {isLastPremium ? (
                    <span className="px-2 py-0.5 rounded-md bg-[#AC9653]/20 text-[#AC9653] border border-[#AC9653]/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#AC9653]" />
                      Master Premium
                    </span>
                  ) : isW2 ? (
                    <span className="px-2 py-0.5 rounded-md bg-[#AC9653]/15 text-[#8C7533] border border-[#AC9653]/30 text-[10px] font-bold uppercase tracking-wider">
                      Ceramic Cao Cấp
                    </span>
                  ) : isPopular ? (
                    <span className="px-2 py-0.5 rounded-md bg-brand-green text-matte-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3 text-matte-black" />
                      Phổ Biến Nhất
                    </span>
                  ) : null}
                </div>

                {/* Duration Badge */}
                <div
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                    isLastPremium
                      ? 'bg-stone-900 text-[#AC9653] border border-[#AC9653]/30'
                      : isW2
                      ? 'bg-[#F4EEDC] text-[#7A6428]'
                      : isPopular
                      ? 'bg-brand-green/20 text-[#4D6415]'
                      : 'bg-stone-100 text-gray-500'
                  }`}
                >
                  <Clock className={`w-3.5 h-3.5 ${isLastPremium || isW2 ? 'text-[#AC9653]' : 'text-brand-green'}`} />
                  <span>{pkg.duration_min}–{pkg.duration_max}p</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div>
                <h3
                  className={`font-display font-black text-base sm:text-lg leading-snug ${
                    isLastPremium ? 'text-white' : isW2 ? 'text-[#3E3113]' : 'text-matte-black'
                  }`}
                >
                  {pkg.name}
                </h3>
                <p
                  className={`text-xs mt-0.5 line-clamp-1 ${
                    isLastPremium ? 'text-stone-300' : 'text-mid-gray'
                  }`}
                >
                  {pkg.tagline}
                </p>
              </div>

              {/* Bullets List without nested scrollbar for 24-inch touch screen */}
              <div
                className={`my-2.5 py-2 border-y space-y-1.5 flex-1 ${
                  isLastPremium
                    ? 'border-stone-800'
                    : isW2
                    ? 'border-[#AC9653]/25'
                    : isPopular
                    ? 'border-brand-green/25'
                    : 'border-stone-200/80'
                }`}
              >
                {pkg.bullets.map((bullet, bIdx) => (
                  <div
                    key={bIdx}
                    className={`flex items-start gap-1.5 text-xs sm:text-[13px] leading-snug ${
                      isLastPremium ? 'text-stone-200' : 'text-gray-700'
                    }`}
                  >
                    <span
                      className={`font-bold text-sm leading-none shrink-0 ${
                        isLastPremium || isW2 ? 'text-[#AC9653]' : 'text-brand-green'
                      }`}
                    >
                      •
                    </span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {/* Price & Selection Indicator */}
              <div className="flex items-end justify-between pt-1">
                <div>
                  <span
                    className={`text-[10px] uppercase font-bold block ${
                      isLastPremium ? 'text-[#AC9653]/80' : isW2 ? 'text-[#8C7533]' : 'text-gray-400'
                    }`}
                  >
                    Giá trọn gói (gồm VAT)
                  </span>
                  <div
                    className={`font-display font-black text-2xl tracking-tight ${
                      isLastPremium
                        ? 'text-[#AC9653]'
                        : isW2
                        ? 'text-[#8C7533]'
                        : isPopular
                        ? 'text-matte-black'
                        : 'text-matte-black'
                    }`}
                  >
                    {formatVND(price)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailModalPackage(pkg);
                    }}
                    className={`p-2 rounded-xl transition ${
                      isLastPremium
                        ? 'text-stone-400 hover:text-white hover:bg-stone-800'
                        : 'text-gray-400 hover:text-matte-black hover:bg-stone-200/60'
                    }`}
                    title="Xem chi tiết toàn bộ quy trình"
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                      isSelected
                        ? isLastPremium || isW2
                          ? 'bg-[#AC9653] text-[#121212] shadow-sm'
                          : 'bg-brand-green text-matte-black shadow-sm'
                        : isLastPremium
                        ? 'bg-stone-800 text-stone-400 border border-stone-700'
                        : 'bg-stone-100 text-gray-400 border border-stone-300'
                    }`}
                  >
                    {isSelected ? <CheckCircle2 className="w-5 h-5" /> : 'Chọn'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Package Detail Modal */}
      {detailModalPackage && (
        <div className="fixed inset-0 z-50 bg-matte-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-matte-black text-white font-display font-black text-xs">
                  {detailModalPackage.tier}
                </span>
                <h3 className="font-display font-black text-lg text-matte-black">
                  {detailModalPackage.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalPackage(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-matte-black font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="my-4 flex-1 overflow-y-auto touch-scroll space-y-4 pr-1">
              <div className="rounded-2xl overflow-hidden h-40 bg-stone-900 relative">
                <img
                  src={detailModalPackage.image_url}
                  alt={detailModalPackage.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-matte-black/80 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-xs font-semibold">{detailModalPackage.tagline}</span>
                  <span className="text-xs font-bold bg-brand-green text-matte-black px-2 py-0.5 rounded">
                    {detailModalPackage.duration_min}–{detailModalPackage.duration_max} phút
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-gray-500 tracking-wider mb-2">
                  Quy trình chi tiết:
                </h4>
                <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  {detailModalPackage.bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <span className="text-forest-green font-bold">•</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-brand-green-light rounded-xl border border-brand-green/30 flex items-center justify-between">
                <span className="text-xs font-bold text-matte-black">
                  Giá xe {vehicleClass === '4_5_cho' ? '4-5 chỗ' : '7-9 chỗ'}:
                </span>
                <span className="font-display font-black text-xl text-matte-black">
                  {formatVND(vehicleClass === '4_5_cho' ? detailModalPackage.base_price_4_5 : detailModalPackage.base_price_7_9)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  handleSelect(detailModalPackage);
                  setDetailModalPackage(null);
                }}
                className="w-full min-h-[54px] rounded-2xl bg-brand-green hover:bg-brand-green-hover text-matte-black font-display font-black text-sm uppercase tracking-wider shadow-md cursor-pointer transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Chọn Gói Này & Tiếp Tục</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
