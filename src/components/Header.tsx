import React, { useRef, useState } from 'react';
import { 
  ShieldCheck, 
  FileSpreadsheet, 
  FileText, 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Upload, 
  Download, 
  Grid, 
  Ruler, 
  Info, 
  Layers, 
  RotateCcw,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useSurveyStore } from '../store/useSurveyStore';
import { extractPdfPages, renderPdfPageToDataUrl, PdfPageInfo } from '../utils/pdfLoader';
import { PdfPageSelectorModal } from './Modals/PdfPageSelectorModal';

export const Header: React.FC = () => {
  const {
    project,
    zoom,
    setZoom,
    resetView,
    undo,
    redo,
    historyIndex,
    history,
    snapToGrid,
    setSnapToGrid,
    showGrid,
    setShowGrid,
    setActiveModal,
    setActiveTool,
    setBackgroundImage,
    updateProjectInfo,
    loadProjectJson,
    loadSampleFloorplan
  } = useSurveyStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  // PDF processing state
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [pdfData, setPdfData] = useState<{
    doc: any;
    pages: PdfPageInfo[];
    fileName: string;
  } | null>(null);

  // Handle floorplan upload (Images or PDFs)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if uploaded file is PDF
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      setIsProcessingPdf(true);
      try {
        const { pdfDoc, pages } = await extractPdfPages(file);
        
        if (pages.length === 1) {
          // Single-page PDF: render directly at 2x CAD sharpness
          const { dataUrl, width, height } = await renderPdfPageToDataUrl(pdfDoc, 1, 2.0);
          setBackgroundImage(dataUrl, width, height);
          updateProjectInfo({
            floorName: file.name.replace(/\.pdf$/i, ''),
          });
        } else {
          // Multi-page architectural sheet set: show selector modal
          setPdfData({
            doc: pdfDoc,
            pages,
            fileName: file.name,
          });
        }
      } catch (err) {
        console.error('Failed to load PDF floorplan:', err);
        alert('Could not parse PDF file. Ensure it is a valid document.');
      } finally {
        setIsProcessingPdf(false);
      }
    } else {
      // Standard image format (PNG, JPG, SVG)
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          setBackgroundImage(dataUrl, img.width, img.height);
          updateProjectInfo({
            floorName: file.name.replace(/\.[^/.]+$/, ''),
          });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }

    // Reset input value so same file can be re-uploaded if desired
    e.target.value = '';
  };

  // Export project to .survey JSON file
  const handleExportJson = () => {
    const dataStr = JSON.stringify(project, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '_')}.survey`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Load .survey JSON file
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          loadProjectJson(parsed);
        } catch (err) {
          alert('Invalid .survey project file format');
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  return (
    <>
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-30 select-none shadow-md">
        {/* Brand & Project Info */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-sky-600 to-indigo-600 px-3 py-1.5 rounded-lg shadow-inner">
            <ShieldCheck className="w-5 h-5 text-white" />
            <span className="font-bold text-sm tracking-wide text-white">SYSTEM SURVEYOR</span>
          </div>

          <div className="h-5 w-[1px] bg-slate-700" />

          {/* Project Name and Details */}
          <button
            onClick={() => setActiveModal('project_info')}
            className="text-left group flex items-center space-x-2 px-2 py-1 rounded hover:bg-slate-800 transition"
          >
            <div>
              <div className="text-xs font-semibold text-slate-200 group-hover:text-sky-400 flex items-center space-x-1.5">
                <span>{project.name}</span>
                <Info className="w-3 h-3 text-slate-400 group-hover:text-sky-400" />
              </div>
              <div className="text-[10px] text-slate-400">
                {project.floorName} &bull; {project.clientName}
              </div>
            </div>
          </button>
        </div>

        {/* Center Controls: Scale & Viewport Navigation */}
        <div className="flex items-center space-x-2 bg-slate-950/70 border border-slate-800 px-3 py-1 rounded-lg">
          {/* Scale indicator */}
          <button
            onClick={() => setActiveTool('calibrate')}
            className="flex items-center space-x-1.5 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-sky-400 text-xs font-medium border border-sky-900/50"
            title="Click to calibrate scale"
          >
            <Ruler className="w-3.5 h-3.5 text-sky-400" />
            <span>Scale: 1 {project.scale.unit} = {Math.round(project.scale.pixelsPerUnit)} px</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800" />

          {/* Undo / Redo */}
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 rounded hover:bg-slate-800"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 rounded hover:bg-slate-800"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800" />

          {/* Zoom Controls */}
          <button
            onClick={() => setZoom(z => Math.max(0.2, z - 0.15))}
            className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-400 w-12 text-center font-mono">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(z => Math.min(3.0, z + 0.15))}
            className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800"
            title="Fit & Center View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800" />

          {/* Grid Snapping */}
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`p-1.5 rounded transition ${snapToGrid ? 'bg-sky-950 text-sky-400 border border-sky-600/40' : 'text-slate-400 hover:bg-slate-800'}`}
            title={snapToGrid ? 'Snap to Grid: ON' : 'Snap to Grid: OFF'}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>

        {/* Right Actions: File, Blueprint, BOM & PDF Export */}
        <div className="flex items-center space-x-2">
          {/* Hidden file inputs */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="application/pdf,.pdf,image/png,image/jpeg,image/svg+xml" 
            className="hidden" 
          />
          <input 
            type="file" 
            ref={jsonInputRef} 
            onChange={handleImportJson} 
            accept=".survey,.json" 
            className="hidden" 
          />

          {/* Load Sample / Reset */}
          <button
            onClick={loadSampleFloorplan}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition border border-slate-700"
            title="Reload demo office blueprint"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Demo Plan</span>
          </button>

          {/* Upload Floorplan (PDF & Images) */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingPdf}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition border border-slate-700 disabled:opacity-50"
            title="Upload architectural floor plan (PDF, PNG, JPG, SVG)"
          >
            {isProcessingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{isProcessingPdf ? 'Parsing PDF...' : 'Upload PDF / Plan'}</span>
          </button>

          {/* Save / Load Project JSON */}
          <button
            onClick={handleExportJson}
            className="flex items-center space-x-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition border border-slate-700"
            title="Save project file (.survey)"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Save</span>
          </button>

          <button
            onClick={() => jsonInputRef.current?.click()}
            className="px-2 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition border border-slate-700"
            title="Open .survey project file"
          >
            Open
          </button>

          <div className="h-5 w-[1px] bg-slate-700" />

          {/* AI Security Advisor */}
          <button
            onClick={() => setActiveModal('advisor')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white rounded font-semibold text-xs shadow transition ring-1 ring-white/10"
            title="Analyze site security compliance & auto-recommendations"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Advisor</span>
          </button>

          {/* Bill of Materials (BOM) */}
          <button
            onClick={() => setActiveModal('bom')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-medium text-xs shadow transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>BOM ({project.devices.length})</span>
          </button>

          {/* Export Report / PDF */}
          <button
            onClick={() => setActiveModal('report')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-medium text-xs shadow transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </header>

      {/* Multi-page PDF Sheet Selector Dialog */}
      {pdfData && (
        <PdfPageSelectorModal
          pdfDoc={pdfData.doc}
          pages={pdfData.pages}
          fileName={pdfData.fileName}
          onClose={() => setPdfData(null)}
        />
      )}
    </>
  );
};
