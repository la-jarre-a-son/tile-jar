import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { usePresetList } from './PresetListContext';

import { mergeDeep, type DeepPartial } from '../helpers';

import DEFAULT_PRESET from '../defaults/preset.json';

const LOCALSTORAGE_PREFIX = 'tile-jar-';

export type PresetVariant = {
  fill: string | null;
  stroke: string | null;
  strokeWidth: number;
  opacity: number;
  transform: string | null;
};

export type PresetTileAnimationStep = {
  progress: number;
  fill: string | null;
  stroke: string | null;
  strokeWidth: number | null;
  opacity: number | null;
  transform: string | null;
};

export type PresetTileAnimation = {
  enabled: boolean;
  duration: string;
  easing: string;
  composition: 'replace' | 'add' | 'accumulate';
  delayPerLine: string;
  delayPerColumn: string;
  delayPerTile: string;
  steps: Array<PresetTileAnimationStep>;
};

export type PresetGridAnimationStep = {
  progress: number;
  transform: string | null;
};

export type PresetGridAnimation = {
  enabled: boolean;
  name: string;
  duration: string;
  easing: string;
  composition: 'replace' | 'add' | 'accumulate';
  steps: Array<PresetGridAnimationStep>;
};

export type Preset = {
  version: number;
  width: number;
  height: number;
  safeAreaSize: number; // FIXME: find a better solution
  render: {
    width: number;
    height: number;
    duration: number;
    frameRate: number;
    loop: boolean;
    seed: number;
  };
  tile: {
    width: number;
    height: number;
    lineDeltaX: number;
    lineDeltaY: number;
    columnDeltaX: number;
    columnDeltaY: number;
    transformOriginX: number;
    transformOriginY: number;
    path: string;
  };
  grid: {
    originX: number;
    originY: number;
    countX: number;
    countY: number;
    lines: number;
    columns: number;
    order: 'up-right' | 'up-left' | 'down-right' | 'down-left';
    transform: string | null;
  };
  variants: Array<PresetVariant>;
  variantLineShift: number;
  variantColumnShift: number;
  tileAnimations: Array<PresetTileAnimation>;
  gridAnimations: Array<PresetGridAnimation>;
};

const readPreset = (presetName: string) => {
  try {
    return {
      ...DEFAULT_PRESET,
      ...JSON.parse(window.localStorage.getItem(`${LOCALSTORAGE_PREFIX}preset-${presetName}`) || 'null'),
    } as Preset;
  } catch (_err) {
    return { ...DEFAULT_PRESET } as Preset;
  }
};

const writePreset = (presetName: string, preset: Preset) => {
  window.localStorage.setItem(`${LOCALSTORAGE_PREFIX}preset-${presetName}`, JSON.stringify(preset));
};

interface PresetContextState {
  currentPreset: string;
  unsaved: boolean;
  preset: Preset;
  updatePreset: (preset: DeepPartial<Preset>) => void;
  addPresetVariant: (variant?: PresetVariant) => void;
  updatePresetVariant: (index: number, variant: DeepPartial<PresetVariant>) => void;
  addPresetTileAnimation: (animation?: PresetTileAnimation) => void;
  updatePresetTileAnimation: (index: number, animation: DeepPartial<PresetTileAnimation>) => void;
  addPresetTileAnimationStep: (stepIndex: number, step?: PresetTileAnimationStep) => void;
  updatePresetTileAnimationStep: (
    animationIndex: number,
    stepIndex: number,
    step: DeepPartial<PresetTileAnimationStep>
  ) => void;
  addPresetGridAnimation: (animation?: PresetGridAnimation) => void;
  updatePresetGridAnimation: (index: number, animation: DeepPartial<PresetGridAnimation>) => void;
  addPresetGridAnimationStep: (stepIndex: number, step?: PresetGridAnimationStep) => void;
  updatePresetGridAnimationStep: (
    animationIndex: number,
    stepIndex: number,
    step: DeepPartial<PresetGridAnimationStep>
  ) => void;
  save: (name: string, preview: string) => void;
  exportPreset: () => Promise<void>;
  importPreset: () => Promise<void>;
}

