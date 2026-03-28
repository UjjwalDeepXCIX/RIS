export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    console.log("[pdf2img] pdfjs already loaded");
    if (loadPromise) return loadPromise;
    isLoading = true;
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        // Set the worker source to use local file
        lib.GlobalWorkerOptions.workerSrc = workerSrc;
        pdfjsLib = lib;
        isLoading = false;
        console.log("[pdf2img] pdfjs loaded successfully");
        return lib;
    }).catch((err) => {
        console.error("[pdf2img] Failed to load pdfjs:", err);
        throw err;});


    return loadPromise;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        console.log("[pdf2img] Starting conversion for:", file.name);

        const lib = await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        console.log("[pdf2img] File converted to arrayBuffer");

        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        console.log("[pdf2img] PDF loaded");

        const page = await pdf.getPage(1);
        console.log("[pdf2img] First page loaded");

        const viewport = page.getViewport({ scale: 4 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";
        }

        await page.render({ canvasContext: context!, viewport }).promise;
        console.log("[pdf2img] Page rendered");

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        console.log("[pdf2img] Blob created successfully");

                        const originalName = file.name.replace(/\.pdf$/i, "");
                        const imageFile = new File([blob], `${originalName}.png`, {
                            type: "image/png",
                        });

                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        console.error("[pdf2img] Blob creation failed");
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });
                    }
                },
                "image/png",
                1.0
            );
        });
    } catch (err) {
        console.error("[pdf2img] Conversion error:", err);
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err}`,
        };
    }
}