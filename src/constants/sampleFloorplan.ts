// Generates a crisp vector floorplan SVG as a Data URL for instant testing
export function generateSampleBlueprintSvg(): string {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="0.75" />
      </pattern>
    </defs>
    
    <!-- Background -->
    <rect width="100%" height="100%" fill="#090d16" />
    <rect width="100%" height="100%" fill="url(#grid)" />
    
    <!-- Outer perimeter wall (1500 x 900) -->
    <rect x="50" y="50" width="1500" height="900" fill="#0f172a" stroke="#475569" stroke-width="8" rx="4" />
    
    <!-- Main Entrance / Vestibule -->
    <rect x="50" y="420" width="220" height="180" fill="#131e32" stroke="#64748b" stroke-width="4" />
    <text x="160" y="515" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">MAIN ENTRANCE / LOBBY</text>
    <line x1="50" y1="470" x2="50" y2="550" stroke="#38bdf8" stroke-width="6" /> <!-- Glass Entry Door -->
    <line x1="270" y1="470" x2="270" y2="550" stroke="#38bdf8" stroke-width="4" /> <!-- Interior lobby door -->
    
    <!-- Reception Area -->
    <rect x="270" y="320" width="300" height="380" fill="#111c2e" stroke="#334155" stroke-width="3" />
    <path d="M 330 450 Q 420 420 510 450 L 510 480 Q 420 450 330 480 Z" fill="#1e293b" stroke="#64748b" stroke-width="2" />
    <text x="420" y="530" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">RECEPTION DESK</text>
    
    <!-- MDF / Server Room (Critical Security Zone) -->
    <rect x="50" y="50" width="340" height="280" fill="#181825" stroke="#ef4444" stroke-width="4" stroke-dasharray="8 4" />
    <text x="220" y="180" fill="#fca5a5" font-family="system-ui, sans-serif" font-size="15" font-weight="700" text-anchor="middle">MDF / SERVER ROOM</text>
    <rect x="80" y="80" width="80" height="100" fill="#1e293b" stroke="#94a3b8" stroke-width="2" />
    <rect x="180" y="80" width="80" height="100" fill="#1e293b" stroke="#94a3b8" stroke-width="2" />
    <rect x="280" y="80" width="80" height="100" fill="#1e293b" stroke="#94a3b8" stroke-width="2" />
    <text x="230" y="210" fill="#64748b" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle">(Access Controlled - High Security)</text>

    <!-- Executive Boardroom -->
    <rect x="390" y="50" width="480" height="270" fill="#131d2f" stroke="#475569" stroke-width="4" />
    <ellipse cx="630" cy="185" rx="160" ry="60" fill="#1e293b" stroke="#64748b" stroke-width="2" />
    <text x="630" y="190" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">EXECUTIVE BOARDROOM</text>
    
    <!-- Open Office Bullpen (North-East) -->
    <rect x="870" y="50" width="680" height="420" fill="#111827" stroke="#475569" stroke-width="4" />
    <text x="1210" y="250" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="16" font-weight="600" text-anchor="middle">OPEN OFFICE WORKSPACE</text>
    <!-- Desk pods -->
    <g stroke="#334155" fill="#1e293b" stroke-width="1.5">
      <rect x="920" y="90" width="120" height="140" rx="4" />
      <rect x="1080" y="90" width="120" height="140" rx="4" />
      <rect x="1240" y="90" width="120" height="140" rx="4" />
      <rect x="1400" y="90" width="120" height="140" rx="4" />
      
      <rect x="920" y="270" width="120" height="140" rx="4" />
      <rect x="1080" y="270" width="120" height="140" rx="4" />
      <rect x="1240" y="270" width="120" height="140" rx="4" />
      <rect x="1400" y="270" width="120" height="140" rx="4" />
    </g>
    
    <!-- Breakroom / Kitchen (South-East) -->
    <rect x="1100" y="580" width="450" height="370" fill="#131e30" stroke="#475569" stroke-width="4" />
    <text x="1325" y="770" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="15" font-weight="600" text-anchor="middle">CAFETERIA / BREAKROOM</text>
    <rect x="1130" y="600" width="390" height="40" fill="#1e293b" stroke="#475569" stroke-width="1" />
    
    <!-- Huddle Rooms / Private Offices (South) -->
    <rect x="50" y="680" width="240" height="270" fill="#101a2b" stroke="#475569" stroke-width="3" />
    <text x="170" y="820" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle">OFFICE 101</text>
    
    <rect x="290" y="680" width="240" height="270" fill="#101a2b" stroke="#475569" stroke-width="3" />
    <text x="410" y="820" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle">OFFICE 102</text>

    <rect x="530" y="680" width="280" height="270" fill="#101a2b" stroke="#475569" stroke-width="3" />
    <text x="670" y="820" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle">CONFERENCE B</text>

    <rect x="810" y="680" width="290" height="270" fill="#101a2b" stroke="#475569" stroke-width="3" />
    <text x="955" y="820" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle">IDF CLOSET & STORAGE</text>

    <!-- Emergency Exit East -->
    <line x1="1550" y1="460" x2="1550" y2="540" stroke="#ef4444" stroke-width="6" />
    <text x="1500" y="505" fill="#ef4444" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="end">EMERGENCY EXIT</text>

    <!-- Center Hallway / Corridors -->
    <text x="750" y="515" fill="#475569" font-family="system-ui, sans-serif" font-size="18" font-weight="700" letter-spacing="4" text-anchor="middle">MAIN CORRIDOR</text>

    <!-- Calibration Reference Dimension (100 ft scale bar) -->
    <g transform="translate(100, 960)">
      <line x1="0" y1="0" x2="200" y2="0" stroke="#38bdf8" stroke-width="3" />
      <line x1="0" y1="-8" x2="0" y2="8" stroke="#38bdf8" stroke-width="3" />
      <line x1="200" y1="-8" x2="200" y2="8" stroke="#38bdf8" stroke-width="3" />
      <text x="100" y="-12" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">SCALE BAR: 20 FT (200 px = 20 ft)</text>
    </g>
  </svg>
  `;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.trim());
}
