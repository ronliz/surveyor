import React from 'react';
import { 
  Eye, 
  EyeOff, 
  Layers, 
  Camera, 
  CreditCard, 
  Activity, 
  Flame, 
  Wifi, 
  Speaker, 
  Server, 
  GitBranch, 
  PenTool, 
  Radar, 
  Tag 
} from 'lucide-react';
import { useSurveyStore } from '../../store/useSurveyStore';
import { LayerState } from '../../types/survey';

export const LayerManager: React.FC = () => {
  const { project, toggleLayer } = useSurveyStore();
  const layers = project.layers;

  const layerItems: { key: keyof LayerState; label: string; icon: React.FC<{ className?: string }>; color: string }[] = [
    { key: 'cctv', label: 'Video Surveillance (CCTV)', icon: Camera, color: '#3b82f6' },
    { key: 'access', label: 'Access Control', icon: CreditCard, color: '#10b981' },
    { key: 'intrusion', label: 'Intrusion Detection', icon: Activity, color: '#f59e0b' },
    { key: 'fire', label: 'Fire & Life Safety', icon: Flame, color: '#ef4444' },
    { key: 'network', label: 'Network & Wi-Fi', icon: Wifi, color: '#8b5cf6' },
    { key: 'audio', label: 'Audio / Visual & Intercom', icon: Speaker, color: '#ec4899' },
    { key: 'infrastructure', label: 'Racks & Infrastructure', icon: Server, color: '#64748b' },
    { key: 'cables', label: 'Cable Routing Runs', icon: GitBranch, color: '#6366f1' },
    { key: 'markups', label: 'Walls & Area Markups', icon: PenTool, color: '#94a3b8' },
    { key: 'fovCones', label: 'Camera FoV & Coverage Cones', icon: Radar, color: '#38bdf8' },
    { key: 'labels', label: 'Device Tag Labels', icon: Tag, color: '#cbd5e1' },
  ];

  return (
    <div className="p-3 bg-slate-900 border-r border-slate-800 w-80 select-none flex flex-col h-full">
      <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
        <Layers className="w-4 h-4 text-sky-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
          System Layers & Filters
        </span>
      </div>

      <div className="text-[11px] text-slate-400 my-2">
        Toggle visibility for individual security disciplines and elements:
      </div>

      <div className="space-y-1 overflow-y-auto flex-1 pr-1">
        {layerItems.map((item) => {
          const isVisible = layers[item.key];
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => toggleLayer(item.key)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition ${
                isVisible
                  ? 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700'
                  : 'bg-slate-950/30 border-slate-900 text-slate-500 hover:text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full transition ${isVisible ? '' : 'opacity-30'}`}
                  style={{ backgroundColor: item.color }}
                />
                <Icon className={`w-3.5 h-3.5 ${isVisible ? 'text-slate-300' : 'text-slate-600'}`} />
                <span className="text-xs font-medium text-left">{item.label}</span>
              </div>

              <div className="p-1">
                {isVisible ? (
                  <Eye className="w-3.5 h-3.5 text-sky-400" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
