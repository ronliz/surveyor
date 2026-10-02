import { create } from 'zustand';
import { 
  SurveyProject, 
  SurveyDevice, 
  CableRun, 
  MarkupItem, 
  ScaleCalibration, 
  LayerState, 
  ToolMode, 
  SystemType,
  Point
} from '../types/survey';
import { DeviceTemplate, DEVICE_CATALOG } from '../constants/deviceCatalog';
import { generateSampleBlueprintSvg } from '../constants/sampleFloorplan';
import { getPolylineLengthFt } from '../utils/geometry';

interface SurveyState {
  project: SurveyProject;
  activeTool: ToolMode;
  selectedDeviceId: string | null;
  selectedCableId: string | null;
  selectedMarkupId: string | null;
  draggedTemplate: DeviceTemplate | null;
  pendingPlacementTemplate: DeviceTemplate | null;
  
  // Viewport
  zoom: number;
  pan: { x: number; y: number };
  snapToGrid: boolean;
  gridSize: number;
  showGrid: boolean;
  
  // Modals & UI
  activeModal: 'bom' | 'report' | 'calibrate' | 'project_info' | 'advisor' | null;
  
  // History for Undo/Redo
  history: SurveyProject[];
  historyIndex: number;

  // Actions
  setActiveTool: (tool: ToolMode) => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  setPan: (pan: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  resetView: () => void;
  setSnapToGrid: (enabled: boolean) => void;
  setShowGrid: (show: boolean) => void;
  setActiveModal: (modal: 'bom' | 'report' | 'calibrate' | 'project_info' | 'advisor' | null) => void;
  setDraggedTemplate: (template: DeviceTemplate | null) => void;
  setPendingPlacement: (template: DeviceTemplate | null) => void;
  
  // Selection
  selectDevice: (id: string | null) => void;
  selectCable: (id: string | null) => void;
  selectMarkup: (id: string | null) => void;
  clearSelection: () => void;
  
  // Project Actions
  updateProjectInfo: (info: Partial<Pick<SurveyProject, 'name' | 'clientName' | 'siteAddress' | 'floorName'>>) => void;
  setBackgroundImage: (url: string | null, width?: number, height?: number) => void;
  setScale: (scale: ScaleCalibration) => void;
  toggleLayer: (layerKey: keyof LayerState) => void;
  
  // Device CRUD
  addDevice: (device: Omit<SurveyDevice, 'id'>) => string;
  updateDevice: (id: string, updates: Partial<SurveyDevice>) => void;
  deleteDevice: (id: string) => void;
  duplicateDevice: (id: string) => void;
  
  // Cable CRUD
  addCable: (cable: Omit<CableRun, 'id' | 'lengthFt'>) => string;
  updateCable: (id: string, updates: Partial<CableRun>) => void;
  deleteCable: (id: string) => void;
  
  // Markup CRUD
  addMarkup: (markup: Omit<MarkupItem, 'id'>) => string;
  updateMarkup: (id: string, updates: Partial<MarkupItem>) => void;
  deleteMarkup: (id: string) => void;

  // History & Persistence
  undo: () => void;
  redo: () => void;
  saveToLocalStorage: () => void;
  loadProjectJson: (projectData: SurveyProject) => void;
  loadSampleFloorplan: () => void;
}

const DEFAULT_SCALE: ScaleCalibration = {
  pixelsPerUnit: 10, // 10 pixels = 1 ft (100 px = 10 ft)
  unit: 'ft',
  isCalibrated: true,
  referenceDistance: 10,
};

const DEFAULT_LAYERS: LayerState = {
  cctv: true,
  access: true,
  intrusion: true,
  fire: true,
  network: true,
  audio: true,
  infrastructure: true,
  cables: true,
  markups: true,
  fovCones: true,
  labels: true,
};

// Initial sample devices for instant demonstration
const createSampleDevices = (scale: ScaleCalibration): SurveyDevice[] => [
  {
    id: 'dev-1',
    systemType: 'cctv',
    deviceType: 'cctv_dome',
    name: 'CAM-101 (Lobby)',
    x: 270,
    y: 470,
    rotation: 0,
    manufacturer: 'Axis Communications',
    model: 'M3206-LVE 4MP IR Dome',
    mountingType: 'Ceiling',
    mountingHeightFt: 10,
    status: 'new',
    estimatedCost: 450,
    hasFov: true,
    fovAngle: 90,
    fovDistanceFt: 45,
    showDori: true,
    ipAddress: '192.168.10.21',
    notes: 'Covers main lobby reception area & entry doors',
  },
  {
    id: 'dev-2',
    systemType: 'cctv',
    deviceType: 'cctv_bullet',
    name: 'CAM-102 (Corridor North)',
    x: 870,
    y: 470,
    rotation: 0,
    manufacturer: 'Hanwha Techwin',
    model: 'XNO-8080R 4K Bullet',
    mountingType: 'Wall',
    mountingHeightFt: 12,
    status: 'new',
    estimatedCost: 580,
    hasFov: true,
    fovAngle: 60,
    fovDistanceFt: 70,
    showDori: true,
    ipAddress: '192.168.10.22',
    notes: 'Long hallway corridor surveillance',
  },
  {
    id: 'dev-3',
    systemType: 'access',
    deviceType: 'access_reader',
    name: 'DR-01 (Server Room In)',
    x: 390,
    y: 190,
    rotation: 180,
    manufacturer: 'HID Global',
    model: 'Signo 40 Multi-Class',
    mountingType: 'Door Frame',
    mountingHeightFt: 4,
    status: 'new',
    estimatedCost: 280,
    notes: 'Card + Mobile NFC access for MDF Server Room',
  },
  {
    id: 'dev-4',
    systemType: 'access',
    deviceType: 'access_maglock',
    name: 'MAG-01 (Server Room)',
    x: 390,
    y: 170,
    rotation: 0,
    manufacturer: 'Securitron',
    model: 'M62 Maglock 1200lb',
    mountingType: 'Door Frame',
    mountingHeightFt: 7,
    status: 'new',
    estimatedCost: 320,
  },
  {
    id: 'dev-5',
    systemType: 'network',
    deviceType: 'net_ap',
    name: 'AP-01 (Bullpen)',
    x: 1200,
    y: 260,
    rotation: 0,
    manufacturer: 'Cisco Meraki',
    model: 'MR46 Wi-Fi 6 AP',
    mountingType: 'Ceiling',
    mountingHeightFt: 11,
    status: 'new',
    estimatedCost: 650,
    hasRadius: true,
    coverageRadiusFt: 40,
    ipAddress: '192.168.20.11',
  },
  {
    id: 'dev-6',
    systemType: 'fire',
    deviceType: 'fire_smoke',
    name: 'SMK-101',
    x: 630,
    y: 180,
    rotation: 0,
    manufacturer: 'Notifier by Honeywell',
    model: 'FSP-951 Photoelectric Smoke',
    mountingType: 'Ceiling',
    mountingHeightFt: 10,
    status: 'new',
    estimatedCost: 115,
    hasRadius: true,
    coverageRadiusFt: 21,
  },
  {
    id: 'dev-7',
    systemType: 'infrastructure',
    deviceType: 'net_rack',
    name: 'MDF-RACK-01',
    x: 180,
    y: 130,
    rotation: 0,
    manufacturer: 'Chatsworth Products (CPI)',
    model: '42U Standard Server Cabinet',
    mountingType: 'Floor' as any,
    mountingHeightFt: 0,
    status: 'existing',
    estimatedCost: 1450,
  }
];

const createSampleCables = (scale: ScaleCalibration): CableRun[] => {
  const points = [
    { x: 180, y: 130 },
    { x: 180, y: 470 },
    { x: 270, y: 470 }
  ];
  return [
    {
      id: 'cbl-1',
      name: 'CBL-CAM101',
      cableType: 'Cat6',
      systemType: 'cctv',
      points,
      fromDeviceId: 'dev-7',
      toDeviceId: 'dev-1',
      lengthFt: getPolylineLengthFt(points, scale),
      color: '#3b82f6',
      notes: 'Plenum Cat6 Blue - Port 12 on Switch-01',
    }
  ];
};

const createInitialProject = (): SurveyProject => {
  const sampleBlueprintUrl = generateSampleBlueprintSvg();
  return {
    id: 'proj-001',
    name: 'Acme HQ - 2nd Floor Security Survey',
    clientName: 'Acme Corporation',
    siteAddress: '100 Innovation Way, Suite 200, Austin, TX',
    floorName: 'Level 2 - Main Corporate Office',
    scale: DEFAULT_SCALE,
    devices: createSampleDevices(DEFAULT_SCALE),
    cables: createSampleCables(DEFAULT_SCALE),
    markups: [],
    backgroundImageUrl: sampleBlueprintUrl,
    backgroundImageWidth: 1600,
    backgroundImageHeight: 1000,
    layers: DEFAULT_LAYERS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const initialProj = createInitialProject();

export const useSurveyStore = create<SurveyState>((set, get) => ({
  project: initialProj,
  activeTool: 'select',
  selectedDeviceId: 'dev-1',
  selectedCableId: null,
  selectedMarkupId: null,
  draggedTemplate: null,
  pendingPlacementTemplate: null,
  
  zoom: 0.9,
  pan: { x: 40, y: 40 },
  snapToGrid: true,
  gridSize: 20,
  showGrid: true,
  
  activeModal: null,
  history: [initialProj],
  historyIndex: 0,

  setActiveTool: (tool) => {
    set({ activeTool: tool });
    if (tool !== 'select' && tool !== 'device') {
      get().clearSelection();
    }
  },

  setZoom: (zoomOrFn) => {
    set((state) => {
      const newZoom = typeof zoomOrFn === 'function' ? zoomOrFn(state.zoom) : zoomOrFn;
      return { zoom: Math.max(0.15, Math.min(newZoom, 4.0)) };
    });
  },

  setPan: (panOrFn) => {
    set((state) => ({
      pan: typeof panOrFn === 'function' ? panOrFn(state.pan) : panOrFn,
    }));
  },

  resetView: () => {
    set({ zoom: 0.85, pan: { x: 60, y: 40 } });
  },

  setSnapToGrid: (enabled) => set({ snapToGrid: enabled }),
  setShowGrid: (show) => set({ showGrid: show }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setDraggedTemplate: (template) => set({ draggedTemplate: template }),
  setPendingPlacement: (template) => {
    if (template) {
      set({ 
        pendingPlacementTemplate: template, 
        activeTool: 'device',
        activeModal: null,
        selectedDeviceId: null,
        selectedCableId: null,
        selectedMarkupId: null,
      });
    } else {
      set({ pendingPlacementTemplate: null, activeTool: 'select' });
    }
  },

  selectDevice: (id) => set({ selectedDeviceId: id, selectedCableId: null, selectedMarkupId: null }),
  selectCable: (id) => set({ selectedCableId: id, selectedDeviceId: null, selectedMarkupId: null }),
  selectMarkup: (id) => set({ selectedMarkupId: id, selectedDeviceId: null, selectedCableId: null }),
  clearSelection: () => set({ selectedDeviceId: null, selectedCableId: null, selectedMarkupId: null }),

  updateProjectInfo: (info) => {
    const { project } = get();
    const updated = { ...project, ...info, updatedAt: new Date().toISOString() };
    set({ project: updated });
    get().saveToLocalStorage();
  },

  setBackgroundImage: (url, width, height) => {
    const { project } = get();
    const updated = {
      ...project,
      backgroundImageUrl: url,
      backgroundImageWidth: width || project.backgroundImageWidth,
      backgroundImageHeight: height || project.backgroundImageHeight,
      updatedAt: new Date().toISOString(),
    };
    set({ project: updated });
  },

  setScale: (scale) => {
    const { project } = get();
    // Recalculate cable lengths with new scale
    const updatedCables = project.cables.map(c => ({
      ...c,
      lengthFt: getPolylineLengthFt(c.points, scale),
    }));
    const updated = { ...project, scale, cables: updatedCables, updatedAt: new Date().toISOString() };
    set({ project: updated });
  },

  toggleLayer: (layerKey) => {
    const { project } = get();
    const updated = {
      ...project,
      layers: {
        ...project.layers,
        [layerKey]: !project.layers[layerKey],
      },
    };
    set({ project: updated });
  },

  addDevice: (deviceData) => {
    const { project, history, historyIndex } = get();
    const id = `dev-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newDevice: SurveyDevice = { ...deviceData, id };
    const updatedDevices = [...project.devices, newDevice];
    const updatedProject = { ...project, devices: updatedDevices, updatedAt: new Date().toISOString() };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedProject);

    set({ 
      project: updatedProject, 
      selectedDeviceId: id, 
      history: newHistory, 
      historyIndex: newHistory.length - 1 
    });
    return id;
  },

  updateDevice: (id, updates) => {
    const { project } = get();
    const updatedDevices = project.devices.map(dev => dev.id === id ? { ...dev, ...updates } : dev);
    const updatedProject = { ...project, devices: updatedDevices, updatedAt: new Date().toISOString() };
    set({ project: updatedProject });
  },

  deleteDevice: (id) => {
    const { project, history, historyIndex, selectedDeviceId } = get();
    const updatedDevices = project.devices.filter(d => d.id !== id);
    // Also remove or detach cables connected to this device
    const updatedCables = project.cables.filter(c => c.fromDeviceId !== id && c.toDeviceId !== id);
    const updatedProject = { ...project, devices: updatedDevices, cables: updatedCables, updatedAt: new Date().toISOString() };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedProject);

    set({ 
      project: updatedProject, 
      selectedDeviceId: selectedDeviceId === id ? null : selectedDeviceId,
      history: newHistory,
      historyIndex: newHistory.length - 1
    });
  },

  duplicateDevice: (id) => {
    const { project, addDevice } = get();
    const target = project.devices.find(d => d.id === id);
    if (!target) return;
    const { id: _, ...rest } = target;
    addDevice({
      ...rest,
      name: `${target.name} (Copy)`,
      x: target.x + 30,
      y: target.y + 30,
    });
  },

  addCable: (cableData) => {
    const { project, history, historyIndex } = get();
    const id = `cbl-${Date.now()}`;
    const lengthFt = getPolylineLengthFt(cableData.points, project.scale);
    const newCable: CableRun = { ...cableData, id, lengthFt };
    const updatedCables = [...project.cables, newCable];
    const updatedProject = { ...project, cables: updatedCables, updatedAt: new Date().toISOString() };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedProject);

    set({ 
      project: updatedProject, 
      selectedCableId: id,
      history: newHistory,
      historyIndex: newHistory.length - 1
    });
    return id;
  },

  updateCable: (id, updates) => {
    const { project } = get();
    const updatedCables = project.cables.map(c => {
      if (c.id !== id) return c;
      const points = updates.points || c.points;
      const lengthFt = getPolylineLengthFt(points, project.scale);
      return { ...c, ...updates, lengthFt };
    });
    set({ project: { ...project, cables: updatedCables, updatedAt: new Date().toISOString() } });
  },

  deleteCable: (id) => {
    const { project, history, historyIndex, selectedCableId } = get();
    const updatedCables = project.cables.filter(c => c.id !== id);
    const updatedProject = { ...project, cables: updatedCables, updatedAt: new Date().toISOString() };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedProject);

    set({ 
      project: updatedProject, 
      selectedCableId: selectedCableId === id ? null : selectedCableId,
      history: newHistory,
      historyIndex: newHistory.length - 1
    });
  },

  addMarkup: (markupData) => {
    const { project, history, historyIndex } = get();
    const id = `mrk-${Date.now()}`;
    const newMarkup: MarkupItem = { ...markupData, id };
    const updatedMarkups = [...project.markups, newMarkup];
    const updatedProject = { ...project, markups: updatedMarkups, updatedAt: new Date().toISOString() };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedProject);

    set({ 
      project: updatedProject, 
      selectedMarkupId: id,
      history: newHistory,
      historyIndex: newHistory.length - 1
    });
    return id;
  },

  updateMarkup: (id, updates) => {
    const { project } = get();
    const updatedMarkups = project.markups.map(m => m.id === id ? { ...m, ...updates } : m);
    set({ project: { ...project, markups: updatedMarkups, updatedAt: new Date().toISOString() } });
  },

  deleteMarkup: (id) => {
    const { project, history, historyIndex, selectedMarkupId } = get();
    const updatedMarkups = project.markups.filter(m => m.id !== id);
    const updatedProject = { ...project, markups: updatedMarkups, updatedAt: new Date().toISOString() };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedProject);

    set({ 
      project: updatedProject, 
      selectedMarkupId: selectedMarkupId === id ? null : selectedMarkupId,
      history: newHistory,
      historyIndex: newHistory.length - 1
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({ project: history[newIndex], historyIndex: newIndex });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({ project: history[newIndex], historyIndex: newIndex });
    }
  },

  saveToLocalStorage: () => {
    try {
      localStorage.setItem('survey_project_data', JSON.stringify(get().project));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  },

  loadProjectJson: (projectData) => {
    set({
      project: projectData,
      history: [projectData],
      historyIndex: 0,
      selectedDeviceId: null,
      selectedCableId: null,
      selectedMarkupId: null,
    });
  },

  loadSampleFloorplan: () => {
    const sample = createInitialProject();
    set({
      project: sample,
      history: [sample],
      historyIndex: 0,
      selectedDeviceId: 'dev-1',
      selectedCableId: null,
      selectedMarkupId: null,
    });
  }
}));
