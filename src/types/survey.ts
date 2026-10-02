export type SystemType = 
  | 'cctv' 
  | 'access' 
  | 'intrusion' 
  | 'fire' 
  | 'network' 
  | 'audio' 
  | 'infrastructure';

export type InstallationStatus = 'new' | 'existing' | 'relocate' | 'demolish';

export interface Point {
  x: number;
  y: number;
}

export interface DoriDistances {
  detect: number;   // 25 px/m (~8 px/ft)
  observe: number;  // 62.5 px/m (~19 px/ft)
  recognize: number;// 125 px/m (~38 px/ft)
  identify: number; // 250 px/m (~76 px/ft)
}

export interface SurveyDevice {
  id: string;
  systemType: SystemType;
  deviceType: string;
  name: string; // e.g. "CAM-101", "DR-01"
  x: number;
  y: number;
  rotation: number; // in degrees (0 - 360)
  
  // Hardware specifications
  manufacturer: string;
  model: string;
  mountingType: 'Ceiling' | 'Wall' | 'Pole' | 'Corner' | 'Desk' | 'Door Frame';
  mountingHeightFt: number;
  status: InstallationStatus;
  estimatedCost: number;
  partNumber?: string;
  
  // Video FoV specific
  hasFov?: boolean;
  fovAngle?: number; // Cone spread angle in degrees (e.g. 60 - 110)
  fovDistanceFt?: number; // Reach of the cone in feet
  showDori?: boolean;
  
  // Coverage radius (e.g. Wi-Fi AP, Motion PIR, Smoke Detector)
  hasRadius?: boolean;
  coverageRadiusFt?: number;

  // Network & IT properties
  ipAddress?: string;
  vlan?: string;
  macAddress?: string;
  switchPort?: string;
  
  // General
  notes?: string;
  color?: string;
  isLocked?: boolean;
}

export interface CableRun {
  id: string;
  name: string; // e.g. "CBL-CAM101"
  cableType: 'Cat6' | 'Cat6A' | 'Fiber Multi-Mode' | 'Fiber Single-Mode' | '18/2 Fire' | '22/4 Security' | 'Coax RG6' | 'Composite Access';
  systemType: SystemType;
  points: Point[];
  fromDeviceId?: string;
  toDeviceId?: string;
  lengthFt: number;
  color: string;
  notes?: string;
}

export type MarkupType = 'wall' | 'room' | 'text' | 'dimension' | 'arrow' | 'callout';

export interface MarkupItem {
  id: string;
  type: MarkupType;
  points: Point[];
  text?: string;
  color: string;
  lineWidth?: number;
  fillColor?: string;
  fontSize?: number;
  measuredLengthFt?: number;
}

export interface ScaleCalibration {
  pixelsPerUnit: number; // pixels per foot
  unit: 'ft' | 'm';
  isCalibrated: boolean;
  referenceDistance: number; // e.g. 10 ft
  calibrationLine?: { p1: Point; p2: Point };
}

export interface LayerState {
  cctv: boolean;
  access: boolean;
  intrusion: boolean;
  fire: boolean;
  network: boolean;
  audio: boolean;
  infrastructure: boolean;
  cables: boolean;
  markups: boolean;
  fovCones: boolean;
  labels: boolean;
}

export interface SurveyProject {
  id: string;
  name: string;
  clientName: string;
  siteAddress: string;
  floorName: string;
  scale: ScaleCalibration;
  devices: SurveyDevice[];
  cables: CableRun[];
  markups: MarkupItem[];
  backgroundImageUrl: string | null;
  backgroundImageWidth?: number;
  backgroundImageHeight?: number;
  layers: LayerState;
  createdAt: string;
  updatedAt: string;
}

export type ToolMode = 
  | 'select' 
  | 'pan' 
  | 'calibrate' 
  | 'cable' 
  | 'wall' 
  | 'room' 
  | 'dimension' 
  | 'text' 
  | 'device';
