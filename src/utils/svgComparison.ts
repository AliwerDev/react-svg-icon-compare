import React from "react";

/**
 * Converts SVG string to pixel data using canvas
 */
export async function getSvgPixelData(svgString: string): Promise<Uint8ClampedArray | null> {
    return new Promise((resolve) => {
        const img = new Image();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (!ctx) {
            resolve(null);
            return;
        }

        const size = 128;
        canvas.width = size;
        canvas.height = size;

        img.onload = () => {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);
            const imageData = ctx.getImageData(0, 0, size, size);
            resolve(imageData.data);
            URL.revokeObjectURL(img.src);
        };

        img.onerror = () => {
            URL.revokeObjectURL(img.src);
            resolve(null);
        };

        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        img.src = URL.createObjectURL(blob);
    });
}

/**
 * Compares two pixel data arrays and returns similarity percentage
 */
export function comparePixelData(data1: Uint8ClampedArray, data2: Uint8ClampedArray): number {
    if (!data1 || !data2 || data1.length !== data2.length) return 0;

    let totalDiff = 0;
    let nonTransparentPixels = 0;

    for (let i = 0; i < data1.length; i += 4) {
        const r1 = data1[i];
        const g1 = data1[i + 1];
        const b1 = data1[i + 2];
        const a1 = data1[i + 3];

        const r2 = data2[i];
        const g2 = data2[i + 1];
        const b2 = data2[i + 2];
        const a2 = data2[i + 3];

        if (a1 === 0 && a2 === 0) continue;

        if ((a1 === 0 && a2 > 0) || (a1 > 0 && a2 === 0)) {
            totalDiff += 255 * 4;
            nonTransparentPixels++;
            continue;
        }

        const diff = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2) + Math.abs(a1 - a2);
        totalDiff += diff;
        nonTransparentPixels++;
    }

    if (nonTransparentPixels === 0) return 0;

    const maxDiff = nonTransparentPixels * 4 * 255;
    const similarity = 100 - (totalDiff / maxDiff) * 100;
    return Math.max(0, similarity);
}

/**
 * Normalizes SVG string for comparison
 */
export function normalizeSvg(svgString: string): string | null {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = svgDoc.querySelector("svg");

    if (!svgElement) return null;

    svgElement.setAttribute("width", "128");
    svgElement.setAttribute("height", "128");

    return new XMLSerializer().serializeToString(svgElement).replace(/currentColor/g, "#000000");
}

/**
 * Renders React icon component to SVG string
 */
export async function renderIconToSvg(
    IconComponent: React.ComponentType<any>
): Promise<string | null> {
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.top = "-9999px";
    tempContainer.style.width = "64px";
    tempContainer.style.height = "64px";
    document.body.appendChild(tempContainer);

    try {
        const { createRoot } = await import("react-dom/client");
        const root = createRoot(tempContainer);

        await new Promise<void>((resolve) => {
            root.render(
                React.createElement(IconComponent, {
                    style: { width: "64px", height: "64px" },
                })
            );
            requestAnimationFrame(() => {
                requestAnimationFrame(() => resolve());
            });
        });

        const svgElement = tempContainer.querySelector("svg");
        if (!svgElement) {
            root.unmount();
            document.body.removeChild(tempContainer);
            return null;
        }

        const clonedSvg = svgElement.cloneNode(true) as SVGElement;
        clonedSvg.setAttribute("width", "128");
        clonedSvg.setAttribute("height", "128");

        const iconSvgString = new XMLSerializer()
            .serializeToString(clonedSvg)
            .replace(/currentColor/g, "#000000");

        root.unmount();
        document.body.removeChild(tempContainer);

        return iconSvgString;
    } catch (error) {
        document.body.removeChild(tempContainer);
        return null;
    }
}
