import * as types from '../types';

const initialState = {
    pagina: 'Demanda'
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
    switch (action.type) {
        case types.MUDAR_HEADER: {
            const newState = { pagina: action.payload };
            return newState;
        }

        default: {
            return state;
        }
    }
}