/**
 * @param {payload} payload
 * @return {function}
*/
export function setStarting(payload) {
  return {type: 'SET_STARTING', payload};
}
