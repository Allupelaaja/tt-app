import React, {useState} from 'react';
import {
  createMuiTheme, responsiveFontSizes, makeStyles, ThemeProvider,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  AppBar, Toolbar, Container, TextField, Button, List, ListItem, ListItemText,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

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
      numItineraries: 3
    ) {
      itineraries {
        legs {
          startTime
          endTime
          mode
          duration
          realTime
          distance
          transitLeg
        }
      }
    }
  }`;

const App = React.forwardRef((props, ref) => {
  let customTheme = createMuiTheme({
    palette: {
      type: 'dark',
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

  /**
   * @return {div}
   */
  function DelayedRoute() {
    const [getRoute, {loading, error, data}] = useLazyQuery(GET_ROUTE);

    if (loading) return (<p>Loading...</p>);
    if (error) return (<p>Error :(</p>);

    /** */
    async function handleClick() {
      const result = await handleAddress();
      const resData = result.features[0].geometry.coordinates;
      getRoute({variables: {fromLat: resData[1], fromLon: resData[0]}});
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
          Get routes
        </Button>
        <br />
        <List>
          {data && data.plan.itineraries.map((entry, index) => (
            <div key={index}>
              <p>Itinerary</p>
              {entry.legs.map((innerEntry, index) => (
                <div key={index}>
                  <ListItem>
                    <ListItemText
                      primary={innerEntry.mode}
                      secondary={
                        <React.Fragment>
                          Leg start time:
                          {new Date(innerEntry.startTime).toString()}
                          <br />
                      Leg end time: {new Date(innerEntry.endTime).toString()}
                        </React.Fragment>
                      }>
                    </ListItemText>
                  </ListItem>
                </div>
              ))}
            </div>
          ))}
        </List>
      </div>
    );
  }

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
            </Toolbar>
          </AppBar>
          <main>
            <Container className={classes.mainContent}>
              <div>
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
