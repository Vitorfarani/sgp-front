import { createContext } from "react";

export const AuthContext = createContext({
  isLoaded: false,
  isLogged: false,
  user: null,
  detranLocal: null,
  login: () => {},
  logout: () => { },
  cbSubmit: () => {},
  isLoaded: false,
  dataSSO: null,
  verifing: false,
  handleVerifing: () => { },
});

export const ThemeContext = createContext({
  colorModeSelected: 'dark',
  toggleTheme: () => {},
  callGlobalAlert: () => {},
  callGlobalNotify: () => {},
  callGlobalDialog: () => new Promise(),
  handleGlobalLoading: {
    show: () => {}, 
    hide: () => {}, 
  }
});
