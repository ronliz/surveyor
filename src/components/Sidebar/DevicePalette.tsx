import React, { useState } from 'react';
import { 
  Camera, 
  Video, 
  Compass, 
  CircleDot, 
  Layers, 
  CreditCard, 
  KeyRound, 
  Lock, 
  Zap, 
  Eye, 
  Activity, 
  ShieldAlert, 
  BellRing, 
  Flame, 
  Hand, 
  Volume2, 
  Shield, 
  Wifi, 
  Network, 
  Server, 
  Speaker, 
  PhoneCall, 
  Wind,
  Radio,
  Tv,
  Monitor,
  Search,
  Sparkles,
  Plus
} from 'lucide-react';
import { DEVICE_CATALOG, DeviceTemplate } from '../../constants/deviceCatalog';
import { SystemType } from '../../types/survey';
import { useSurveyStore } from '../../store/useSurveyStore';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Camera,
  Video,
  Compass,
  CircleDot,
  Layers,
  CreditCard,
  KeyRound,
  Lock,
  Zap,
  Eye,
  Activity,
  ShieldAlert,
  BellRing,
  Flame,
  Hand,
  Volume2,
  Shield,
  Wifi,
  Network,
  Server,
  Speaker,
  PhoneCall,
  Wind,
  Radio,
  Tv,
  Monitor,
};

