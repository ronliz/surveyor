/**
 * canvasIcons.ts
 * Draws System Surveyor-style icons directly onto an HTML5 Canvas 2D context.
 * Each icon is a pure Path2D drawing at origin (0,0); the caller transforms ctx.
 */

type Ctx = CanvasRenderingContext2D;

function fillAndStroke(ctx: Ctx, fillColor: string, strokeColor = '#ffffff', lineWidth = 1.5) {
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

// ─── Base shapes ────────────────────────────────────────────────────────────

function drawCircleBase(ctx: Ctx, r: number, fill: string) {
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  fillAndStroke(ctx, fill, '#ffffff', 2);
}

function drawSquareBase(ctx: Ctx, r: number, fill: string) {
  ctx.beginPath();
  ctx.roundRect(-r, -r, r * 2, r * 2, 3);
  fillAndStroke(ctx, fill, '#ffffff', 2);
}

function drawDiamondBase(ctx: Ctx, r: number, fill: string) {
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(r, 0);
  ctx.lineTo(0, r);
  ctx.lineTo(-r, 0);
  ctx.closePath();
  fillAndStroke(ctx, fill, '#ffffff', 2);
}

// ─── VIDEO SURVEILLANCE ──────────────────────────────────────────────────────

/** Dome camera: circle with inner lens ring */
function drawDomeCam(ctx: Ctx, fill: string) {
  drawCircleBase(ctx, 12, fill);
  // outer ring
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.strokeStyle = '#ffffffaa';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // lens
  ctx.beginPath();
  ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
}

/** Bullet / varifocal camera: rectangle body with lens dot */
function drawBulletCam(ctx: Ctx, fill: string) {
  drawCircleBase(ctx, 12, fill);
  // Body rect
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.roundRect(-7, -4, 10, 8, 2);
  ctx.fill();
  // Lens circle
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(5, 0, 3.5, 0, Math.PI * 2);
  ctx.fill();
  // Lens glint
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(5, -1.5, 1.2, 0, Math.PI * 2);
  ctx.fill();
}

/** PTZ: circle with four nub arrows */
function drawPtzCam(ctx: Ctx, fill: string) {
  drawCircleBase(ctx, 12, fill);
  // Outer ring
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 1;
  ctx.stroke();
  // Center lens
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
  ctx.fill();
  // Four tick marks
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  [0, 90, 180, 270].forEach(deg => {
    const r = deg * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(Math.cos(r) * 5, Math.sin(r) * 5);
    ctx.lineTo(Math.cos(r) * 7.5, Math.sin(r) * 7.5);
    ctx.stroke();
  });
}

/** 180° panoramic: half-circle lens */
function drawPanoramicCam(ctx: Ctx, fill: string) {
  drawCircleBase(ctx, 12, fill);
  // Flat-top dome shape inside
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.arc(0, 2, 7, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  // Lens dot
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(0, 2, 3, 0, Math.PI * 2);
  ctx.fill();
}

/** Fisheye 360°: concentric circles */
function drawFisheyeCam(ctx: Ctx, fill: string) {
  drawCircleBase(ctx, 12, fill);
  [7, 4.5, 2.5].forEach((r, i) => {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.strokeStyle = i === 0 ? 'rgba(255,255,255,0.7)' : '#ffffff';
    ctx.lineWidth = i === 2 ? 0 : 1;
    if (i === 2) { ctx.fillStyle = '#ffffff'; ctx.fill(); }
    else ctx.stroke();
  });
}

/** Multi-sensor: 4 lens dots in a 2x2 grid */
function drawMultiSensor(ctx: Ctx, fill: string) {
  drawSquareBase(ctx, 11, fill);
  [[-4, -4], [4, -4], [-4, 4], [4, 4]].forEach(([x, y]) => {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ─── ACCESS CONTROL ──────────────────────────────────────────────────────────

/** Card reader: tall rounded rect with antenna waves */
function drawCardReader(ctx: Ctx, fill: string) {
  drawSquareBase(ctx, 11, fill);
  // Keycard slot
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 1, 4.5, 0.5, Math.PI - 0.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 1, 6.5, 0.5, Math.PI - 0.5);
  ctx.stroke();
  // Icon dot (NFC symbol)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 5.5, 1.5, 0, Math.PI * 2);
  ctx.fill();
}

/** Keypad reader: square body with 9 dot grid */
function drawKeypadReader(ctx: Ctx, fill: string) {
  drawSquareBase(ctx, 11, fill);
  // 3x3 grid of dots
  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(col * 3.5, row * 3.5, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/** Maglock: horizontal bar representing magnet body */
function drawMaglock(ctx: Ctx, fill: string) {
  // Background circle
  drawCircleBase(ctx, 12, fill);
  // Maglock U-shape
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-6, 3);
  ctx.lineTo(-6, -2);
  ctx.arc(-3, -2, 3, Math.PI, 0);
  ctx.lineTo(0, 3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 3);
  ctx.lineTo(0, -2);
  ctx.arc(3, -2, 3, Math.PI, 0);
  ctx.lineTo(6, 3);
  ctx.stroke();
}

/** REX (Request to Exit) sensor: motion fan with person silhouette */
function drawRex(ctx: Ctx, fill: string) {
  drawDiamondBase(ctx, 11, fill);
  // Motion arcs
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  [5, 7.5].forEach(r => {
    ctx.beginPath();
    ctx.arc(0, 0, r, -Math.PI * 0.7, -Math.PI * 0.3);
    ctx.stroke();
  });
  // Person dot
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, -1, 2, 0, Math.PI * 2);
  ctx.fill();
}

/** Electric strike */
function drawStrike(ctx: Ctx, fill: string) {
  drawSquareBase(ctx, 11, fill);
  // Lightning bolt
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(2, -8);
  ctx.lineTo(-2, -1);
  ctx.lineTo(1, -1);
  ctx.lineTo(-2, 8);
  ctx.lineTo(2, 1);
  ctx.lineTo(-1, 1);
  ctx.closePath();
  ctx.fill();
}

/** Access controller / panel */
function drawController(ctx: Ctx, fill: string) {
  drawSquareBase(ctx, 11, fill);
  // 4 small LED dots on left, bar on right
  for (let i = -1.5; i <= 1.5; i += 1) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-5, i * 3, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-1, -7, 8, 14);
}

// ─── INTRUSION DETECTION ─────────────────────────────────────────────────────

/** PIR motion detector: triangle with fan */
function drawPir(ctx: Ctx, fill: string) {
  // Triangle base
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(11, 10);
  ctx.lineTo(-11, 10);
  ctx.closePath();
  fillAndStroke(ctx, fill, '#ffffff', 2);
  // Fan arcs inside
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.2;
  [4, 7].forEach(r => {
    ctx.beginPath();
    ctx.arc(0, 6, r, -Math.PI * 0.8, -Math.PI * 0.2);
    ctx.stroke();
  });
  // Lens
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 6, 2, 0, Math.PI * 2);
  ctx.fill();
}

/** DPS / Door Position Sensor: two rect halves with gap */
function drawDps(ctx: Ctx, fill: string) {
  drawCircleBase(ctx, 12, fill);
  // Door frame left
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(-9, -6, 4, 12, 1.5);
  ctx.fill();
  // Door leaf right (slightly open)
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath();
  ctx.roundRect(2, -6, 4, 12, 1.5);
  ctx.fill();
  // Gap magnet dot
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(-3, 0, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(3, 0, 1.5, 0, Math.PI * 2);
  ctx.fill();
}

/** Glass break sensor: circle with crack lines */
function drawGlassBreak(ctx: Ctx, fill: string) {
  drawCircleBase(ctx, 12, fill);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-8, -2);
  ctx.lineTo(0, 3);
  ctx.lineTo(5, -5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 3);
  ctx.lineTo(-3, 9);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 3);
  ctx.lineTo(7, 8);
  ctx.stroke();
}

/** Panic / duress button: square with big button circle */
function drawPanicButton(ctx: Ctx, fill: string) {
  drawSquareBase(ctx, 11, '#dc2626');
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
  ctx.fill();
}

/** Siren / Strobe */
function drawSiren(ctx: Ctx, fill: string) {
  drawCircleBase(ctx, 12, fill);
  // Bell shape
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, -1, 6, Math.PI, 0);
  ctx.lineTo(6, 5);
  ctx.lineTo(-6, 5);
  ctx.closePath();
  ctx.fill();
  // Bell clapper
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(0, 5, 1.5, 0, Math.PI * 2);
  ctx.fill();
  // Radiate lines
  ctx.strokeStyle = '#ffffffaa';
  ctx.lineWidth = 1;
  [-9, 9].forEach(x => {
    ctx.beginPath();
    ctx.moveTo(x, -3);
    ctx.lineTo(x * 1.4, -7);
    ctx.stroke();
  });
}

