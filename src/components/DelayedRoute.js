import React, {useState} from 'react';
import Typography from '@material-ui/core/Typography';
import {
  TextField, Button, List, ListItem, ListItemText,
} from '@material-ui/core';
import {connect} from 'react-redux';
import {
  gql, useLazyQuery,
} from '@apollo/client';
import {
  makeStyles,
} from '@material-ui/core/styles';
import formatTime from '../functions/formatTime';
import PropTypes from 'prop-types';

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

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    textAlign: 'center',
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

const mapStateToProps = (state) => {
  return {routes: state.routes};
};

/**
* @param {setRoute} setRoute
* @param {setOpen} setOpen
* @return {div}
*/
function DelayedRoute({routes, setRoute, setOpen}) {
  const [address, setAddress] = useState('');
  const [getRoute, {loading, error, data}] =
      useLazyQuery(GET_ROUTE, {
        onCompleted: () => {
          store.dispatch(setData(data));
        },
      });

  DelayedRoute.propTypes = {
    setRoute: PropTypes.func,
    setOpen: PropTypes.func,
    routes: PropTypes.object,
  };

  const classes = useStyles();

  if (loading) return (<p>Loading...</p>);
  if (error) return (<p>Error :(</p>);

  /** */
  async function handleClick() {
    const result = await handleAddress();
    const resData = result.features[0].geometry.coordinates;
    getRoute({variables: {fromLat: resData[1], fromLon: resData[0]}});
  }

  /** */
  async function handleAddress() {
    const res = await fetch('https://api.digitransit.fi/geocoding/v1/search?text=' + address + '&size=1');
    const data = await res.json();
    return data;
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
      <div className={classes.buttonDiv}>
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
        <Button
          className={classes.customBtn}
          variant='contained' onClick={() => handleClick()}>
          <Typography variant="h5">
          Get timetable
          </Typography>
        </Button>
      </div>
      <Typography variant="h5" className={classes.title}>
        {address !== '' ?
            address + ' - Maria 01' : <></>}
      </Typography>
      <br />
      <List>
        {Object.keys(routes).length != 0 &&
          routes.plan.itineraries.map((entry, index) => (
            <div key={index}>
              <ListItem button className={classes.entry}
                onClick={((e) => handleOpen(e, entry))}>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography variant="h5">
                        {'Route - ' + (index + 1) + ' / ' +
                          Math.ceil(entry.duration / 60) + 'min'}
                      </Typography>
                    </React.Fragment>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography variant="h5">
                        {formatTime(entry.startTime)}&nbsp;
                      -&nbsp;{formatTime(entry.endTime)}
                      </Typography>
                    </React.Fragment>
                  }>
                </ListItemText>
              </ListItem>
            </div>
          ))}
      </List>
    </div>
  );
};

const Routes = connect(mapStateToProps)(DelayedRoute);

export default Routes;
