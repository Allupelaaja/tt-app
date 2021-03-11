import logo from './logo.svg';
import React from 'react';
import { createMuiTheme, responsiveFontSizes, makeStyles, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { AppBar, Toolbar, Container } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { ApolloClient, InMemoryCache, gql, ApolloProvider, useQuery } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
  cache: new InMemoryCache()
});

const SINGLE_STOP = gql`
  query getStop {
    stop(id: "HSL:1040129") {
      name
      lat
      lon
    }
  }`;

function SingleStop() {
  const { loading, error, data } = useQuery(SINGLE_STOP);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div key={data.stop.name}>
      <p>
        {data.stop.name}: {data.stop.lat}, {data.stop.lon}
      </p>
    </div>
  );
}

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
                  <SingleStop></SingleStop>
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
