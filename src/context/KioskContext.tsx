import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  KioskStep,
  Vehicle,
  Customer,
  ServicePackage,
  AddonService,
  Voucher,
  PaymentMethodType,
  KioskOrder,
  VehicleClass,
} from '../types/kiosk';
import {
  MOCK_STATIONS,
  MOCK_PACKAGES,
  MOCK_ADDONS,
  MOCK_CUSTOMERS,
  MOCK_VOUCHERS,
} from '../data/mockKioskData';

interface KioskContextType {
  // Device & Station
  isPaired: boolean;
  station: typeof MOCK_STATIONS[0];
  pairDevice: (code: string) => { success: boolean; message?: string; stationName?: string };
  unpairDevice: () => void;

  // Session & Navigation
  step: KioskStep;
  goToStep: (step: KioskStep) => void;
  kioskDisplayMode: 'portrait_frame' | 'full_viewport';
  toggleDisplayMode: () => void;

  // Customer & Auth
  customer: Customer | null;
  customersList: Customer[];
  lookupCustomer: (phone: string) => {
    status: 'not_found' | 'needs_first_pin' | 'enter_pin' | 'locked';
    customer?: Customer;
    remainingMinutes?: number;
  };
  loginWithPin: (phone: string, pin: string) => {
    success: boolean;
    attemptsLeft?: number;
    locked?: boolean;
    mustChangePin?: boolean;
    errorMsg?: string;
  };
  loginWithQR: (qrToken?: string) => { success: boolean; customerName?: string };
  quickRegister: (name: string, phone: string, pin: string) => Customer;
  requestPinReset: (phone: string) => string; // returns generated temp PIN
  confirmChangePin: (newPin: string) => boolean;

  // Vehicle Selection
  selectedVehicle: Vehicle | null;
  selectVehicle: (vehicle: Vehicle) => void;
  addNewVehicle: (plate: string, vehicleClass: VehicleClass, modelName?: string) => Vehicle;

  // Services & Add-ons
  packages: ServicePackage[];
  addons: AddonService[];
  selectedPackage: ServicePackage | null;
  selectedAddons: AddonService[];
  selectPackage: (pkg: ServicePackage) => void;
  toggleAddon: (addon: AddonService) => void;

  // Vouchers & Pricing
  vouchers: Voucher[];
  appliedVoucher: Voucher | null;
  applyVoucher: (code: string) => { success: boolean; message?: string };
  removeVoucher: () => void;
  subtotal: number;
  discountAmount: number;
  finalTotal: number;

  // Payment & Orders
  paymentMethod: PaymentMethodType;
  selectPaymentMethod: (method: PaymentMethodType) => void;
  currentOrder: KioskOrder | null;
  initiatePayment: () => void;
  simPaymentSuccess: () => void;
  simPaymentFailure: () => void;

  // Session termination
  cancelCurrentSession: () => void;
  endSessionNextCustomer: () => void;

  // UI Toast & Sim Helpers
  toastMessage: string | null;
  showToast: (msg: string) => void;
  quickFillDemoUser: (customerIndex: number) => void;
}

const KioskContext = createContext<KioskContextType | undefined>(undefined);

