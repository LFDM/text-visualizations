import { trim } from 'lodash';
export default {
  normalize
};

function normalize(token) {
  return trim(token.toLowerCase());
}
