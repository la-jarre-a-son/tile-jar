import { Icon, Tooltip } from '@la-jarre-a-son/ui';
import React from 'react';

export type LabelWithTooltipProps = {
  label: string;
  title?: string;
  content: string;
  icon?: string;
};

export const LabelWithTooltip: React.FC<LabelWithTooltipProps> = ({ label, title, content, icon }) => (
  <>
    {label + ' '}
    <Tooltip title={title} content={content}>
      <Icon name={icon ?? 'fi fi-rr-info'} aria-label="info" />
    </Tooltip>
  </>
);

export default LabelWithTooltip;
