import React, {useState} from 'react';
import {
  createMuiTheme, responsiveFontSizes, makeStyles, ThemeProvider,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  AppBar, Toolbar, Container, TextField, Button, List, ListItem, ListItemText,
  Dialog, DialogTitle, DialogContent,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import WbSunnyIcon from '@material-ui/icons/WbSunny';

import {
  ApolloClient, InMemoryCache, gql, ApolloProvider, useLazyQuery,
} from '@apollo/client';

const routeClient = new ApolloClient({
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
  cache: new InMemoryCache(),
});

const GET_ROUTE = gql`
  query Route($fromLat: Float!, $fromLon: Float!) {
    plan(
      from: {lat: $fromLat, lon: $fromLon}
      to: {lat: 60.16736926540844, lon: 24.921782530681504}
      numItineraries: 5
    ) {
      itineraries {
        startTime
        endTime
        duration
        walkDistance
        legs {
          startTime
          endTime
          mode
          duration
          realTime
          distance
          transitLeg
          from {
            lat
            lon
            name
            stop {
              code
              name
            }
          }
          to {
            lat
            lon
            name
            stop {
              code
              name
            }
          }
          trip {
            tripHeadsign
            routeShortName
          }
        }
      }
    }
  }`;

const App = React.forwardRef((props, ref) => {
  const [brightness, setBrightness] = useState('light');

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
      },
      textAlign: 'center',
    },
  }));

  const classes = useStyles();

  const [address, setAddress] = useState('');
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState(null);
  const [results, setResults] = useState('');

  /**
   * @return {div}
   */
  function DelayedRoute() {
    const [getRoute, {loading, error, data}] =
    useLazyQuery(GET_ROUTE, {onCompleted: () => {
      setResults(data);
    }});

    if (loading) return (<p>Loading...</p>);
    if (error) return (<p>Error :(</p>);

    /** */
    async function handleClick() {
      const result = await handleAddress();
      const resData = result.features[0].geometry.coordinates;
      getRoute({variables: {fromLat: resData[1], fromLon: resData[0]}});
    }

    /**
   *@param {Object} event
   *@param {Object} entry
  */
    function handleOpen(event, entry) {
      setRoute(entry);
      setOpen(true);
    }

    return (
      <div>
        <TextField
          autoFocus
          margin="dense"
          type="string"
          id="form-name"
          label="Starting address"
          value={address}
          onChange={(address) => setAddress(address.target.value)}
          inputProps={{maxLength: 100}}
        />
        <br />
        <Button onClick={() => handleClick()}>
          Get timetable
        </Button>
        <br />
        <Typography variant="h5" className={classes.title}>
          {address !== '' ?
                  address + ' - Maria 01' : <></>}
        </Typography>
        <br />
        <List>
          {results && results.plan.itineraries.map((entry, index) => (
            <div key={index}>
              <ListItem button onClick={((e) => handleOpen(e, entry))}>
                <ListItemText
                  primary={'Route ' + (index + 1) + ' ' +
                  Math.ceil(entry.duration/60) + 'min'}
                  secondary={
                    <React.Fragment>
                      {formatTime(entry.startTime)}&nbsp;
                      -&nbsp;{formatTime(entry.endTime)}
                    </React.Fragment>
                  }>
                </ListItemText>
              </ListItem>
            </div>
          ))}
        </List>
      </div>
    );
  }

  /**
   *@param {Number} time
   * @return {String}
  */
  function formatTime(time) {
    const date = new Date(time);
    let hours = date.getHours();
    if (hours < 10) {
      hours = '0' + hours;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    const timeAsString = hours + ':' + minutes;
    return timeAsString;
  }

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
          <Typography>Route info</Typography>
        </DialogTitle>
        <DialogContent>
          {route ? route.legs.map((entry, index) => (
            <div key={index}>
              <ListItem>
                <ListItemText
                  primary={
                    entry.mode +
                    (entry.trip ?
                    ' ' + entry.trip.routeShortName :
                    '')
                  }
                  secondary={
                    <React.Fragment>
                      {entry.from.stop && entry.to.stop ?
                      entry.from.stop.name +
                      ' - ' +
                      entry.to.stop.name :
                      entry.from.name +
                      ' - ' +
                      entry.to.name}
                      <br/>
                      {formatTime(entry.startTime)}&nbsp;
                      -&nbsp;{formatTime(entry.endTime)}
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

  /** */
  async function handleAddress() {
    const res = await fetch('https://api.digitransit.fi/geocoding/v1/search?text=' + address + '&size=1');
    const data = await res.json();
    return data;
  }

  return (
    <ApolloProvider client={routeClient}>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <div className="App">
          <AppBar position="static">
            <Toolbar>
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
