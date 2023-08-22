export function getSelectStyles(multi, size) {
  const suffix = size ? `-${size}` : '';
  const multiplicator = multi ? 2 : 1;
  return {
    control: (provided, { isDisabled, isFocused }) => ({
      ...provided,
      backgroundColor: `var(--bs-body-bg)`,
     
      borderColor: `var(--bs-border-color)`,
      // borderWidth: "var(--bs-select-border-width)",
      lineHeight: "var(--bs-select-line-height)",
      fontSize: `var(--bs-select-font-size${suffix})`,
      fontWeight: "var(--bs-select-font-weight)",
      minHeight: `calc((var(--bs-select-line-height)*var(--bs-select-font-size${suffix})) + (var(--bs-select-padding-y${suffix})*2) + (var(--bs-select-border-width)*2))`,
      ':hover': {
        // borderColor: "var(--bs-select-focus-border-color)",
      },
    }),
    singleValue: ({ marginLeft, marginRight, ...provided }, { isDisabled }) => ({
      ...provided,
      color: `var(--bs-body-color)`,
    }),
    // valueContainer: (provided, state) => ({
    //   ...provided,
    //   padding: `calc(var(--bs-select-padding-y${suffix})/${multiplicator}) calc(var(--bs-select-padding-x${suffix})/${multiplicator})`,
    // }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: `var(--bs-body-color)`,
      backgroundColor: `var(--bs-body-bg)`,
    }),
    input: ({ margin, paddingTop, paddingBottom, ...provided }, state) => ({
      ...provided,
      color: `var(--bs-body-color)`,
    }),
    option: (provided, state) => ({
      ...provided,
      color: `var(--bs-body-color)`,
      backgroundColor: `var(--bs-body-bg)`,
      // margin: `calc(var(--bs-select-padding-y${suffix})/2) calc(var(--bs-select-padding-x${suffix})/2)`,
    }),
    // menu: ({ marginTop, ...provided }, state) => ({
    //   ...provided
    // }),
    // multiValue: (provided, state) => ({
    //   ...provided,
    //   margin: `calc(var(--bs-select-padding-y${suffix})/2) calc(var(--bs-select-padding-x${suffix})/2)`,
    // }),
    // clearIndicator: ({ padding, ...provided }, state) => ({
    //   ...provided,
    //   alignItems: "center",
    //   justifyContent: "center",
    //   height: "100%",
    //   width: "var(--bs-select-indicator-padding)"
    // }),
    // multiValueLabel: ({ padding, paddingLeft, fontSize, ...provided }, state) => ({
    //   ...provided,
    //   padding: `0 var(--bs-select-padding-y${suffix})`,
    //   whiteSpace: "normal"
    // })
    multiValue: (styles, { data }) => {
      return {
        ...styles,
        backgroundColor: data.color,
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: 'white',
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      ':hover': {
        backgroundColor: data.color,
        color: 'white',
      },
    }),
  }
}

export function IndicatorSeparator() {
  return null;
}



export function getSelectTheme(theme) {
  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary: "var(--bs-secondary)",
      danger: "var(--bs-danger)",
    }
  }
}