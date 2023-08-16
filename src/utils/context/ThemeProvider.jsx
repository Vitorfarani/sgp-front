


import React, { createContext, useContext, useEffect, useState} from "react";
import { useLocalStorage } from "@/utils/hooks/useLocalStorage";
import { GlobalAlert } from "@/components/index";
import { ThemeContext } from "./index";


export const ThemeProvider = ({ children }) => {
  const [colorModeSelected, setColorModeSelected, loadColorModeSelected] = useLocalStorage('colorModeSelected', document.querySelector("html").getAttribute("data-bs-theme"));
  const [modalProps, setModalProps] = useState({});
  
  function toggleTheme() {
    let newColorMode = colorModeSelected === "dark" ? "light" : "dark";
    console.log(newColorMode)
    setColorModeSelected(newColorMode)
    document.querySelector("html").setAttribute("data-bs-theme", newColorMode);
  }

  function callGlobalAlert(body) {
    if(Object.keys(body).includes('message')) {
      console.log(body)
      setModalProps(body)
    } else {
      throw 'message is required';
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
      callGlobalAlert
    }}>
      {children}
      <GlobalAlert
        show={!!modalProps.message}
        onHide={() => {
          console.log('hide')
          setModalProps({})
        }}
        modalProps={modalProps}/>
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
