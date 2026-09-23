export type VehicleClass = '4_5_cho' | '7_9_cho';

export interface Vehicle {
  id: string;
  customer_id: string;
  license_plate: string;
  vehicle_class: VehicleClass;
  model_name?: string;
  last_visit?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  pin_hash?: string; // or demo PIN code
  has_pin: boolean;
  failed_attempts: number;
  locked_until?: number | null;
  must_change_pin: boolean;
  sup_points: number;
  vehicles: Vehicle[];
}

export type ServiceTier = 'W0' | 'W1' | 'W2' | 'W3' | 'W4' | 'W5';

export interface ServicePackage {
  id: string;
  tier: ServiceTier;
  name: string;
  tagline: string;
  duration_min: number;
  duration_max: number;
  base_price_4_5: number;
  base_price_7_9: number;
  image_url: string;
  description_md: string;
  bullets: string[];
  color_theme: 'normal' | 'primary' | 'gold' | 'custom';
  popular?: boolean;
}

export interface AddonService {
  id: string;
  name: string;
  price_4_5: number;
  price_7_9: number;
  duration_min: number;
  description_md: string;
  icon_name: string;
  category: 'interior' | 'exterior' | 'protection';
}

export interface Voucher {
  code: string;
  title: string;
  discount_type: 'fixed' | 'percent';
  discount_value: number;
  min_order_value: number;
  description: string;
  badge?: string;
}

export type PaymentMethodType = 'qr_vnpay' | 'visa_mastercard' | 'cash' | 'deferred';

export interface OrderItem {
  name: string;
  type: 'main' | 'addon';
  price: number;
  duration_min: number;
}

export interface KioskOrder {
  order_id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  license_plate: string;
  vehicle_class: VehicleClass;
  station_name: string;
  items: OrderItem[];
  base_amount: number;
  discount_amount: number;
  vat_rate: number; // 8% or 10% (inclusive)
  final_amount: number;
  voucher_code?: string;
  payment_method: PaymentMethodType;
  payment_status: 'pending' | 'paid' | 'pending_cash' | 'pending_deferred' | 'failed';
  assigned_bay: string;
  eta_minutes: number;
  created_at: string;
}

export type KioskStep =
  | 'K0'   // Device Pairing
  | 'K1'   // Idle / Attract
  | 'K1L'  // Liveview (TV Queue in portrait)
  | 'K2'   // Customer Login (Phone/PIN or QR)
  | 'K2_A' // Quick Register (Name + Phone + PIN)
  | 'K5'   // Vehicle Selection
  | 'K6'   // Main Service Catalog
  | 'K7'   // Add-ons
  | 'K8'   // Order Confirm & Voucher
  | 'K9'   // Payment Method Selection
  | 'K10'  // Payment Processing (QR & Waiting)
  | 'K11'; // Success & Countdown ETA
