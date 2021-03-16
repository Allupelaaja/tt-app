/**
 * @param {payload} payload
 * @return {function}
*/
export function setEmpty(payload) {
  return {type: 'SET_EMPTY', payload};
}
