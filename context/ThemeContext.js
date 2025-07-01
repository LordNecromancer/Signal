import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext('light');

/*
Theme context to propagate theme information from HeaderDropDown component to main page.
*/
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default theme

  const toggleTheme = (selectedTheme) => setTheme(selectedTheme);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
