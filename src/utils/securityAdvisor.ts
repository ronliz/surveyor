import { SurveyProject, SurveyDevice, SystemType } from '../types/survey';
import { DeviceTemplate, DEVICE_CATALOG } from '../constants/deviceCatalog';
import { getDistance, feetToPixels } from './geometry';

export type PreferredEcosystem = 'verkada' | 'multivendor';

export interface SecurityFinding {
  id: string;
  category: 'cctv' | 'access' | 'intrusion' | 'fire' | 'network';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  locationName: string;
  description: string;
  standardReference: string;
  recommendedDevice?: {
    template: DeviceTemplate;
    targetX: number;
    targetY: number;
    rotation: number;
    reason: string;
  };
}

export interface SecurityAuditReport {
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  categoryScores: {
    cctv: number;
    access: number;
    intrusion: number;
    fire: number;
  };
  summary: string;
  findings: SecurityFinding[];
  deviceCounts: Record<SystemType, number>;
}

// Helper to pick exact template matching brand preference
function getDevice(deviceType: string, ecosystem: PreferredEcosystem): DeviceTemplate {
  if (ecosystem === 'verkada') {
    const vMatch = DEVICE_CATALOG.find(d => d.deviceType === `verkada_${deviceType}` || (d.defaultManufacturer === 'Verkada' && d.deviceType.includes(deviceType)));
    if (vMatch) return vMatch;
  } else {
    const stdMatch = DEVICE_CATALOG.find(d => !d.deviceType.startsWith('verkada_') && (d.deviceType.includes(deviceType) || d.systemType === (deviceType as any)));
    if (stdMatch) return stdMatch;
  }
  // Fallback to strict find or first catalog entry
  return DEVICE_CATALOG.find(d => d.deviceType.includes(deviceType)) || DEVICE_CATALOG[0];
}

