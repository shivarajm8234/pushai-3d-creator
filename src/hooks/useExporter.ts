import * as THREE from "three";

export type ExportFormat =
  | "glb"
  | "gltf"
  | "obj"
  | "stl"
  | "ply"
  | "dae"
  | "x3d"
  | "svg"
  | "fbx"
  | "3ds"
  | "abc"
  | "usd";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function useExporter() {
  const exportObject = async (
    format: ExportFormat,
    object: THREE.Object3D,
    options?: { filename?: string }
  ) => {
    const name = options?.filename || "model";

    switch (format) {
      case "glb": {
        const { GLTFExporter } = await import(
          "three/examples/jsm/exporters/GLTFExporter.js"
        );
        const exporter = new GLTFExporter();
        await new Promise<void>((resolve, reject) => {
          exporter.parse(
            object,
            (result) => {
              let blob: Blob;
              if (result instanceof ArrayBuffer) {
                blob = new Blob([result], { type: "model/gltf-binary" });
                downloadBlob(blob, `${name}.glb`);
              } else {
                const json = JSON.stringify(result, null, 2);
                blob = new Blob([json], { type: "model/gltf+json" });
                downloadBlob(blob, `${name}.gltf`);
              }
              resolve();
            },
            (err) => reject(err),
            {
              binary: true,
              onlyVisible: true,
              includeCustomExtensions: true,
              truncateDrawRange: true,
            }
          );
        });
        return;
      }
      case "gltf": {
        const { GLTFExporter } = await import(
          "three/examples/jsm/exporters/GLTFExporter.js"
        );
        const exporter = new GLTFExporter();
        await new Promise<void>((resolve, reject) => {
          exporter.parse(
            object,
            (result) => {
              const json = JSON.stringify(result, null, 2);
              const blob = new Blob([json], { type: "model/gltf+json" });
              downloadBlob(blob, `${name}.gltf`);
              resolve();
            },
            (err) => reject(err),
            {
              binary: false,
              onlyVisible: true,
              includeCustomExtensions: true,
              truncateDrawRange: true,
            }
          );
        });
        return;
      }
      case "obj": {
        const { OBJExporter } = await import(
          "three/examples/jsm/exporters/OBJExporter.js"
        );
        const exporter = new OBJExporter();
        const result = exporter.parse(object);
        const blob = new Blob([result], { type: "text/plain" });
        downloadBlob(blob, `${name}.obj`);
        return;
      }
      case "stl": {
        const { STLExporter } = await import(
          "three/examples/jsm/exporters/STLExporter.js"
        );
        const exporter = new STLExporter();
        const result = exporter.parse(object, { binary: true }) as ArrayBuffer | DataView;
        const buffer = result instanceof ArrayBuffer ? result : result.buffer;
        const blob = new Blob([buffer], { type: "model/stl" });
        downloadBlob(blob, `${name}.stl`);
        return;
      }
      case "ply": {
        const { PLYExporter } = await import(
          "three/examples/jsm/exporters/PLYExporter.js"
        );
        const exporter = new PLYExporter();
        await new Promise<void>((resolve, reject) => {
          try {
            exporter.parse(
              object,
              (res: string | ArrayBuffer) => {
                const blob = typeof res === "string"
                  ? new Blob([res], { type: "text/plain" })
                  : new Blob([res], { type: "application/octet-stream" });
                downloadBlob(blob, `${name}.ply`);
                resolve();
              },
              { binary: false }
            );
          } catch (e) {
            reject(e);
          }
        });
        return;
      }
      case "dae":
      case "x3d":
      case "svg":
      case "fbx":
      case "3ds":
      case "abc":
      case "usd": {
        throw new Error(
          `Export for ${format.toUpperCase()} requires server-side conversion`
        );
      }
      default:
        throw new Error("Unsupported format");
    }
  };

  return { exportObject };
}
