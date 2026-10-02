import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSurveyStore } from '../../store/useSurveyStore';
import { 
  Point, 
  SurveyDevice, 
  CableRun, 
  MarkupItem 
} from '../../types/survey';
import { DeviceTemplate, SYSTEM_COLORS } from '../../constants/deviceCatalog';
import { 
  degToRad, 
  feetToPixels, 
  pixelsToFeet, 
  getDistance, 
  getAngleDegrees, 
  calculateDoriRadii, 
  snapToGrid 
} from '../../utils/geometry';
import { drawDeviceIcon } from '../../utils/canvasIcons';
import { Trash2, Copy, RotateCw, Sliders, X } from 'lucide-react';

interface DragState {
  type: 'device' | 'rotate' | 'pan' | 'cable_point';
  id?: string;
  initialX: number;
  initialY: number;
  deviceInitialX?: number;
  deviceInitialY?: number;
  deviceInitialRotation?: number;
}

export const CanvasStage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    project,
    activeTool,
    setActiveTool,
    selectedDeviceId,
    selectedCableId,
    selectedMarkupId,
    selectDevice,
    selectCable,
    selectMarkup,
    clearSelection,
    addDevice,
    deleteDevice,
    duplicateDevice,
    updateDevice,
    addCable,
    deleteCable,
    addMarkup,
    deleteMarkup,
    pendingPlacementTemplate,
    setPendingPlacement,
    setScale,
    zoom,
    setZoom,
    pan,
    setPan,
    snapToGrid: isSnapGrid,
    gridSize,
    showGrid,
    setActiveModal
  } = useSurveyStore();

  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    deviceId: string;
  } | null>(null);

  // In-progress drawing states
  const [activeDrawingPoints, setActiveDrawingPoints] = useState<Point[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null);
  const [calibrationDraft, setCalibrationDraft] = useState<{ p1: Point; p2: Point } | null>(null);

  // Keyboard shortcut listener (Delete, Backspace, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input/textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedDeviceId) {
          deleteDevice(selectedDeviceId);
        } else if (selectedCableId) {
          deleteCable(selectedCableId);
        } else if (selectedMarkupId) {
          deleteMarkup(selectedMarkupId);
        }
      } else if (e.key === 'Escape') {
        if (contextMenu) setContextMenu(null);
        if (activeDrawingPoints.length > 0) {
          setActiveDrawingPoints([]);
          setActiveTool('select');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDeviceId, selectedCableId, selectedMarkupId, deleteDevice, deleteCable, deleteMarkup, contextMenu, activeDrawingPoints, setActiveTool]);

  // Load background image
  useEffect(() => {
    if (!project.backgroundImageUrl) {
      setBgImage(null);
      return;
    }
    const img = new Image();
    img.src = project.backgroundImageUrl;
    img.onload = () => {
      setBgImage(img);
    };
  }, [project.backgroundImageUrl]);

  // Coordinate Conversion Helpers
  const screenToWorld = useCallback((screenX: number, screenY: number): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = screenX - rect.left;
    const clientY = screenY - rect.top;
    return {
      x: (clientX - pan.x) / zoom,
      y: (clientY - pan.y) / zoom,
    };
  }, [pan, zoom]);

  const worldToScreen = useCallback((worldX: number, worldY: number): Point => {
    return {
      x: worldX * zoom + pan.x,
      y: worldY * zoom + pan.y,
    };
  }, [pan, zoom]);

  // Canvas redraw loop
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement?.clientWidth || 1000;
    const height = canvas.parentElement?.clientHeight || 700;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Background fill
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Apply Camera Transform
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // 1. Draw Grid
    if (showGrid) {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5 / zoom;
      const startX = Math.floor((-pan.x / zoom) / gridSize) * gridSize - gridSize * 2;
      const endX = startX + (width / zoom) + gridSize * 4;
      const startY = Math.floor((-pan.y / zoom) / gridSize) * gridSize - gridSize * 2;
      const endY = startY + (height / zoom) + gridSize * 4;

      ctx.beginPath();
      for (let x = startX; x <= endX; x += gridSize) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
      }
      for (let y = startY; y <= endY; y += gridSize) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
      }
      ctx.stroke();
    }

    // 2. Draw Floorplan Background Image
    if (bgImage && bgImage.complete) {
      ctx.drawImage(bgImage, 0, 0);
    }

    const { layers, scale } = project;

    // 3. Draw Markups (Walls, Rooms, Measurements)
    if (layers.markups) {
      project.markups.forEach((markup) => {
        const isSelected = selectedMarkupId === markup.id;
        ctx.strokeStyle = isSelected ? '#38bdf8' : markup.color || '#64748b';
        ctx.lineWidth = (markup.lineWidth || 3) * (isSelected ? 1.5 : 1);
        ctx.fillStyle = markup.fillColor || 'rgba(56, 189, 248, 0.1)';

        if (markup.type === 'wall' && markup.points.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(markup.points[0].x, markup.points[0].y);
          for (let i = 1; i < markup.points.length; i++) {
            ctx.lineTo(markup.points[i].x, markup.points[i].y);
          }
          ctx.stroke();
        } else if (markup.type === 'room' && markup.points.length === 2) {
          const p1 = markup.points[0];
          const p2 = markup.points[1];
          const rx = Math.min(p1.x, p2.x);
          const ry = Math.min(p1.y, p2.y);
          const rw = Math.abs(p2.x - p1.x);
          const rh = Math.abs(p2.y - p1.y);
          ctx.fillRect(rx, ry, rw, rh);
          ctx.strokeRect(rx, ry, rw, rh);
        } else if (markup.type === 'dimension' && markup.points.length === 2) {
          const p1 = markup.points[0];
          const p2 = markup.points[1];
          ctx.beginPath();
          ctx.setLineDash([4, 4]);
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // Length text
          const distPx = getDistance(p1, p2);
          const distFt = pixelsToFeet(distPx, scale).toFixed(1);
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          ctx.fillStyle = '#38bdf8';
          ctx.font = '11px monospace';
          ctx.fillText(`${distFt} ${scale.unit}`, midX, midY - 6);
        } else if (markup.type === 'text' && markup.points.length >= 1) {
          ctx.fillStyle = markup.color || '#f8fafc';
          ctx.font = `bold ${markup.fontSize || 14}px sans-serif`;
          ctx.fillText(markup.text || 'Annotation', markup.points[0].x, markup.points[0].y);
        }
      });
    }

    // 4. Draw Cable Routing Runs
    if (layers.cables) {
      project.cables.forEach((cable) => {
        if (!layers[cable.systemType]) return;
        const isSelected = selectedCableId === cable.id;

        ctx.strokeStyle = isSelected ? '#38bdf8' : cable.color || '#6366f1';
        ctx.lineWidth = isSelected ? 4 : 2.5;
        ctx.setLineDash(cable.cableType.includes('Fiber') ? [6, 4] : []);

        ctx.beginPath();
        if (cable.points.length > 0) {
          ctx.moveTo(cable.points[0].x, cable.points[0].y);
          for (let i = 1; i < cable.points.length; i++) {
            ctx.lineTo(cable.points[i].x, cable.points[i].y);
          }
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Junction nodes
        cable.points.forEach((pt, idx) => {
          ctx.fillStyle = isSelected ? '#38bdf8' : '#cbd5e1';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, idx === 0 || idx === cable.points.length - 1 ? 4 : 2.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Cable label at midpoint
        if (cable.points.length >= 2 && layers.labels) {
          const midIdx = Math.floor(cable.points.length / 2);
          const pt = cable.points[midIdx];
          ctx.fillStyle = '#0f172a';
          ctx.font = '10px monospace';
          const label = `${cable.name} (${Math.round(cable.lengthFt)} ${scale.unit})`;
          const textWidth = ctx.measureText(label).width;
          ctx.fillRect(pt.x - textWidth / 2 - 3, pt.y - 14, textWidth + 6, 14);
          ctx.fillStyle = isSelected ? '#38bdf8' : '#94a3b8';
          ctx.fillText(label, pt.x - textWidth / 2, pt.y - 4);
        }
      });
    }

    // 5. Draw Field of View (FoV) Cones & Coverage Bubbles
    if (layers.fovCones) {
      project.devices.forEach((dev) => {
        if (!layers[dev.systemType]) return;

        // Directional FoV Cone (CCTV cameras, PIR sensors)
        if (dev.hasFov && dev.fovAngle && dev.fovDistanceFt) {
          const rangePx = feetToPixels(dev.fovDistanceFt, scale);
          const halfAngleRad = degToRad(dev.fovAngle / 2);
          const centerAngleRad = degToRad(dev.rotation);
          const startAngle = centerAngleRad - halfAngleRad;
          const endAngle = centerAngleRad + halfAngleRad;

          // Draw DORI zones if enabled on camera
          if (dev.showDori && dev.systemType === 'cctv') {
            const dori = calculateDoriRadii(rangePx);
            const zones = [
              { radius: dori.detect, color: 'rgba(239, 68, 68, 0.12)', stroke: 'rgba(239, 68, 68, 0.4)', label: 'Detect' },
              { radius: dori.observe, color: 'rgba(245, 158, 11, 0.15)', stroke: 'rgba(245, 158, 11, 0.5)', label: 'Observe' },
              { radius: dori.recognize, color: 'rgba(59, 130, 246, 0.18)', stroke: 'rgba(59, 130, 246, 0.6)', label: 'Recognize' },
              { radius: dori.identify, color: 'rgba(16, 185, 129, 0.25)', stroke: 'rgba(16, 185, 129, 0.7)', label: 'Identify' },
            ];

            zones.forEach((z) => {
              ctx.fillStyle = z.color;
              ctx.strokeStyle = z.stroke;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(dev.x, dev.y);
              ctx.arc(dev.x, dev.y, z.radius, startAngle, endAngle);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            });
          } else {
            // Standard single color FoV cone
            ctx.fillStyle = dev.systemType === 'cctv' ? 'rgba(56, 189, 248, 0.22)' : 'rgba(245, 158, 11, 0.2)';
            ctx.strokeStyle = dev.systemType === 'cctv' ? '#38bdf8' : '#f59e0b';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(dev.x, dev.y);
            ctx.arc(dev.x, dev.y, rangePx, startAngle, endAngle);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }

          // Center line of sight indicator
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(dev.x, dev.y);
          ctx.lineTo(
            dev.x + Math.cos(centerAngleRad) * rangePx,
            dev.y + Math.sin(centerAngleRad) * rangePx
          );
          ctx.stroke();
        }

        // Omnidirectional Coverage Bubble (Wi-Fi APs, Smoke Detectors, Speakers)
        if (dev.hasRadius && dev.coverageRadiusFt) {
          const radiusPx = feetToPixels(dev.coverageRadiusFt, scale);
          ctx.fillStyle = dev.systemType === 'network' ? 'rgba(139, 92, 246, 0.15)' : 
                          dev.systemType === 'fire' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(236, 72, 153, 0.15)';
          ctx.strokeStyle = dev.systemType === 'network' ? '#8b5cf6' : 
                            dev.systemType === 'fire' ? '#ef4444' : '#ec4899';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(dev.x, dev.y, radiusPx, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
    }

    // 6. Draw System Devices
    project.devices.forEach((dev) => {
      if (!layers[dev.systemType]) return;
      const isSelected = selectedDeviceId === dev.id;
      const devColor = dev.color || SYSTEM_COLORS[dev.systemType] || '#3b82f6';

      ctx.save();
      ctx.translate(dev.x, dev.y);

      // Selected glow halo
      if (isSelected) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Rotation Handle
        const rotHandleDist = 32;
        const rotAngleRad = degToRad(dev.rotation);
        const handleX = Math.cos(rotAngleRad) * rotHandleDist;
        const handleY = Math.sin(rotAngleRad) * rotHandleDist;

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(handleX, handleY);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(handleX, handleY, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw the device-type-specific icon
      drawDeviceIcon(ctx, dev.deviceType, devColor);

      ctx.restore();

      // Device Tag Label
      if (layers.labels) {
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 10px sans-serif';
        const label = dev.name;
        const textWidth = ctx.measureText(label).width;
        ctx.fillRect(dev.x - textWidth / 2 - 3, dev.y + 14, textWidth + 6, 14);
        ctx.strokeStyle = isSelected ? '#38bdf8' : '#334155';
        ctx.lineWidth = 1;
        ctx.strokeRect(dev.x - textWidth / 2 - 3, dev.y + 14, textWidth + 6, 14);
        ctx.fillStyle = isSelected ? '#38bdf8' : '#e2e8f0';
        ctx.fillText(label, dev.x - textWidth / 2, dev.y + 24);
      }
    });

    // 7. Draw in-progress markup or cabling tool graphics
    if (activeDrawingPoints.length > 0) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(activeDrawingPoints[0].x, activeDrawingPoints[0].y);
      for (let i = 1; i < activeDrawingPoints.length; i++) {
        ctx.lineTo(activeDrawingPoints[i].x, activeDrawingPoints[i].y);
      }
      if (hoveredPoint) {
        ctx.lineTo(hoveredPoint.x, hoveredPoint.y);
      }
      ctx.stroke();

      // Nodes
      activeDrawingPoints.forEach((pt) => {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 8. Draw active scale calibration line
    if (calibrationDraft) {
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(calibrationDraft.p1.x, calibrationDraft.p1.y);
      ctx.lineTo(calibrationDraft.p2.x, calibrationDraft.p2.y);
      ctx.stroke();

      // End caps
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(calibrationDraft.p1.x, calibrationDraft.p1.y, 5, 0, Math.PI * 2);
      ctx.arc(calibrationDraft.p2.x, calibrationDraft.p2.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 9. Draw Ghost Placement Preview under cursor
    if (activeTool === 'device' && pendingPlacementTemplate && hoveredPoint) {
      const { scale } = project;
      const t = pendingPlacementTemplate;

      // Draw FoV Cone Ghost
      if (t.hasFov && t.fovAngle && t.fovDistanceFt) {
        const rangePx = feetToPixels(t.fovDistanceFt, scale);
        const halfAngleRad = degToRad(t.fovAngle / 2);
        const centerAngleRad = 0; // pointing east initially

        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(hoveredPoint.x, hoveredPoint.y);
        ctx.arc(hoveredPoint.x, hoveredPoint.y, rangePx, -halfAngleRad, halfAngleRad);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Draw Radius Bubble Ghost
      if (t.hasRadius && t.coverageRadiusFt) {
        const radiusPx = feetToPixels(t.coverageRadiusFt, scale);
        ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(hoveredPoint.x, hoveredPoint.y, radiusPx, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Ghost Device Base Circle & Crosshairs
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(hoveredPoint.x - 20, hoveredPoint.y);
      ctx.lineTo(hoveredPoint.x + 20, hoveredPoint.y);
      ctx.moveTo(hoveredPoint.x, hoveredPoint.y - 20);
      ctx.lineTo(hoveredPoint.x, hoveredPoint.y + 20);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = t.color || '#3b82f6';
      ctx.beginPath();
      ctx.arc(hoveredPoint.x, hoveredPoint.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ghost Label
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px sans-serif';
      const label = `Click to place: ${t.label}`;
      const textWidth = ctx.measureText(label).width;
      ctx.fillRect(hoveredPoint.x - textWidth / 2 - 4, hoveredPoint.y + 16, textWidth + 8, 16);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(hoveredPoint.x - textWidth / 2 - 4, hoveredPoint.y + 16, textWidth + 8, 16);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(label, hoveredPoint.x - textWidth / 2, hoveredPoint.y + 28);
    }

    ctx.restore();
    ctx.restore();
  }, [
    pan, 
    zoom, 
    showGrid, 
    gridSize, 
    bgImage, 
    project, 
    selectedDeviceId, 
    selectedCableId, 
    selectedMarkupId, 
    activeDrawingPoints, 
    hoveredPoint, 
    calibrationDraft,
    activeTool,
    pendingPlacementTemplate
  ]);

  // Request Animation Frame on render
  useEffect(() => {
    let animId: number;
    const loop = () => {
      renderCanvas();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [renderCanvas]);

  // Mouse wheel for smooth Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newZoom = Math.max(0.15, Math.min(zoom * zoomFactor, 4.0));
    
    // Zoom toward cursor position
    const newPanX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
    const newPanY = mouseY - (mouseY - pan.y) * (newZoom / zoom);

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  // Find device under cursor
  const getDeviceAt = (worldPos: Point): SurveyDevice | null => {
    const hitRadius = 16;
    for (let i = project.devices.length - 1; i >= 0; i--) {
      const dev = project.devices[i];
      if (getDistance(worldPos, { x: dev.x, y: dev.y }) <= hitRadius) {
        return dev;
      }
    }
    return null;
  };

  // Check if mouse hits rotation handle of selected device
  const isRotationHandleHit = (worldPos: Point, dev: SurveyDevice): boolean => {
    const rotDist = 32;
    const rotRad = degToRad(dev.rotation);
    const handlePos = {
      x: dev.x + Math.cos(rotRad) * rotDist,
      y: dev.y + Math.sin(rotRad) * rotDist,
    };
    return getDistance(worldPos, handlePos) <= 10;
  };

  // Mouse Down handler
  const handleMouseDown = (e: React.MouseEvent) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);
    const snapped = snapToGrid(worldPos, gridSize, isSnapGrid);

    // Click-to-Place Device Mode (From AI Advisor or Palette)
    if (activeTool === 'device' && pendingPlacementTemplate) {
      const template = pendingPlacementTemplate;
      const newId = addDevice({
        systemType: template.systemType,
        deviceType: template.deviceType,
        name: `${template.label.replace(/^Verkada\s+/i, '').split(' ')[0]}-${Math.floor(100 + Math.random() * 900)}`,
        x: snapped.x,
        y: snapped.y,
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

      selectDevice(newId);
      setPendingPlacement(null);
      return;
    }

    // Pan mode or Middle Click
    if (activeTool === 'pan' || e.button === 1) {
      setDragState({
        type: 'pan',
        initialX: e.clientX,
        initialY: e.clientY,
      });
      return;
    }

    // Scale calibration tool
    if (activeTool === 'calibrate') {
      setCalibrationDraft({ p1: snapped, p2: snapped });
      return;
    }

    // Cabling tool: add point
    if (activeTool === 'cable') {
      const hitDev = getDeviceAt(worldPos);
      const pointToAdd = hitDev ? { x: hitDev.x, y: hitDev.y } : snapped;
      
      if (activeDrawingPoints.length > 0 && e.detail === 2) {
        // Double click finishes cable
        addCable({
          name: `CBL-${project.cables.length + 101}`,
          cableType: 'Cat6',
          systemType: hitDev ? hitDev.systemType : 'cctv',
          points: [...activeDrawingPoints, pointToAdd],
          fromDeviceId: undefined,
          toDeviceId: hitDev?.id,
          color: '#3b82f6',
        });
        setActiveDrawingPoints([]);
        setActiveTool('select');
      } else {
        setActiveDrawingPoints([...activeDrawingPoints, pointToAdd]);
      }
      return;
    }

    // Wall tool
    if (activeTool === 'wall') {
      if (activeDrawingPoints.length > 0 && e.detail === 2) {
        addMarkup({
          type: 'wall',
          points: [...activeDrawingPoints, snapped],
          color: '#64748b',
          lineWidth: 4,
        });
        setActiveDrawingPoints([]);
        setActiveTool('select');
      } else {
        setActiveDrawingPoints([...activeDrawingPoints, snapped]);
      }
      return;
    }

    // Room / Area tool
    if (activeTool === 'room') {
      if (activeDrawingPoints.length === 1) {
        addMarkup({
          type: 'room',
          points: [activeDrawingPoints[0], snapped],
          color: '#38bdf8',
          fillColor: 'rgba(56, 189, 248, 0.15)',
          lineWidth: 2,
        });
        setActiveDrawingPoints([]);
        setActiveTool('select');
      } else {
        setActiveDrawingPoints([snapped]);
      }
      return;
    }

    // Dimension / Measure tool
    if (activeTool === 'dimension') {
      if (activeDrawingPoints.length === 1) {
        addMarkup({
          type: 'dimension',
          points: [activeDrawingPoints[0], snapped],
          color: '#38bdf8',
        });
        setActiveDrawingPoints([]);
        setActiveTool('select');
      } else {
        setActiveDrawingPoints([snapped]);
      }
      return;
    }

    // Text tool
    if (activeTool === 'text') {
      const text = prompt('Enter annotation text:');
      if (text) {
        addMarkup({
          type: 'text',
          points: [snapped],
          text,
          color: '#f8fafc',
          fontSize: 14,
        });
      }
      setActiveTool('select');
      return;
    }

    // Select Tool: check rotation handle first, then device hit
    if (activeTool === 'select') {
      if (selectedDeviceId) {
        const selectedDev = project.devices.find(d => d.id === selectedDeviceId);
        if (selectedDev && isRotationHandleHit(worldPos, selectedDev)) {
          setDragState({
            type: 'rotate',
            id: selectedDev.id,
            initialX: e.clientX,
            initialY: e.clientY,
            deviceInitialRotation: selectedDev.rotation,
          });
          return;
        }
      }

      const hitDev = getDeviceAt(worldPos);
      if (hitDev) {
        selectDevice(hitDev.id);
        setDragState({
          type: 'device',
          id: hitDev.id,
          initialX: e.clientX,
          initialY: e.clientY,
          deviceInitialX: hitDev.x,
          deviceInitialY: hitDev.y,
        });
      } else {
        // Clear selection or start panning canvas
        clearSelection();
        setDragState({
          type: 'pan',
          initialX: e.clientX,
          initialY: e.clientY,
        });
      }
    }
  };

  // Mouse Move handler
  const handleMouseMove = (e: React.MouseEvent) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);
    const snapped = snapToGrid(worldPos, gridSize, isSnapGrid);
    setHoveredPoint(snapped);

    if (!dragState) {
      if (calibrationDraft) {
        setCalibrationDraft({ ...calibrationDraft, p2: snapped });
      }
      return;
    }

    if (dragState.type === 'pan') {
      const dx = e.clientX - dragState.initialX;
      const dy = e.clientY - dragState.initialY;
      setPan({ x: pan.x + dx, y: pan.y + dy });
      setDragState({ ...dragState, initialX: e.clientX, initialY: e.clientY });
    } else if (dragState.type === 'device' && dragState.id) {
      const dx = (e.clientX - dragState.initialX) / zoom;
      const dy = (e.clientY - dragState.initialY) / zoom;
      const newX = (dragState.deviceInitialX || 0) + dx;
      const newY = (dragState.deviceInitialY || 0) + dy;
      const finalPos = snapToGrid({ x: newX, y: newY }, gridSize, isSnapGrid);
      updateDevice(dragState.id, { x: finalPos.x, y: finalPos.y });
    } else if (dragState.type === 'rotate' && dragState.id) {
      const dev = project.devices.find(d => d.id === dragState.id);
      if (dev) {
        const angle = Math.round(getAngleDegrees({ x: dev.x, y: dev.y }, worldPos));
        updateDevice(dragState.id, { rotation: angle });
      }
    }
  };

  // Mouse Up handler
  const handleMouseUp = (e: React.MouseEvent) => {
    if (calibrationDraft) {
      const p1 = calibrationDraft.p1;
      const p2 = calibrationDraft.p2;
      const distPx = getDistance(p1, p2);
      if (distPx > 20) {
        // Open calibration modal
        useSurveyStore.getState().setScale({
          ...project.scale,
          calibrationLine: { p1, p2 },
        });
        setActiveModal('calibrate');
      }
      setCalibrationDraft(null);
      setActiveTool('select');
    }
    setDragState(null);
  };

  // Drag & Drop from Device Palette
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dataStr = e.dataTransfer.getData('application/json');
    if (!dataStr) return;

    try {
      const template: DeviceTemplate = JSON.parse(dataStr);
      const worldPos = screenToWorld(e.clientX, e.clientY);
      const snapped = snapToGrid(worldPos, gridSize, isSnapGrid);

      addDevice({
        systemType: template.systemType,
        deviceType: template.deviceType,
        name: `${template.label.split(' ')[0]}-${Math.floor(100 + Math.random() * 900)}`,
        x: snapped.x,
        y: snapped.y,
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
    } catch (err) {
      console.error('Failed to drop device:', err);
    }
  };

  // Context Menu handler on right click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeDrawingPoints.length > 0) {
      setActiveDrawingPoints([]);
      setActiveTool('select');
      return;
    }

    const worldPos = screenToWorld(e.clientX, e.clientY);
    const hitDev = getDeviceAt(worldPos);

    if (hitDev) {
      selectDevice(hitDev.id);
      const rect = containerRef.current?.getBoundingClientRect();
      const x = e.clientX - (rect?.left || 0);
      const y = e.clientY - (rect?.top || 0);
      setContextMenu({
        x,
        y,
        deviceId: hitDev.id,
      });
    } else {
      setContextMenu(null);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex-1 h-full w-full overflow-hidden bg-slate-950 cursor-crosshair select-none"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => {
        if (contextMenu) setContextMenu(null);
      }}
    >
      <canvas
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseDown={(e) => {
          if (contextMenu) setContextMenu(null);
          handleMouseDown(e);
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
        className="block w-full h-full"
      />

      {/* Floating Right-Click Context Menu */}
      {contextMenu && (
        <div
          style={{ left: `${Math.min(contextMenu.x, (containerRef.current?.clientWidth || 800) - 180)}px`, top: `${Math.min(contextMenu.y, (containerRef.current?.clientHeight || 600) - 180)}px` }}
          className="absolute z-50 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-1.5 min-w-[170px] space-y-1 text-xs select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {(() => {
            const dev = project.devices.find((d) => d.id === contextMenu.deviceId);
            if (!dev) return null;
            return (
              <>
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 border-b border-slate-800 uppercase tracking-wider truncate flex items-center justify-between">
                  <span className="truncate">{dev.name}</span>
                  <span className="w-2 h-2 rounded-full inline-block ml-1" style={{ backgroundColor: dev.color || '#3b82f6' }} />
                </div>

                <button
                  onClick={() => {
                    deleteDevice(dev.id);
                    setContextMenu(null);
                  }}
                  className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-600 font-medium transition text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Device</span>
                </button>

                <button
                  onClick={() => {
                    duplicateDevice(dev.id);
                    setContextMenu(null);
                  }}
                  className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition text-left"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Duplicate</span>
                </button>

                <button
                  onClick={() => {
                    updateDevice(dev.id, { rotation: (dev.rotation + 90) % 360 });
                    setContextMenu(null);
                  }}
                  className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition text-left"
                >
                  <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Rotate 90°</span>
                </button>

                <div className="h-[1px] bg-slate-800 my-0.5" />

                <button
                  onClick={() => setContextMenu(null)}
                  className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition text-[11px] text-left"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close Menu</span>
                </button>
              </>
            );
          })()}
        </div>
      )}

      {/* Device Placement Active Guide Prompt */}
      {activeTool === 'device' && pendingPlacementTemplate && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-indigo-600/95 text-white px-5 py-2 rounded-full text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center space-x-3 border border-indigo-400/40 animate-pulse">
          <span>🎯 Click anywhere on your floorplan to place {pendingPlacementTemplate.label}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPendingPlacement(null);
            }}
            className="bg-indigo-900/80 hover:bg-rose-600 px-2 py-0.5 rounded text-[11px] transition text-white"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Calibration active guide prompt */}
      {activeTool === 'calibrate' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-rose-600/90 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur flex items-center space-x-2">
          <span>Click and drag a line across a known doorway or scale bar to calibrate</span>
        </div>
      )}

      {/* Cabling active guide prompt */}
      {activeTool === 'cable' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-sky-600/90 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur flex items-center space-x-2">
          <span>Click to place cable points &bull; Click device to attach &bull; Double-click to finish</span>
        </div>
      )}
    </div>
  );
};
