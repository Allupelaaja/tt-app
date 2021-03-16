import React, {useState} from 'react';
import {
  createMuiTheme, responsiveFontSizes, makeStyles, ThemeProvider,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  AppBar, Toolbar, Container, Button, ListItem, ListItemText,
  Dialog, DialogTitle, DialogContent,
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
import formatTime from './functions/formatTime';

window.store = store;
window.setData = setData;

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
    entry: {
      borderRadius: '25px',
      margin: '10px',
    },
    customBtn: {
      marginLeft: '5vh',
    },
    buttonDiv: {
      marginBottom: '2vh',
    },
  }));

  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState(null);

  /**
   * @return {div}
   */
  function MoreInfo() {
    return (
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle
          id="simple-dialog-title">
          <Typography variant="h5">Route info</Typography>
        </DialogTitle>
        <DialogContent>
          {route ? route.legs.map((entry, index) => (
            <div key={index} className={classes.entry}>
              <ListItem>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography variant="h5">
                        {entry.mode +
                          (entry.trip ?
                            ' ' + entry.trip.routeShortName :
                            '') + ' - ' +
                            Math.ceil(entry.duration / 60) + 'min'}
                      </Typography>
                    </React.Fragment>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography variant="h5">
                        {entry.from.stop && entry.to.stop ?
                          entry.from.stop.name +
                          ' - ' +
                          entry.to.stop.name :
                          entry.from.name +
                          ' - ' +
                          entry.to.name}
                        <br />
                        {formatTime(entry.startTime)}&nbsp;
                      -&nbsp;{formatTime(entry.endTime)}
                      </Typography>
                    </React.Fragment>
                  }>
                </ListItemText>
              </ListItem>
            </div>
          )) : <></>}
        </DialogContent>
      </Dialog>
    );
  }

  const handleClose = () => {
    setOpen(false);
  };

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
                <MoreInfo open={open} onClose={handleClose}></MoreInfo>
                <DelayedRoute
                  setRoute={setRoute}
                  setOpen={setOpen}>
                </DelayedRoute>
              </div>
            </Container>
          </main>
        </div>
      </ThemeProvider>
    </ApolloProvider>
  );
});

export default App;