export const DevicePalette: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<SystemType | 'all'>('all');
  const [selectedBrand, setSelectedBrand] = useState<'all' | 'verkada'>('all');
  const { setDraggedTemplate, addDevice } = useSurveyStore();

  const systems: { id: SystemType | 'all'; label: string; color: string }[] = [
    { id: 'all', label: 'All Disciplines', color: '#64748b' },
    { id: 'cctv', label: 'Video (CCTV)', color: '#3b82f6' },
    { id: 'access', label: 'Access Control', color: '#10b981' },
    { id: 'intrusion', label: 'Intrusion & Vape', color: '#f59e0b' },
    { id: 'fire', label: 'Fire & Safety', color: '#ef4444' },
    { id: 'network', label: 'Network & IT', color: '#8b5cf6' },
    { id: 'audio', label: 'Audio / Intercom', color: '#ec4899' },
    { id: 'infrastructure', label: 'Racks / Viewing', color: '#475569' },
  ];

  const filteredDevices = DEVICE_CATALOG.filter((dev) => {
    const isVerkada = dev.defaultManufacturer.toLowerCase() === 'verkada';
    const matchesBrand = selectedBrand === 'all' || (selectedBrand === 'verkada' && isVerkada);
    const matchesSystem = selectedSystem === 'all' || dev.systemType === selectedSystem;
    const matchesSearch = dev.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dev.defaultManufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dev.defaultModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dev.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesSystem && matchesSearch;
  });

  const handleDragStart = (e: React.DragEvent, template: DeviceTemplate) => {
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
    setDraggedTemplate(template);
  };

  const handleQuickAdd = (template: DeviceTemplate) => {
    addDevice({
      systemType: template.systemType,
      deviceType: template.deviceType,
      name: `${template.label.replace(/^Verkada\s+/i, '').split(' ')[0]}-${Math.floor(100 + Math.random() * 900)}`,
      x: 600 + (Math.random() * 100 - 50),
      y: 400 + (Math.random() * 100 - 50),
      rotation: 0,
      manufacturer: template.defaultManufacturer,
      model: template.defaultModel,
      mountingType: template.mountingType,
      mountingHeightFt: template.mountingHeightFt,
      status: 'new',
      estimatedCost: template.defaultCost,
      hasFov: template.hasFov,
      fovAngle: template.fovAngle,
      fovDistanceFt: template.fovDistanceFt,
      showDori: template.hasFov ? true : false,
      hasRadius: template.hasRadius,
      coverageRadiusFt: template.coverageRadiusFt,
      color: template.color,
    });
  };

  const verkadaCount = DEVICE_CATALOG.filter(d => d.defaultManufacturer === 'Verkada').length;

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 w-80 select-none">
      {/* Search & Brand Filter Header */}
      <div className="p-3 border-b border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Device Catalog
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {filteredDevices.length} items
          </span>
        </div>

        {/* Brand Switcher: All vs Verkada Suite */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setSelectedBrand('all')}
            className={`text-xs py-1 px-2 rounded-md font-medium transition ${
              selectedBrand === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Brands
          </button>
          <button
            onClick={() => setSelectedBrand('verkada')}
            className={`text-xs py-1 px-2 rounded-md font-medium transition flex items-center justify-center space-x-1 ${
              selectedBrand === 'verkada'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-sky-400 hover:text-sky-300 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Verkada ({verkadaCount})</span>
          </button>
        </div>
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search CD52, AD32, SV23, dome..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
          />
        </div>

        {/* System Category Filter Pills */}
        <div className="flex flex-wrap gap-1 pt-0.5">
          {systems.map((sys) => {
            const isActive = selectedSystem === sys.id;
            return (
              <button
                key={sys.id}
                onClick={() => setSelectedSystem(sys.id)}
                className={`text-[11px] px-2 py-0.5 rounded-full border transition flex items-center space-x-1 ${
                  isActive
                    ? 'bg-slate-800 text-white border-sky-500 shadow-sm font-semibold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                {sys.id !== 'all' && (
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: sys.color }}
                  />
                )}
                <span>{sys.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Device List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <div className="text-[11px] text-slate-500 px-1 font-medium flex items-center justify-between">
          <span>Drag onto floor plan or click +</span>
          {selectedBrand === 'verkada' && (
            <span className="text-[10px] text-sky-400 font-semibold">Verkada Cloud Ecosystem</span>
          )}
        </div>

        {filteredDevices.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 space-y-2">
            <div>No devices found matching your filters.</div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSystem('all');
                setSelectedBrand('all');
              }}
              className="text-sky-400 hover:underline text-xs"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredDevices.map((template) => {
            const IconComponent = ICON_MAP[template.icon] || Camera;
            const isVerkada = template.defaultManufacturer === 'Verkada';

            return (
              <div
                key={template.deviceType}
                draggable
                onDragStart={(e) => handleDragStart(e, template)}
                className={`group relative rounded-lg p-2.5 cursor-grab active:cursor-grabbing transition shadow-sm hover:shadow-md border ${
                  isVerkada 
                    ? 'bg-slate-950/95 border-sky-900/40 hover:border-sky-600/60' 
                    : 'bg-slate-950 hover:bg-slate-850 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className="p-2 rounded-md flex items-center justify-center text-white"
                      style={{ backgroundColor: `${template.color}25`, color: template.color }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 transition flex items-center space-x-1.5">
                        <span>{template.label}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1.5">
                        <span>{template.defaultManufacturer}</span>
                        {isVerkada && (
                          <span className="bg-sky-950 text-sky-400 text-[9px] px-1 py-0.2 rounded border border-sky-800/50 font-bold">
                            CLOUD
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Add button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickAdd(template);
                    }}
                    className="p-1 rounded bg-slate-800 hover:bg-sky-600 text-slate-400 hover:text-white transition"
                    title="Add to Canvas"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {template.description}
                </div>

                {/* Device metadata badges */}
                <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-slate-400">
                  <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-emerald-400 font-mono">
                    ${template.defaultCost.toLocaleString()}
                  </span>
                  <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                    {template.mountingType} @ {template.mountingHeightFt}ft
                  </span>
                  {template.hasFov && (
                    <span className="bg-sky-950/60 text-sky-400 border border-sky-800/40 px-1.5 py-0.5 rounded">
                      FoV: {template.fovAngle}° / {template.fovDistanceFt}ft
                    </span>
                  )}
                  {template.hasRadius && (
                    <span className="bg-purple-950/60 text-purple-400 border border-purple-800/40 px-1.5 py-0.5 rounded">
                      Coverage: {template.coverageRadiusFt}ft
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
