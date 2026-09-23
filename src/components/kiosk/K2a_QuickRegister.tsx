import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { ArrowLeft, UserPlus, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const K2a_QuickRegister: React.FC = () => {
  const { quickRegister, goToStep } = useKiosk();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('0909112233');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên của bạn.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Số điện thoại phải đủ 10 chữ số.');
      return;
    }

    if (pin.length !== 6) {
      setErrorMessage('Mã PIN phải đủ đúng 6 chữ số.');
      return;
    }

    if (pin !== confirmPin) {
      setErrorMessage('Mã PIN và mã xác nhận không trùng khớp.');
      return;
    }

    // Register & go straight to K5
    quickRegister(name, cleanPhone, pin);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 sm:p-8 max-w-2xl mx-auto w-full">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <button
            type="button"
            onClick={() => goToStep('K2')}
            className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-mid-gray hover:text-matte-black transition py-1 px-2 rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại đăng nhập</span>
          </button>
          <span className="text-[11px] font-bold text-brand-green bg-brand-green/10 px-2.5 py-1 rounded-full border border-brand-green/20">
            Tặng +50 điểm SUP
          </span>
        </div>

        <div className="text-center mt-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-green/10 text-forest-green flex items-center justify-center mx-auto mb-3">
            <UserPlus className="w-7 h-7 text-brand-green" />
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-black text-matte-black uppercase tracking-tight">
            Đăng Ký Nhanh Tại Kiosk
          </h1>
          <p className="text-xs sm:text-sm text-mid-gray mt-1 max-w-md mx-auto">
            Chỉ đúng 3 thông tin cơ bản để tích điểm SUP, áp voucher và theo dõi xe tự động.
          </p>
        </div>
      </div>

      {/* 3-field form */}
      <form onSubmit={handleSubmit} className="my-6 space-y-4">
        {/* 1. Full Name */}
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            1. Họ và tên của bạn *
          </label>
          <input
            type="text"
            required
            placeholder="Ví dụ: Nguyễn Văn Minh"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrorMessage(null);
            }}
            className="w-full h-14 px-4 rounded-xl border-2 border-stone-200 focus:border-brand-green focus:outline-hidden bg-white text-base font-medium text-matte-black shadow-xs transition"
          />
        </div>

        {/* 2. Phone Number */}
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            2. Số điện thoại (dùng để đăng nhập) *
          </label>
          <input
            type="tel"
            required
            placeholder="09xx xxx xxx"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setErrorMessage(null);
            }}
            className="w-full h-14 px-4 rounded-xl border-2 border-stone-200 focus:border-brand-green focus:outline-hidden bg-white text-base font-sans font-bold text-matte-black tracking-wider shadow-xs transition"
          />
        </div>

        {/* 3. PIN 6 numbers & Confirm PIN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              3. Mã PIN (6 số) *
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              required
              placeholder="••••••"
              value={pin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setPin(val);
                setErrorMessage(null);
              }}
              className="w-full h-14 px-4 rounded-xl border-2 border-stone-200 focus:border-brand-green focus:outline-hidden bg-white text-xl font-mono text-center tracking-widest text-matte-black shadow-xs transition"
            />
          </div>

          <div>
            <label className="block text-xs font-display font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Xác nhận lại mã PIN *
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              required
              placeholder="••••••"
              value={confirmPin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setConfirmPin(val);
                setErrorMessage(null);
              }}
              className="w-full h-14 px-4 rounded-xl border-2 border-stone-200 focus:border-brand-green focus:outline-hidden bg-white text-xl font-mono text-center tracking-widest text-matte-black shadow-xs transition"
            />
          </div>
        </div>

        {/* Quick Demo Preset Button */}
        <div className="pt-1 flex items-center justify-between text-xs text-gray-500">
          <span>Điền nhanh mẫu test:</span>
          <button
            type="button"
            onClick={() => {
              setName('Trần Anh Tuấn');
              setPhone('0909112233');
              setPin('123456');
              setConfirmPin('123456');
              setErrorMessage(null);
            }}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-slate-700 font-bold border border-stone-300 cursor-pointer"
          >
            Điền mẫu: Tuấn (PIN: 123456)
          </button>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            className="w-full min-h-[64px] rounded-2xl bg-brand-green hover:bg-brand-green-hover text-matte-black font-display font-black text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Xác Nhận Đăng Ký & Tiếp Tục Chọn Xe</span>
          </button>
        </div>
      </form>

      {/* Footer Security Note */}
      <div className="flex items-center justify-center gap-2 text-xs text-mid-gray pb-2">
        <ShieldCheck className="w-4 h-4 text-forest-green" />
        <span>Thông tin được mã hóa bảo mật chuẩn WASSUP Station OS.</span>
      </div>
    </div>
  );
};
