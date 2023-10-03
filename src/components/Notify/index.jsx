import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Alert, Col, Row } from 'react-bootstrap';
import './style.scss';
import { FiCheck } from 'react-icons/fi';

const defaults = {};

const positionList = [
  'top-left', 'top-right',
  'bottom-left', 'bottom-right',
  'top', 'bottom', 'left', 'right', 'center'
];

const Notify = forwardRef((p, ref) => {
  const [notifs, setNotifs] = useState({
    center: [],
    left: [],
    right: [],
    top: [],
    'top-left': [],
    'top-right': [],
    bottom: [],
    'bottom-left': [],
    'bottom-right': [],
  });

  useImperativeHandle(ref, () => ({
    add: (config) => {
      console.log(config)
      if (!config) {
        console.error('Notify: parameter required');
        return false;
      }

      const notif = {
        ...defaults,
        ...(typeof config === 'string' ? { message: config } : config),
      };

      if (notif.position) {
        if (!positionList.includes(notif.position)) {
          console.error(`Notify: wrong position: ${notif.position}`);
          return false;
        }
      } else {
        notif.position = 'bottom';
      }

      notif._id = Math.random().toString(12).substring(2);

      if (notif.timeout === undefined) {
        notif.timeout = 5000;
      }

      const close = () => {
        remove(notif);
      };

      if (config.actions) {
        notif.actions = config.actions.map((item) => {
          const handler = item.handler;
          const action = item;

          action.handler =
            typeof handler === 'function'
              ? () => {
                handler();
                !item.noDismiss && close();
              }
              : () => close();

          return action;
        });
      }

      if (typeof config.onDismiss === 'function') {
        notif.onDismiss = config.onDismiss;
      }

      if (notif.closeBtn) {
        const btn = [
          {
            closeBtn: true,
            label: notif.closeBtn,
            handler: close,
          },
        ];
        notif.actions = notif.actions
          ? notif.actions.concat(btn)
          : btn;
      }

      if (notif.timeout) {
        notif.__timeout = setTimeout(() => {
          close();
        }, notif.timeout + /* show duration */ 1000);
      }

      const action = notif.position.indexOf('top') > -1 ? 'unshift' : 'push';
      setNotifs((prevNotifs) => ({
        ...prevNotifs,
        [notif.position]: [...prevNotifs[notif.position], notif],
      }));

      return close;
    }
  }))

  const remove = (notif) => {
    if (notif.__timeout) {
      clearTimeout(notif.__timeout);
    }

    setNotifs((prevNotifs) => ({
      ...prevNotifs,
      [notif.position]: prevNotifs[notif.position].filter((item) => item !== notif),
    }));

    if (typeof notif.onDismiss === 'function') {
      notif.onDismiss();
    }
  };
  const MapNotify = () => {
    return positionList.map((pos) => {
      const vert = ['left', 'center', 'right'].includes(pos)
        ? 'center'
        : pos.indexOf('top') > -1
          ? 'top'
          : 'bottom';
      const align = pos.indexOf('left') > -1
        ? 'start'
        : pos.indexOf('right') > -1
          ? 'end'
          : 'center';
      const classes = ['left', 'right'].includes(pos)
        ? `items-${pos === 'left' ? 'start' : 'end'} justify-content-center`
        : pos === 'center'
          ? 'align-items-center'
          : `align-items-${align}`;
      return (
        <div
          key={pos}
          className={`u-notification-list u-notification-list-${vert} d-flex flex-column ${classes}`}
        >
          {notifs[pos].map((notif) => (
            <Alert
              key={notif._id}
              className="u-notification"
              {...notif}
            >
              <Row style={{width: '100%'}}>
                <Col sm={1}>
                  {notif.icon ? <notif.icon size={'1.6em'}/> : <FiCheck size={'1.6em'}/>}
                </Col>
                <Col sm={10} className='m-auto'  >
                  <span style={{textWrap: 'nowrap'}}>
                    {notif.message}
                  </span>
                </Col>
              </Row>
            </Alert>
          ))}
        </div>
      );
    })
  }
  return (
    <div className="u-notifications">
      <MapNotify/>
    </div>
  );
})

export default Notify;
