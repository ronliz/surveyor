import { Point, ScaleCalibration } from '../types/survey';

/**
 * Calculates Euclidean distance between two points
 */
export function getDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Calculates angle in degrees from p1 to p2 (0 is pointing right / east)
 */
export function getAngleDegrees(p1: Point, p2: Point): number {
  const radians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  let degrees = radians * (180 / Math.PI);
  if (degrees < 0) degrees += 360;
  return degrees;
}

/**
 * Converts degrees to radians
 */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Converts distance in feet to pixels according to the scale calibration
 */
export function feetToPixels(feet: number, scale: ScaleCalibration): number {
  return feet * scale.pixelsPerUnit;
}

/**
 * Converts distance in pixels to feet (or meters)
 */
export function pixelsToFeet(pixels: number, scale: ScaleCalibration): number {
  if (!scale.pixelsPerUnit || scale.pixelsPerUnit <= 0) return 0;
  return pixels / scale.pixelsPerUnit;
}

/**
 * Calculates the total length of a polyline in feet
 */
export function getPolylineLengthFt(points: Point[], scale: ScaleCalibration): number {
  if (points.length < 2) return 0;
  let totalPixels = 0;
  for (let i = 0; i < points.length - 1; i++) {
    totalPixels += getDistance(points[i], points[i + 1]);
  }
  return pixelsToFeet(totalPixels, scale);
}

/**
 * Calculates DORI (Detect, Observe, Recognize, Identify) zone boundaries
 * Based on EN 62676-4 video surveillance standard:
 * - Identification (250 px/m -> ~76 px/ft) - 15% of max distance
 * - Recognition (125 px/m -> ~38 px/ft) - 30% of max distance
 * - Observation (62.5 px/m -> ~19 px/ft) - 60% of max distance
 * - Detection (25 px/m -> ~8 px/ft) - 100% of max distance
 */
export interface DoriZoneRadii {
  identify: number;
  recognize: number;
  observe: number;
  detect: number;
}

export function calculateDoriRadii(maxDistancePx: number): DoriZoneRadii {
  return {
    identify: maxDistancePx * 0.20,
    recognize: maxDistancePx * 0.40,
    observe: maxDistancePx * 0.70,
    detect: maxDistancePx * 1.00,
  };
}

/**
 * Snaps a coordinate point to grid size if snapping is enabled
 */
export function snapToGrid(point: Point, gridSize: number = 20, enabled: boolean = true): Point {
  if (!enabled) return point;
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize,
  };
}
