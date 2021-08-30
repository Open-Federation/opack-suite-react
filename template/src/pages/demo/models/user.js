const config = {
  state: {
    list: ['tom', 'xiaoming'],
    status: 0,
    filterText: ''
  },

  changeCurrentEditUserAction: function (draftState, params) {
    draftState.list[params.index] = params.name;
  },
  /**
   * paramsTypes = {
   *  text: filterText
   * }
   */
  changeFilterValueAction: function (draftState, params) {
    draftState.filterText = params.text;
  },
  changeEditIndexAction: function (draftState, params) {
    draftState.currentEditIndex = params.index;
  },
  addUserAction: function (draftState) {
    draftState.list.push(getRandomName());
    draftState.status = 0;
  },
  requestStatusAction: function (draftState) {
    draftState.status = 1;
  },
  delUserAction: function (draftState, params) {
    draftState.list.splice(params.index, 1);
  }
};

export default config;

function getRandomName(len = 4) {
  let str = '';
  while (len--) str += String.fromCharCode(97 + Math.ceil(Math.random() * 25));
  return str;
}
