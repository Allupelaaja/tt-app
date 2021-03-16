import React from 'react';
import Typography from '@material-ui/core/Typography';
import {
  List, ListItem, ListItemText,
} from '@material-ui/core';
import {connect} from 'react-redux';
import {
  makeStyles,
} from '@material-ui/core/styles';
import formatTime from '../functions/formatTime';
import PropTypes from 'prop-types';
import {setBool} from '../actions/setBool';
import {setOpen} from '../actions/setOpen';
import store from '../store/routesStore';

window.store = store;
window.setOpen = setOpen;
window.setBool = setBool;

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
  return {
    content: state.content,
    isOpen: state.isOpen,
    routes: state.routes,
    address: state.address,
  };
};

/**
* @return {div}
*/
function DelayedRoute({content, isOpen, routes, address}) {
  DelayedRoute.propTypes = {
    content: PropTypes.object,
    isOpen: PropTypes.bool,
    routes: PropTypes.object,
    address: PropTypes.string,
  };

  const classes = useStyles();

  /**
   *@param {Object} event
   *@param {Object} entry
  */
  function handleOpen(event, entry) {
    store.dispatch(setOpen(entry));
    store.dispatch(setBool(true));
  }

  return (
    <div>
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
