import type { Preset } from '../../contexts/PresetContext';

export const tileInCanvas = (preset: Preset, x: number, y: number) => {
  if (x > preset.width + preset.safeAreaSize) return false;
  if (y - preset.tile.height > preset.height + preset.safeAreaSize) return false;
  if (x + preset.tile.width < -1 * preset.safeAreaSize) return false;
  if (y + preset.tile.height < -1 * preset.safeAreaSize) return false;

  return true;
};
