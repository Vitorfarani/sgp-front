import React from 'react';
import './style.scss'

const HorizontalScrollView = ({children, className, ...props}) => {
  return (
    <div className={"horizontal-scroll-view " + className} {...props}>
        {children}
    </div>
  );
};

export default HorizontalScrollView;
