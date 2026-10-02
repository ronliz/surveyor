import React from 'react';
import { 
  MousePointer, 
  Hand, 
  Ruler, 
  GitBranch, 
  Square, 
  PenTool, 
  Type
} from 'lucide-react';
import { useSurveyStore } from '../../store/useSurveyStore';
import { ToolMode } from '../../types/survey';

export const MarkupTools: React.FC = () => {
  const { activeTool, setActiveTool } = useSurveyStore();

  const tools: { id: ToolMode; label: string; icon: React.FC<{ className?: string }>; description: string }[] = [
    { id: 'select', label: 'Select / Move', icon: MousePointer, description: 'Select, move & rotate devices or paths' },
    { id: 'pan', label: 'Pan Canvas', icon: Hand, description: 'Pan around floor plan (or drag empty canvas)' },
    { id: 'calibrate', label: 'Calibrate Scale', icon: Ruler, description: 'Draw reference line to set scale (ft/m)' },
    { id: 'cable', label: 'Cable Routing', icon: GitBranch, description: 'Click points to draw cable run between devices' },
    { id: 'wall', label: 'Wall Line', icon: PenTool, description: 'Draw architectural wall markups' },
    { id: 'room', label: 'Room / Zone', icon: Square, description: 'Draw coverage zone or room boundary' },
    { id: 'dimension', label: 'Measure Tape', icon: Ruler, description: 'Measure distance between any two points' },
    { id: 'text', label: 'Text Callout', icon: Type, description: 'Place note or text callout on plan' },
  ];

  return (
    <div className="absolute left-4 top-16 z-20 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl p-1.5 shadow-2xl flex flex-col space-y-1 select-none">
      {tools.map((tool) => {
        const isActive = activeTool === tool.id;
        const Icon = tool.icon;

        return (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`p-2.5 rounded-lg flex items-center justify-center transition group relative ${
              isActive
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={`${tool.label} - ${tool.description}`}
          >
            <Icon className="w-4 h-4" />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-2.5 px-2 py-1 bg-slate-950 text-slate-200 text-xs rounded border border-slate-800 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition shadow-lg z-30">
              <span className="font-semibold">{tool.label}</span>: {tool.description}
            </div>
          </button>
        );
      })}
    </div>
  );
};
