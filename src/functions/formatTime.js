/**
   *@param {Number} time
   * @return {String}
  */
export default function formatTime(time) {
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
