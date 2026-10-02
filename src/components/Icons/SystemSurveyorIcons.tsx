import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// -------------------------------------------------------------
// VIDEO SURVEILLANCE ICONS (System Surveyor Blue)
// -------------------------------------------------------------

export const DomeCameraIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="7" rx="9" ry="3" />
    <path d="M3 7v2c0 4.97 4.03 9 9 9s9-4.03 9-9V7" />
    <circle cx="12" cy="11" r="3" fill={color} fillOpacity="0.3" />
    <circle cx="12" cy="11" r="1" fill={color} />
  </svg>
);

export const BulletCameraIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="6" width="13" height="8" rx="2" />
    <path d="M15 8.5l6-3.5v9l-6-3.5v-2z" fill={color} fillOpacity="0.3" />
    <line x1="6" y1="14" x2="6" y2="19" />
    <line x1="3" y1="19" x2="9" y2="19" />
    <circle cx="8.5" cy="10" r="2" />
  </svg>
);

export const PtzCameraIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" fill={color} fillOpacity="0.3" />
    <path d="M12 3l2 2-2 2" />
    <path d="M12 21l-2-2 2-2" />
    <path d="M3 12l2-2 2 2" />
    <path d="M21 12l-2 2-2-2" />
  </svg>
);

export const FisheyeCameraIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="6" strokeDasharray="3 3" />
    <circle cx="12" cy="12" r="3" fill={color} />
    <circle cx="12" cy="12" r="1" fill="#fff" />
  </svg>
);

export const MultiSensorCameraIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <circle cx="7.5" cy="7.5" r="2" fill={color} />
    <circle cx="16.5" cy="7.5" r="2" fill={color} />
    <circle cx="7.5" cy="16.5" r="2" fill={color} />
    <circle cx="16.5" cy="16.5" r="2" fill={color} />
    <line x1="12" y1="3" x2="12" y2="21" strokeDasharray="2 2" />
    <line x1="3" y1="12" x2="21" y2="12" strokeDasharray="2 2" />
  </svg>
);

// -------------------------------------------------------------
// ACCESS CONTROL ICONS (System Surveyor Green)
// -------------------------------------------------------------

export const CardReaderIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="5" y="2" width="14" height="20" rx="3" />
    <circle cx="12" cy="7" r="1.5" fill={color} />
    <path d="M9 13a4 4 0 0 1 6 0" />
    <path d="M7 16a7 7 0 0 1 10 0" />
  </svg>
);

export const KeypadReaderIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="5" y="2" width="14" height="20" rx="3" />
    <line x1="8" y1="6" x2="16" y2="6" strokeWidth="2" />
    <circle cx="8" cy="10" r="1" fill={color} />
    <circle cx="12" cy="10" r="1" fill={color} />
    <circle cx="16" cy="10" r="1" fill={color} />
    <circle cx="8" cy="13" r="1" fill={color} />
    <circle cx="12" cy="13" r="1" fill={color} />
    <circle cx="16" cy="13" r="1" fill={color} />
    <circle cx="8" cy="16" r="1" fill={color} />
    <circle cx="12" cy="16" r="1" fill={color} />
    <circle cx="16" cy="16" r="1" fill={color} />
    <circle cx="12" cy="19" r="1" fill={color} />
  </svg>
);

export const MaglockIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="6" width="20" height="7" rx="1.5" />
    <rect x="5" y="13" width="14" height="5" fill={color} fillOpacity="0.3" />
    <line x1="8" y1="6" x2="8" y2="13" />
    <line x1="16" y1="6" x2="16" y2="13" />
  </svg>
);

export const RexSensorIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a5 5 0 0 0-5 5v3h10V7a5 5 0 0 0-5-5z" fill={color} fillOpacity="0.2" />
    <path d="M7 10L3 20h18l-4-10H7z" />
    <line x1="12" y1="12" x2="12" y2="17" />
  </svg>
);

export const AccessControllerIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="7" cy="7" r="1.5" fill={color} />
    <circle cx="7" cy="12" r="1.5" fill={color} />
    <circle cx="7" cy="17" r="1.5" fill={color} />
    <path d="M12 6h5v4h-5z" fill={color} fillOpacity="0.3" />
    <path d="M12 14h5v4h-5z" fill={color} fillOpacity="0.3" />
  </svg>
);