type Props = {
  children?: React.ReactNode;
};

const PresetContext = React.createContext<PresetContextState | null>(null);

export const PresetProvider: React.FC<Props> = ({ children }) => {
  const { currentPreset, savePreset, setCurrentPreset } = usePresetList();

  const [preset, setPreset] = useState<Preset>(readPreset(currentPreset));
  const [unsaved, setUnsaved] = useState<boolean>(false);

  const updatePreset = useCallback((preset: DeepPartial<Preset>) => {
    setPreset((old: Preset) => mergeDeep(old, preset) as Preset);
    setUnsaved(true);
  }, []);

  const addPresetVariant = useCallback((variant?: PresetVariant) => {
    setPreset((old: Preset) => {
      const newVariant = variant || old.variants.length ? old.variants[old.variants.length - 1] : DEFAULT_PRESET.variants[0];
      const variants = [...old.variants, newVariant];
      return { ...old, variants } as Preset;
    });
    setUnsaved(true);
  }, []);

  const updatePresetVariant = useCallback((index: number, variant: DeepPartial<PresetVariant>) => {
    setPreset((old: Preset) => {
      const variants = old.variants.map((v, i) => (i === index ? mergeDeep(v, variant) : v));
      return { ...old, variants } as Preset;
    });
    setUnsaved(true);
  }, []);

  const addPresetTileAnimation = useCallback((animation?: PresetTileAnimation) => {
    setPreset((old: Preset) => {
      const newPresetTileAnimation =
        animation || old.tileAnimations.length
          ? old.tileAnimations[old.tileAnimations.length - 1]
          : DEFAULT_PRESET.tileAnimations[0];
      const tileAnimations = [...old.tileAnimations, newPresetTileAnimation];
      return { ...old, tileAnimations } as Preset;
    });
    setUnsaved(true);
  }, []);

  const updatePresetTileAnimation = useCallback((index: number, animation: DeepPartial<PresetTileAnimation>) => {
    setPreset((old: Preset) => {
      const tileAnimations = old.tileAnimations.map((a, i) => (i === index ? mergeDeep(a, animation) : a));
      return { ...old, tileAnimations } as Preset;
    });
    setUnsaved(true);
  }, []);

  const addPresetTileAnimationStep = useCallback((animationIndex: number, step?: PresetTileAnimationStep) => {
    setPreset((old: Preset) => {
      const animation = old.tileAnimations[animationIndex];
      if (!animation) return old;

      const newStep =
        step || animation.steps.length
          ? animation.steps[animation.steps.length - 1]
          : DEFAULT_PRESET.tileAnimations[0].steps[0];
      const steps = [...animation.steps, newStep];

      const tileAnimations = old.tileAnimations.map((a, i) => (i === animationIndex ? mergeDeep(a, { steps }) : a));

      return { ...old, tileAnimations } as Preset;
    });
    setUnsaved(true);
  }, []);

  const updatePresetTileAnimationStep = useCallback(
    (animationIndex: number, stepIndex: number, step: DeepPartial<PresetTileAnimationStep>) => {
      setPreset((old: Preset) => {
        const animation = old.tileAnimations[animationIndex];
        if (!animation) return old;

        const steps = animation.steps.map((s, i) => (i === stepIndex ? mergeDeep(s, step) : s));

        const tileAnimations = old.tileAnimations.map((a, i) => (i === animationIndex ? mergeDeep(a, { steps }) : a));

        return mergeDeep(old, { tileAnimations }) as Preset;
      });
      setUnsaved(true);
    },
    []
  );

  const addPresetGridAnimation = useCallback((animation?: PresetGridAnimation) => {
    setPreset((old: Preset) => {
      const newPresetGridAnimation =
        animation || old.gridAnimations.length
          ? old.gridAnimations[old.gridAnimations.length - 1]
          : DEFAULT_PRESET.gridAnimations[0];
      const gridAnimations = [...old.gridAnimations, newPresetGridAnimation];
      return { ...old, gridAnimations } as Preset;
    });
    setUnsaved(true);
  }, []);

  const updatePresetGridAnimation = useCallback((index: number, animation: DeepPartial<PresetGridAnimation>) => {
    setPreset((old: Preset) => {
      const gridAnimations = old.gridAnimations.map((a, i) => (i === index ? mergeDeep(a, animation) : a));
      return { ...old, gridAnimations } as Preset;
    });
    setUnsaved(true);
  }, []);

  const addPresetGridAnimationStep = useCallback((animationIndex: number, step?: PresetGridAnimationStep) => {
    setPreset((old: Preset) => {
      const animation = old.gridAnimations[animationIndex];
      if (!animation) return old;

      const newStep =
        step || animation.steps.length
          ? animation.steps[animation.steps.length - 1]
          : DEFAULT_PRESET.gridAnimations[0].steps[0];
      const steps = [...animation.steps, newStep];

      const gridAnimations = old.gridAnimations.map((a, i) => (i === animationIndex ? mergeDeep(a, { steps }) : a));

      return { ...old, gridAnimations } as Preset;
    });
    setUnsaved(true);
  }, []);

  const updatePresetGridAnimationStep = useCallback(
    (animationIndex: number, stepIndex: number, step: DeepPartial<PresetGridAnimationStep>) => {
      setPreset((old: Preset) => {
        const animation = old.gridAnimations[animationIndex];
        if (!animation) return old;

        const steps = animation.steps.map((s, i) => (i === stepIndex ? mergeDeep(s, step) : s));

        const gridAnimations = old.gridAnimations.map((a, i) => (i === animationIndex ? mergeDeep(a, { steps }) : a));

        return mergeDeep(old, { gridAnimations }) as Preset;
      });
      setUnsaved(true);
    },
    []
  );

  const save = useCallback(
    (name: string, preview: string) => {
      savePreset(name, preview);
      writePreset(name, preset);
      setCurrentPreset(name);
      setUnsaved(false);
    },
    [preset, savePreset, setCurrentPreset]
  );

  const exportPreset = useCallback(async () => {
    const presetJson = JSON.stringify(preset, null, 2);

    const fileHandle = await showSaveFilePicker({
      suggestedName: currentPreset + '.tile-jar-preset.json',
      types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }],
    });
    const writableStream = await fileHandle.createWritable();
    await writableStream.write(presetJson);
    await writableStream.close();
  }, [currentPreset, preset]);

  const importPreset = useCallback(async () => {
    const fileHandle = await showOpenFilePicker({
      types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }],
      excludeAcceptAllOption: true,
      multiple: false,
    });

    const file = await fileHandle[0].getFile();
    const presetJson = await file.text();
    setPreset(JSON.parse(presetJson));
    setUnsaved(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreset(readPreset(currentPreset));
    setUnsaved(false);
  }, [currentPreset]);

  const value = useMemo(
    () => ({
      currentPreset,
      unsaved,
      preset,
      updatePreset,
      addPresetVariant,
      updatePresetVariant,
      addPresetTileAnimation,
      updatePresetTileAnimation,
      addPresetTileAnimationStep,
      updatePresetTileAnimationStep,
      addPresetGridAnimation,
      updatePresetGridAnimation,
      addPresetGridAnimationStep,
      updatePresetGridAnimationStep,
      save,
      exportPreset,
      importPreset,
    }),
    [
      currentPreset,
      unsaved,
      preset,
      updatePreset,
      addPresetVariant,
      updatePresetVariant,
      addPresetTileAnimation,
      updatePresetTileAnimation,
      addPresetTileAnimationStep,
      updatePresetTileAnimationStep,
      addPresetGridAnimation,
      updatePresetGridAnimation,
      addPresetGridAnimationStep,
      updatePresetGridAnimationStep,
      save,
      exportPreset,
      importPreset,
    ]
  );

  return <PresetContext.Provider value={value}>{children}</PresetContext.Provider>;
};

export const usePreset = () => {
  const context = useContext(PresetContext);
  if (!context) {
    throw new Error(`usePreset must be used within a PresetProvider`);
  }
  return context;
};

export default PresetProvider;
