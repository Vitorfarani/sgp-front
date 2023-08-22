


import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/utils/hooks/useLocalStorage";
import { GlobalAlert, LoadingOverLay, ModalDialog } from "@/components/index";
import { ThemeContext } from "./index";
import { Modal, Spinner } from "react-bootstrap";


export const ThemeProvider = ({ children }) => {
  const [colorModeSelected, setColorModeSelected, loadColorModeSelected] = useLocalStorage('colorModeSelected', document.querySelector("html").getAttribute("data-bs-theme"));
  const [modalProps, setModalProps] = useState({});
  const [dialogProps, setDialogProps] = useState({});
  const [promiseDialog, setPromiseDialog] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState();

  function toggleTheme() {
    let newColorMode = colorModeSelected === "dark" ? "light" : "dark";
    console.log(newColorMode)
    setColorModeSelected(newColorMode)
    document.querySelector("html").setAttribute("data-bs-theme", newColorMode);
  }

  function callGlobalAlert(body) {
    if (Object.keys(body).includes('message')) {
      console.log(body)
      setModalProps(body)
    } else {
      throw 'message is required';
    }
  }
  
  async function callGlobalDialog(body) {
    if (Object.keys(body).includes('title')) {
      console.log(body)
      setDialogProps(body)
      return new Promise((resolve, reject) => {
        setPromiseDialog({resolve, reject})
      })
    } else {
      return Promise.reject('title is required');
    }
  }
  const handleGlobalLoading = {
    show: (msg) => {
      setIsLoading(true)
      if(msg) {
        setLoadingMsg(msg)
      }
    },
    hide: () => {
      setIsLoading(false)
      setLoadingMsg(undefined)
    }
  }
  useEffect(() => {
    (async () => {
      loadColorModeSelected()
    })()
  }, []);

  return (
    <ThemeContext.Provider value={{
      colorModeSelected,
      toggleTheme,
      callGlobalAlert,
      callGlobalDialog,
      handleGlobalLoading
    }}>
      {children}
      <GlobalAlert
        show={!!modalProps.message}
        onHide={() => {
          console.log('hide')
          setModalProps({})
        }}
        modalProps={modalProps} />
        {/* {!!dialogProps.title && ( */}
          <ModalDialog
            show={!!dialogProps.title}
            onSuccess={(result) => {
              promiseDialog.resolve(result)
              setPromiseDialog(null)
              setDialogProps({})
            }}
            onCancel={() => {
              promiseDialog.reject()
              setPromiseDialog(null)
              setDialogProps({})
            }}
            onHide={() => {
              promiseDialog.reject()
              setPromiseDialog(null)
              setDialogProps({})
            }}
            {...dialogProps}
          />
           {isLoading && <LoadingOverLay label={loadingMsg}/>}
        {/* )} */} 
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme precisa ser usado dentro de um ThemeProvider.');
  }

  return context;
}
