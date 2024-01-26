import React, { forwardRef, useImperativeHandle, useState } from 'react';
import './style.scss';
import { Overlay } from '..';

const LoadingOverLay = forwardRef((props, ref) => {
  const [isShow, setIsShow] = useState(false);
  const [message, setMessage] = useState();

  function hide() {
    console.log('hide')

    setIsShow(false)
    setTimeout(() => {
      setMessage(undefined)
    }, 400);
  }

  function show(msg) {
    console.log('show')
    if (msg) setMessage(msg)
    setIsShow(true)
  }

  useImperativeHandle(ref, () => ({
    show,
    hide
  }))
  return isShow && (
    <Overlay description={message} >
      <div className="spinner-border" style={{ width: '6em', height: '6em', borderWidth: '0.59rem' }}>
      </div>
    </Overlay>
  );
})

export default LoadingOverLay;