// -------------------------------------------------------------
// INTRUSION DETECTION ICONS (System Surveyor Amber)
// -------------------------------------------------------------

export const PirMotionIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12,3 3,21 21,21" fill={color} fillOpacity="0.2" />
    <circle cx="12" cy="15" r="3" fill={color} />
    <path d="M7 18a6 6 0 0 1 10 0" />
  </svg>
);

export const DoorContactIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="4" width="6" height="16" rx="1.5" fill={color} fillOpacity="0.3" />
    <rect x="14" y="4" width="6" height="16" rx="1.5" fill={color} fillOpacity="0.3" />
    <line x1="10" y1="12" x2="14" y2="12" strokeDasharray="1 1" />
  </svg>
);

export const SirenStrobeIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 10a8 8 0 0 1 16 0v7H4v-7z" fill={color} fillOpacity="0.3" />
    <line x1="2" y1="21" x2="22" y2="21" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="5" y1="4" x2="7" y2="6" />
    <line x1="19" y1="4" x2="17" y2="6" />
  </svg>
);

export const PanicButtonIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <circle cx="12" cy="12" r="5" fill={color} />
    <circle cx="12" cy="12" r="2" fill="#fff" />
  </svg>
);

// -------------------------------------------------------------
// FIRE & LIFE SAFETY ICONS (System Surveyor Red)
// -------------------------------------------------------------

export const SmokeDetectorIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.15" />
    <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
    <text x="12" y="15" textAnchor="middle" fill={color} fontSize="9" fontWeight="bold" fontFamily="sans-serif">S</text>
  </svg>
);

export const FirePullIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="3" width="16" height="18" rx="2" fill={color} fillOpacity="0.2" />
    <rect x="7" y="10" width="10" height="7" rx="1" fill={color} />
    <line x1="12" y1="6" x2="12" y2="8" strokeWidth="2" />
  </svg>
);

export const HornStrobeIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <polygon points="8,8 16,8 14,14 10,14" fill={color} />
    <circle cx="12" cy="17" r="1.5" fill={color} />
  </svg>
);

// -------------------------------------------------------------
// NETWORKING & IT ICONS (System Surveyor Purple)
// -------------------------------------------------------------

export const WifiApIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="4" fill={color} fillOpacity="0.15" />
    <path d="M8.5 11.5a5 5 0 0 1 7 0" />
    <path d="M6 9a8.5 8.5 0 0 1 12 0" />
    <circle cx="12" cy="15" r="1.5" fill={color} />
  </svg>
);

export const ServerRackIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17" x2="20" y2="17" />
    <circle cx="7" cy="4.5" r="1" fill={color} />
    <circle cx="7" cy="9.5" r="1" fill={color} />
    <circle cx="7" cy="14.5" r="1" fill={color} />
    <circle cx="7" cy="19.5" r="1" fill={color} />
  </svg>
);

// -------------------------------------------------------------
// ENVIRONMENTAL & VAPE ICONS (System Surveyor Teal)
// -------------------------------------------------------------

export const VapeSensorIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.15" />
    <path d="M8 12c1.5-2 2-2 3.5 0s2 2 3.5 0" />
    <path d="M8 8c1.5-2 2-2 3.5 0s2 2 3.5 0" />
    <circle cx="12" cy="16" r="1.5" fill={color} />
  </svg>
);

// -------------------------------------------------------------
// AUDIO / INTERCOM ICONS (System Surveyor Magenta)
// -------------------------------------------------------------

export const IntercomIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="6" y="2" width="12" height="20" rx="3" fill={color} fillOpacity="0.15" />
    <circle cx="12" cy="7" r="2.5" />
    <circle cx="12" cy="7" r="1" fill={color} />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="14" x2="15" y2="14" />
    <circle cx="12" cy="18" r="1.5" fill={color} />
  </svg>
);

export const SpeakerIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.15" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="2" fill={color} />
  </svg>
);