// ─── FIRE & LIFE SAFETY ──────────────────────────────────────────────────────

/** Smoke detector: circle with "S" */
function drawSmokeDetector(ctx: Ctx, fill: string) {
  drawCircleBase(ctx, 12, fill);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('S', 0, 1);
}

/** Manual pull station: tall rect with handle bar */
function drawPullStation(ctx: Ctx, fill: string) {
  drawSquareBase(ctx, 11, fill);
  // Handle bar
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(-7, -2, 14, 6, 2);
  ctx.fill();
  // Down arrow
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(0, -1);
  ctx.lineTo(-3, 3);
  ctx.lineTo(3, 3);
  ctx.closePath();
  ctx.fill();
}

/** Horn/Strobe combination */
function drawHornStrobe(ctx: Ctx, fill: string) {
  drawSquareBase(ctx, 11, fill);
  // Left half: lightning bolt (strobe)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(-1, -7);
  ctx.lineTo(-5, 0);
  ctx.lineTo(-2, 0);
  ctx.lineTo(-4, 7);
  ctx.lineTo(0, 1);
  ctx.lineTo(-2, 1);
  ctx.closePath();
  ctx.fill();
  // Right half: horn shape
  ctx.beginPath();
  ctx.moveTo(2, -5);
  ctx.lineTo(8, -3);
  ctx.lineTo(8, 3);
  ctx.lineTo(2, 5);
  ctx.closePath();
  ctx.fill();
}

