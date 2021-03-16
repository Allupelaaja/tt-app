
/**
 * @param {payload} payload
 * @return {function}
*/
export function setBool(payload) {
  return {type: 'SET_BOOL', payload};
}
