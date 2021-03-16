import React from 'react';
import Typography from '@material-ui/core/Typography';
import formatTime from '../functions/formatTime';
import {
  ListItem, ListItemText, Dialog, DialogTitle, DialogContent,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import {
  makeStyles,
} from '@material-ui/core/styles';
import {setBool} from '../actions/setBool';
import {setOpen} from '../actions/setOpen';
import store from '../store/routesStore';
import {connect} from 'react-redux';

window.store = store;
window.setOpen = setOpen;
window.setBool = setBool;

const mapStateToProps = (state) => {
  return {
    content: state.content,
    isOpen: state.isOpen,
    routes: state.routes};
};

/**
 * @return {div}
*/
function MoreInfo({content, isOpen, routes}) {
  const useStyles = makeStyles((theme) => ({
    entry: {
      borderRadius: '25px',
      margin: '10px',
    },
  }));

  const classes = useStyles();

  MoreInfo.propTypes = {
    content: PropTypes.object,
    isOpen: PropTypes.bool,
    routes: PropTypes.object,
  };

  const handleClose = () => {
    store.dispatch(setBool(false));
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={isOpen}
    >
      <DialogTitle
        id="simple-dialog-title">
        <Typography variant="h5">Route info</Typography>
      </DialogTitle>
      <DialogContent>
        {Object.keys(content).length != 0 ?
        content.legs.map((entry, index) => (
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

const Info = connect(mapStateToProps)(MoreInfo);

export default Info;
