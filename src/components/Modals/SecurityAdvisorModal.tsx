import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Plus, 
  Camera, 
  CreditCard, 
  Flame, 
  Activity, 
  ArrowRight,
  Zap,
  BookOpen,
  DoorOpen,
  Server,
  Layers,
  Wind,
  Shield,
  Eye,
  Sliders
} from 'lucide-react';
import { useSurveyStore } from '../../store/useSurveyStore';
import { analyzeFloorplanSecurity, PreferredEcosystem } from '../../utils/securityAdvisor';
import { DEVICE_CATALOG, DeviceTemplate } from '../../constants/deviceCatalog';

interface ZoneRequirementPackage {
  id: string;
  name: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  complianceTitle: string;
  standards: string[];
  description: string;
  recommendedDevices: {
    role: string;
    templateType: string;
    reason: string;
  }[];
}

const ZONE_PACKAGES: ZoneRequirementPackage[] = [
  {
    id: 'entrance',
    name: 'Main Entrance & Lobby Vestibule',
    icon: DoorOpen,
    color: '#0284c7',
    complianceTitle: 'Ingress Identification & Access Security',
    standards: ['EN 62676-4 DORI (250 px/m Facial Identification)', 'ISO 27001 Physical Entry Controls', 'ADA / Egress Compliance'],
    description: 'High-traffic primary portal requiring positive facial identification, touchless mobile/badge credentialing, and visitor video intercom routing.',
    recommendedDevices: [
      { role: 'Ingress Identification Camera', templateType: 'verkada_cd62', reason: '4K resolution facing entry portal to achieve 250 px/m identification standard.' },
      { role: 'Touchless Multi-Credential Reader', templateType: 'verkada_ad32', reason: 'NFC, BLE, Apple Wallet & RFID badge reader on door frame.' },
      { role: 'Video Intercom Station', templateType: 'verkada_td52', reason: '5MP smart video intercom with sub-second guest call routing.' },
      { role: 'Request to Exit (REX) Sensor', templateType: 'access_rex', reason: 'PIR egress detector to release magnetic locks upon approach.' },
    ]
  },
  {
    id: 'server_room',
    name: 'MDF Server Room / Data Center',
    icon: Server,
    color: '#ef4444',
    complianceTitle: 'High-Security Critical Infrastructure (2-Factor Auth)',
    standards: ['PCI-DSS v4.0 Req 9.1', 'SOC 2 Type II Physical Security', 'NFPA 75 Protection of IT Equipment'],
    description: 'Critical IT infrastructure housing network switches, servers, and sensitive data. Mandates dual-credential badge + PIN authentication and early smoke detection.',
    recommendedDevices: [
      { role: '2-Factor PIN + Badge Reader', templateType: 'verkada_ad33', reason: 'Requires PIN + Badge entry to satisfy PCI-DSS & SOC 2 audit controls.' },
      { role: '1200lb Electromagnetic Lock', templateType: 'access_maglock', reason: 'Fail-safe high holding force magnetic lock on server door.' },
      { role: 'Server Room Vandal Dome', templateType: 'verkada_cd52', reason: '5MP wide-angle camera with onboard storage monitoring server racks.' },
      { role: 'Photoelectric Smoke Detector', templateType: 'fire_smoke', reason: 'NFPA 75 early-warning smoke detection directly above rack enclosures.' },
      { role: 'Cloud Door Controller', templateType: 'verkada_ac42', reason: 'Centralized 4-door PoE access controller in rack enclosure.' },
    ]
  },
  {
    id: 'corridor',
    name: 'Hallways & Primary Corridors',
    icon: Layers,
    color: '#8b5cf6',
    complianceTitle: 'Directional Travel Path & Life Safety Spacing',
    standards: ['ASIS Commercial Facility Guidelines', 'NFPA 72 30-Foot Smoke Spacing', 'NFPA 101 Egress'],
    description: 'Long circulation corridors connecting office suites. Requires directional telephoto surveillance down travel paths and smoke detectors every 30 feet.',
    recommendedDevices: [
      { role: 'Corridor Optical Bullet Camera', templateType: 'verkada_cb52', reason: '3x motorized optical zoom down the corridor with 50m IR reach.' },
      { role: 'Addressable Smoke Detector', templateType: 'fire_smoke', reason: 'Place every 30 feet along corridor ceiling per NFPA 72.' },
      { role: 'Horn Strobe Notification', templateType: 'fire_horn', reason: 'Synchronized visual flash strobe and audible alarm notification.' },
    ]
  },
  {
    id: 'perimeter_exit',
    name: 'Emergency Exit & Perimeter Doors',
    icon: AlertTriangle,
    color: '#ea580c',
    complianceTitle: 'Perimeter Intrusion & Emergency Egress',
    standards: ['IBC Sec. 907.4.2 Fire Pull Stations', 'UL 639 Perimeter Intrusion', 'Life Safety Egress Codes'],
    description: 'Emergency egress doors leading to stairwells or exterior. Must feature door intrusion sensors, audible alarms on unauthorized propping, and fire pull boxes.',
    recommendedDevices: [
      { role: 'Manual Fire Alarm Pull Station', templateType: 'fire_pull', reason: 'Must be within 5 feet of exit doorway per IBC Section 907.4.2.' },
      { role: 'Wireless Magnetic Door Contact', templateType: 'verkada_br33', reason: 'Detects unauthorized door opening or propped door events.' },
      { role: 'High-dB Siren & Strobe', templateType: 'verkada_bx21', reason: '105dB acoustic alert triggered on forced entry.' },
      { role: 'Exit Overview Bullet Camera', templateType: 'verkada_cb62', reason: '4K camera with vehicle & license plate recognition.' },
    ]
  },
  {
    id: 'open_office',
    name: 'Open Workspace & Bullpen',
    icon: Activity,
    color: '#f59e0b',
    complianceTitle: 'Situational Awareness & After-Hours Intrusion',
    standards: ['UL 639 Intrusion Standards', 'Loss Prevention Guidelines', 'Wi-Fi 6 Density Standards'],
    description: 'Wide open area with high employee desk density and laptop computers. Requires 360-degree situational video, after-hours PIR intrusion, and enterprise Wi-Fi.',
    recommendedDevices: [
      { role: '360° Panoramic Fisheye Camera', templateType: 'verkada_cf83', reason: '12MP 360-degree overview covering all desk pods with zero blind spots.' },
      { role: 'Wireless PIR Motion Sensor', templateType: 'verkada_br31', reason: 'Corner-mounted 90° motion detector armed during after-hours.' },
      { role: 'Wi-Fi 6 Access Point', templateType: 'net_ap', reason: 'High-capacity dual-band Wi-Fi 6 access point for mobile devices.' },
      { role: 'Wireless Panic Button', templateType: 'verkada_bh61', reason: 'Under-desk panic button for reception or manager desks.' },
    ]
  },
  {
    id: 'breakroom',
    name: 'Cafeteria, Breakroom & Restrooms',
    icon: Wind,
    color: '#14b8a6',
    complianceTitle: 'Environmental Health & Vape Detection (Privacy Areas)',
    standards: ['ASHRAE 62.1 Indoor Air Quality', 'Facility Anti-Vaping Policy', 'WELL Building Standard'],
    description: 'Spaces where video cameras cannot be installed due to privacy. Environmental sensor nodes provide vape/THC detection, air quality, noise anomalies, and motion.',
    recommendedDevices: [
      { role: 'Vape & Air Quality Sensor', templateType: 'verkada_sv23', reason: 'Discreet ceiling node detecting vape, THC, smoke, TVOCs, and noise index.' },
      { role: 'IP Background Audio Speaker', templateType: 'av_speaker', reason: 'PoE ceiling speaker for scheduled bells, music, and voice paging.' },
    ]
  }
];