// ─── NETWORKING & IT ─────────────────────────────────────────────────────────

/** Wi-Fi AP: circle with wifi arcs */
function drawWifiAp(ctx: Ctx, fill: string) {
  drawCircleBase(ctx, 12, fill);
  ctx.strokeStyle = '#ffffff';
  [4, 6.5, 9].forEach(r => {
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 2, r, -Math.PI * 0.75, -Math.PI * 0.25);
    ctx.stroke();
  });
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 2, 1.5, 0, Math.PI * 2);
  ctx.fill();
}

/** Data drop / network jack */
function drawDataDrop(ctx: Ctx, fill: string) {
  drawSquareBase(ctx, 11, fill);
  // RJ45 jack outline
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(-6, -5, 12, 10, 2);
  ctx.fill();
  // 4 pin slots
  ctx.fillStyle = fill;
  [-4, -1.5, 1.5, 4].forEach(x => {
    ctx.fillRect(x - 0.8, -2.5, 1.6, 5);
  });
}

/** Server rack: tall rect with horizontal shelves */
function drawServerRack(ctx: Ctx, fill: string) {
  drawSquareBase(ctx, 11, fill);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  [-4, 0, 4].forEach(y => {
    ctx.beginPath();
    ctx.moveTo(-8, y);
    ctx.lineTo(8, y);
    ctx.stroke();
  });
  // LED dot
  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.arc(5, -7, 1.5, 0, Math.PI * 2);
  ctx.fill();
}

// ─── AUDIO / AV ──────────────────────────────────────────────────────────────

/** Speaker / IP paging */
function drawSpeaker(ctx: Ctx, fill: string) {
  drawCircleBase(ctx, 12, fill);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  // Two arcs
  [5, 8].forEach(r => {
    ctx.beginPath();
    ctx.arc(0, 0, r, -0.9, 0.9);
    ctx.stroke();
  });
  // Cone body
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(-4, -2);
  ctx.lineTo(0, -4);
  ctx.lineTo(0, 4);
  ctx.lineTo(-4, 2);
  ctx.closePath();
  ctx.fill();
}

/** Video intercom: rounded rect with camera + mic dot */
function drawIntercom(ctx: Ctx, fill: string) {
  drawSquareBase(ctx, 11, fill);
  // Camera lens
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, -3, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(0, -3, 2, 0, Math.PI * 2);
  ctx.fill();
  // Mic dots
  ctx.fillStyle = '#ffffff';
  [-3, 0, 3].forEach(x => {
    ctx.beginPath();
    ctx.arc(x, 5, 1.2, 0, Math.PI * 2);
    ctx.fill();
  });
}

/** Viewing station / NVR monitor */
function drawViewingStation(ctx: Ctx, fill: string) {
  drawSquareBase(ctx, 11, fill);
  // Screen
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.roundRect(-7, -7, 14, 10, 1.5);
  ctx.fill();
  // Stand
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-2, 3, 4, 3);
  ctx.fillRect(-4, 6, 8, 2);
}

// ─── ENVIRONMENTAL ───────────────────────────────────────────────────────────

