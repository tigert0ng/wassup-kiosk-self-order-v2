import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { Vehicle, VehicleClass } from '../../types/kiosk';
import { Car, Plus, CheckCircle2, AlertCircle, ArrowLeft, Shield } from 'lucide-react';

export const K5_VehicleSelection: React.FC = () => {
  const { customer, selectedVehicle, selectVehicle, addNewVehicle, goToStep, showToast } = useKiosk();

  const vehicles = customer?.vehicles || [];
  const [showAddForm, setShowAddForm] = useState(vehicles.length === 0);
  const [plateInput, setPlateInput] = useState('');
  const [modelInput, setModelInput] = useState('');
  const [selectedClass, setSelectedClass] = useState<VehicleClass | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleVehicleCardClick = (v: Vehicle) => {
    selectVehicle(v);
    showToast(`Đã chọn xe: ${v.license_plate} (${v.vehicle_class === '4_5_cho' ? '4-5 chỗ' : '7-9 chỗ'})`);
  };

  const handleSaveNewVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanPlate = plateInput.trim().toUpperCase();
    if (!cleanPlate) {
      setFormError('Vui lòng nhập biển số xe.');
      return;
    }

    if (!selectedClass) {
      setFormError('Bắt buộc chọn phân hạng xe (4-5 chỗ hoặc 7-9 chỗ).');
      return;
    }

    const created = addNewVehicle(cleanPlate, selectedClass, modelInput.trim() || undefined);
    setShowAddForm(false);
    setPlateInput('');
    setModelInput('');
    setSelectedClass(null);
    showToast(`Đã thêm xe mới: ${created.license_plate}!`);
  };

  return (
    <div className="flex-1 flex flex-col p-5 sm:p-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <button
          type="button"
          onClick={() => goToStep('K2')}
          className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-mid-gray hover:text-matte-black transition py-1 px-2 rounded-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Đổi khách hàng</span>
        </button>

        <div className="text-right">
          <span className="text-xs text-mid-gray">Khách hàng: </span>
          <span className="text-xs font-display font-bold text-matte-black">
            {customer?.name || 'Khách vãng lai'}
          </span>
          <span className="ml-2 inline-block bg-brand-green/20 text-forest-green text-[10px] font-bold px-2 py-0.5 rounded-full">
            {customer?.sup_points || 0} điểm SUP
          </span>
        </div>
      </div>

      <div className="text-center my-4">
        <h1 className="text-2xl sm:text-3xl font-display font-black text-matte-black uppercase tracking-tight">
          Xe Của Bạn & Phân Hạng Giá
        </h1>
        <p className="text-xs sm:text-sm text-mid-gray mt-1 max-w-md mx-auto">
          Chọn đúng xe để bảng giá được tính chính xác theo quy chuẩn diện tích thân vỏ.
        </p>
      </div>

      {/* Main Vehicles Grid or Add Form */}
      <div className="my-4 flex-1">
        {!showAddForm ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((v) => {
              const isSelected = selectedVehicle?.id === v.id;
              const isSedan = v.vehicle_class === '4_5_cho';

              return (
                <div
                  key={v.id}
                  onClick={() => handleVehicleCardClick(v)}
                  className={`relative p-5 rounded-3xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[190px] ${
                    isSelected
                      ? 'bg-brand-green-light border-brand-green shadow-md shadow-brand-green/20 scale-[1.02]'
                      : 'bg-white border-stone-200 hover:border-brand-green/60 hover:shadow-xs'
                  }`}
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-display font-extrabold uppercase px-2.5 py-1 rounded-lg ${
                        isSedan
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isSedan ? '4 - 5 Chỗ (Sedan)' : '7 - 9 Chỗ (SUV / Bán tải)'}
                    </span>

                    {isSelected && (
                      <div className="w-7 h-7 rounded-full bg-brand-green text-matte-black flex items-center justify-center font-black">
                        ✓
                      </div>
                    )}
                  </div>

                  {/* License Plate Display (Big & Bold) */}
                  <div className="my-3">
                    <div className="inline-block px-4 py-1.5 rounded-xl bg-white border-2 border-matte-black shadow-xs">
                      <span className="font-sans font-black text-2xl sm:text-3xl text-matte-black tracking-wider">
                        {v.license_plate}
                      </span>
                    </div>
                    {v.model_name && (
                      <div className="text-xs text-gray-600 font-medium mt-2 truncate">
                        {v.model_name}
                      </div>
                    )}
                  </div>

                  {/* Footer Info */}
                  <div className="text-[11px] text-gray-400 flex items-center justify-between pt-2 border-t border-stone-200/70">
                    <span>Lần ghé: {v.last_visit || 'Gần đây'}</span>
                    <span className="font-bold text-matte-black">
                      {isSelected ? 'Đã chọn' : 'Chạm để chọn'}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Always Include "+ Thêm xe mới" Card at end of list (US-K2.1) */}
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="p-5 rounded-3xl border-2 border-dashed border-stone-300 hover:border-brand-green bg-stone-50 hover:bg-stone-100/80 transition-all flex flex-col items-center justify-center min-h-[190px] text-center cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white group-hover:bg-brand-green/20 border border-stone-200 group-hover:border-brand-green text-mid-gray group-hover:text-forest-green flex items-center justify-center transition-all mb-3 shadow-xs">
                <Plus className="w-7 h-7" />
              </div>
              <span className="font-display font-black text-sm uppercase tracking-wider text-matte-black">
                + Thêm Xe Mới
              </span>
              <span className="text-xs text-mid-gray mt-1">
                Nhập biển số & phân hạng xe
              </span>
            </button>
          </div>
        ) : (
          /* Add Vehicle Form */
          <div className="bg-white border-2 border-stone-200 rounded-3xl p-6 sm:p-8 max-w-xl mx-auto shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
              <h3 className="font-display font-black text-lg uppercase text-matte-black">
                Đăng Ký Xe Mới Vào Hồ Sơ
              </h3>
              {vehicles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs font-bold text-mid-gray hover:text-matte-black"
                >
                  Hủy / Chọn xe có sẵn
                </button>
              )}
            </div>

            <form onSubmit={handleSaveNewVehicle} className="space-y-4">
              {/* License Plate Input */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  1. Biển Số Xe *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 51K-889.24"
                  value={plateInput}
                  onChange={(e) => {
                    setPlateInput(e.target.value.toUpperCase());
                    setFormError(null);
                  }}
                  className="w-full h-15 px-4 rounded-2xl border-2 border-stone-300 focus:border-brand-green focus:outline-hidden bg-white text-2xl font-sans font-black tracking-widest text-matte-black text-center shadow-xs"
                />
              </div>

              {/* Mandatory Vehicle Class Selection */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>2. Bắt Buộc Chọn Phân Hạng Xe *</span>
                  <span className="text-[10px] text-amber-700 font-bold lowercase">
                    (không có mặc định)
                  </span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: 4-5 Seats */}
                  <div
                    onClick={() => {
                      setSelectedClass('4_5_cho');
                      setFormError(null);
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedClass === '4_5_cho'
                        ? 'bg-brand-green-light border-brand-green shadow-xs'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-black text-sm uppercase text-matte-black">
                        4 - 5 Chỗ
                      </span>
                      {selectedClass === '4_5_cho' && (
                        <CheckCircle2 className="w-5 h-5 text-forest-green" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600">
                      Sedan, Hatchback, Crossover cỡ nhỏ (Mazda 3, Vios, City...)
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      Giá tiêu chuẩn
                    </span>
                  </div>

                  {/* Option 2: 7-9 Seats */}
                  <div
                    onClick={() => {
                      setSelectedClass('7_9_cho');
                      setFormError(null);
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedClass === '7_9_cho'
                        ? 'bg-brand-green-light border-brand-green shadow-xs'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-black text-sm uppercase text-matte-black">
                        7 - 9 Chỗ / Bán Tải
                      </span>
                      {selectedClass === '7_9_cho' && (
                        <CheckCircle2 className="w-5 h-5 text-forest-green" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600">
                      SUV, MPV cỡ lớn, Pickup (Everest, Carnival, Fortuner, Ranger...)
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      Phụ thu theo diện tích
                    </span>
                  </div>
                </div>
              </div>

              {/* Model Name Input (Optional) */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  3. Dòng xe & Màu sắc (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: VinFast VF8 (Màu Xanh Rêu)"
                  value={modelInput}
                  onChange={(e) => setModelInput(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-stone-300 focus:border-brand-green focus:outline-hidden bg-white text-sm text-matte-black shadow-xs"
                />
              </div>

              {formError && (
                <div className="flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full min-h-[58px] rounded-2xl bg-brand-green hover:bg-brand-green-hover text-matte-black font-display font-black text-sm uppercase tracking-wider shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Lưu Xe & Chọn Ngay</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer Info Box */}
      <div className="mt-auto bg-stone-100 rounded-2xl p-3 text-center text-xs text-gray-600 border border-stone-200/80">
        Phân hạng xe xác định định mức hóa chất bọt tuyết và thời gian sấy thổi khô tương ứng.
      </div>
    </div>
  );
};
