import React, { useState } from 'react';
import { Ruler, Check, X } from 'lucide-react';
import { useSurveyStore } from '../../store/useSurveyStore';
import { getDistance } from '../../utils/geometry';

export const CalibrationModal: React.FC = () => {
  const { project, setScale, setActiveModal } = useSurveyStore();
  const [distance, setDistance] = useState<string>('10');
  const [unit, setUnit] = useState<'ft' | 'm'>(project.scale.unit || 'ft');

  const line = project.scale.calibrationLine;
  const pixelLength = line ? getDistance(line.p1, line.p2) : 100;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const numDist = parseFloat(distance);
    if (isNaN(numDist) || numDist <= 0) return;

    const pixelsPerUnit = pixelLength / numDist;

    setScale({
      pixelsPerUnit,
      unit,
      isCalibrated: true,
      referenceDistance: numDist,
      calibrationLine: line,
    });

    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Ruler className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Set Floorplan Scale
            </h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleApply} className="space-y-4">
          <div className="text-xs text-slate-300">
            Measured line on screen: <span className="font-mono text-sky-400 font-bold">{Math.round(pixelLength)} pixels</span>.
            Enter the actual real-world length of this reference distance:
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Real-World Length
              </label>
              <input
                type="number"
                step="any"
                min="0.1"
                required
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                placeholder="e.g. 10 or 3"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Measurement Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'ft' | 'm')}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              >
                <option value="ft">Feet (ft)</option>
                <option value="m">Meters (m)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">Calculated Calibration:</div>
            <div>
              1 {unit} = {((parseFloat(distance) > 0 ? pixelLength / parseFloat(distance) : 0)).toFixed(2)} pixels
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow"
            >
              <Check className="w-4 h-4" />
              <span>Apply Scale</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
