import React, { useContext, useState, useMemo, useCallback, useRef, type Ref } from 'react';

import type { Preset } from './PresetContext';

import { usePreset } from './PresetContext';

// import { usePreset } from './PresetContext';
// import { usePresetList } from './PresetListContext';

type RenderState = 'stopped' | 'paused' | 'playing';

export interface RenderingContextState {
  svgRef: Ref<SVGSVGElement | null>;
  preset: Preset;
  renderState: RenderState;
  currentFrame: number;
  totalFrames: number;
  animationCurrentTime: number;
  setCurrentFrame: (currentFrame: number) => void;
  play: () => void;
  stop: () => void;
  pause: () => void;
  end: () => void;
  saveVector: (fileName?: string) => Promise<unknown>;
  saveImage: (dirHandle?: FileSystemDirectoryHandle, fileName?: string) => Promise<unknown>;
  saveAnimation: () => Promise<unknown>;
  getDataUrl: (width: number, height: number) => Promise<string>;
  cancelExport: () => void;
}

const RenderingContext = React.createContext<RenderingContextState | null>(null);
const exportCanvas = document.createElement('canvas');

type Props = {
  children?: React.ReactNode;
};

export const RenderingProvider: React.FC<Props> = ({ children }) => {
  // const { currentPreset } = usePresetList();
  const { preset } = usePreset();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [renderState, setRenderState] = useState<RenderState>('paused');
  const [currentFrame, setCurrentFrame] = useState<number>(1);
  const exportCancelled = useRef<boolean>(false);

  const totalFrames = useMemo(() => preset.render.duration * preset.render.frameRate, [preset]);
  const animationCurrentTime = useMemo(
    () => ((currentFrame - 1) * preset.render.duration) / totalFrames,
    [currentFrame, totalFrames, preset.render]
  );

  const play = useCallback(() => setRenderState('playing'), []);
  const pause = useCallback(() => setRenderState('paused'), []);
  const stop = useCallback(() => {
    setRenderState('stopped');
    setCurrentFrame(1);
    return new Promise((resolve) => {
      setTimeout(() => {
        setRenderState('paused');
        resolve(true);
      }, 0);
    });
  }, []);

  const end = useCallback(() => {
    setRenderState('stopped');
    setCurrentFrame(totalFrames);
    setTimeout(() => setRenderState('paused'), 0);
  }, [totalFrames]);

  const getSVGBlob = useCallback(() => {
    if (svgRef.current) {
      const content = new XMLSerializer().serializeToString(svgRef.current);
      const blob = new Blob([content], { type: 'image/svg+xml; charset=utf-8' });
      return blob;
    }
    return null;
  }, []);

  const saveVector = useCallback(
    async (fileName: string = 'test.svg') => {
      const blob = getSVGBlob();
      if (!blob) throw new Error('Cannot transform svg to blob');

      const fileHandle = await showSaveFilePicker({
        suggestedName: fileName,
        types: [{ description: 'PNG', accept: { 'image/png': ['.png'] } }],
      });
      const writableStream = await fileHandle.createWritable();
      await writableStream.write(blob);
      await writableStream.close();
    },
    [getSVGBlob]
  );

  const saveImage = useCallback(
    (dirHandle?: FileSystemDirectoryHandle, fileName: string = 'test.png') => {
      const blob = getSVGBlob();
      if (!blob) throw new Error('Cannot transform svg to blob');

      exportCanvas.width = preset.render.width;
      exportCanvas.height = preset.render.height;

      const image = new Image(exportCanvas.width, exportCanvas.height);
      const dataUrl = URL.createObjectURL(blob);
      image.src = dataUrl;

      const promise = new Promise((resolve, reject) => {
        image.onload = async () => {
          const context = exportCanvas.getContext('2d');
          if (!context) throw new Error('Cannot get 2D context');

          context.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
          context.drawImage(image, 0, 0);
          URL.revokeObjectURL(dataUrl);

          exportCanvas.toBlob(async (blob) => {
            try {
              if (!blob) throw new Error('empty blob');

              const fileHandle = await (dirHandle
                ? dirHandle.getFileHandle(fileName, { create: true })
                : showSaveFilePicker({
                    suggestedName: fileName,
                    types: [{ description: 'PNG', accept: { 'image/png': ['.png'] } }],
                  }));
              const writableStream = await fileHandle.createWritable();
              await writableStream.write(blob);
              await writableStream.close();
              resolve(fileName);
            } catch (err) {
              reject(err);
              console.error(err);
            }
          }, 'image/png');
        };
      });
      return promise;
    },
    [getSVGBlob, preset]
  );

  const saveAnimation = useCallback(async () => {
    if (!window.showDirectoryPicker) throw new Error('Browser does not support Filesystem API');

    const dirHandle: FileSystemDirectoryHandle = await window.showDirectoryPicker({ mode: 'readwrite' });

    exportCancelled.current = false;

    await stop();

    for (let f = 1; f <= totalFrames; f++) {
      setCurrentFrame(f);

      if (exportCancelled.current) {
        throw new Error('export cancelled');
      }

      const filename = f.toFixed(0).padStart(4, '0') + '.png';
      await saveImage(dirHandle, filename);
    }
  }, [saveImage, stop, totalFrames]);

  const getDataUrl = useCallback(
    (width: number, height: number) => {
      const blob = getSVGBlob();
      if (!blob) throw new Error('Cannot transform svg to blob');

      exportCanvas.width = width;
      exportCanvas.height = height;

      const image = new Image(exportCanvas.width, exportCanvas.height);
      const dataUrl = URL.createObjectURL(blob);
      image.src = dataUrl;

      const promise = new Promise<string>((resolve, reject) => {
        image.onload = async () => {
          const context = exportCanvas.getContext('2d');
          if (!context) return reject(new Error('Cannot get 2D context'));

          context.clearRect(0, 0, width, height);
          const imgWidth =
            preset.render.width > preset.render.height ? width : width * (preset.render.width / preset.render.height);
          const imgHeight =
            preset.render.width > preset.render.height ? height * (preset.render.height / preset.render.width) : height;

          context.drawImage(image, (width - imgWidth) / 2, (height - imgHeight) / 2, imgWidth, imgHeight);

          URL.revokeObjectURL(dataUrl);

          resolve(exportCanvas.toDataURL());
        };
      });
      return promise;
    },
    [getSVGBlob, preset.render.height, preset.render.width]
  );

  const cancelExport = useCallback(() => (exportCancelled.current = true), []);

  const value = useMemo(
    () => ({
      svgRef,
      play,
      stop,
      pause,
      end,
      setCurrentFrame,
      cancelExport,
      saveVector,
      saveImage,
      saveAnimation,
      getDataUrl,
      currentFrame,
      renderState,
      totalFrames,
      animationCurrentTime,
      preset,
    }),
    [
      play,
      stop,
      pause,
      end,
      cancelExport,
      saveVector,
      saveImage,
      saveAnimation,
      getDataUrl,
      currentFrame,
      renderState,
      totalFrames,
      animationCurrentTime,
      preset,
    ]
  );

  return <RenderingContext.Provider value={value}>{children}</RenderingContext.Provider>;
};

export const useRendering = () => {
  const context = useContext(RenderingContext);
  if (!context) {
    throw new Error(`useRendering must be used within a RenderingProvider`);
  }
  return context;
};

export default RenderingProvider;
