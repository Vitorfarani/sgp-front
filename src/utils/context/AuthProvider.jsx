import React, { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import moment from "moment";
import { loginApi, MOCK_USER } from "@/services/AuthService.js";
import { logoutGov, sendCodeToGov } from "@/services/sso.js";
import { useLocalStorage } from "@/utils/hooks/useLocalStorage";
import { isExpired } from "@/utils/helpers";
import { AuthContext } from ".";

export const AuthProvider = ({ children }) => {
  const [user, setUser, loadUser] = useLocalStorage('user', null);
  const [dataSSO, setDataSSO, loadDataSSO] = useLocalStorage('dataSSO', null);
  const [isLogged, setIsLogged] = useState(false);
  const [hmlMode, sethmlMode] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [verifing, setVerifing] = useState(false);

  async function login(user, resultSSO) {
    setUser(user)
    resultSSO.loginIn = moment();
    setDataSSO(resultSSO);
    setIsLogged(true)
    setLoaded(true);
  }

  async function logout(clean = false, cleanDetran = false) {
    if (clean) {
      // await logoutGov(dataSSO)
      setUser(null)
      setTheme(null)
      setDataSSO(null);
      window.localStorage.clear();
    }
    setIsLogged(false)
    sethmlMode(false)
    setVerifing(false)
  }

  function handleVerifing(p) {
    setVerifing(p)
  }
  
  const cbSubmit = async (resultSSO, signature = null) => {
    login(MOCK_USER, resultSSO);
    return Promise.resolve()
    await loginApi(resultSSO.access_token)
    .then(async (response) => {
        let responseUser = response.data
        let theme = null;
        // responseUser.cpf = '0' + 9976919727
        if(responseUser.cpf.toString().length === 10) {
          responseUser.cpf = '0' + responseUser.cpf
        }
        login(responseUser, theme, resultSSO);
      })
      .catch((error) => {
        if(error === 'Usuário inválido.') {
          setDataSSO(null)
          setIsLogged(false)
          return;
        }
        if (!!error) {
          Alert.alert('Validação', error)
        }
        setIsLogged(false)
      })
  }

  async function loadLocal() {
    try {
      let userL = await loadUser();
      await loadDataSSO()
      .then((token) => {
        if(token) {
          setUser(MOCK_USER)
          setIsLogged(true)
        }
        setLoaded(true)
      });

    } catch (error) {

    }
  }

  useEffect(() => {
    loadLocal()
  }, []);

  return (
    <AuthContext.Provider value={{
      isLogged,
      isLoaded,
      user,
      dataSSO,
      login,
      logout,
      cbSubmit,
      dataSSO,
      hmlMode,
      sethmlMode,
      setIsLogged,
      verifing,
      handleVerifing
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
