import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';

import DEFAULT_PRESET_LIST from '../defaults/presetList.json';

const LOCALSTORAGE_PREFIX = 'tile-jar-';

type PresetList = Array<{
  name: string;
  preview: string;
}>;

const readPresetList = () => {
  try {
    return JSON.parse(window.localStorage.getItem(LOCALSTORAGE_PREFIX + 'presets') ?? 'null') || DEFAULT_PRESET_LIST;
  } catch (_err) {
    return DEFAULT_PRESET_LIST;
  }
};

const writePresetList = (presets: PresetList) => {
  window.localStorage.setItem(LOCALSTORAGE_PREFIX + 'presets', JSON.stringify(presets));
};

const getCurrentPreset = () => {
  try {
    return JSON.parse(window.localStorage.getItem(LOCALSTORAGE_PREFIX + 'preset') ?? 'null') || 'default';
  } catch (_err) {
    return 'default';
  }
};

const saveCurrentPreset = (presetName: string) => {
  window.localStorage.setItem(LOCALSTORAGE_PREFIX + 'preset', JSON.stringify(presetName));
};

const deletePreset = (presetName: string) => {
  window.localStorage.removeItem(`${LOCALSTORAGE_PREFIX}preset-${presetName}`);
};

type Props = {
  children?: React.ReactNode;
};

interface PresetListContextState {
  presets: PresetList;
  currentPreset: string;
  setCurrentPreset: (presetName: string) => void;
  savePreset: (presetName: string, preview: string) => void;
  removePreset: (presetName: string) => void;
}

const PresetListContext = React.createContext<PresetListContextState | null>(null);

export const PresetListProvider: React.FC<Props> = ({ children }) => {
  const [presets, setPresets] = useState<PresetList>(readPresetList());
  const [currentPreset, setCurrentPreset] = useState<string>(getCurrentPreset());

  const removePreset = useCallback((presetName: string) => {
    setPresets((state) => state.filter((item) => item.name !== presetName));
    deletePreset(presetName);
  }, []);

  const savePreset = useCallback(
    (presetName: string, preview: string) => {
      setPresets((state) =>
        state.find((preset) => preset.name === presetName)
          ? state.map((preset) => (preset.name === currentPreset ? { ...preset, preview } : preset), [])
          : [...state, { name: presetName, preview }]
      );
    },
    [currentPreset]
  );

  useEffect(() => {
    writePresetList(presets);
  }, [presets]);

  useEffect(() => {
    saveCurrentPreset(currentPreset);
  }, [currentPreset]);

  const value = useMemo(
    () => ({
      presets,
      currentPreset,
      setCurrentPreset,
      removePreset,
      savePreset,
    }),
    [currentPreset, presets, removePreset, savePreset]
  );

  return <PresetListContext.Provider value={value}>{children}</PresetListContext.Provider>;
};

export const usePresetList = () => {
  const context = useContext(PresetListContext);
  if (!context) {
    throw new Error(`usePresetList must be used within a PresetListProvider`);
  }
  return context;
};

export default PresetListProvider;
