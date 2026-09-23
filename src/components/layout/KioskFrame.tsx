import React, { useState, useEffect } from 'react';
import { useKiosk } from '../../context/KioskContext';
import { StickyFooterBar } from './StickyFooterBar';
import { SimActionDrawer } from '../sim/SimActionDrawer';

// Kiosk screens
import { K0_DevicePairing } from '../kiosk/K0_DevicePairing';
import { K1_IdleAttract } from '../kiosk/K1_IdleAttract';
import { K1L_Liveview } from '../kiosk/K1L_Liveview';
import { K2_CustomerLogin } from '../kiosk/K2_CustomerLogin';
import { K2a_QuickRegister } from '../kiosk/K2a_QuickRegister';
import { K5_VehicleSelection } from '../kiosk/K5_VehicleSelection';
import { K6_PackageCatalog } from '../kiosk/K6_PackageCatalog';
import { K7_AddonCatalog } from '../kiosk/K7_AddonCatalog';
import { K8_OrderConfirmation } from '../kiosk/K8_OrderConfirmation';
import { K9_PaymentMethod } from '../kiosk/K9_PaymentMethod';
import { K10_PaymentProcessing } from '../kiosk/K10_PaymentProcessing';
import { K11_SuccessEta } from '../kiosk/K11_SuccessEta';

import { Wifi, PhoneCall, AlertCircle, Building2 } from 'lucide-react';

export const KioskFrame: React.FC = () => {
  const { step, kioskDisplayMode, station, toastMessage, isPaired, showToast } = useKiosk();
  const [currentTime, setCurrentTime] = useState('');
  const [showStaffCallModal, setShowStaffCallModal] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Screen routing switch
  const renderScreen = () => {
    if (!isPaired && step !== 'K0') {
      return <K0_DevicePairing />;
    }

    switch (step) {
      case 'K0':
        return <K0_DevicePairing />;
      case 'K1':
        return <K1_IdleAttract />;
      case 'K1L':
        return <K1L_Liveview />;
      case 'K2':
        return <K2_CustomerLogin />;
      case 'K2_A':
        return <K2a_QuickRegister />;
      case 'K5':
        return <K5_VehicleSelection />;
      case 'K6':
        return <K6_PackageCatalog />;
      case 'K7':
        return <K7_AddonCatalog />;
      case 'K8':
        return <K8_OrderConfirmation />;
      case 'K9':
        return <K9_PaymentMethod />;
      case 'K10':
        return <K10_PaymentProcessing />;
      case 'K11':
        return <K11_SuccessEta />;
      default:
        return <K1_IdleAttract />;
    }
  };

  const isPortraitFrame = kioskDisplayMode === 'portrait_frame';

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#1A1A1A] flex flex-col items-center justify-center p-0 sm:p-4 lg:p-6 overflow-x-hidden">
      {/* Outer Kiosk Bezel & Frame */}
      <div
        className={`w-full transition-all duration-300 flex flex-col relative ${
          isPortraitFrame
            ? 'max-w-[480px] min-h-[920px] max-h-[96vh] rounded-3xl sm:rounded-[40px] border-4 sm:border-8 border-[#222222] shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-warm-white overflow-hidden ring-1 ring-white/10'
            : 'max-w-full min-h-screen rounded-none border-0 bg-warm-white'
        }`}
      >
        {/* Hardware Status Bar (Top) */}
        <div className="bg-matte-black text-white px-5 py-2.5 flex items-center justify-between text-xs select-none shrink-0 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm tracking-wider text-gray-200">
              {currentTime || '08:30'}
            </span>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-gray-400 pl-2 border-l border-gray-700">
              <Building2 className="w-3 h-3 text-brand-green" />
              <span className="truncate max-w-[140px] font-medium">{station.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Call Staff Button */}
            <button
              type="button"
              onClick={() => setShowStaffCallModal(true)}
              className="flex items-center gap-1 text-[11px] font-display font-bold uppercase tracking-wider text-brand-green hover:underline cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Gọi nhân viên</span>
            </button>

            {/* Online Status */}
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Wifi className="w-3.5 h-3.5" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Screen Content Viewport */}
        <div className="flex-1 flex flex-col bg-warm-white overflow-y-auto touch-scroll relative">
          {renderScreen()}
        </div>

        {/* Sticky Footer Bar (K5–K10) */}
        <StickyFooterBar />
      </div>

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-matte-black text-white border-2 border-brand-green px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold max-w-md">
            <AlertCircle className="w-5 h-5 text-brand-green shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Staff Assistance Modal */}
      {showStaffCallModal && (
        <div className="fixed inset-0 z-50 bg-matte-black/75 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-brand-green/20 text-forest-green flex items-center justify-center mx-auto mb-4">
              <PhoneCall className="w-8 h-8 text-brand-green" />
            </div>
            <h3 className="text-xl font-display font-black text-matte-black">
              Cần Hỗ Trợ Tại Kiosk?
            </h3>
            <p className="text-xs text-mid-gray mt-2 mb-6 leading-relaxed">
              Nhân viên kỹ thuật và thu ngân tại trạm luôn sẵn sàng hỗ trợ trực tiếp. Vui lòng bấm nút gọi để kích hoạt chuông báo.
            </p>
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowStaffCallModal(false);
                  showToast('Đã phát tín hiệu gọi nhân viên trạm tới hỗ trợ!');
                }}
                className="w-full min-h-[52px] rounded-xl bg-brand-green hover:bg-brand-green-hover text-matte-black font-display font-black text-xs uppercase tracking-wider shadow-md transition cursor-pointer"
              >
                Gửi Tín Hiệu Gọi Nhân Viên
              </button>
              <button
                type="button"
                onClick={() => setShowStaffCallModal(false)}
                className="w-full min-h-[44px] rounded-xl border border-stone-300 hover:bg-stone-100 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Developer / Tester SimAction Drawer */}
      <SimActionDrawer />
    </div>
  );
};