export function analyzeFloorplanSecurity(
  project: SurveyProject, 
  ecosystem: PreferredEcosystem = 'verkada'
): SecurityAuditReport {
  const devices = project.devices;
  const findings: SecurityFinding[] = [];
  const scale = project.scale;

  // Spatial Dimensions
  const planWidth = project.backgroundImageWidth || 1600;
  const planHeight = project.backgroundImageHeight || 1000;

  // Calculate actual bounding box of items or floorplan
  const minX = 60;
  const maxX = planWidth - 60;
  const minY = 60;
  const maxY = planHeight - 60;
  const centerX = planWidth / 2;
  const centerY = planHeight / 2;

  // Count devices by system
  const counts: Record<SystemType, number> = {
    cctv: 0,
    access: 0,
    intrusion: 0,
    fire: 0,
    network: 0,
    audio: 0,
    infrastructure: 0,
  };

  devices.forEach(d => {
    if (counts[d.systemType] !== undefined) counts[d.systemType]++;
  });

  const cctvCameras = devices.filter(d => d.systemType === 'cctv');
  const accessDevices = devices.filter(d => d.systemType === 'access');
  const fireDevices = devices.filter(d => d.systemType === 'fire');
  const intrusionDevices = devices.filter(d => d.systemType === 'intrusion');
  const readers = accessDevices.filter(d => d.deviceType.includes('reader') || d.deviceType.includes('ad3'));
  const controllers = accessDevices.filter(d => d.deviceType.includes('panel') || d.deviceType.includes('controller') || d.deviceType.includes('ac4') || d.deviceType.includes('ac6'));
  const smokeDetectors = fireDevices.filter(d => d.deviceType.includes('smoke'));
  const pullStations = fireDevices.filter(d => d.deviceType.includes('pull'));
  const motionSensors = intrusionDevices.filter(d => d.deviceType.includes('pir') || d.deviceType.includes('motion') || d.deviceType.includes('br31'));

  let cctvScore = 100;
  let accessScore = 100;
  let intrusionScore = 100;
  let fireScore = 100;

  // -------------------------------------------------------------
  // 1. VIDEO SURVEILLANCE SPATIAL & DORI ANALYSIS
  // -------------------------------------------------------------
  if (cctvCameras.length === 0) {
    cctvScore = 15;
    const entryDome = ecosystem === 'verkada' 
      ? getDevice('cd52', 'verkada') 
      : getDevice('dome', 'multivendor');

    findings.push({
      id: 'cctv-none',
      category: 'cctv',
      severity: 'critical',
      title: 'Zero Video Surveillance Deployed',
      locationName: 'Main Entrance & Lobby',
      description: 'The floor plan contains no security cameras. Ingress points, main corridors, and high-value rooms have zero visibility.',
      standardReference: 'ASIS Physical Security Design Guideline',
      recommendedDevice: {
        template: entryDome,
        targetX: Math.round(planWidth * 0.18),
        targetY: Math.round(planHeight * 0.48),
        rotation: 0,
        reason: `Install ${entryDome.label} covering main ingress doorway to establish 250 px/m DORI Identification standard.`,
      },
    });
  } else {
    // Check Main Entrance Ingress Portal Coverage (West/Entry area)
    const entranceZone = { x: planWidth * 0.20, y: planHeight * 0.48 };
    const hasEntranceCam = cctvCameras.some(c => getDistance(c, entranceZone) < feetToPixels(45, scale));

    if (!hasEntranceCam) {
      cctvScore -= 25;
      const idCamera = ecosystem === 'verkada' ? getDevice('cd62', 'verkada') : getDevice('dome', 'multivendor');
      findings.push({
        id: 'cctv-entrance-gap',
        category: 'cctv',
        severity: 'critical',
        title: 'Main Lobby Ingress Lacks Positive Identification Camera',
        locationName: 'Main Entrance Lobby',
        description: 'EN 62676-4 DORI standard mandates a dedicated 250 px/m resolution camera facing visitors entering through primary access portals.',
        standardReference: 'EN 62676-4 Video Surveillance Standard',
        recommendedDevice: {
          template: idCamera,
          targetX: Math.round(entranceZone.x),
          targetY: Math.round(entranceZone.y),
          rotation: 0,
          reason: `Deploy ${idCamera.label} aimed at entrance vestibule doors for crisp facial identification.`,
        },
      });
    }

    // Check Central Transit Corridors
    const corridorCenter = { x: centerX, y: centerY };
    const hasCorridorCam = cctvCameras.some(c => getDistance(c, corridorCenter) < feetToPixels(50, scale));

    if (!hasCorridorCam) {
      cctvScore -= 20;
      const bulletCam = ecosystem === 'verkada' ? getDevice('cb52', 'verkada') : getDevice('bullet', 'multivendor');
      findings.push({
        id: 'cctv-corridor-gap',
        category: 'cctv',
        severity: 'warning',
        title: 'Central Hallway Corridor Blind Spot',
        locationName: 'Main East-West Corridor',
        description: 'Long corridor passage connects multiple suites but lacks directional surveillance along its travel path.',
        standardReference: 'ASIS Commercial Facility Protection',
        recommendedDevice: {
          template: bulletCam,
          targetX: Math.round(centerX - 100),
          targetY: Math.round(centerY),
          rotation: 0,
          reason: `Deploy ${bulletCam.label} with optical zoom down the center passage.`,
        },
      });
    }

    // Check Open Workspace Quadrant (North-East zone)
    const northEastZone = { x: planWidth * 0.75, y: planHeight * 0.25 };
    const hasNEZoneCam = cctvCameras.some(c => getDistance(c, northEastZone) < feetToPixels(55, scale));

    if (!hasNEZoneCam) {
      cctvScore -= 15;
      const fisheyeCam = ecosystem === 'verkada' ? getDevice('cf83', 'verkada') : getDevice('dome', 'multivendor');
      findings.push({
        id: 'cctv-open-workspace',
        category: 'cctv',
        severity: 'warning',
        title: 'Open Office Workspace Surveillance Gap',
        locationName: 'North-East Open Office Bullpen',
        description: 'Large open workspace area with high desk density has no overview camera for asset protection and safety monitoring.',
        standardReference: 'Loss Prevention Standard Guidelines',
        recommendedDevice: {
          template: fisheyeCam,
          targetX: Math.round(northEastZone.x),
          targetY: Math.round(northEastZone.y),
          rotation: 0,
          reason: `Mount ${fisheyeCam.label} in ceiling center for 360° situational coverage of all desk pods.`,
        },
      });
    }
  }

  // -------------------------------------------------------------
  // 2. ACCESS CONTROL & SERVER ROOM COMPLIANCE
  // -------------------------------------------------------------
  if (readers.length === 0) {
    accessScore = 20;
    const portalReader = ecosystem === 'verkada' ? getDevice('ad32', 'verkada') : getDevice('reader', 'multivendor');
    findings.push({
      id: 'access-none',
      category: 'access',
      severity: 'critical',
      title: 'No Electronic Access Control Installed',
      locationName: 'Interior Lobby Door / Portal',
      description: 'Doors rely entirely on physical mechanical keys, preventing badge audit logs, scheduled unlocking, and instant lost-card deactivation.',
      standardReference: 'ISO/IEC 27001 Physical Access Control (A.11.1)',
      recommendedDevice: {
        template: portalReader,
        targetX: Math.round(planWidth * 0.17),
        targetY: Math.round(planHeight * 0.51),
        rotation: 180,
        reason: `Install ${portalReader.label} for touchless mobile NFC and RFID card badge access.`,
      },
    });
  } else {
    // Check MDF Server Room 2-Factor Authentication (North-West high-risk zone)
    const mdfZone = { x: planWidth * 0.24, y: planHeight * 0.19 };
    const hasMdfReader = readers.some(r => getDistance(r, mdfZone) < feetToPixels(25, scale));

    if (!hasMdfReader) {
      accessScore -= 30;
      const keypadReader = ecosystem === 'verkada' ? getDevice('ad33', 'verkada') : getDevice('keypad', 'multivendor');
      findings.push({
        id: 'access-mdf-gap',
        category: 'access',
        severity: 'critical',
        title: 'MDF / Server Room Lacks 2-Factor Badge+PIN Access',
        locationName: 'MDF Server Room Entry',
        description: 'PCI-DSS Req. 9.1 and SOC 2 Type II compliance mandate two-factor authentication (PIN + Smart Card or Biometric) on all server rooms and IT telecom closets.',
        standardReference: 'PCI-DSS v4.0 Req 9.1 & SOC 2 Security',
        recommendedDevice: {
          template: keypadReader,
          targetX: Math.round(mdfZone.x),
          targetY: Math.round(mdfZone.y),
          rotation: 180,
          reason: `Deploy ${keypadReader.label} on Server Room door for dual-credential badge + PIN enforcement.`,
        },
      });
    }

    // Check Cloud Controller Hardware Capacity
    const requiredPorts = readers.length;
    let availablePorts = 0;
    controllers.forEach(c => {
      if (c.deviceType.includes('ac6')) availablePorts += 16;
      else if (c.deviceType.includes('ac4')) availablePorts += 4;
      else availablePorts += 2;
    });

    if (requiredPorts > availablePorts) {
      accessScore -= 20;
      const ctrl = ecosystem === 'verkada' ? getDevice('ac42', 'verkada') : getDevice('panel', 'multivendor');
      findings.push({
        id: 'access-controller-capacity',
        category: 'access',
        severity: 'critical',
        title: 'Insufficient Access Controller Panel Capacity',
        locationName: 'MDF Telecom Closet',
        description: `Project contains ${requiredPorts} door reader(s), but only ${availablePorts} controller port(s) are provisioned. A dedicated controller panel is required.`,
        standardReference: 'Access Control Architecture Design Guidelines',
        recommendedDevice: {
          template: ctrl,
          targetX: Math.round(planWidth * 0.12),
          targetY: Math.round(planHeight * 0.15),
          rotation: 0,
          reason: `Add ${ctrl.label} in the MDF rack to drive electric door locks, REX sensors, and card readers.`,
        },
      });
    }
  }

  // -------------------------------------------------------------
  // 3. FIRE & LIFE SAFETY (NFPA 72 & IBC COMPLIANCE)
  // -------------------------------------------------------------
  if (smokeDetectors.length === 0) {
    fireScore = 20;
    const smoke = getDevice('smoke', 'multivendor');
    findings.push({
      id: 'fire-smoke-none',
      category: 'fire',
      severity: 'critical',
      title: 'Zero Photoelectric Smoke Detectors Configured',
      locationName: 'Central Ceiling & Corridors',
      description: 'NFPA 72 National Fire Alarm Code requires addressable photoelectric smoke detection throughout commercial office corridors, server rooms, and return air pathways.',
      standardReference: 'NFPA 72 Sec. 17.7.3 & IBC Sec. 907',
      recommendedDevice: {
        template: smoke,
        targetX: Math.round(centerX),
        targetY: Math.round(centerY - 80),
        rotation: 0,
        reason: `Install ${smoke.label} with 21ft coverage radius to satisfy NFPA 72 30-foot spacing criteria.`,
      },
    });
  } else {
    // Check MDF Server Room Smoke Detection
    const mdfCenter = { x: planWidth * 0.14, y: planHeight * 0.18 };
    const hasMdfSmoke = smokeDetectors.some(s => getDistance(s, mdfCenter) < feetToPixels(25, scale));

    if (!hasMdfSmoke) {
      fireScore -= 25;
      const smoke = getDevice('smoke', 'multivendor');
      findings.push({
        id: 'fire-mdf-smoke',
        category: 'fire',
        severity: 'critical',
        title: 'MDF Server Room Missing Dedicated Smoke Detector',
        locationName: 'MDF Server Room Ceiling',
        description: 'Server rooms house high-density electrical power distributions and require dedicated early-warning photoelectric smoke detection.',
        standardReference: 'NFPA 75 Protection of Information Technology Equipment',
        recommendedDevice: {
          template: smoke,
          targetX: Math.round(mdfCenter.x),
          targetY: Math.round(mdfCenter.y),
          rotation: 0,
          reason: `Deploy ${smoke.label} directly above server equipment racks.`,
        },
      });
    }

    // Check East Perimeter Emergency Exit Manual Pull Station
    const emergencyExitZone = { x: planWidth * 0.95, y: planHeight * 0.50 };
    const hasPullStation = pullStations.some(p => getDistance(p, emergencyExitZone) < feetToPixels(30, scale));

    if (!hasPullStation) {
      fireScore -= 20;
      const pull = getDevice('pull', 'multivendor');
      findings.push({
        id: 'fire-pull-exit',
        category: 'fire',
        severity: 'warning',
        title: 'Emergency Exit Door Lacks Manual Fire Alarm Pull Station',
        locationName: 'East Perimeter Emergency Exit',
        description: 'IBC Section 907.4.2 mandates manual fire alarm pull boxes within 5 feet of every required exit doorway on each level.',
        standardReference: 'IBC Sec. 907.4.2 & NFPA 101 Life Safety Code',
        recommendedDevice: {
          template: pull,
          targetX: Math.round(emergencyExitZone.x - 30),
          targetY: Math.round(emergencyExitZone.y),
          rotation: 180,
          reason: `Place ${pull.label} at 48 inches AFF adjacent to emergency exit egress door.`,
        },
      });
    }
  }

  // -------------------------------------------------------------
  // 4. INTRUSION DETECTION & ENVIRONMENTAL VAPE SENSING
  // -------------------------------------------------------------
  const openWorkspace = { x: planWidth * 0.70, y: planHeight * 0.20 };
  const hasMotionInBullpen = motionSensors.some(m => getDistance(m, openWorkspace) < feetToPixels(45, scale));

  if (!hasMotionInBullpen) {
    intrusionScore -= 25;
    const pirDevice = ecosystem === 'verkada' ? getDevice('br31', 'verkada') : getDevice('pir', 'multivendor');
    findings.push({
      id: 'intrusion-workspace-pir',
      category: 'intrusion',
      severity: 'warning',
      title: 'After-Hours Motion Intrusion Gap in Open Bullpen',
      locationName: 'Open Office Bullpen Area',
      description: 'Open cubicle workspaces and perimeter window walls require wide-angle PIR motion detection connected to central 24/7 monitoring.',
      standardReference: 'UL 639 Intrusion Detection Standard',
      recommendedDevice: {
        template: pirDevice,
        targetX: Math.round(openWorkspace.x - 100),
        targetY: Math.round(openWorkspace.y - 60),
        rotation: 135,
        reason: `Mount ${pirDevice.label} in corner with 90° spread to monitor after-hours movement.`,
      },
    });
  }

  // Check Breakroom / Restroom Environmental & Vape Sensor
  const breakroomZone = { x: planWidth * 0.82, y: planHeight * 0.77 };
  const envSensors = intrusionDevices.filter(d => d.deviceType.includes('sv2') || d.deviceType.includes('sensor'));
  const hasEnvSensor = envSensors.some(s => getDistance(s, breakroomZone) < feetToPixels(40, scale));

  if (!hasEnvSensor && ecosystem === 'verkada') {
    const sv23 = getDevice('sv23', 'verkada');
    findings.push({
      id: 'env-breakroom-sensor',
      category: 'intrusion',
      severity: 'info',
      title: 'Environmental Vape, Smoke & Air Quality Sensor Recommended',
      locationName: 'Cafeteria & Breakroom Area',
      description: 'Deploying multi-sensor environmental nodes provides vape/THC detection, air quality (TVOC/PM2.5), and noise anomaly detection where cameras cannot be placed.',
      standardReference: 'ASHRAE 62.1 Indoor Air Quality & Facility Policy',
      recommendedDevice: {
        template: sv23,
        targetX: Math.round(breakroomZone.x),
        targetY: Math.round(breakroomZone.y),
        rotation: 0,
        reason: `Install ${sv23.label} in breakroom ceiling for discreet environmental health and safety insights.`,
      },
    });
  }

  // Calculate Overall Normalized Score
  cctvScore = Math.max(15, Math.min(100, cctvScore));
  accessScore = Math.max(15, Math.min(100, accessScore));
  intrusionScore = Math.max(15, Math.min(100, intrusionScore));
  fireScore = Math.max(15, Math.min(100, fireScore));

  const overallScore = Math.round((cctvScore * 0.35) + (accessScore * 0.30) + (fireScore * 0.20) + (intrusionScore * 0.15));

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  let riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Severe';

  if (overallScore >= 92) {
    grade = 'A+';
    riskLevel = 'Low';
  } else if (overallScore >= 85) {
    grade = 'A';
    riskLevel = 'Low';
  } else if (overallScore >= 75) {
    grade = 'B';
    riskLevel = 'Moderate';
  } else if (overallScore >= 60) {
    grade = 'C';
    riskLevel = 'Moderate';
  } else if (overallScore >= 45) {
    grade = 'D';
    riskLevel = 'High';
  } else {
    grade = 'F';
    riskLevel = 'Severe';
  }

  const criticalCount = findings.filter(f => f.severity === 'critical').length;
  const warningCount = findings.filter(f => f.severity === 'warning').length;

  const summary = `Site survey analysis identified ${criticalCount} critical compliance gap${criticalCount === 1 ? '' : 's'} and ${warningCount} advisory item${warningCount === 1 ? '' : 's'} across physical security, access control, and life safety disciplines.`;

  return {
    overallScore,
    grade,
    riskLevel,
    categoryScores: {
      cctv: cctvScore,
      access: accessScore,
      intrusion: intrusionScore,
      fire: fireScore,
    },
    summary,
    findings,
    deviceCounts: counts,
  };
}
