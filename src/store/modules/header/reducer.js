import * as types from "../types";

const initialState = {
  pagina: "Demanda",
  compact: false,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case types.MUDAR_HEADER: {
      const newState = { ...state, pagina: action.payload };
      return newState;
    }

    case types.COMPACT_HEADER: {
      const newState = { ...state, compact: !state.compact };
      console.log(newState.compact);
      return newState;
    }

    default: {
      return state;
    }
  }
}
