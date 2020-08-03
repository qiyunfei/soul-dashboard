import {
  getAllService,
  getAllServiceList
} from "../services/api";

export default {
  namespace: "serviceList",

  state: {
    serviceList: [],
    serviceListList: [],
    currentService: ""
  },

  effects: {
    *fetchService({ payload }, { call, put }) {
      const json = yield call(getAllService, { ...payload });
      if (json.code === 200) {
        let dataList = json.data;
        dataList = dataList.map(item => {
          item.key = item.appName;
          return item;
        });
        yield put({
          type: "saveService",
          payload: {
            serviceList: dataList
          }
        });

        yield put({
          type: "saveCurrentService",
          payload: {
            currentService:
              dataList && dataList.length > 0 ? dataList[0] : ""
          }
        });
        if (dataList && dataList.length > 0) {
          yield put({
            type: "fetchServiceList",
            payload: {
              appName: dataList[0].appName
            }
          });
        }
      }
    },
    *fetchServiceList({ payload }, { call, put }) {
      const json = yield call(getAllServiceList, payload);
      if (json.code === 200) {
        let dataList = json.data;
        dataList = dataList.map(item => {
          item.key = item.address;
          return item;
        });
        yield put({
          type: "saveServiceList",
          payload: {
            serviceListList: dataList
          }
        });
      }
    }
  },

  reducers: {
    saveService(state, { payload }) {
      return {
        ...state,
        serviceList: payload.serviceList,
      };
    },

    saveServiceList(state, { payload }) {
      return {
        ...state,
        serviceListList: payload.serviceListList,
      };
    },
    saveCurrentService(state, { payload }) {
      return {
        ...state,
        currentService: payload.currentService
      };
    }
  }
};

