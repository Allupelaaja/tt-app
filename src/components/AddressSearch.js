import React from 'react';
import Typography from '@material-ui/core/Typography';
import {
  TextField, Button,
} from '@material-ui/core';
import {connect} from 'react-redux';
import {
  gql, useLazyQuery,
} from '@apollo/client';
import {
  makeStyles,
} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {setAddress} from '../actions/setAddress';
import store from '../store/routesStore';

window.store = store;
window.setAddress = setAddress;

const mapStateToProps = (state) => {
  return {
    address: state.address,
  };
};

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
  customBtn: {
    marginLeft: '5vh',
  },
  buttonDiv: {
    marginBottom: '2vh',
  },
}));

/**
* @return {div}
*/
function AddressSearch({address}) {
  AddressSearch.propTypes = {
    address: PropTypes.string,
  };

  const classes = useStyles();

  const [getRoute, {data}] =
      useLazyQuery(GET_ROUTE, {
        onCompleted: () => {
          store.dispatch(setData(data));
        },
      });


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

  return (
    <div className={classes.buttonDiv}>
      <TextField
        autoFocus
        margin="dense"
        type="string"
        id="form-name"
        label="Starting address"
        value={address}
        onChange={(address) => store.dispatch(setAddress(address.target.value))}
        inputProps={{maxLength: 100}}
      />
      <Button
        className={classes.customBtn}
        variant='contained' onClick={() => handleClick()}>
        <Typography variant="h5">
          Get timetable
        </Typography>
      </Button>
    </div>);
}

const connAddress = connect(mapStateToProps)(AddressSearch);

export default connAddress;
