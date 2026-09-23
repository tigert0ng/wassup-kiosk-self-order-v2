import React, { useState } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { formatPhoneNumber } from '../../lib/format';
import {
  Phone,
  KeyRound,
  QrCode,
  AlertTriangle,
  ArrowLeft,
  Delete,
  UserCheck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

type SubPhase = 'phone' | 'pin' | 'first_pin' | 'force_change_pin' | 'qr_scan';

export const K2_CustomerLogin: React.FC = () => {
  const {
    lookupCustomer,
    loginWithPin,
    loginWithQR,
    requestPinReset,
    confirmChangePin,
    goToStep,
    showToast,
    customersList,
  } = useKiosk();

  const [subPhase, setSubPhase] = useState<SubPhase>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [confirmPinCode, setConfirmPinCode] = useState('');
  const [isConfirmingStep, setIsConfirmingStep] = useState(false);
  const [matchedCustomerName, setMatchedCustomerName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [issuedPinHint, setIssuedPinHint] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Self-service PIN reset popup (US-K1.4)
  const [newIssuedPin, setNewIssuedPin] = useState<string | null>(null);

  // Numpad key handlers
  const handleDigit = (digit: string) => {
    setErrorMessage(null);
    setSuccessNotice(null);

    if (subPhase === 'phone') {
      if (phoneNumber.length < 10) {
        const next = phoneNumber + digit;
        setPhoneNumber(next);
        if (next.length === 10) {
          handleVerifyPhone(next);
        }
      }
    } else if (subPhase === 'pin') {
      if (pinCode.length < 6) {
        const next = pinCode + digit;
        setPinCode(next);
        if (next.length === 6) {
          handleVerifyPin(next);
        }
      }
    } else if (subPhase === 'first_pin' || subPhase === 'force_change_pin') {
      if (!isConfirmingStep) {
        if (pinCode.length < 6) {
          const next = pinCode + digit;
          setPinCode(next);
          if (next.length === 6) {
            setIsConfirmingStep(true);
          }
        }
      } else {
        if (confirmPinCode.length < 6) {
          const next = confirmPinCode + digit;
          setConfirmPinCode(next);
          if (next.length === 6) {
            handleFinalizeNewPin(pinCode, next);
          }
        }
      }
    }
  };

  const handleDelete = () => {
    setErrorMessage(null);
    if (subPhase === 'phone') {
      setPhoneNumber((prev) => prev.slice(0, -1));
    } else if (subPhase === 'pin') {
      setPinCode((prev) => prev.slice(0, -1));
    } else if (subPhase === 'first_pin' || subPhase === 'force_change_pin') {
      if (isConfirmingStep) {
        if (confirmPinCode.length > 0) {
          setConfirmPinCode((prev) => prev.slice(0, -1));
        } else {
          setIsConfirmingStep(false);
        }
      } else {
        setPinCode((prev) => prev.slice(0, -1));
      }
    }
  };

  const handleClear = () => {
    setErrorMessage(null);
    if (subPhase === 'phone') {
      setPhoneNumber('');
    } else if (subPhase === 'pin') {
      setPinCode('');
    } else {
      setPinCode('');
      setConfirmPinCode('');
      setIsConfirmingStep(false);
    }
  };

  // Verify Phone Lookup
  const handleVerifyPhone = (phoneToCheck?: string) => {
    const phone = phoneToCheck || phoneNumber;
    if (phone.length < 10) {
      setErrorMessage('Số điện thoại phải đủ 10 chữ số.');
      return;
    }

    const res = lookupCustomer(phone);
    if (res.status === 'not_found') {
      // PRD US-K1.3: transition to K2-a (Quick Register)
      showToast('Số điện thoại chưa đăng ký. Chuyển sang đăng ký nhanh.');
      goToStep('K2_A');
    } else if (res.status === 'locked') {
      setErrorMessage(`Tài khoản tạm khóa do sai PIN. Vui lòng thử lại sau ${res.remainingMinutes} phút hoặc bấm "Quên mã PIN?".`);
    } else if (res.status === 'needs_first_pin') {
      setMatchedCustomerName(res.customer?.name || null);
      setSubPhase('first_pin');
      setPinCode('');
      setConfirmPinCode('');
      setIsConfirmingStep(false);
      showToast(`Chào mừng ${res.customer?.name}! Vui lòng thiết lập mã PIN 6 số lần đầu.`);
    } else if (res.status === 'enter_pin') {
      setMatchedCustomerName(res.customer?.name || null);
      setSubPhase('pin');
      setPinCode('');
    }
  };

  // Verify PIN
  const handleVerifyPin = (pinToCheck: string) => {
    const res = loginWithPin(phoneNumber, pinToCheck);
    if (res.success) {
      if (res.mustChangePin) {
        setSubPhase('force_change_pin');
        setPinCode('');
        setConfirmPinCode('');
        setIsConfirmingStep(false);
        setIssuedPinHint(null);
        showToast('Mã PIN tạm thời hợp lệ. Vui lòng đổi mã PIN mới (nhập 2 lần)!');
      } else {
        showToast(`Đăng nhập thành công!`);
        goToStep('K5');
      }
    } else {
      setErrorMessage(res.errorMsg || 'Mã PIN không đúng.');
      setPinCode('');
    }
  };

  // Finalize First PIN or Force Change PIN
  const handleFinalizeNewPin = (first: string, second: string) => {
    if (first !== second) {
      setErrorMessage('Mã xác nhận không khớp. Vui lòng nhập lại.');
      setConfirmPinCode('');
      return;
    }

    if (subPhase === 'first_pin') {
      loginWithPin(phoneNumber, first);
    } else if (subPhase === 'force_change_pin') {
      confirmChangePin(first);
      // Đổi mã xong quay lại màn hình đăng nhập
      setSubPhase('phone');
      setPhoneNumber(phoneNumber);
      setPinCode('');
      setConfirmPinCode('');
      setIsConfirmingStep(false);
      setIssuedPinHint(null);
      setSuccessNotice('Đổi mã PIN mới thành công! Vui lòng đăng nhập lại với mã PIN vừa tạo.');
    }
  };

  // US-K1.4: Self-service PIN reset on kiosk display
  const handleForgotPin = () => {
    if (!phoneNumber) return;
    const tempPin = requestPinReset(phoneNumber);
    setNewIssuedPin(tempPin);
  };

  const handleApplyIssuedPin = () => {
    if (!newIssuedPin) return;
    setIssuedPinHint(null);
    setPinCode(newIssuedPin);
    const pin = newIssuedPin;
    setNewIssuedPin(null);
    handleVerifyPin(pin);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 sm:p-8 max-w-2xl mx-auto w-full">
      {/* Top Header & Tab switcher */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <button
            type="button"
            onClick={() => {
              if (subPhase === 'phone') {
                goToStep('K1');
              } else {
                setSubPhase('phone');
                setPinCode('');
                setErrorMessage(null);
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-mid-gray hover:text-matte-black transition py-1 px-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{subPhase === 'phone' ? 'Màn hình chính' : 'Đổi số điện thoại'}</span>
          </button>

          {/* QR Scan toggle */}
          <button
            type="button"
            onClick={() => {
              if (subPhase === 'qr_scan') {
                setSubPhase('phone');
              } else {
                setSubPhase('qr_scan');
              }
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-display font-black uppercase tracking-wider transition ${
              subPhase === 'qr_scan'
                ? 'bg-matte-black text-brand-green shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-matte-black border border-stone-300'
            }`}
          >
            <QrCode className="w-4 h-4 text-brand-green" />
            <span>{subPhase === 'qr_scan' ? 'Dùng Bàn Phím SĐT' : 'Quét Mã QR'}</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mt-4">
          <h1 className="text-2xl sm:text-3xl font-display font-black text-matte-black uppercase tracking-tight">
            {subPhase === 'phone' && 'Đăng Nhập Khách Hàng'}
            {subPhase === 'pin' && 'Nhập Mã PIN Bảo Mật'}
            {subPhase === 'first_pin' && 'Thiết Lập Mã PIN Lần Đầu'}
            {subPhase === 'force_change_pin' && 'Đổi Mã PIN Mới'}
            {subPhase === 'qr_scan' && 'Quét Mã QR Cá Nhân'}
          </h1>
          <p className="text-xs sm:text-sm text-mid-gray mt-1">
            {subPhase === 'phone' && 'Nhập số điện thoại để dùng voucher và tích điểm SUP.'}
            {subPhase === 'pin' && `Xin chào ${matchedCustomerName || 'quý khách'}! Vui lòng nhập 6 số PIN.`}
            {subPhase === 'first_pin' &&
              (!isConfirmingStep ? 'Vui lòng nhập 6 số PIN mới của bạn' : 'Nhập lại 6 số PIN để xác nhận')}
            {subPhase === 'force_change_pin' &&
              (!isConfirmingStep ? 'Bước 1/2: Vui lòng nhập mã PIN mới tự chọn (6 số)' : 'Bước 2/2: Nhập lại mã PIN mới để xác nhận')}
            {subPhase === 'qr_scan' && 'Đưa mã QR trên app hoặc Zalo WASSUP vào trước mắt quét.'}
          </p>
        </div>
      </div>

      {/* Main Form Area */}
      {subPhase !== 'qr_scan' ? (
        <div className="my-4">
          {/* Success Banner when returning from PIN change */}
          {successNotice && subPhase === 'phone' && (
            <div className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 p-3 rounded-2xl border border-emerald-300 text-center animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Hint when temporary PIN was issued */}
          {issuedPinHint && subPhase === 'pin' && (
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Mã PIN tạm thời vừa cấp: <strong className="font-mono text-sm tracking-widest text-matte-black">{issuedPinHint}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPinCode(issuedPinHint);
                  handleVerifyPin(issuedPinHint);
                }}
                className="text-[10px] font-bold text-amber-900 bg-amber-200/90 hover:bg-amber-300 px-2.5 py-1 rounded-xl cursor-pointer transition"
              >
                Điền nhanh
              </button>
            </div>
          )}
          {/* Input Box Display */}
          <div className="bg-white border-2 border-stone-200 rounded-2xl p-5 text-center shadow-xs">
            {subPhase === 'phone' ? (
              <div>
                <span className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center justify-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brand-green" />
                  <span>Số Điện Thoại (10 Số)</span>
                </span>
                <div className="h-16 flex items-center justify-center tracking-wider text-3xl sm:text-4xl font-sans font-black text-matte-black mt-1">
                  {phoneNumber ? (
                    formatPhoneNumber(phoneNumber)
                  ) : (
                    <span className="text-gray-300 font-sans">09xx xxx xxx</span>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase mb-1">
                  <span className="flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-brand-green" />
                    <span>
                      {subPhase === 'pin' && 'Mã PIN (6 số)'}
                      {(subPhase === 'first_pin' || subPhase === 'force_change_pin') &&
                        (!isConfirmingStep ? 'Bước 1: Nhập PIN mới' : 'Bước 2: Xác nhận lại')}
                    </span>
                  </span>
                  <span className="text-gray-500 font-normal">{phoneNumber}</span>
                </div>

                {/* PIN Mask Dots */}
                <div className="h-16 flex items-center justify-center gap-3 mt-1">
                  {[0, 1, 2, 3, 4, 5].map((idx) => {
                    const currentVal = !isConfirmingStep ? pinCode : confirmPinCode;
                    const filled = currentVal.length > idx;
                    return (
                      <div
                        key={idx}
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all ${
                          filled
                            ? 'bg-matte-black border-matte-black scale-110'
                            : 'border-stone-300 bg-stone-100'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-red-600 bg-red-50 p-2 rounded-xl border border-red-200">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Under-input quick action: "Quên mã PIN?" (US-K1.4) or switch */}
          {subPhase === 'pin' && (
            <div className="flex items-center justify-between mt-2 px-1 text-xs">
              <button
                type="button"
                onClick={handleForgotPin}
                className="font-display font-bold text-amber-700 hover:text-amber-800 underline decoration-amber-400 cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Quên mã PIN? (Tự cấp lại ngay)</span>
              </button>
              <span className="text-gray-400 text-[11px]">Tối đa 5 lần thử</span>
            </div>
          )}

          {/* Touch Numpad */}
          <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto w-full mt-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigit(digit)}
                className="h-15 sm:h-16 rounded-2xl bg-white hover:bg-stone-100 active:scale-95 border border-stone-200 text-2xl font-display font-bold text-matte-black shadow-xs transition-all flex items-center justify-center cursor-pointer"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-15 sm:h-16 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 border border-stone-200 text-xs font-display font-bold uppercase tracking-wider text-mid-gray shadow-xs transition-all flex items-center justify-center cursor-pointer"
            >
              Xóa hết
            </button>
            <button
              type="button"
              onClick={() => handleDigit('0')}
              className="h-15 sm:h-16 rounded-2xl bg-white hover:bg-stone-100 active:scale-95 border border-stone-200 text-2xl font-display font-bold text-matte-black shadow-xs transition-all flex items-center justify-center cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="h-15 sm:h-16 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 border border-stone-200 text-mid-gray shadow-xs transition-all flex items-center justify-center cursor-pointer"
            >
              <Delete className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        /* QR Code Scanner Mockup */
        <div className="my-6 max-w-sm mx-auto w-full text-center">
          <div className="relative border-2 border-dashed border-brand-green bg-stone-900 rounded-3xl p-8 shadow-inner overflow-hidden">
            <div className="w-48 h-48 mx-auto border-2 border-brand-green/60 rounded-2xl flex flex-col items-center justify-center p-4 relative">
              <QrCode className="w-24 h-24 text-brand-green animate-pulse" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-brand-green/80 shadow-[0_0_12px_#A2C62C] animate-bounce" />
            </div>
            <p className="text-xs text-gray-300 mt-4">
              Đưa mã QR trên ứng dụng WASSUP của bạn vào trước camera kiosk
            </p>
          </div>

          <button
            type="button"
            onClick={() => loginWithQR()}
            className="mt-5 w-full min-h-[56px] rounded-2xl bg-brand-green hover:bg-brand-green-hover text-matte-black font-display font-black text-sm uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Mô Phỏng Quét QR Thành Công</span>
          </button>
        </div>
      )}

      {/* Quick Test Demo Helpers */}
      <div className="pt-2 border-t border-stone-200">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span className="font-bold uppercase tracking-wider text-[10px]">Tài khoản test nhanh:</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setSubPhase('phone');
              setPhoneNumber(customersList[0].phone);
              handleVerifyPhone(customersList[0].phone);
            }}
            className="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-left cursor-pointer transition"
          >
            <div className="font-display font-bold text-[11px] text-matte-black truncate">
              {customersList[0].name}
            </div>
            <div className="text-[10px] text-gray-500">Có PIN: 123456</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSubPhase('phone');
              setPhoneNumber(customersList[1].phone);
              handleVerifyPhone(customersList[1].phone);
            }}
            className="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-left cursor-pointer transition"
          >
            <div className="font-display font-bold text-[11px] text-matte-black truncate">
              {customersList[1].name}
            </div>
            <div className="text-[10px] text-amber-700 font-medium">Chưa đặt PIN</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSubPhase('phone');
              setPhoneNumber('0909112233');
              handleVerifyPhone('0909112233');
            }}
            className="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-left cursor-pointer transition"
          >
            <div className="font-display font-bold text-[11px] text-matte-black truncate">
              + Khách Mới Tinh
            </div>
            <div className="text-[10px] text-emerald-700 font-medium">Test K2-a ĐK</div>
          </button>
        </div>
      </div>

      {/* US-K1.4 Self-Issued PIN Dialog */}
      {newIssuedPin && (
        <div className="fixed inset-0 z-50 bg-matte-black/75 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
              Cấp Mã PIN Tạm Thời Mới
            </span>
            <h3 className="text-xl font-display font-black text-matte-black mt-1">
              Mã PIN mới của bạn là:
            </h3>

            {/* Giant Display of the new PIN */}
            <div className="my-5 p-5 rounded-2xl bg-brand-green-light border-2 border-brand-green text-matte-black font-display font-black text-4xl sm:text-5xl tracking-widest shadow-inner">
              {newIssuedPin}
            </div>

            <p className="text-xs text-mid-gray mb-6 leading-relaxed">
              Vui lòng ghi nhớ mã PIN này để nhập vào bàn phím. Sau khi nhập, hệ thống sẽ <strong>yêu cầu bạn đổi mã PIN mới (nhập 2 lần)</strong> để bảo mật tài khoản.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  const issued = newIssuedPin;
                  setIssuedPinHint(issued);
                  setPinCode('');
                  setErrorMessage(null);
                  setNewIssuedPin(null);
                  setSubPhase('pin');
                  showToast(`Mã PIN mới: ${issued}. Vui lòng nhập vào bàn phím.`);
                }}
                className="w-full min-h-[56px] rounded-2xl bg-brand-green hover:bg-brand-green-hover text-matte-black font-display font-black text-sm uppercase tracking-wider shadow-md cursor-pointer transition flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Tôi Đã Nhớ — Tiến Hành Nhập PIN →</span>
              </button>

              <button
                type="button"
                onClick={handleApplyIssuedPin}
                className="w-full py-2 text-xs font-bold text-gray-500 hover:text-matte-black underline cursor-pointer"
              >
                (Hoặc tự động điền nhanh mã này)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
