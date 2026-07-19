export async function convertPdfToImage(file: File): Promise<{ file: File | null }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Dynamically import/load PDF.js from CDN if not already loaded globally
    if (typeof window !== "undefined" && !(window as any).pdfjsLib) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
        script.onload = () => {
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
          resolve();
        };
        script.onerror = () => reject(new Error("Failed to load PDF.js client helper."));
        document.head.appendChild(script);
      });
    }

    const pdfjsLib = (window as any).pdfjsLib;
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    // Get first page of the PDF to make a preview image representation
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });
    
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not get canvas 2D rendering context.");
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const imgFile = new File([blob], `${file.name.replace(/\.pdf$/i, "")}.png`, { type: "image/png" });
          resolve({ file: imgFile });
        } else {
          resolve({ file: null });
        }
      }, "image/png");
    });
  } catch (err) {
    console.error("PDF to Image conversion error:", err);
    return { file: null };
  }
}
