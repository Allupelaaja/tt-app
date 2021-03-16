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
import {setStarting} from '../actions/setStarting';
import {setEmpty} from '../actions/setEmpty';
import store from '../store/routesStore';

window.store = store;
window.setAddress = setAddress;
window.setStarting = setStarting;
window.setEmpty = setEmpty;

const mapStateToProps = (state) => {
  return {
    address: state.address,
    startingAddress: state.startingAddress,
    isEmpty: state.isEmpty,
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
function AddressSearch({address, startingAddress, isEmpty}) {
  AddressSearch.propTypes = {
    address: PropTypes.string,
    startingAddress: PropTypes.string,
    isEmpty: PropTypes.bool,
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
    if (address) {
      const result = await handleAddress();
      const resData = result.features[0].geometry.coordinates;
      getRoute({variables: {fromLat: resData[1], fromLon: resData[0]}});
      store.dispatch(setStarting(address));
    } else {
      store.dispatch(setEmpty(true));
    }
  }

  /** */
  async function handleAddress() {
    const res = await fetch('https://api.digitransit.fi/geocoding/v1/search?text=' + address + '&size=1');
    const data = await res.json();
    return data;
  }

  /**
   * @param {String} address
  */
  function addressChange(address) {
    store.dispatch(setEmpty(false));
    store.dispatch(setAddress(address));
  }

  return (
    <div className={classes.buttonDiv}>
      <TextField
        error={isEmpty}
        autoFocus
        margin="dense"
        type="string"
        id="form-name"
        label="Starting address"
        value={address}
        onChange={(address) => addressChange(address.target.value)}
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
