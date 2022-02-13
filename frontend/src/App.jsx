import React from 'react';
import OrderCore from './components/OrderCore';

import { createTheme, responsiveFontSizes, StyledEngineProvider } from '@mui/material/styles';
import { ThemeProvider as MuiThemeProvider, StylesProvider } from '@mui/styles';
import { ThemeProvider } from '@emotion/react';

import styles from './styles';

//Auto responsive font sizes by viewport
let theme = createTheme();
theme = responsiveFontSizes(theme);


const App = () => {


	return (
        <StylesProvider injectFirst>
    		<StyledEngineProvider injectFirst>
                <MuiThemeProvider theme={theme}>
                    <ThemeProvider theme={theme}>
                        <OrderCore />
                    </ThemeProvider>
                </MuiThemeProvider>
            </StyledEngineProvider>
 		 </StylesProvider>
    );
}

export default App;