/** Vape / Air quality sensor: circle with wave lines */
function drawVapeSensor(ctx: Ctx, fill: string) {
  drawCircleBase(ctx, 12, fill);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  [-4, 0, 4].forEach((x, i) => {
    ctx.beginPath();
    const startY = 5 - i;
    ctx.moveTo(x, startY);
    ctx.bezierCurveTo(x - 2, startY - 4, x + 2, startY - 7, x, startY - 10);
    ctx.stroke();
  });
}

// ─── MASTER DISPATCH ─────────────────────────────────────────────────────────

/**
 * Draws a device-type-specific icon.
 * The ctx must be translated to (dev.x, dev.y) before calling.
 * The icon is drawn at origin and will fill approximately a 24×24 bounding box.
 */
export function drawDeviceIcon(ctx: Ctx, deviceType: string, fill: string) {
  ctx.save();
  const dt = deviceType.toLowerCase();

  if (dt.includes('cd62') || dt.includes('cd52') || dt.includes('cd72') || dt === 'cctv_dome') {
    drawDomeCam(ctx, fill);
  } else if (dt.includes('cb') || dt.includes('bullet') || dt === 'cctv_bullet') {
    drawBulletCam(ctx, fill);
  } else if (dt.includes('cp') || dt.includes('ptz') || dt === 'cctv_ptz') {
    drawPtzCam(ctx, fill);
  } else if (dt.includes('cf') || dt.includes('fisheye') || dt === 'cctv_fisheye') {
    drawFisheyeCam(ctx, fill);
  } else if (dt.includes('panoram') || dt.includes('180')) {
    drawPanoramicCam(ctx, fill);
  } else if (dt.includes('multi') || dt.includes('cm')) {
    drawMultiSensor(ctx, fill);

  } else if (dt.includes('ad32') || dt.includes('reader') || dt === 'access_reader') {
    drawCardReader(ctx, fill);
  } else if (dt.includes('ad33') || dt.includes('keypad')) {
    drawKeypadReader(ctx, fill);
  } else if (dt.includes('maglock') || dt === 'access_maglock') {
    drawMaglock(ctx, fill);
  } else if (dt.includes('rex') || dt === 'access_rex') {
    drawRex(ctx, fill);
  } else if (dt.includes('strike') || dt === 'access_strike') {
    drawStrike(ctx, fill);
  } else if (dt.includes('ac4') || dt.includes('ac6') || dt.includes('controller') || dt.includes('panel') || dt === 'access_panel') {
    drawController(ctx, fill);

  } else if (dt.includes('br31') || dt.includes('pir') || dt.includes('motion')) {
    drawPir(ctx, fill);
  } else if (dt.includes('br33') || dt.includes('dps') || dt.includes('door_contact') || dt.includes('contact')) {
    drawDps(ctx, fill);
  } else if (dt.includes('glass')) {
    drawGlassBreak(ctx, fill);
  } else if (dt.includes('bh61') || dt.includes('panic')) {
    drawPanicButton(ctx, fill);
  } else if (dt.includes('bx21') || dt.includes('siren')) {
    drawSiren(ctx, fill);

  } else if (dt.includes('smoke') || dt === 'fire_smoke') {
    drawSmokeDetector(ctx, fill);
  } else if (dt.includes('pull') || dt === 'fire_pull') {
    drawPullStation(ctx, fill);
  } else if (dt.includes('horn') || dt === 'fire_horn') {
    drawHornStrobe(ctx, fill);

  } else if (dt.includes('net_ap') || dt.includes('wifi') || dt.includes('ap')) {
    drawWifiAp(ctx, fill);
  } else if (dt.includes('net_drop') || dt.includes('data')) {
    drawDataDrop(ctx, fill);
  } else if (dt.includes('rack') || dt.includes('server')) {
    drawServerRack(ctx, fill);

  } else if (dt.includes('td52') || dt.includes('intercom')) {
    drawIntercom(ctx, fill);
  } else if (dt.includes('tv53') || dt.includes('viewing')) {
    drawViewingStation(ctx, fill);
  } else if (dt.includes('av_speaker') || dt.includes('speaker')) {
    drawSpeaker(ctx, fill);

  } else if (dt.includes('sv23') || dt.includes('vape') || dt.includes('air') || dt.includes('env')) {
    drawVapeSensor(ctx, fill);

  } else {
    // Fallback: generic circle with arrow
    drawCircleBase(ctx, 12, fill);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(7, 0);
    ctx.lineTo(1, -4);
    ctx.lineTo(1, 4);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}