export const KioskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Device Pairing state (persisted in localStorage)
  const [isPaired, setIsPaired] = useState<boolean>(() => {
    const saved = localStorage.getItem('wassup_kiosk_paired');
    return saved !== null ? saved === 'true' : true; // default paired to Station Q7 for smooth review
  });

  const [stationId, setStationId] = useState<string>(() => {
    return localStorage.getItem('wassup_kiosk_station_id') || 'sta_q7';
  });

  const station = useMemo(() => {
    return MOCK_STATIONS.find((s) => s.id === stationId) || MOCK_STATIONS[0];
  }, [stationId]);

  // 2. Navigation Step
  const [step, setStep] = useState<KioskStep>(() => (isPaired ? 'K1' : 'K0'));
  const [kioskDisplayMode, setKioskDisplayMode] = useState<'portrait_frame' | 'full_viewport'>('portrait_frame');

  // 3. Customer & Vehicles
  const [customersList, setCustomersList] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('wassup_customers_cache');
    return saved ? JSON.parse(saved) : MOCK_CUSTOMERS;
  });

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // 4. Cart selections
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(() => MOCK_PACKAGES[1]); // Default W1
  const [selectedAddons, setSelectedAddons] = useState<AddonService[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  // 5. Payment & Order
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('qr_vnpay');
  const [currentOrder, setCurrentOrder] = useState<KioskOrder | null>(null);

  // 6. Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  }, []);

  // Save customers list to localStorage
  useEffect(() => {
    localStorage.setItem('wassup_customers_cache', JSON.stringify(customersList));
  }, [customersList]);

  // Save pairing to localStorage
  const pairDevice = useCallback((code: string) => {
    const cleanCode = code.trim().toUpperCase().replace(/\s/g, '');
    const matched = MOCK_STATIONS.find((s) => s.code.replace('-', '') === cleanCode.replace('-', ''));
    if (matched) {
      setIsPaired(true);
      setStationId(matched.id);
      localStorage.setItem('wassup_kiosk_paired', 'true');
      localStorage.setItem('wassup_kiosk_station_id', matched.id);
      return { success: true, stationName: matched.name };
    }
    return { success: false, message: 'Mã ghép đôi không tồn tại hoặc đã hết hạn.' };
  }, []);

  const unpairDevice = useCallback(() => {
    setIsPaired(false);
    localStorage.setItem('wassup_kiosk_paired', 'false');
    setStep('K0');
    showToast('Đã thu hồi phiên thiết bị. Chuyển về màn K0.');
  }, [showToast]);

  const toggleDisplayMode = useCallback(() => {
    setKioskDisplayMode((prev) => (prev === 'portrait_frame' ? 'full_viewport' : 'portrait_frame'));
  }, []);

  const goToStep = useCallback((newStep: KioskStep) => {
    setStep(newStep);
  }, []);

  // Customer Lookup
  const lookupCustomer = useCallback(
    (phone: string) => {
      const cleanPhone = phone.replace(/\D/g, '');
      const found = customersList.find((c) => c.phone === cleanPhone);

      if (!found) {
        return { status: 'not_found' as const };
      }

      // Check lock status
      if (found.locked_until && found.locked_until > Date.now()) {
        const remaining = Math.ceil((found.locked_until - Date.now()) / (1000 * 60));
        return { status: 'locked' as const, remainingMinutes: remaining, customer: found };
      }

      if (!found.has_pin || !found.pin_hash) {
        return { status: 'needs_first_pin' as const, customer: found };
      }

      return { status: 'enter_pin' as const, customer: found };
    },
    [customersList]
  );

  // Customer Login with PIN
  const loginWithPin = useCallback(
    (phone: string, pin: string) => {
      const cleanPhone = phone.replace(/\D/g, '');
      const target = customersList.find((c) => c.phone === cleanPhone);

      if (!target) {
        return { success: false, errorMsg: 'Số điện thoại không tồn tại.' };
      }

      // Check lock
      if (target.locked_until && target.locked_until > Date.now()) {
        return { success: false, locked: true, errorMsg: 'Tài khoản đang bị tạm khóa do nhập sai PIN quá 5 lần.' };
      }

      // Handle first time PIN setup
      if (!target.has_pin) {
        target.pin_hash = pin;
        target.has_pin = true;
        target.failed_attempts = 0;
        setCustomer({ ...target });
        // Set first vehicle if available
        if (target.vehicles.length > 0) {
          setSelectedVehicle(target.vehicles[0]);
        }
        setStep('K5');
        return { success: true };
      }

      // Match PIN
      if (target.pin_hash === pin) {
        target.failed_attempts = 0;
        target.locked_until = null;
        setCustomer({ ...target });

        if (target.vehicles.length > 0) {
          setSelectedVehicle(target.vehicles[0]);
        }

        if (target.must_change_pin) {
          return { success: true, mustChangePin: true };
        }

        setStep('K5');
        return { success: true };
      }

      // Wrong PIN
      const attempts = (target.failed_attempts || 0) + 1;
      target.failed_attempts = attempts;

      if (attempts >= 5) {
        target.locked_until = Date.now() + 5 * 60 * 1000; // lock 5 mins
        setCustomersList([...customersList]);
        return { success: false, locked: true, attemptsLeft: 0, errorMsg: 'Sai PIN 5 lần. Khóa 5 phút hoặc bấm "Quên mã PIN?" để tự cấp lại.' };
      }

      const attemptsLeft = 5 - attempts;
      setCustomersList([...customersList]);
      return { success: false, attemptsLeft, errorMsg: `Mã PIN không chính xác. Còn lại ${attemptsLeft} lần thử.` };
    },
    [customersList]
  );

  // Login with QR Code
  const loginWithQR = useCallback(
    (qrToken?: string) => {
      // Pick first or matched customer
      const target = customersList[0];
      if (target) {
        setCustomer(target);
        if (target.vehicles.length > 0) {
          setSelectedVehicle(target.vehicles[0]);
        }
        setStep('K5');
        showToast(`Đăng nhập QR thành công: ${target.name}`);
        return { success: true, customerName: target.name };
      }
      return { success: false };
    },
    [customersList, showToast]
  );

  // Quick register K2-a (US-K1.3: exactly 3 fields: Name, Phone, PIN 6 digits)
  const quickRegister = useCallback(
    (name: string, phone: string, pin: string) => {
      const cleanPhone = phone.replace(/\D/g, '');
      const newCustomer: Customer = {
        id: `cust_${Date.now()}`,
        name: name.trim(),
        phone: cleanPhone,
        pin_hash: pin,
        has_pin: true,
        failed_attempts: 0,
        must_change_pin: false,
        sup_points: 50, // Welcome SUP bonus
        vehicles: [],
      };

      setCustomersList((prev) => [newCustomer, ...prev]);
      setCustomer(newCustomer);
      setSelectedVehicle(null);
      setStep('K5'); // Go straight to vehicle screen
      showToast(`Chào mừng ${newCustomer.name}! Đăng ký thành công +50 điểm SUP.`);
      return newCustomer;
    },
    [showToast]
  );

  // Request PIN Reset (US-K1.4: system self-issues new PIN on screen)
  const requestPinReset = useCallback(
    (phone: string) => {
      const cleanPhone = phone.replace(/\D/g, '');
      // generate 6 random digits
      const newRandomPin = Math.floor(100000 + Math.random() * 900000).toString();

      setCustomersList((prev) =>
        prev.map((c) => {
          if (c.phone === cleanPhone) {
            return {
              ...c,
              pin_hash: newRandomPin,
              must_change_pin: true,
              failed_attempts: 0,
              locked_until: null,
            };
          }
          return c;
        })
      );

      return newRandomPin;
    },
    []
  );

  // Confirm custom PIN change after temp PIN
  const confirmChangePin = useCallback(
    (newPin: string) => {
      if (!customer) return false;
      const targetId = customer.id;
      setCustomersList((prev) =>
        prev.map((c) =>
          c.id === targetId
            ? {
                ...c,
                pin_hash: newPin,
                has_pin: true,
                must_change_pin: false,
                failed_attempts: 0,
                locked_until: null,
              }
            : c
        )
      );
      // Log out temporary session so user logs in fresh on login screen
      setCustomer(null);
      setSelectedVehicle(null);
      setStep('K2');
      showToast('Đổi mã PIN mới thành công! Vui lòng đăng nhập bằng mã PIN vừa tạo.');
      return true;
    },
    [customer, showToast]
  );

  // Select vehicle
  const selectVehicle = useCallback((v: Vehicle) => {
    setSelectedVehicle(v);
  }, []);

  // Add new vehicle (FRK-2.1)
  const addNewVehicle = useCallback(
    (plate: string, vehicleClass: VehicleClass, modelName?: string) => {
      const newVeh: Vehicle = {
        id: `veh_${Date.now()}`,
        customer_id: customer ? customer.id : 'anon',
        license_plate: plate.toUpperCase().trim(),
        vehicle_class: vehicleClass,
        model_name: modelName || (vehicleClass === '4_5_cho' ? 'Sedan / Hatchback' : 'SUV / Bán tải'),
        last_visit: 'Lần đầu tiên',
      };

      if (customer) {
        const updatedCustomer = {
          ...customer,
          vehicles: [...customer.vehicles, newVeh],
        };
        setCustomer(updatedCustomer);
        setCustomersList((prev) =>
          prev.map((c) => (c.id === customer.id ? updatedCustomer : c))
        );
      }

      setSelectedVehicle(newVeh);
      return newVeh;
    },
    [customer]
  );

  // Package & Addon selection
  const selectPackage = useCallback((pkg: ServicePackage) => {
    setSelectedPackage(pkg);
  }, []);

  const toggleAddon = useCallback((addon: AddonService) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  }, []);

  // Price Calculation
  const vehicleClass = selectedVehicle?.vehicle_class || '4_5_cho';

  const subtotal = useMemo(() => {
    let sum = 0;
    if (selectedPackage) {
      sum += vehicleClass === '4_5_cho' ? selectedPackage.base_price_4_5 : selectedPackage.base_price_7_9;
    }
    selectedAddons.forEach((a) => {
      sum += vehicleClass === '4_5_cho' ? a.price_4_5 : a.price_7_9;
    });
    return sum;
  }, [selectedPackage, selectedAddons, vehicleClass]);

  const discountAmount = useMemo(() => {
    if (!appliedVoucher) return 0;
    if (subtotal < appliedVoucher.min_order_value) return 0;
    if (appliedVoucher.discount_type === 'fixed') {
      return Math.min(appliedVoucher.discount_value, subtotal);
    } else {
      return Math.round((subtotal * appliedVoucher.discount_value) / 100);
    }
  }, [appliedVoucher, subtotal]);

  const finalTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  // Apply Voucher
  const applyVoucher = useCallback(
    (code: string) => {
      const cleanCode = code.trim().toUpperCase();
      const v = MOCK_VOUCHERS.find((item) => item.code === cleanCode);
      if (!v) {
        return { success: false, message: 'Mã ưu đãi không hợp lệ hoặc đã hết hạn.' };
      }
      if (subtotal < v.min_order_value) {
        return {
          success: false,
          message: `Đơn hàng chưa đạt mức tối thiểu (${new Intl.NumberFormat('vi-VN').format(v.min_order_value)}đ) để áp dụng mã này.`,
        };
      }
      setAppliedVoucher(v);
      return { success: true };
    },
    [subtotal]
  );

  const removeVoucher = useCallback(() => {
    setAppliedVoucher(null);
  }, []);

  const selectPaymentMethod = useCallback((m: PaymentMethodType) => {
    setPaymentMethod(m);
  }, []);

  // Initiate Payment -> moves to K10
  const initiatePayment = useCallback(() => {
    if (!customer || !selectedVehicle || !selectedPackage) return;

    const items = [
      {
        name: selectedPackage.name,
        type: 'main' as const,
        price: vehicleClass === '4_5_cho' ? selectedPackage.base_price_4_5 : selectedPackage.base_price_7_9,
        duration_min: selectedPackage.duration_min,
      },
      ...selectedAddons.map((a) => ({
        name: a.name,
        type: 'addon' as const,
        price: vehicleClass === '4_5_cho' ? a.price_4_5 : a.price_7_9,
        duration_min: a.duration_min,
      })),
    ];

    const totalDuration = items.reduce((acc, cur) => acc + cur.duration_min, 0);

    const order: KioskOrder = {
      order_id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customer_id: customer.id,
      customer_name: customer.name,
      customer_phone: customer.phone,
      license_plate: selectedVehicle.license_plate,
      vehicle_class: vehicleClass,
      station_name: station.name,
      items,
      base_amount: subtotal,
      discount_amount: discountAmount,
      vat_rate: station.vat_rate,
      final_amount: finalTotal,
      voucher_code: appliedVoucher?.code,
      payment_method: paymentMethod,
      payment_status: 'pending',
      assigned_bay: station.active_bays[Math.floor(Math.random() * station.active_bays.length)],
      eta_minutes: totalDuration,
      created_at: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setCurrentOrder(order);
    setStep('K10');
  }, [customer, selectedVehicle, selectedPackage, vehicleClass, selectedAddons, subtotal, discountAmount, station, finalTotal, appliedVoucher, paymentMethod]);

  // Payment Sim Success
  const simPaymentSuccess = useCallback(() => {
    if (!currentOrder) return;
    setCurrentOrder((prev) => (prev ? { ...prev, payment_status: 'paid' } : null));
    setStep('K11');
    showToast('Thanh toán VNPay thành công! Đã tạo Work Order.');
  }, [currentOrder, showToast]);

  // Payment Sim Failure
  const simPaymentFailure = useCallback(() => {
    showToast('Giao dịch chưa hoàn tất hoặc bị hủy. Vui lòng quét lại mã hoặc thử lại.');
  }, [showToast]);

  // Cancel current session (FRK-3.2)
  const cancelCurrentSession = useCallback(() => {
    setCustomer(null);
    setSelectedVehicle(null);
    setSelectedPackage(MOCK_PACKAGES[1]);
    setSelectedAddons([]);
    setAppliedVoucher(null);
    setCurrentOrder(null);
    setStep('K1');
    showToast('Đã hủy phiên làm việc. Quay về màn hình chào.');
  }, [showToast]);

  // End session for next customer (FRK-6.2)
  const endSessionNextCustomer = useCallback(() => {
    setCustomer(null);
    setSelectedVehicle(null);
    setSelectedPackage(MOCK_PACKAGES[1]);
    setSelectedAddons([]);
    setAppliedVoucher(null);
    setCurrentOrder(null);
    setStep('K1');
    showToast('Phiên đã hoàn tất. Chào đón khách hàng tiếp theo!');
  }, [showToast]);

  // Quick fill demo user for fast testing
  const quickFillDemoUser = useCallback(
    (index: number) => {
      const target = customersList[index] || customersList[0];
      if (target) {
        setCustomer(target);
        if (target.vehicles.length > 0) {
          setSelectedVehicle(target.vehicles[0]);
        }
        showToast(`Đã nạp tài khoản test: ${target.name} (${target.phone})`);
      }
    },
    [customersList, showToast]
  );

  return (
    <KioskContext.Provider
      value={{
        isPaired,
        station,
        pairDevice,
        unpairDevice,
        step,
        goToStep,
        kioskDisplayMode,
        toggleDisplayMode,
        customer,
        customersList,
        lookupCustomer,
        loginWithPin,
        loginWithQR,
        quickRegister,
        requestPinReset,
        confirmChangePin,
        selectedVehicle,
        selectVehicle,
        addNewVehicle,
        packages: MOCK_PACKAGES,
        addons: MOCK_ADDONS,
        selectedPackage,
        selectedAddons,
        selectPackage,
        toggleAddon,
        vouchers: MOCK_VOUCHERS,
        appliedVoucher,
        applyVoucher,
        removeVoucher,
        subtotal,
        discountAmount,
        finalTotal,
        paymentMethod,
        selectPaymentMethod,
        currentOrder,
        initiatePayment,
        simPaymentSuccess,
        simPaymentFailure,
        cancelCurrentSession,
        endSessionNextCustomer,
        toastMessage,
        showToast,
        quickFillDemoUser,
      }}
    >
      {children}
    </KioskContext.Provider>
  );
};

export const useKiosk = () => {
  const context = useContext(KioskContext);
  if (!context) {
    throw new Error('useKiosk must be used within a KioskProvider');
  }
  return context;
};
