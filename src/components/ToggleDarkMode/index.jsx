import { useTheme } from '@/utils/context/ThemeProvider';
import React, { useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi'; // Importe os ícones do react-icons
import './style.scss';

function ToggleDarkMode({className}) {
  const { toggleTheme, colorModeSelected } = useTheme();

  let classes = "toggleDarkMode " + className;
  return (
    <button className={classes} onClick={toggleTheme}>
      {colorModeSelected == "light" ? <FiSun /> : <FiMoon />}
    </button>
  );
}

export default ToggleDarkMode;


