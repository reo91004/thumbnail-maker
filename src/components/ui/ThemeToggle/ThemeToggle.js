import React from 'react';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import './ThemeToggle.scss';

function ThemeToggle({ theme, onToggle }) {
  return (
    <button className="theme-toggle" onClick={onToggle} aria-label="Toggle theme">
      {theme === 'dark' ? <MdLightMode /> : <MdDarkMode />}
    </button>
  );
}

export default ThemeToggle;
