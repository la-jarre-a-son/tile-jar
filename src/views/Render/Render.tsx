import { useMemo, type CSSProperties } from 'react';
import { bindClassNames, classNames } from '@la-jarre-a-son/ui';
import random from 'random';

import styles from './Render.module.scss';

import renderingCSS from './rendering.css?raw';
import { range } from '../../helpers';
import { tileInCanvas } from './utils';
import { useRendering } from '../../contexts/RenderingContext';

const cx = bindClassNames(styles);

const TILE_MARGIN = 4;

const Render: React.FC = () => {
  const { svgRef, preset, animationCurrentTime, renderState } = useRendering();

  const rng = random.clone(preset.render.seed);

  const lineRange = preset.grid.countY
    ? preset.grid.order === 'up-left' || preset.grid.order === 'up-right'
      ? range(preset.grid.countY - 1, 0)
      : range(0, preset.grid.countY - 1)
    : [];

  const columnRange = preset.grid.countX
    ? preset.grid.order === 'up-left' || preset.grid.order === 'down-left'
      ? range(preset.grid.countX - 1, 0)
      : range(0, preset.grid.countX - 1)
    : [];

  const enabledTileAnimations = useMemo(() => preset.tileAnimations.filter((a) => a.enabled), [preset.tileAnimations]);

  const enabledGridAnimations = useMemo(() => preset.gridAnimations.filter((a) => a.enabled), [preset.gridAnimations]);

  const style = {
    '--animation-current-time': -1 * animationCurrentTime + 's',
    '--animation-iteration-count': preset.render.loop ? 'infinite' : '1',
    '--animation-duration': preset.render.duration + 's',
    '--view-width': preset.width + 'px',
    '--view-height': preset.height + 'px',
    '--grid-random-x': rng.float(),
    '--grid-random-y': rng.float(),
    '--tile-width': preset.tile.width + 'px',
    '--tile-height': preset.tile.height + 'px',
    '--tile-columnDeltaX': preset.tile.columnDeltaX + 'px',
    '--tile-columnDeltaY': preset.tile.columnDeltaY + 'px',
    '--tile-lineDeltaX': preset.tile.lineDeltaX + 'px',
    '--tile-lineDeltaY': preset.tile.lineDeltaY + 'px',
    '--lines': preset.grid.lines,
    '--columns': preset.grid.columns,
    '--variants': preset.variants.length,
  } as CSSProperties;

  return (
    <div className={cx('base')}>
      <svg
        id="svg"
        className={classNames({
          stopped: renderState === 'stopped',
          playing: renderState === 'playing',
          paused: renderState === 'paused',
        })}
        ref={svgRef}
        viewBox={`0 0 ${preset.width} ${preset.height}`}
        width={preset.render.width}
        height={preset.render.height}
        style={style}
      >
        <defs>
          <g id="tile">
            <rect
              x={-1 * TILE_MARGIN}
              y={-1 * TILE_MARGIN}
              width={preset.tile.width + TILE_MARGIN}
              height={preset.tile.height + TILE_MARGIN}
              fill="none"
              stroke="none"
            />
            <path d={preset.tile.path} />
          </g>
        </defs>
        <style>{renderingCSS}</style>
        <style>
          {preset.variants.map(
            (variant, index) => `
              .tile-${index} {
                fill: ${variant.fill ?? 'none'};
                stroke: ${variant.stroke ?? 'none'};
                stroke-width: ${variant.strokeWidth || 0}px;
                opacity: ${variant.opacity || 0};
                transform: ${variant.transform ?? 'none'};
              }
            `
          )}
          {enabledTileAnimations.map(
            (animation, index) => `
                @keyframes ${'tile-animation-' + index} {
                  ${animation.steps
                    .map(
                      (step) => `
                      ${step.progress * 100 + '%'} {
                        ${step.fill ? 'fill:' + step.fill + ';' : ''}
                        ${step.stroke ? 'stroke:' + step.stroke + ';' : ''}
                        ${step.strokeWidth !== null ? 'stroke-width:' + step.strokeWidth + 'px;' : ''}
                        ${step.opacity !== null ? 'opacity:' + step.opacity + ';' : ''}
                        ${step.transform ? 'transform:' + step.transform + ';' : ''}
                      }
                    `
                    )
                    .join('\n')}
                }`
          )}

          {enabledGridAnimations.map(
            (animation, index) => `
                @keyframes ${'grid-animation-' + index} {
                  ${animation.steps
                    .map(
                      (step) => `
                      ${step.progress * 100 + '%'} {
                        ${step.transform ? 'transform:' + step.transform + ';' : ''}
                      }
                    `
                    )
                    .join('\n')}
                }`
          )}
          {`
            #grid {
              animation-name: ${
                enabledGridAnimations.length
                  ? enabledGridAnimations.map((_, index) => 'grid-animation-' + index).join(',  ')
                  : 'none'
              };
              animation-duration: ${
                enabledGridAnimations.length
                  ? enabledGridAnimations.map((animation) => animation.duration).join(',  ')
                  : 'initial'
              };
              animation-timing-function: ${
                enabledGridAnimations.length
                  ? enabledGridAnimations.map((animation) => animation.easing).join(',  ')
                  : 'initial'
              };
              animation-composition: ${
                enabledGridAnimations.length
                  ? enabledGridAnimations.map((animation) => animation.composition).join(',  ')
                  : 'initial'
              };
              animation-delay:  ${
                enabledGridAnimations.length
                  ? enabledGridAnimations
                      .map(
                        (_animation) => `
                          var(--animation-current-time, 0s)
                      `
                      )
                      .join(',  ')
                  : 'initial'
              };
            }`}
          {`
            #grid .tile {
              animation-name: ${
                enabledTileAnimations.length
                  ? enabledTileAnimations.map((_, index) => 'tile-animation-' + index).join(',  ')
                  : 'none'
              };
              animation-duration: ${
                enabledTileAnimations.length
                  ? enabledTileAnimations.map((animation) => animation.duration).join(',  ')
                  : 'initial'
              };
              animation-timing-function: ${
                enabledTileAnimations.length
                  ? enabledTileAnimations.map((animation) => animation.easing).join(',  ')
                  : 'initial'
              };
              animation-composition: ${
                enabledTileAnimations.length
                  ? enabledTileAnimations.map((animation) => animation.composition).join(',  ')
                  : 'initial'
              };
              animation-delay:  ${
                enabledTileAnimations.length
                  ? enabledTileAnimations
                      .map(
                        (_animation, index) => `
                          calc(
                            var(--animation-${index}-delay-per-tile, 0s)
                            + var(--animation-${index}-delay-per-line, 0s)
                            + var(--animation-${index}-delay-per-column, 0s)
                            + var(--animation-current-time, 0s)
                          )
                      `
                      )
                      .join(',  ')
                  : 'initial'
              };
            }`}
          {range(0, preset.grid.lines - 1).map(
            (line) => `
                .line-${line} {
                  ${enabledTileAnimations.map((animation, index) => `--animation-${index}-delay-per-line: calc(${animation.delayPerLine} * ${line});`).join('\n')}
                }
              `
          )}
          {range(0, preset.grid.columns - 1).map(
            (column) => `
                .column-${column} {
                  ${enabledTileAnimations.map((animation, index) => `--animation-${index}-delay-per-column: calc(${animation.delayPerColumn} * ${column});`).join('\n')}
                }
              `
          )}
          {preset.variants.map(
            (_, tile) => `
                .tile-${tile} {
                  ${enabledTileAnimations.map((animation, index) => `--animation-${index}-delay-per-tile: calc(${animation.delayPerTile} * ${tile});`).join('\n')}
                }
              `
          )}
        </style>
        <g id="grid" style={{ transform: preset.grid.transform || 'none' }}>
          {lineRange.map((line) =>
            columnRange.map((column) => {
              const lineNum = line % preset.grid.lines;
              const columnNum = column % preset.grid.columns;
              const x = preset.grid.originX + column * preset.tile.columnDeltaX + line * preset.tile.lineDeltaX;
              const y = preset.grid.originY + column * preset.tile.columnDeltaY + line * preset.tile.lineDeltaY;
              const originX = x + (preset.tile.transformOriginX ?? preset.tile.width / 2);
              const originY = y + (preset.tile.transformOriginY ?? preset.tile.height / 2);

              const variantIndex =
                (line * preset.variantLineShift + column * preset.variantColumnShift) % preset.variants.length;
              const tileClass = 'tile-' + variantIndex;

              const tileStyle = {
                '--tile-i': column,
                '--tile-j': line,
                '--tile-x': x + 'px',
                '--tile-y': y + 'px',
                '--tile-line': lineNum,
                '--tile-column': columnNum,
                '--tile-variant': variantIndex,
                '--tile-random-x': rng.float(),
                '--tile-random-y': rng.float(),
                transformOrigin: `${originX}px ${originY}px`,
              } as CSSProperties;

              const isInCanvas = tileInCanvas(preset, x, y);

              return (
                isInCanvas && (
                  <use
                    key={line + '-' + column}
                    href="#tile"
                    className={classNames('tile', 'line-' + lineNum, 'column-' + columnNum, tileClass)}
                    style={tileStyle}
                    x={x}
                    y={y}
                  />
                )
              );
            })
          )}
        </g>
      </svg>
    </div>
  );
};

export default Render;
