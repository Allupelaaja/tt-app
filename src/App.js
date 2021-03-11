import logo from './logo.svg';
import React, { useState, useEffect } from 'react'
import { createMuiTheme, responsiveFontSizes, makeStyles, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { AppBar, Toolbar, Container, TextField } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';

import { ApolloClient, InMemoryCache, gql, ApolloProvider, useQuery, useLazyQuery } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
  cache: new InMemoryCache()
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

  const [fromLat, setFromLat] = useState(60.168992)
  const [fromLon, setFromLon] = useState(24.932366)

  function DelayedRoute() {
    const [getRoute, { loading, error, data }] = useLazyQuery(GET_ROUTE)

    if (loading) return (<p>Loading...</p>)
    if (error) return (<p>Error :(</p>)

    return (
      <div>
        <button onClick={() => getRoute({ variables: { fromLat: fromLat, fromLon: fromLon } })}>
          Get start time
      </button>
        {data ? <p>{data.plan.itineraries[0].legs[0].startTime}</p> : <p>results here</p>}
      </div>
    )
  }

  return (
    <ApolloProvider client={client}>
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
                  <div>
                    <TextField
                      autoFocus
                      margin="dense"
                      type="number"
                      id="form-name"
                      label="Latitude"
                      value={fromLat}
                      onChange={fromLat => setFromLat(fromLat.target.value)}
                      inputProps={{ maxLength: 100 }}
                    />
                    <br />
                    <TextField
                      autoFocus
                      margin="dense"
                      type="number"
                      id="form-name"
                      label="Longitude"
                      value={fromLon}
                      onChange={fromLon => setFromLon(fromLon.target.value)}
                      inputProps={{ maxLength: 100 }}
                    />
                    <br />
                  </div>
                  <DelayedRoute></DelayedRoute>
                </Typography>
              </div>
            </Container>
          </main>
        </div>
      </ThemeProvider>
    </ApolloProvider>
  );
})

export default App;
