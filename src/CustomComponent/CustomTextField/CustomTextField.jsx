/* eslint-disable react/prop-types */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextField, InputAdornment } from "@mui/material";
// Here are are destructuring the required field for our Text Field
const CustomTextField = ({
    id,
    label,
    defaultValue,
    helperText,
    variant,
    isValid,
    isInvalid,
    isDisabled,
    leftIcon,
    rightIcon,
    onChange,
    textStyle,
    CustomValue,
    placeholder,
    onInput,
    type,
    multiline,
    rows,
    maxRows,
    style
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <TextField
            type={type}
            className={`${isValid ? "valid-class" : ""}${isInvalid ? "invalid-class" : ""}`}
            typeof={type}
            id={id}
            multiline={multiline}
            rows={rows}
            maxRows={maxRows}
            label={label}
            placeholder={placeholder}
            value={CustomValue}
            defaultValue={defaultValue}
            helperText={helperText}
            variant={variant}
            disabled={isDisabled}
            style={style}
            sx={textStyle}
            onInput={onInput}
            onChange={onChange}
            InputLabelProps={{
                shrink: !!defaultValue || !!isFocused,
                style: leftIcon ? { paddingLeft: 30 } : {},
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...(leftIcon || rightIcon
                ? {
                      // only add InputProps if leftIcon or rightIcon is defined
                    //   If there is any icon to put we need to use left and right adornment
                      InputProps: {
                          startAdornment: leftIcon ? (
                              <InputAdornment position="start">{leftIcon}</InputAdornment>
                          ) : null,
                          endAdornment: rightIcon ? (
                              <InputAdornment position="end">{rightIcon}</InputAdornment>
                          ) : null,
                      },
                  }
                : {})}
        />
    );
};
// Here we are giving the default values of the text field
CustomTextField.defaultProps = {
    id: "text-field",
    label: "Name",
    defaultValue: "",
    helperText: "valid username",
    variant: "standard",
    isValid: false,
    isInvalid: false,
    isDisabled: false,
    leftIcon: "",
    rightIcon: "",
    onChange: () => {},
};
// Here we are specifying the type of the fields
CustomTextField.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    defaultValue: PropTypes.string,
    helperText: PropTypes.string,
    variant: PropTypes.string,
    isValid: PropTypes.bool,
    isInvalid: PropTypes.bool,
    isDisabled: PropTypes.bool,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    onChange: PropTypes.func,
    onInput: PropTypes.string,
};

export default CustomTextField;
