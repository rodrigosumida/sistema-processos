import * as types from "../types";

export function mudarHeader(payload) {
  return {
    type: types.MUDAR_HEADER,
    payload,
  };
}

export function compactHeader(payload) {
  return {
    type: types.COMPACT_HEADER,
    payload,
  };
}
