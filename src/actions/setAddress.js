/**
 * @param {payload} payload
 * @return {function}
*/
export function setAddress(payload) {
  return {type: 'SET_ADDRESS', payload};
}
