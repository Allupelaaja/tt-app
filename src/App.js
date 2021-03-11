import logo from './logo.svg';
import React from 'react';
import { createMuiTheme, responsiveFontSizes, makeStyles, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { AppBar, Toolbar, Container } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const App = React.forwardRef((props, ref) => {
  let customTheme = createMuiTheme({
    palette: {
      type: 'dark',
    },
  })
  customTheme = responsiveFontSizes(customTheme)

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
      textAlign: "center",
    },
    mainContent: {
      [theme.breakpoints.up('sm')]: {
        width: '75%',
        margin: '0 auto',
        padding: '30px',
      },
    }
  }));

  const classes = useStyles();

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h4" className={classes.title}>
              Timetables App
          </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <Container className={classes.mainContent}>
            <div>
              <Typography variant="h6" className={classes.title}>
                Select locations
              </Typography>
            </div>
          </Container>
        </main>
      </div>
    </ThemeProvider>
  );
})

export default App;
