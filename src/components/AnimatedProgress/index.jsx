import React from 'react';
import { between } from '@/utils/helpers/format';
import './style.scss'
function width(val) {
  return { width: `${val}%` };
}

const AnimatedProgress = ({
  percentage = 0,
  color = 'secondary',
  stripe = false,
  animate = false,
  indeterminate = true,
  buffer,
  height = '4px',
}) => {
  const model = between(percentage, 0, 100);
  const bufferModel = between(buffer || 0, 0, 100 - model);
  const bufferStyle = width(bufferModel);
  const trackStyle = width(buffer ? 100 - buffer : 100);
  const computedClass = `u-progress text-${color}`;
  const computedStyle = { height: height };
  const modelClass = {
    animate: animate,
    stripe: stripe,
    indeterminate: indeterminate,
  };
  const modelStyle = width(model);

  return (
    <div style={computedStyle} className={computedClass}>
      {buffer && !indeterminate ? (
        <div className="u-progress-buffer" style={bufferStyle}></div>
      ) : null}

      <div className="u-progress-track" style={trackStyle}></div>

      <div className={`u-progress-model indeterminate`} style={modelStyle}></div>
    </div>
  );
};

export default AnimatedProgress 

