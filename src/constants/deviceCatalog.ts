import { SystemType } from '../types/survey';

export interface DeviceTemplate {
  deviceType: string;
  label: string;
  systemType: SystemType;
  icon: string;
  defaultModel: string;
  defaultManufacturer: string;
  defaultCost: number;
  mountingType: 'Ceiling' | 'Wall' | 'Pole' | 'Corner' | 'Desk' | 'Door Frame';
  mountingHeightFt: number;
  hasFov?: boolean;
  fovAngle?: number;
  fovDistanceFt?: number;
  hasRadius?: boolean;
  coverageRadiusFt?: number;
  color: string;
  description: string;
}

export const DEVICE_CATALOG: DeviceTemplate[] = [
  // ==========================================
  // --- VERKADA SECURITY & IOT SUITE ---
  // ==========================================
  {
    deviceType: 'verkada_cd52',
    label: 'Verkada CD52-E Dome (5MP)',
    systemType: 'cctv',
    icon: 'Camera',
    defaultManufacturer: 'Verkada',
    defaultModel: 'CD52-E Outdoor Dome 5MP',
    defaultCost: 1199,
    mountingType: 'Ceiling',
    mountingHeightFt: 10,
    hasFov: true,
    fovAngle: 97,
    fovDistanceFt: 55,
    color: '#0284c7',
    description: 'Verkada hybrid cloud 5MP outdoor vandal dome with onboard SSD storage & AI analytics'
  },
  {
    deviceType: 'verkada_cd62',
    label: 'Verkada CD62-E 4K Dome',
    systemType: 'cctv',
    icon: 'Camera',
    defaultManufacturer: 'Verkada',
    defaultModel: 'CD62-E 4K Vandal Dome',
    defaultCost: 1599,
    mountingType: 'Ceiling',
    mountingHeightFt: 12,
    hasFov: true,
    fovAngle: 95,
    fovDistanceFt: 70,
    color: '#0369a1',
    description: 'Verkada enterprise 4K Ultra-HD vandal dome camera with intelligent search'
  },
  {
    deviceType: 'verkada_cb52',
    label: 'Verkada CB52-E Bullet (5MP)',
    systemType: 'cctv',
    icon: 'Video',
    defaultManufacturer: 'Verkada',
    defaultModel: 'CB52-E Bullet 5MP (3x Zoom)',
    defaultCost: 1399,
    mountingType: 'Wall',
    mountingHeightFt: 14,
    hasFov: true,
    fovAngle: 45,
    fovDistanceFt: 110,
    color: '#0284c7',
    description: 'Verkada telephoto bullet camera with 3x motorized optical zoom and 50m IR illumination'
  },
  {
    deviceType: 'verkada_cb62',
    label: 'Verkada CB62-E 4K Bullet',
    systemType: 'cctv',
    icon: 'Video',
    defaultManufacturer: 'Verkada',
    defaultModel: 'CB62-E 4K Telephoto Bullet',
    defaultCost: 1799,
    mountingType: 'Pole',
    mountingHeightFt: 16,
    hasFov: true,
    fovAngle: 40,
    fovDistanceFt: 160,
    color: '#075985',
    description: 'Verkada long-range 4K bullet with license plate recognition and vehicle analytics'
  },
  {
    deviceType: 'verkada_cf83',
    label: 'Verkada CF83-E 360° Fisheye',
    systemType: 'cctv',
    icon: 'CircleDot',
    defaultManufacturer: 'Verkada',
    defaultModel: 'CF83-E 12MP Fisheye',
    defaultCost: 1499,
    mountingType: 'Ceiling',
    mountingHeightFt: 12,
    hasRadius: true,
    coverageRadiusFt: 35,
    color: '#38bdf8',
    description: 'Verkada 12MP 360-degree panoramic coverage camera with digital PTZ dewarping'
  },
  {
    deviceType: 'verkada_cp52',
    label: 'Verkada CP52-E PTZ (28x)',
    systemType: 'cctv',
    icon: 'Compass',
    defaultManufacturer: 'Verkada',
    defaultModel: 'CP52-E 5MP 28x Optical PTZ',
    defaultCost: 2499,
    mountingType: 'Pole',
    mountingHeightFt: 24,
    hasFov: true,
    fovAngle: 120,
    fovDistanceFt: 220,
    color: '#0c4a6e',
    description: 'Verkada 5MP high-speed pan-tilt-zoom with 28x optical zoom and auto-tracking'
  },
  {
    deviceType: 'verkada_ch52',
    label: 'Verkada CH52-E Multi-Sensor',
    systemType: 'cctv',
    icon: 'Layers',
    defaultManufacturer: 'Verkada',
    defaultModel: 'CH52-E 20MP Quad Multi-Sensor',
    defaultCost: 2699,
    mountingType: 'Ceiling',
    mountingHeightFt: 16,
    hasFov: true,
    fovAngle: 180,
    fovDistanceFt: 85,
    color: '#0369a1',
    description: 'Verkada 4-in-1 adjustable quad-sensor camera (4x 5MP sensors) for corners and intersections'
  },
  {
    deviceType: 'verkada_cm41',
    label: 'Verkada CM41 Mini Dome',
    systemType: 'cctv',
    icon: 'Camera',
    defaultManufacturer: 'Verkada',
    defaultModel: 'CM41 Mini Indoor 5MP',
    defaultCost: 799,
    mountingType: 'Ceiling',
    mountingHeightFt: 9,
    hasFov: true,
    fovAngle: 93,
    fovDistanceFt: 35,
    color: '#38bdf8',
    description: 'Verkada ultra-compact discrete indoor mini dome camera'
  },

  // --- VERKADA ACCESS CONTROL ---
  {
    deviceType: 'verkada_ad32',
    label: 'Verkada AD32 Mullion Reader',
    systemType: 'access',
    icon: 'CreditCard',
    defaultManufacturer: 'Verkada',
    defaultModel: 'AD32 Multi-Format Reader',
    defaultCost: 349,
    mountingType: 'Door Frame',
    mountingHeightFt: 4,
    color: '#10b981',
    description: 'Verkada BLE, NFC, and DesFire EV3 multi-credential smart card & mobile door reader'
  },
  {
    deviceType: 'verkada_ad33',
    label: 'Verkada AD33 Keypad Reader',
    systemType: 'access',
    icon: 'KeyRound',
    defaultManufacturer: 'Verkada',
    defaultModel: 'AD33 PIN + Card Reader',
    defaultCost: 449,
    mountingType: 'Wall',
    mountingHeightFt: 4,
    color: '#059669',
    description: 'Verkada dual-authentication keypad and mobile NFC/BLE credential reader'
  },
  {
    deviceType: 'verkada_ac42',
    label: 'Verkada AC42 4-Door Controller',
    systemType: 'access',
    icon: 'Server',
    defaultManufacturer: 'Verkada',
    defaultModel: 'AC42 4-Door Cloud Controller',
    defaultCost: 1799,
    mountingType: 'Wall',
    mountingHeightFt: 5,
    color: '#047857',
    description: 'Verkada native cloud-managed 4-door access controller panel with battery backup'
  },
  {
    deviceType: 'verkada_ac62',
    label: 'Verkada AC62 16-Door Controller',
    systemType: 'access',
    icon: 'Server',
    defaultManufacturer: 'Verkada',
    defaultModel: 'AC62 16-Door Elevator/Access',
    defaultCost: 3999,
    mountingType: 'Wall',
    mountingHeightFt: 5,
    color: '#065f46',
    description: 'Verkada enterprise 16-door unified controller for elevator and multi-tenant access'
  },

  // --- VERKADA ENVIRONMENTAL & VAPE SENSORS ---
  {
    deviceType: 'verkada_sv23',
    label: 'Verkada SV23 Vape & Air Sensor',
    systemType: 'intrusion',
    icon: 'Wind',
    defaultManufacturer: 'Verkada',
    defaultModel: 'SV23 Environmental & Vape',
    defaultCost: 999,
    mountingType: 'Ceiling',
    mountingHeightFt: 10,
    hasRadius: true,
    coverageRadiusFt: 25,
    color: '#14b8a6',
    description: 'Verkada specialized vape, THC, smoke, noise index, TVOC, and temperature/humidity sensor'
  },
  {
    deviceType: 'verkada_sv25',
    label: 'Verkada SV25 Environmental Sensor',
    systemType: 'intrusion',
    icon: 'Wind',
    defaultManufacturer: 'Verkada',
    defaultModel: 'SV25 All-In-One Sensor',
    defaultCost: 1299,
    mountingType: 'Ceiling',
    mountingHeightFt: 10,
    hasRadius: true,
    coverageRadiusFt: 30,
    color: '#0d9488',
    description: 'Verkada all-in-one air quality sensor (CO2, PM2.5, motion, barometric pressure, acoustic alerts)'
  },

  // --- VERKADA ALARMS & INTRUSION ---
  {
    deviceType: 'verkada_bp41',
    label: 'Verkada BP41 Alarm Panel',
    systemType: 'intrusion',
    icon: 'Shield',
    defaultManufacturer: 'Verkada',
    defaultModel: 'BP41 32-Zone Alarm Hub',
    defaultCost: 999,
    mountingType: 'Wall',
    mountingHeightFt: 5,
    color: '#f59e0b',
    description: 'Verkada integrated alarm panel with cellular backup and wireless sensor hub'
  },
  {
    deviceType: 'verkada_bc51',
    label: 'Verkada BC51 Alarm Console',
    systemType: 'intrusion',
    icon: 'Tv',
    defaultManufacturer: 'Verkada',
    defaultModel: 'BC51 Touchscreen Console',
    defaultCost: 799,
    mountingType: 'Wall',
    mountingHeightFt: 4.5,
    color: '#d97706',
    description: 'Verkada interactive touchscreen alarm console with 2-way video calling to monitoring operators'
  },
  {
    deviceType: 'verkada_bh61',
    label: 'Verkada BH61 Panic Button',
    systemType: 'intrusion',
    icon: 'Radio',
    defaultManufacturer: 'Verkada',
    defaultModel: 'BH61 Wireless Panic Button',
    defaultCost: 199,
    mountingType: 'Desk',
    mountingHeightFt: 2.5,
    color: '#b45309',
    description: 'Verkada single and double-press wireless emergency panic and duress button'
  },
  {
    deviceType: 'verkada_br31',
    label: 'Verkada BR31 Wireless Motion',
    systemType: 'intrusion',
    icon: 'Activity',
    defaultManufacturer: 'Verkada',
    defaultModel: 'BR31 Wireless PIR Motion',
    defaultCost: 199,
    mountingType: 'Corner',
    mountingHeightFt: 8,
    hasFov: true,
    fovAngle: 90,
    fovDistanceFt: 35,
    color: '#f59e0b',
    description: 'Verkada wireless passive infrared motion sensor with pet immunity'
  },
  {
    deviceType: 'verkada_br33',
    label: 'Verkada BR33 Wireless Contact',
    systemType: 'intrusion',
    icon: 'Lock',
    defaultManufacturer: 'Verkada',
    defaultModel: 'BR33 Wireless Door Contact',
    defaultCost: 149,
    mountingType: 'Door Frame',
    mountingHeightFt: 6,
    color: '#d97706',
    description: 'Verkada surface-mount wireless magnetic door & window intrusion sensor'
  },
  {
    deviceType: 'dps_wired',
    label: 'DPS – Wired Door Position Sensor',
    systemType: 'intrusion',
    icon: 'Lock',
    defaultManufacturer: 'Bosch',
    defaultModel: 'DS150i Wired Magnetic Contact',
    defaultCost: 35,
    mountingType: 'Door Frame',
    mountingHeightFt: 6.5,
    color: '#b45309',
    description: 'Surface-mount wired magnetic door/window position sensor (normally closed). Triggers alarm on open.'
  },
  {
    deviceType: 'dps_wireless',
    label: 'DPS – Wireless Door Position Sensor',
    systemType: 'intrusion',
    icon: 'Lock',
    defaultManufacturer: 'Bosch',
    defaultModel: 'ISW-ZPR1-WP13 Wireless Contact',
    defaultCost: 65,
    mountingType: 'Door Frame',
    mountingHeightFt: 6.5,
    color: '#b45309',
    description: 'Z-Wave wireless magnetic door/window position sensor with tamper detection and low-battery alert.'
  },
  {
    deviceType: 'dps_overhead_door',
    label: 'DPS – Overhead / Roll-Up Door Sensor',
    systemType: 'intrusion',
    icon: 'Lock',
    defaultManufacturer: 'Sentrol',
    defaultModel: 'GRI 2600 Overhead Door Contact',
    defaultCost: 45,
    mountingType: 'Door Frame',
    mountingHeightFt: 10,
    color: '#92400e',
    description: 'Heavy-gauge overhead roll-up door position sensor rated for commercial loading dock doors.'
  },
  {
    deviceType: 'glass_break',
    label: 'Glass Break Detector',
    systemType: 'intrusion',
    icon: 'ShieldAlert',
    defaultManufacturer: 'Bosch',
    defaultModel: 'DS1101i Glassbreak Detector',
    defaultCost: 79,
    mountingType: 'Wall',
    mountingHeightFt: 8,
    hasRadius: true,
    coverageRadiusFt: 25,
    color: '#b45309',
    description: 'Acoustic glassbreak sensor detecting high-frequency glass shattering within 25ft coverage radius.'
  },
  {
    deviceType: 'verkada_bx21',
    label: 'Verkada BX21 Wireless Siren',
    systemType: 'intrusion',
    icon: 'BellRing',
    defaultManufacturer: 'Verkada',
    defaultModel: 'BX21 Wireless Siren & Strobe',
    defaultCost: 299,
    mountingType: 'Wall',
    mountingHeightFt: 8,
    color: '#ea580c',
    description: 'Verkada 105dB outdoor/indoor wireless audible alarm siren and visual LED strobe'
  },

  // --- VERKADA INTERCOM & VIEWING ---
  {
    deviceType: 'verkada_td52',
    label: 'Verkada TD52 Video Intercom',
    systemType: 'audio',
    icon: 'PhoneCall',
    defaultManufacturer: 'Verkada',
    defaultModel: 'TD52 Video Intercom 5MP',
    defaultCost: 1499,
    mountingType: 'Wall',
    mountingHeightFt: 5,
    hasFov: true,
    fovAngle: 130,
    fovDistanceFt: 20,
    color: '#db2777',
    description: 'Verkada 5MP smart video intercom with sub-second call routing, mobile unlocking, and reader'
  },
  {
    deviceType: 'verkada_vx52',
    label: 'Verkada VX52 Viewing Station',
    systemType: 'infrastructure',
    icon: 'Monitor',
    defaultManufacturer: 'Verkada',
    defaultModel: 'VX52 4K Live Viewing Station',
    defaultCost: 1299,
    mountingType: 'Desk',
    mountingHeightFt: 3,
    color: '#475569',
    description: 'Verkada dedicated ultra-low latency 4K video monitor appliance for guard stations'
  },

  // ==========================================
  // --- GENERAL INDUSTRY STANDARD DEVICES ---
  // ==========================================
  {
    deviceType: 'cctv_dome',
    label: 'Standard Dome Camera',
    systemType: 'cctv',
    icon: 'Camera',
    defaultManufacturer: 'Axis Communications',
    defaultModel: 'M3206-LVE 4MP IR Dome',
    defaultCost: 450,
    mountingType: 'Ceiling',
    mountingHeightFt: 10,
    hasFov: true,
    fovAngle: 90,
    fovDistanceFt: 45,
    color: '#3b82f6',
    description: 'Indoor/outdoor vandal-resistant wide-angle dome camera'
  },
  {
    deviceType: 'cctv_bullet',
    label: 'Standard Bullet Camera',
    systemType: 'cctv',
    icon: 'Video',
    defaultManufacturer: 'Hanwha Techwin',
    defaultModel: 'XNO-8080R 4K Bullet',
    defaultCost: 580,
    mountingType: 'Wall',
    mountingHeightFt: 14,
    hasFov: true,
    fovAngle: 65,
    fovDistanceFt: 75,
    color: '#2563eb',
    description: 'Long-range telephoto bullet camera with IR illumination'
  },
  {
    deviceType: 'access_maglock',
    label: 'Electromagnetic Lock',
    systemType: 'access',
    icon: 'Lock',
    defaultManufacturer: 'Securitron / ASSA ABLOY',
    defaultModel: 'M62 Maglock 1200lb',
    defaultCost: 320,
    mountingType: 'Door Frame',
    mountingHeightFt: 7,
    color: '#047857',
    description: '1200lb holding force fail-safe magnetic lock'
  },
  {
    deviceType: 'access_strike',
    label: 'Electric Door Strike',
    systemType: 'access',
    icon: 'Zap',
    defaultManufacturer: 'HES / ASSA ABLOY',
    defaultModel: 'HES 5000 Universal Strike',
    defaultCost: 210,
    mountingType: 'Door Frame',
    mountingHeightFt: 3.5,
    color: '#34d399',
    description: 'Low-profile electric release door strike'
  },
  {
    deviceType: 'access_rex',
    label: 'Request to Exit (REX)',
    systemType: 'access',
    icon: 'Eye',
    defaultManufacturer: 'Bosch',
    defaultModel: 'DS160 PIR Exit Sensor',
    defaultCost: 135,
    mountingType: 'Wall',
    mountingHeightFt: 7.5,
    hasFov: true,
    fovAngle: 45,
    fovDistanceFt: 8,
    color: '#6ee7b7',
    description: 'Passive infrared motion detector for hands-free egress'
  },
  {
    deviceType: 'fire_smoke',
    label: 'Smoke Detector',
    systemType: 'fire',
    icon: 'Flame',
    defaultManufacturer: 'Notifier by Honeywell',
    defaultModel: 'FSP-951 Photoelectric Smoke',
    defaultCost: 115,
    mountingType: 'Ceiling',
    mountingHeightFt: 10,
    hasRadius: true,
    coverageRadiusFt: 21,
    color: '#ef4444',
    description: 'Addressable intelligent photoelectric smoke sensor'
  },
  {
    deviceType: 'fire_pull',
    label: 'Manual Pull Station',
    systemType: 'fire',
    icon: 'Hand',
    defaultManufacturer: 'Notifier by Honeywell',
    defaultModel: 'NBG-12LX Addressable Pull',
    defaultCost: 140,
    mountingType: 'Wall',
    mountingHeightFt: 4,
    color: '#dc2626',
    description: 'Dual-action emergency manual fire alarm station'
  },
  {
    deviceType: 'fire_horn',
    label: 'Horn Strobe / Notification',
    systemType: 'fire',
    icon: 'Volume2',
    defaultManufacturer: 'System Sensor',
    defaultModel: 'L-Series P2RL Wall Horn Strobe',
    defaultCost: 88,
    mountingType: 'Wall',
    mountingHeightFt: 7.5,
    color: '#b91c1c',
    description: 'Life safety audible horn and synchronized flash strobe'
  },
  {
    deviceType: 'fire_facp',
    label: 'Fire Alarm Control Panel',
    systemType: 'fire',
    icon: 'Shield',
    defaultManufacturer: 'Notifier',
    defaultModel: 'NFS2-640 Intelligent FACP',
    defaultCost: 2400,
    mountingType: 'Wall',
    mountingHeightFt: 5,
    color: '#991b1b',
    description: 'Central fire alarm control unit and network hub'
  },
  {
    deviceType: 'net_ap',
    label: 'Wi-Fi 6 Access Point',
    systemType: 'network',
    icon: 'Wifi',
    defaultManufacturer: 'Cisco Meraki',
    defaultModel: 'MR46 Wi-Fi 6 AP',
    defaultCost: 650,
    mountingType: 'Ceiling',
    mountingHeightFt: 10,
    hasRadius: true,
    coverageRadiusFt: 40,
    color: '#8b5cf6',
    description: 'Dual-band Wi-Fi 6 multi-gigabit wireless access point'
  },
  {
    deviceType: 'net_drop',
    label: 'Network Data Drop (RJ45)',
    systemType: 'network',
    icon: 'Network',
    defaultManufacturer: 'Panduit',
    defaultModel: 'Mini-Com Dual Cat6 Faceplate',
    defaultCost: 45,
    mountingType: 'Wall',
    mountingHeightFt: 1.5,
    color: '#7c3aed',
    description: 'Dual RJ45 Ethernet communication wall outlet'
  },
  {
    deviceType: 'net_rack',
    label: 'MDF / IDF Telecom Rack',
    systemType: 'infrastructure',
    icon: 'Server',
    defaultManufacturer: 'Chatsworth Products (CPI)',
    defaultModel: '42U Standard Server Cabinet',
    defaultCost: 1450,
    mountingType: 'Floor' as any,
    mountingHeightFt: 0,
    color: '#475569',
    description: 'Main or intermediate distribution frame network closet'
  },
  {
    deviceType: 'av_speaker',
    label: 'IP Ceiling Speaker',
    systemType: 'audio',
    icon: 'Speaker',
    defaultManufacturer: 'Axis Communications',
    defaultModel: 'C1210-E Network Ceiling Speaker',
    defaultCost: 310,
    mountingType: 'Ceiling',
    mountingHeightFt: 9,
    hasRadius: true,
    coverageRadiusFt: 20,
    color: '#ec4899',
    description: 'PoE IP SIP ceiling speaker for background audio & paging'
  }
];

export const SYSTEM_COLORS: Record<SystemType, string> = {
  cctv: '#3b82f6',
  access: '#10b981',
  intrusion: '#f59e0b',
  fire: '#ef4444',
  network: '#8b5cf6',
  audio: '#ec4899',
  infrastructure: '#64748b',
};

export const SYSTEM_NAMES: Record<SystemType, string> = {
  cctv: 'Video Surveillance (CCTV)',
  access: 'Access Control',
  intrusion: 'Intrusion & Environmental',
  fire: 'Fire & Life Safety',
  network: 'Network & Wi-Fi',
  audio: 'Audio / Visual & Intercom',
  infrastructure: 'Infrastructure & Racks',
};
