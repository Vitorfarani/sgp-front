import { isSet } from "@/utils/helpers/is";

export function getSelectStyles(multi, size, isInvalid = false) {
  const suffix = size ? `-${size}` : '';
  const multiplicator = multi ? 2 : 1;
  return {
    control: (provided, { isDisabled, isFocused }) => ({
      ...provided,
      backgroundColor: `var(--bs-body-bg)`,

      borderColor: !isInvalid ? `var(--bs-border-color)` : `var(--bs-form-invalid-border-color)`,
      // borderWidth: "var(--bs-select-border-width)",
      lineHeight: "var(--bs-select-line-height)",
      fontSize: `var(--bs-select-font-size${suffix})`,
      fontWeight: "var(--bs-select-font-weight)",
      borderRadius: 'var(--bs-border-radius)',
      minHeight: `calc((var(--bs-select-line-height)*var(--bs-select-font-size${suffix})) + (var(--bs-select-padding-y${suffix})*2) + (var(--bs-select-border-width)*2))`,
      ':hover': {
        // borderColor: "var(--bs-select-focus-border-color)",
      },
    }),
    singleValue: ({ marginLeft, marginRight, ...provided }, { data }) => {
      return {
        ...provided,
        ...dot(data),
        color: `var(--bs-body-color)`,
      }
    },
    // valueContainer: (provided, state) => ({
    //   ...provided,
    //   padding: `calc(var(--bs-select-padding-y${suffix})/${multiplicator}) calc(var(--bs-select-padding-x${suffix})/${multiplicator})`,
    // }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: `var(--bs-body-color)`,
      backgroundColor: `var(--bs-body-bg)`,
    }),
    input: ({ margin, paddingTop, paddingBottom, ...provided }, { data }) => ({
      ...provided,
      color: `var(--bs-body-color)`,
      ...dot(data),
    }),
    option: (provided, {data}) => ({
      ...provided,
      ...dot(data),
      color: `var(--bs-body-color)`,
      backgroundColor: `var(--bs-body-bg)`,
      borderColor: `var(--bs-body-bg)`,
     
      // margin: `calc(var(--bs-select-padding-y${suffix})/2) calc(var(--bs-select-padding-x${suffix})/2)`,
    }),
    menu: ({ marginTop, ...provided }, state) => ({
      ...provided,
      backgroundColor: `var(--bs-body-bg)`,

    }),
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
        backgroundColor: data.color ? data.color : 'var(--bs-heading-color)',
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,

      color: 'white',
      backgroundColor: data.color ? data.color : 'var(--bs-primary)',
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      // color: data.color ? data.color : 'var(--bs-heading-color)',
      // ':hover': {
      //   color: data.color ? data.color : 'var(--bs-heading-color)',
      // },
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
export const dot = (data) => {
  if(!isSet(data) || !isSet(data.color)) return
  return {
    alignItems: 'center',
    display: 'flex',
    ':before': {
      backgroundColor: !!data.color ? data.color : 'var(--bs-primary)',
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
  }
};
