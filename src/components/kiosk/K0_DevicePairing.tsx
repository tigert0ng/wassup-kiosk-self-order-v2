import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { MOCK_STATIONS } from '../../data/mockKioskData';
import { ShieldCheck, QrCode, Delete, CheckCircle2, AlertTriangle, Building2 } from 'lucide-react';

export const K0_DevicePairing: React.FC = () => {
  const { pairDevice, goToStep, isPaired, station, showToast } = useKiosk();
  const [pairingCode, setPairingCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    code: string;
    stationName: string;
  } | null>(null);

  const handleDigit = (digit: string) => {
    if (pairingCode.length < 6) {
      setPairingCode((prev) => prev + digit);
      setErrorMessage(null);
    }
  };

  const handleDelete = () => {
    setPairingCode((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const handleClear = () => {
    setPairingCode('');
    setErrorMessage(null);
  };

  const handleVerifyCode = (codeToVerify?: string) => {
    const targetCode = codeToVerify || pairingCode;
    if (targetCode.length < 6) {
      setErrorMessage('Vui lòng nhập đủ mã PIN 6 số.');
      return;
    }

    const cleanCode = targetCode.replace('-', '');
    const matched = MOCK_STATIONS.find((s) => s.code.replace('-', '') === cleanCode);

    if (matched) {
      // US-K0.2: MUST show station name confirmation before final pairing
      setPendingConfirmation({
        code: targetCode,
        stationName: matched.name,
      });
      setErrorMessage(null);
    } else {
      setErrorMessage('Mã ghép đôi không tồn tại hoặc đã hết hạn (Mã test: 652-000, 789-123).');
    }
  };

  const handleConfirmPairing = () => {
    if (!pendingConfirmation) return;
    const res = pairDevice(pendingConfirmation.code);
    if (res.success) {
      setPendingConfirmation(null);
      showToast(`Ghép đôi thành công cho ${res.stationName}!`);
      goToStep('K1');
    } else {
      setErrorMessage(res.message || 'Lỗi ghép đôi.');
      setPendingConfirmation(null);
    }
  };

  // Format code display e.g. 652-000
  const formattedCode =
    pairingCode.length > 3
      ? `${pairingCode.slice(0, 3)}-${pairingCode.slice(3)}`
      : pairingCode;

  return (
    <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="text-center pt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-green/10 text-brand-green border border-brand-green/30 mb-4 shadow-sm">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-matte-black uppercase tracking-tight">
          Ghép Đôi Thiết Bị Kiosk
        </h1>
        <p className="text-sm text-mid-gray mt-1.5 max-w-md mx-auto">
          Mỗi kiosk vật lý được gán danh tính riêng với trạm phục vụ. Vui lòng nhập mã PIN do Quản lý trạm cấp từ Admin Hub.
        </p>

        {isPaired && (
          <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đang ghép đôi với: <strong>{station.name}</strong></span>
          </div>
        )}
      </div>

      {/* Code Display Area */}
      <div className="my-6">
        <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 text-center shadow-xs">
          <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
            Mã Ghép Đôi (6 Số)
          </span>
          <div className="h-16 flex items-center justify-center tracking-widest text-3xl sm:text-4xl font-display font-black text-matte-black mt-2">
            {formattedCode || <span className="text-gray-300">___-___</span>}
          </div>

          {errorMessage && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Quick Test Demo Codes */}
        <div className="mt-3 flex items-center justify-center gap-2 flex-wrap text-xs text-gray-500">
          <span className="font-medium">Mã demo:</span>
          <button
            type="button"
            onClick={() => {
              setPairingCode('652000');
              handleVerifyCode('652000');
            }}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-slate-700 font-bold border border-stone-300 cursor-pointer"
          >
            Trạm Q7 (652-000)
          </button>
          <button
            type="button"
            onClick={() => {
              setPairingCode('789123');
              handleVerifyCode('789123');
            }}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-slate-700 font-bold border border-stone-300 cursor-pointer"
          >
            Trạm Bình Thạnh (789-123)
          </button>
        </div>
      </div>

      {/* Touch Numpad (grid 3x4) */}
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto w-full mb-6">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handleDigit(digit)}
            className="h-16 sm:h-18 rounded-2xl bg-white hover:bg-stone-100 active:scale-95 border border-stone-200 text-2xl font-display font-bold text-matte-black shadow-xs transition-all flex items-center justify-center cursor-pointer"
          >
            {digit}
          </button>
        ))}
        <button
          type="button"
          onClick={handleClear}
          className="h-16 sm:h-18 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 border border-stone-200 text-xs font-display font-bold uppercase tracking-wider text-mid-gray shadow-xs transition-all flex items-center justify-center cursor-pointer"
        >
          Xóa hết
        </button>
        <button
          type="button"
          onClick={() => handleDigit('0')}
          className="h-16 sm:h-18 rounded-2xl bg-white hover:bg-stone-100 active:scale-95 border border-stone-200 text-2xl font-display font-bold text-matte-black shadow-xs transition-all flex items-center justify-center cursor-pointer"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="h-16 sm:h-18 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 border border-stone-200 text-mid-gray shadow-xs transition-all flex items-center justify-center cursor-pointer"
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>

      {/* Primary Action */}
      <div className="space-y-3 max-w-sm mx-auto w-full pb-4">
        <button
          type="button"
          disabled={pairingCode.length < 6}
          onClick={() => handleVerifyCode()}
          className={`w-full min-h-[64px] rounded-2xl font-display font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
            pairingCode.length === 6
              ? 'bg-brand-green hover:bg-brand-green-hover text-matte-black cursor-pointer shadow-brand-green/20'
              : 'bg-stone-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Kiểm tra & Ghép đôi</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setPairingCode('652000');
            handleVerifyCode('652000');
          }}
          className="w-full min-h-[50px] rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-xs font-display font-bold uppercase tracking-wider text-slate-700 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <QrCode className="w-4 h-4 text-brand-green" />
          <span>Quét mã QR kỹ thuật viên</span>
        </button>
      </div>

      {/* US-K0.2 Modal Confirmation of Station Name */}
      {pendingConfirmation && (
        <div className="fixed inset-0 z-50 bg-matte-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-brand-green/20 text-forest-green flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-forest-green" />
            </div>
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              Xác Nhận Trạm Phục Vụ
            </span>
            <h3 className="text-xl font-display font-black text-matte-black mt-1">
              Bạn đang ghép thiết bị này cho trạm:
            </h3>
            <div className="my-4 p-4 rounded-2xl bg-brand-green-light border border-brand-green/30 text-matte-black font-display font-bold text-lg">
              {pendingConfirmation.stationName}
            </div>
            <p className="text-xs text-mid-gray mb-6 leading-relaxed">
              ⚠️ Lưu ý: Sau khi xác nhận, mọi đơn hàng từ kiosk này sẽ tự động gán vào trạm trên. Ghép nhầm trạm không thể sửa lại đơn cũ!
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPendingConfirmation(null)}
                className="min-h-[56px] rounded-xl border border-stone-300 hover:bg-stone-100 font-display font-bold text-xs uppercase text-slate-700 cursor-pointer transition"
              >
                Hủy / Nhập lại
              </button>
              <button
                type="button"
                onClick={handleConfirmPairing}
                className="min-h-[56px] rounded-xl bg-brand-green hover:bg-brand-green-hover font-display font-black text-xs uppercase text-matte-black shadow-md cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác nhận ghép</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
