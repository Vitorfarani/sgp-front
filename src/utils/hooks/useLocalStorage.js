import { useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);

  const setItem = async (value) => {
    try {
      setStoredValue(value);
      if(value === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
    }
  }

  const getItem = async (fun = () => {}) => {
    return new Promise(async (resolve, reject) => {
      try {
        const value = window.localStorage.getItem(key);
        if (value !== null) {
          setStoredValue(JSON.parse(value));
          resolve(JSON.parse(value))
        } else {
          setStoredValue(initialValue);
          resolve(null)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  return [storedValue, setItem, getItem];
};
