import React from 'react';
import { Tooltip, Button } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';

export default function ButtonSmall({
  // children,
  onClick,
  info,
  positionTooltip = 'bottomRight',
  bg = '!bg-primary',
  icon
}: {
  // children: any;
  onClick?: any;
  info: string;
  positionTooltip: TooltipPlacement;
  bg?: string,
  icon: any
}) {
  return (
    <Tooltip
      placement={positionTooltip}
      title={info}
      arrow={true}
    >
      <Button
        icon={icon}
        onClick={onClick}
        size="middle"
        className={`${bg} !bg-opacity-15`}
      >
        {/* {children} */}
      </Button>
    </Tooltip>
  );
}
