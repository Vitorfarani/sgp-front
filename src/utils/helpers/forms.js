import { isString } from "./is";

export function formatForm(formData) {
  const state = { ...formData };

  const trimTextInputs = () => {
    Object.keys(state).map((field) => {
      if(isString(state[field])) {
        state[field] = state[field].trim()
        if(state[field] === '') {
          state[field] = null
        }
      }
    });

    return {
      ...state,
      trimTextInputs,
      rebaseIds,
      formatDates,
      rebaseIdsToObj,
      getResult
    };
  };
  
  const rebaseIds = fieldsToRebase => {
    fieldsToRebase.forEach(field => {
      if (!!state[field]) {
        state[field+'_id'] = state[field].id;
        delete state[field];
      }
    });

    return {
      ...state,
      trimTextInputs,
      rebaseIds,
      formatDates,
      rebaseIdsToObj,
      getResult
    };
  };
  const rebaseIdsToObj = fieldsToRebase => {
    fieldsToRebase.forEach(field => {
      if (state[field] !== undefined) {
        state[field] = {id: state[field]};
      }
    });

    return {
      ...state,
      trimTextInputs,
      rebaseIds,
      formatDates,
      rebaseIdsToObj,
      getResult
    };
  };

  const formatDates = fieldsToFormat => {
    fieldsToFormat.forEach(field => {
      if (state[field] !== undefined) {
        // Implement your date formatting logic here
        // For example: state[field] = format(state[field], 'yyyy-MM-dd');
      }
    });

    return {
      ...state,
      trimTextInputs,
      rebaseIds,
      formatDates,
      rebaseIdsToObj,
      getResult
    };
  };
  function getResult() {
    return state
  }
  return {
    trimTextInputs,
    rebaseIds,
    formatDates,
    rebaseIdsToObj,
    getResult
  };
}

