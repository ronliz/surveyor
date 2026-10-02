# System Surveyor Replica - Visual Floorplan & Security System Design

A professional web application replicating the core capabilities of [System Surveyor](https://systemsurveyor.com/) for physical security design, IoT site surveys, cabling infrastructure, dynamic camera Field of View (FoV) cones, and automated Bill of Materials (BOM) reporting.

---

## Key Features

### 1. Interactive Floorplan & Canvas Engine
- **Blueprint Import**: Upload floor plan blueprints in PNG, JPEG, or SVG formats, or use the pre-loaded architectural sample layout.
- **Scale Calibration Tool**: Calibrate real-world scale (feet/meters) by drawing a reference line across a known doorway or dimension.
- **Fluid Navigation**: Infinite canvas with smooth panning (Space + Drag or Hand tool), cursor-centered zoom (mouse wheel), and grid snapping.
- **CAD Markup Tools**: Walls, room zones, measurement dimension tape, and text callouts.

### 2. Physical Security, IoT & IT Device Catalog
- **Video Surveillance (CCTV)**: Fixed Dome, Bullet, PTZ Speed Dome, 360° Fisheye, Multi-Sensor cameras.
  - **Dynamic Field-of-View (FoV) Cones**: Live adjustable viewing angle ($20^\circ - 180^\circ$), reach distance, rotation, and **EN 62676-4 DORI Color Zones** (Detection, Observation, Recognition, Identification).
- **Access Control**: Card / Mobile Readers, Keypads, Maglocks, Electric Strikes, Request to Exit (REX) PIR sensors, Access Control Panels.
- **Intrusion Detection**: PIR Motion Sensors (with detection fans), Glass Break Sensors, Sirens & Strobes, Alarm Panels.
- **Fire & Life Safety**: Addressable Smoke Detectors (NFPA coverage bubbles), Heat Detectors, Manual Pull Stations, Horn Strobes.
- **Networking & IT / AV**: Wi-Fi 6 Access Points (RF coverage radius), RJ45 Network Drops, MDF/IDF Telecom Racks, IP Ceiling Speakers, Video Intercoms.

### 3. Cable Routing Infrastructure
- Connect devices directly to MDF/IDF telecom closets.
- Interactive multi-segment cable path drawing.
- Real-time length calculation (feet and meters) calibrated to floor plan scale.

### 4. Property Inspector
- Real-time editing of device tags (`CAM-101`, `DR-01`), manufacturer, model, mounting height, lens angle, reach distance, installation status (*New*, *Existing*, *Relocate*, *Demolish*), IP address, VLAN, and cost.

### 5. Automated Bill of Materials (BOM) & Reporting
- Real-time aggregation of all hardware items with quantities, part numbers, and manufacturer data.
- Searchable, filterable BOM table with cost estimations.
- One-click export to **CSV** and **PDF Executive Site Survey Report** with floor plan drawing snapshots and itemized schedules.

### 6. Project Management
- Save and load `.survey` JSON project files.
- LocalStorage autosaving.

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev

# 3. Build for production
npm run build
```

Open your browser at `http://localhost:3000` to start surveying!
