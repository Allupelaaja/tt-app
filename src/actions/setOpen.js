/**
 * @param {payload} payload
 * @return {function}
*/
export function setOpen(payload) {
  return {type: 'SET_OPEN', payload};
}
