


import React, { createContext, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "@/utils/hooks/useLocalStorage";
import { GlobalAlert, LoadingOverLay, ModalDialog, Notify } from "@/components/index";
import { ThemeContext } from "./index";
import { Alert, Modal, Spinner } from "react-bootstrap";
import { isString } from "../helpers/is";


export const ThemeProvider = memo(({ children }) => {
  const [colorModeSelected, setColorModeSelected, loadColorModeSelected] = useLocalStorage('colorModeSelected', document.querySelector("html").getAttribute("data-bs-theme"));
  const [promiseDialog, setPromiseDialog] = useState();
  const dialog = useRef();
  const notify = useRef();
  const loadingOverLay = useRef();
  const globalAlertRef = useRef();

  const toggleTheme = useCallback(() => {
    let newColorMode = colorModeSelected === "dark" ? "light" : "dark";
    setColorModeSelected(newColorMode)
    document.querySelector("html").setAttribute("data-bs-theme", newColorMode);
  },[colorModeSelected]);

  const callGlobalAlert = useCallback((body) => {
    if (isString(body.message)) {
      globalAlertRef.current.show(body)
    } else {
      console.error('message is required');
    }
  },[])

  //Example: callGlobalNotify({variant: 'success', message: 'Tarefa foi salva com sucesso', icon: FiCheck, position: 'bottom'})
  const callGlobalNotify = useCallback((body) => {
    if (isString(body.message)) {
      
      notify.current.add({...body, position: 'top-right'})
    } else {
      console.error('message is required');
    }
  }, [])

  const callGlobalDialog = useCallback((body) => {
      dialog.current.show(body)
      return new Promise((resolve, reject) => {
        setPromiseDialog({ resolve, reject })
      })
  }, []);
  
  const handleGlobalLoading = {
    show: (msg) => loadingOverLay.current.show(msg),
    hide: () => loadingOverLay.current.hide(),
  }
  
  useEffect(() => {
    (async () => {
      loadColorModeSelected()
    })()
  }, []);

  const contextValues = useMemo(() => ({
      colorModeSelected,
      toggleTheme,
      callGlobalAlert,
      callGlobalNotify,
      callGlobalDialog,
      handleGlobalLoading
  }), [colorModeSelected])
  return (
    <ThemeContext.Provider value={contextValues}>
      {children}
      <GlobalAlert ref={globalAlertRef} />
      <ModalDialog
        ref={dialog}
        onSuccess={(results) => {
          promiseDialog.resolve(results)
        }}
        onCancel={() => promiseDialog.reject()}
        onHide={() => promiseDialog.reject()}/>

      <LoadingOverLay ref={loadingOverLay} />
      <Notify ref={notify} />
    </ThemeContext.Provider>
  );
})

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme precisa ser usado dentro de um ThemeProvider.');
  }

  return context;
}
