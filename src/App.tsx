import React, { useState } from 'react';
import { Header } from './components/Header';
import { DevicePalette } from './components/Sidebar/DevicePalette';
import { LayerManager } from './components/Sidebar/LayerManager';
import { MarkupTools } from './components/Sidebar/MarkupTools';
import { CanvasStage } from './components/Canvas/CanvasStage';
import { PropertyPanel } from './components/Inspector/PropertyPanel';
import { CalibrationModal } from './components/Canvas/CalibrationModal';
import { BomModal } from './components/Modals/BomModal';
import { ExportReportModal } from './components/Modals/ExportReportModal';
import { ProjectInfoModal } from './components/Modals/ProjectInfoModal';
import { SecurityAdvisorModal } from './components/Modals/SecurityAdvisorModal';
import { useSurveyStore } from './store/useSurveyStore';
import { LayoutGrid, Layers } from 'lucide-react';

export const App: React.FC = () => {
  const [leftTab, setLeftTab] = useState<'catalog' | 'layers'>('catalog');
  const { activeModal } = useSurveyStore();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Top Application Header */}
      <Header />

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar Tab Navigation Strip */}
        <div className="w-12 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-3 space-y-2 z-20 select-none">
          <button
            onClick={() => setLeftTab('catalog')}
            className={`p-2.5 rounded-xl transition ${
              leftTab === 'catalog'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            title="Device Catalog (Drag & Drop Elements)"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <button
            onClick={() => setLeftTab('layers')}
            className={`p-2.5 rounded-xl transition ${
              leftTab === 'layers'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            title="System Layers & Visibility Filters"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* Left Active Sidebar Content */}
        {leftTab === 'catalog' ? <DevicePalette /> : <LayerManager />}

        {/* Floating Markup Tools Toolbar */}
        <MarkupTools />

        {/* Central 2D CAD & Floorplan Canvas */}
        <CanvasStage />

        {/* Right Property Inspector */}
        <PropertyPanel />
      </div>

      {/* Popups & Modals */}
      {activeModal === 'advisor' && <SecurityAdvisorModal />}
      {activeModal === 'calibrate' && <CalibrationModal />}
      {activeModal === 'bom' && <BomModal />}
      {activeModal === 'report' && <ExportReportModal />}
      {activeModal === 'project_info' && <ProjectInfoModal />}
    </div>
  );
};

export default App;
