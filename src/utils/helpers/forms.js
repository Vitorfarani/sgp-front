export function formatForm(formData) {
  const state = { ...formData };

  const rebaseIds = fieldsToRebase => {
    fieldsToRebase.forEach(field => {
      if (!!state[field]) {
        state[field] = state[field].id;
      }
    });

    return {
      ...state,
      rebaseIds,
      formatDates,
      rebaseIdsToObj
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
      rebaseIds,
      formatDates,
      rebaseIdsToObj
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
      rebaseIds,
      formatDates
    };
  };

  return {
    rebaseIds,
    formatDates
  };
}

