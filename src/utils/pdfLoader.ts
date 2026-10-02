// PDF.js loader and renderer for architectural blueprint PDFs

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

/**
 * Ensures PDF.js library is loaded in the browser
 */
export async function loadPdfJs(): Promise<any> {
  if (window.pdfjsLib) {
    return window.pdfjsLib;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      } else {
        reject(new Error('PDF.js failed to initialize on window.'));
      }
    };
    script.onerror = (err) => reject(new Error(`Failed to load PDF.js script: ${err}`));
    document.head.appendChild(script);
  });
}

export interface PdfPageInfo {
  pageNumber: number;
  thumbnailUrl: string;
  width: number;
  height: number;
}

/**
 * Loads a PDF file and extracts thumbnail previews for all pages
 */
export async function extractPdfPages(file: File): Promise<{
  pdfDoc: any;
  pages: PdfPageInfo[];
}> {
  const pdfjs = await loadPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdfDoc.numPages;

  const pages: PdfPageInfo[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 0.35 }); // thumbnail scale

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (ctx) {
      await page.render({
        canvasContext: ctx,
        viewport: viewport,
      }).promise;

      pages.push({
        pageNumber: i,
        thumbnailUrl: canvas.toDataURL('image/jpeg', 0.8),
        width: viewport.width / 0.35,
        height: viewport.height / 0.35,
      });
    }
  }

  return { pdfDoc, pages };
}

/**
 * Renders a specific PDF page at high resolution for blueprint markup
 */
export async function renderPdfPageToDataUrl(
  pdfDoc: any, 
  pageNumber: number, 
  renderScale: number = 2.0
): Promise<{ dataUrl: string; width: number; height: number }> {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale: renderScale });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  if (!ctx) {
    throw new Error('Could not create canvas 2D context for PDF rendering.');
  }

  // Draw white background before PDF rendering
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvasContext: ctx,
    viewport: viewport,
  }).promise;

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width: viewport.width,
    height: viewport.height,
  };
}
