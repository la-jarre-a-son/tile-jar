import React from 'react';

import { bindClassNames, Box, Button, ButtonGroup, Icon, Progress, Slider, Stack } from '@la-jarre-a-son/ui';

import styles from './AnimationState.module.scss';
import { useRendering } from '../../contexts/RenderingContext';

const cx = bindClassNames(styles);

export const AnimationState: React.FC = () => {
  const { renderState, currentFrame, totalFrames, setCurrentFrame, play, stop, pause, end } = useRendering();

  return (
    <Box className={cx('base')} pad="md" elevation={3}>
      <Stack>
        <ButtonGroup>
          {renderState === 'playing' ? (
            <Button intent="primary" size="sm" aria-label="pause" icon onClick={pause}>
              <Icon name="fi fi-rr-pause" />
            </Button>
          ) : (
            <Button intent="primary" size="sm" aria-label="play" hoverIntent icon onClick={play}>
              <Icon name="fi fi-rr-play" />
            </Button>
          )}
          <Button intent="danger" size="sm" aria-label="stop" hoverIntent icon onClick={stop}>
            <Icon name="fi fi-rr-stop" />
          </Button>
          <Button intent="warning" size="sm" aria-label="gotoend" hoverIntent icon onClick={end}>
            <Icon name="fi fi-rr-step-forward" />
          </Button>
        </ButtonGroup>

        {renderState === 'playing' ? (
          <Progress className={cx('progress')} indeterminate></Progress>
        ) : (
          <Slider
            className={cx('slider')}
            value={currentFrame}
            onChange={(value: number | number[]) => setCurrentFrame(Number(value))}
            min={1}
            max={totalFrames}
            step={1}
            valueText={currentFrame + ' / ' + totalFrames}
            textClassName={cx('sliderLabel')}
          />
        )}
      </Stack>
    </Box>
  );
};

export default AnimationState;
