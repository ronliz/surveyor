import React from 'react';
import { 
  Sliders, 
  Trash2, 
  Copy, 
  Shield, 
  Wifi, 
  Camera, 
  DollarSign, 
  Compass, 
  Layers, 
  Info,
  Maximize2,
  FileText,
  Lock,
  Unlock
} from 'lucide-react';
import { useSurveyStore } from '../../store/useSurveyStore';
import { SurveyDevice, InstallationStatus, CableRun } from '../../types/survey';
import { SYSTEM_NAMES } from '../../constants/deviceCatalog';

export const PropertyPanel: React.FC = () => {
  const {
    project,
    selectedDeviceId,
    selectedCableId,
    updateDevice,
    deleteDevice,
    duplicateDevice,
    updateCable,
    deleteCable,
    clearSelection,
  } = useSurveyStore();

  const selectedDevice = project.devices.find((d) => d.id === selectedDeviceId);
  const selectedCable = project.cables.find((c) => c.id === selectedCableId);

  if (!selectedDevice && !selectedCable) {
    return (
      <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 flex flex-col items-center justify-center text-center select-none text-slate-500 h-full">
        <Sliders className="w-10 h-10 mb-3 opacity-30 text-slate-400" />
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Property Inspector
        </div>
        <p className="text-[11px] leading-relaxed">
          Select any device, camera, or cable path on the floor plan to edit its specifications, FoV, and network details.
        </p>
      </div>
    );
  }

  // Cable Property Inspector
  if (selectedCable) {
    return (
      <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full select-none">
        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedCable.color }} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Cable Properties
            </span>
          </div>
          <button
            onClick={() => deleteCable(selectedCable.id)}
            className="p-1.5 rounded hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition"
            title="Delete Cable Run"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Cable Tag / ID</label>
            <input
              type="text"
              value={selectedCable.name}
              onChange={(e) => updateCable(selectedCable.id, { name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Cable Type</label>
            <select
              value={selectedCable.cableType}
              onChange={(e) => updateCable(selectedCable.id, { cableType: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:border-sky-500 focus:outline-none"
            >
              <option value="Cat6">Cat6 UTP (Plenum)</option>
              <option value="Cat6A">Cat6A 10G Shielded</option>
              <option value="Fiber Multi-Mode">Fiber Multi-Mode (OM3/OM4)</option>
              <option value="Fiber Single-Mode">Fiber Single-Mode (OS2)</option>
              <option value="18/2 Fire">18/2 FPLP Fire Wire</option>
              <option value="22/4 Security">22/4 CMP Alarm Wire</option>
              <option value="Composite Access">Composite Access Control Cable</option>
            </select>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 font-mono">
            <div className="text-[11px] text-slate-400 font-sans font-semibold">Calculated Run Length:</div>
            <div className="text-lg text-sky-400 font-bold">
              {Math.round(selectedCable.lengthFt)} {project.scale.unit}
              <span className="text-xs text-slate-500 font-normal ml-2">
                ({(selectedCable.lengthFt * 0.3048).toFixed(1)} m)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Notes / Switch Port</label>
            <textarea
              rows={3}
              value={selectedCable.notes || ''}
              onChange={(e) => updateCable(selectedCable.id, { notes: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:border-sky-500 focus:outline-none text-[11px]"
              placeholder="e.g. MDF Switch 01, Port 14"
            />
          </div>
        </div>
      </div>
    );
  }

  // Device Property Inspector
  const dev = selectedDevice!;

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full select-none">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: dev.color || '#3b82f6' }}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {SYSTEM_NAMES[dev.systemType] || 'Device Properties'}
          </span>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => duplicateDevice(dev.id)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Duplicate Device"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => deleteDevice(dev.id)}
            className="p-1.5 rounded hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition"
            title="Delete Device"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
        {/* Device Tag / Name */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Device Tag / ID
          </label>
          <input
            type="text"
            value={dev.name}
            onChange={(e) => updateDevice(dev.id, { name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-bold text-sm focus:border-sky-500 focus:outline-none"
          />
        </div>

        {/* Hardware Manufacturer & Model */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Manufacturer</label>
            <input
              type="text"
              value={dev.manufacturer}
              onChange={(e) => updateDevice(dev.id, { manufacturer: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-slate-200 focus:border-sky-500 focus:outline-none text-[11px]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Model / Part #</label>
            <input
              type="text"
              value={dev.model}
              onChange={(e) => updateDevice(dev.id, { model: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-slate-200 focus:border-sky-500 focus:outline-none text-[11px]"
            />
          </div>
        </div>

        {/* Mounting & Height */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Mounting Type</label>
            <select
              value={dev.mountingType}
              onChange={(e) => updateDevice(dev.id, { mountingType: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-slate-200 focus:border-sky-500 focus:outline-none text-[11px]"
            >
              <option value="Ceiling">Ceiling Mount</option>
              <option value="Wall">Wall Mount</option>
              <option value="Pole">Pole Mount</option>
              <option value="Corner">Corner Mount</option>
              <option value="Door Frame">Door Frame</option>
              <option value="Desk">Desk / Table</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Height (ft)</label>
            <input
              type="number"
              value={dev.mountingHeightFt}
              onChange={(e) => updateDevice(dev.id, { mountingHeightFt: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-slate-200 focus:border-sky-500 focus:outline-none text-[11px]"
            />
          </div>
        </div>

        {/* Installation Status & Estimated Cost */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Install Status</label>
            <select
              value={dev.status}
              onChange={(e) => updateDevice(dev.id, { status: e.target.value as InstallationStatus })}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-slate-200 focus:border-sky-500 focus:outline-none text-[11px]"
            >
              <option value="new">New Item</option>
              <option value="existing">Existing to Remain</option>
              <option value="relocate">Relocate</option>
              <option value="demolish">Demolish / Remove</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Est. Cost ($)</label>
            <input
              type="number"
              value={dev.estimatedCost}
              onChange={(e) => updateDevice(dev.id, { estimatedCost: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-slate-200 focus:border-sky-500 focus:outline-none text-[11px]"
            />
          </div>
        </div>

        {/* CCTV Camera Field of View (FoV) Controls */}
        {dev.hasFov && (
          <div className="p-3 bg-slate-950 rounded-lg border border-sky-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Field of View (FoV)</span>
              </span>
            </div>

            {/* Rotation slider */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Aim Angle / Rotation</span>
                <span className="font-mono text-sky-400 font-bold">{dev.rotation}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={dev.rotation}
                onChange={(e) => updateDevice(dev.id, { rotation: parseInt(e.target.value) })}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            {/* FoV Cone Angle Spread */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Lens Angle Spread</span>
                <span className="font-mono text-sky-400 font-bold">{dev.fovAngle || 90}°</span>
              </div>
              <input
                type="range"
                min="20"
                max="180"
                value={dev.fovAngle || 90}
                onChange={(e) => updateDevice(dev.id, { fovAngle: parseInt(e.target.value) })}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            {/* View Distance Reach */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Coverage Distance</span>
                <span className="font-mono text-sky-400 font-bold">{dev.fovDistanceFt || 45} ft</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                value={dev.fovDistanceFt || 45}
                onChange={(e) => updateDevice(dev.id, { fovDistanceFt: parseInt(e.target.value) })}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            {/* DORI zones toggle */}
            {dev.systemType === 'cctv' && (
              <label className="flex items-center space-x-2 text-[11px] text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={dev.showDori || false}
                  onChange={(e) => updateDevice(dev.id, { showDori: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0"
                />
                <span>Show DORI Resolution Zones</span>
              </label>
            )}
          </div>
        )}

        {/* Coverage Radius Slider (Wi-Fi, Smoke, Speaker) */}
        {dev.hasRadius && (
          <div className="p-3 bg-slate-950 rounded-lg border border-purple-900/40 space-y-3">
            <div className="flex justify-between text-[11px] text-purple-400 font-bold">
              <span>Coverage Radius</span>
              <span className="font-mono font-bold">{dev.coverageRadiusFt || 30} ft</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={dev.coverageRadiusFt || 30}
              onChange={(e) => updateDevice(dev.id, { coverageRadiusFt: parseInt(e.target.value) })}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        )}

        {/* Network & IT Properties */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Wifi className="w-3 h-3 text-slate-400" />
            <span>Network & Addressing</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">IP Address</label>
              <input
                type="text"
                placeholder="192.168.1.50"
                value={dev.ipAddress || ''}
                onChange={(e) => updateDevice(dev.id, { ipAddress: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px] font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">VLAN</label>
              <input
                type="text"
                placeholder="VLAN 10"
                value={dev.vlan || ''}
                onChange={(e) => updateDevice(dev.id, { vlan: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px] font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1 pt-2 border-t border-slate-800">
          <label className="block text-[11px] font-semibold text-slate-400">Installation Notes</label>
          <textarea
            rows={3}
            placeholder="Mounting instructions, cable routing details, or field survey notes..."
            value={dev.notes || ''}
            onChange={(e) => updateDevice(dev.id, { notes: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-[11px] focus:border-sky-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
