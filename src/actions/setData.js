/**
 * @param {payload} payload
 * @return {function}
*/
export function setData(payload) {
  return {type: 'SET_DATA', payload};
}
