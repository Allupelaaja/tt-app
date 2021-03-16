import React, {useState} from 'react';
import {
  createMuiTheme, responsiveFontSizes, makeStyles, ThemeProvider,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  AppBar, Toolbar, Container, Button,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import {
  ApolloClient, InMemoryCache, ApolloProvider,
} from '@apollo/client';
import store from './store/routesStore';
import {setData} from './actions/setData';
import DelayedRoute from './components/DelayedRoute';
import MoreInfo from './components/MoreInfo';
import AddressSearch from './components/AddressSearch';
import {setBool} from './actions/setBool';
import {setOpen} from './actions/setOpen';

window.store = store;
window.setData = setData;
window.setOpen = setOpen;
window.setBool = setBool;

const routeClient = new ApolloClient({
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
  cache: new InMemoryCache(),
});

const App = React.forwardRef((props, ref) => {
  const [brightness, setBrightness] = useState('light');

  store.subscribe(() => console.log('state', store.getState()));

  let customTheme = createMuiTheme({
    palette: {
      type: brightness,
    },
  });
  customTheme = responsiveFontSizes(customTheme);

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
      textAlign: 'center',
    },
    mainContent: {
      [theme.breakpoints.up('sm')]: {
        width: '75%',
        margin: '0 auto',
        padding: '30px',
        borderRadius: '25px',
        marginTop: '2vh',
      },
      textAlign: 'center',
      backgroundColor: customTheme.palette.background.paper,
      minHeight: '80vh',
    },
  }));

  const classes = useStyles();

  return (
    <ApolloProvider client={routeClient}>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <div className="App">
          <AppBar position="static">
            <Toolbar>
              <Typography>
                  Aleksi Heikkilä, 2021
              </Typography>
              <Typography variant="h4" className={classes.title}>
                  Timetables App
              </Typography>
              {brightness === 'light' ?
                  <Button
                    onClick={() => setBrightness('dark')}>
                    <Brightness3Icon />
                  </Button> :
                  <Button
                    onClick={() => setBrightness('light')}>
                    <WbSunnyIcon />
                  </Button>}
            </Toolbar>
          </AppBar>
          <main>
            <Container className={classes.mainContent}>
              <div>
                <AddressSearch></AddressSearch>
                <MoreInfo></MoreInfo>
                <DelayedRoute></DelayedRoute>
              </div>
            </Container>
          </main>
        </div>
      </ThemeProvider>
    </ApolloProvider>
  );
});

export default App;
