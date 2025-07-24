import { call, put, all, takeLatest } from "redux-saga/effects";
import { get } from "lodash";
import * as actions from "./actions";
import * as types from "../types";
import api from "../../../api/axios";

function* loginRequest({ payload }) {
  try {
    const response = yield call(api.post, "/token/insert", payload);
    yield put(
      actions.loginSuccess({
        ...response.data,
      })
    );

    api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
  } catch (error) {
    yield put(actions.loginFailure);
  }
}

function persistRehydrate({ payload }) {
  const token = get(payload, "auth.token");
  if (!token) return;

  api.defaults.headers.Authorization = `Bearer ${token}`;
}

export default all([
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
]);
