import React, { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import moment from "moment";
import { loginApi, me, logout as logoutApi } from "@/services/AuthService.js";
import { logoutGov } from "@/services/sso.js";
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

  async function login(user) {
    setUser(user)
    // resultSSO.loginIn = moment();
    // setDataSSO(resultSSO);
    setIsLogged(true)
    setLoaded(true);
  }

  async function logout(clean = false, cleanDetran = false) {
    if (clean) {
      await logoutApi()
      setUser(null)
      window.localStorage.clear();
    }
    setIsLogged(false)
  }

  function handleVerifing(p) {
    setVerifing(p)
  }
  
  const cbSubmit = async (code, signature = null) => {
    await loginApi(code)
    .then(async (response) => {
        let responseUser = response.data.user
       
        login(responseUser);
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
      me()
      .then(({data}) => {
        setUser(data.user)
        setIsLogged(true)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(()=> {
        setLoaded(true)

      })

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