export const SecurityAdvisorModal: React.FC = () => {
  const { project, setActiveModal, setPendingPlacement } = useSurveyStore();
  const [activeTab, setActiveTab] = useState<'zones' | 'audit'>('zones');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('entrance');
  const [ecosystem, setEcosystem] = useState<PreferredEcosystem>('verkada');

  const audit = analyzeFloorplanSecurity(project, ecosystem);
  const selectedZone = ZONE_PACKAGES.find(z => z.id === selectedZoneId) || ZONE_PACKAGES[0];

  const handlePlaceDevice = (templateType: string) => {
    // Find device in catalog matching templateType or brand preference
    let dev = DEVICE_CATALOG.find(d => d.deviceType === templateType);
    if (!dev && ecosystem === 'multivendor') {
      dev = DEVICE_CATALOG.find(d => !d.deviceType.startsWith('verkada_') && templateType.includes(d.deviceType));
    }
    if (!dev) dev = DEVICE_CATALOG[0];

    // Activate interactive placement cursor mode
    setPendingPlacement(dev);
  };

  const handlePlaceEntirePackage = () => {
    selectedZone.recommendedDevices.forEach((item, index) => {
      let dev = DEVICE_CATALOG.find(d => d.deviceType === item.templateType);
      if (!dev) dev = DEVICE_CATALOG[0];

      addDevice({
        systemType: dev.systemType,
        deviceType: dev.deviceType,
        name: `${dev.label.replace(/^Verkada\s+/i, '').split(' ')[0]}-${Math.floor(100 + Math.random() * 900)}`,
        x: ((project.backgroundImageWidth || 1600) / 2) - 80 + (index * 45),
        y: ((project.backgroundImageHeight || 1000) / 2) + (index * 25),
        rotation: 0,
        manufacturer: dev.defaultManufacturer,
        model: dev.defaultModel,
        mountingType: dev.mountingType,
        mountingHeightFt: dev.mountingHeightFt,
        status: 'new',
        estimatedCost: dev.defaultCost,
        hasFov: dev.hasFov,
        fovAngle: dev.fovAngle,
        fovDistanceFt: dev.fovDistanceFt,
        showDori: dev.hasFov ? true : false,
        hasRadius: dev.hasRadius,
        coverageRadiusFt: dev.coverageRadiusFt,
        color: dev.color,
        notes: `AI Package: ${selectedZone.name} - ${item.role}`,
      });
    });

    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-sky-600 text-white rounded-xl shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-100">AI Physical Security Advisor & Specification Engine</h2>
                <span className="bg-indigo-950 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-700/50">
                  SITE SURVEY ADVISOR
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Select your room or zone type below to see exact physical security requirements and deploy compliant device packages
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Ecosystem Toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setEcosystem('verkada')}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  ecosystem === 'verkada'
                    ? 'bg-sky-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Verkada Cloud
              </button>
              <button
                onClick={() => setEcosystem('multivendor')}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  ecosystem === 'multivendor'
                    ? 'bg-slate-800 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Multi-Vendor
              </button>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4">
          <button
            onClick={() => setActiveTab('zones')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'zones'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Zone-by-Zone Security Specifier (Recommended)</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'audit'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Current Floorplan Compliance Score ({audit.overallScore}%)</span>
          </button>
        </div>

        {/* Content Body */}
        {activeTab === 'zones' ? (
          <div className="flex flex-1 overflow-hidden">
            {/* Left Zone Selector List */}
            <div className="w-80 bg-slate-950/60 border-r border-slate-800 p-3 overflow-y-auto space-y-2 select-none">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Select Space / Room Type:
              </div>

              {ZONE_PACKAGES.map((zone) => {
                const Icon = zone.icon;
                const isSelected = selectedZoneId === zone.id;

                return (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZoneId(zone.id)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-slate-900 border-sky-500 ring-1 ring-sky-500/40 shadow-lg'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div
                      className="p-2 rounded-lg text-white mt-0.5 shrink-0"
                      style={{ backgroundColor: `${zone.color}25`, color: zone.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className={`text-xs font-bold ${isSelected ? 'text-sky-300' : 'text-slate-200'}`}>
                        {zone.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {zone.recommendedDevices.length} required devices
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Zone Specification & Requirement Details */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Zone Title Banner */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-100">{selectedZone.name}</span>
                    <span className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-700">
                      {selectedZone.complianceTitle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    {selectedZone.description}
                  </p>
                </div>

                <button
                  onClick={handlePlaceEntirePackage}
                  className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg transition shrink-0 ml-4"
                >
                  <Zap className="w-4 h-4" />
                  <span>Deploy Full Package ({selectedZone.recommendedDevices.length} Devices)</span>
                </button>
              </div>

              {/* Standards Badges */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>Applicable Compliance & Security Standards:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedZone.standards.map((std, i) => (
                    <span key={i} className="text-[11px] bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">
                      {std}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Hardware Breakdown */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Required Physical Security Hardware ({selectedZone.recommendedDevices.length} items):
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {selectedZone.recommendedDevices.map((item, idx) => {
                    let dev = DEVICE_CATALOG.find(d => d.deviceType === item.templateType);
                    if (!dev) dev = DEVICE_CATALOG[0];

                    return (
                      <div
                        key={idx}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between hover:border-slate-700 transition"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="p-2 rounded-lg text-white"
                            style={{ backgroundColor: `${dev.color}25`, color: dev.color }}
                          >
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-slate-100">{item.role}</span>
                              <span className="text-[10px] text-sky-400 font-mono font-semibold bg-sky-950 px-1.5 py-0.5 rounded border border-sky-800/40">
                                {dev.label}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {item.reason}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 shrink-0 ml-4">
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            ${dev.defaultCost.toLocaleString()}
                          </span>

                          <button
                            onClick={() => handlePlaceDevice(item.templateType)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow transition"
                            title="Click on the exact spot on your floor plan to drop this device"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Click to Place on Plan</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Tab 2: Site Inventory & Compliance Audit */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-center border-r border-slate-800 pr-3">
                <div className="text-2xl font-black text-sky-400">{audit.overallScore}%</div>
                <div className="text-xs font-bold text-slate-300">Overall Grade: {audit.grade}</div>
                <div className="text-[10px] text-slate-500">{audit.riskLevel} Risk Profile</div>
              </div>
              <div className="text-center border-r border-slate-800 pr-3">
                <div className="text-xl font-bold text-sky-400">{audit.categoryScores.cctv}%</div>
                <div className="text-xs text-slate-400">Video Surveillance</div>
                <div className="text-[10px] text-slate-500">{project.devices.filter(d => d.systemType === 'cctv').length} Cameras</div>
              </div>
              <div className="text-center border-r border-slate-800 pr-3">
                <div className="text-xl font-bold text-emerald-400">{audit.categoryScores.access}%</div>
                <div className="text-xs text-slate-400">Access Control</div>
                <div className="text-[10px] text-slate-500">{project.devices.filter(d => d.systemType === 'access').length} Door Units</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-rose-400">{audit.categoryScores.fire}%</div>
                <div className="text-xs text-slate-400">Life Safety (NFPA)</div>
                <div className="text-[10px] text-slate-500">{project.devices.filter(d => d.systemType === 'fire').length} Detectors</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Identified Site Survey Findings & Standards Check:
              </div>

              {audit.findings.map((f) => (
                <div key={f.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{f.title}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono">
                      {f.standardReference}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div>
            Tip: You can also drag and drop any hardware item directly from the left Device Catalog palette.
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition"
          >
            Close Advisor
          </button>
        </div>
      </div>
    </div>
  );
};
