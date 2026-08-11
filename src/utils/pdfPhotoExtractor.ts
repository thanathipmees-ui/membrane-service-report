import * as pdfjsLib from 'pdfjs-dist';

// Set worker source URL
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

export interface PagePhotos {
  pageNumber: number;
  beforeImage: string; // base64 data url
  afterImage: string;  // base64 data url
  fullPageImage?: string;
}

export interface PdfExtractedPage {
  pageNumber: number;
  text: string;
}

/**
 * Extracts raw text from each page of a PDF file using pdfjs-dist
 */
export async function extractTextFromPdf(file: File): Promise<PdfExtractedPage[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;

    const pagesText: PdfExtractedPage[] = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const textItems = textContent.items.map((item: any) => item.str).join(' ');
      pagesText.push({
        pageNumber: i,
        text: textItems
      });
    }

    return pagesText;
  } catch (err) {
    console.warn('PDF text extraction warning:', err);
    return [];
  }
}

/**
 * Renders each page of a PDF file to a canvas and crops the Before & After picture regions
 */
export async function extractPhotosFromPdf(file: File): Promise<PagePhotos[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;

    const pagePhotosList: PagePhotos[] = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 }); // High-res rendering

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: ctx,
        viewport,
        canvas
      }).promise;

      // Calculate bounding boxes for "Picture Before" and "Picture After"
      // Based on standard SGW RO Membrane Report template
      const width = canvas.width;
      const height = canvas.height;

      // Picture section horizontal boundaries: x=36% to 86% of page width
      const cropX = Math.round(width * 0.355);
      const cropW = Math.round(width * 0.510);

      // Picture Before vertical boundaries: y=19.5% to 31.5% of page height
      const cropY_before = Math.round(height * 0.198);
      const cropH_before = Math.round(height * 0.118);

      // Picture After vertical boundaries: y=31.5% to 43.5% of page height
      const cropY_after = Math.round(height * 0.316);
      const cropH_after = Math.round(height * 0.118);

      // Crop Before photo strip
      const beforeCanvas = document.createElement('canvas');
      beforeCanvas.width = cropW;
      beforeCanvas.height = cropH_before;
      const beforeCtx = beforeCanvas.getContext('2d');
      if (beforeCtx) {
        beforeCtx.drawImage(canvas, cropX, cropY_before, cropW, cropH_before, 0, 0, cropW, cropH_before);
      }
      const beforeDataUrl = beforeCanvas.toDataURL('image/jpeg', 0.85);

      // Crop After photo strip
      const afterCanvas = document.createElement('canvas');
      afterCanvas.width = cropW;
      afterCanvas.height = cropH_after;
      const afterCtx = afterCanvas.getContext('2d');
      if (afterCtx) {
        afterCtx.drawImage(canvas, cropX, cropY_after, cropW, cropH_after, 0, 0, cropW, cropH_after);
      }
      const afterDataUrl = afterCanvas.toDataURL('image/jpeg', 0.85);

      pagePhotosList.push({
        pageNumber: i,
        beforeImage: beforeDataUrl,
        afterImage: afterDataUrl
      });
    }

    return pagePhotosList;
  } catch (err) {
    console.warn('PDF photo extraction warning:', err);
    return [];
  }
}
