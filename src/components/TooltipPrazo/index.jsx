import React from 'react';
import { BadgeColor } from "@/components/index";

const TooltipPrazo = ({ prazoLabels }) => {
  return (
    <>
      {prazoLabels && (
        <>
          <BadgeColor color={prazoLabels.color}>{prazoLabels.label}</BadgeColor>
          <span style={{ marginLeft: 12 }}>{prazoLabels.diff}</span>
        </>
      )}
    </>
  );
};
export default TooltipPrazo;