/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

const CustomButton = ({
    label,
    leftIcon,
    rightIcon,
    isTransaprent,
    isDisabled,
    isElevated,
    handleClick,
    isText,
    buttonCss,
}) => {
    return (
        <Button
            className="contained-btn"
            variant={isText ? "text" : isTransaprent ? "outlined" : "contained"}
            disableElevation={!isElevated}
            disabled={isDisabled}
            startIcon={leftIcon}
            endIcon={rightIcon}
            onClick={handleClick}
            style={buttonCss}
            sx={buttonCss}
        >
            {label}
        </Button>
    );
};

CustomButton.defaultProps = {
    label: "enabled",
    leftIcon: "",
    rightIcon: "",
    isTransaprent: false,
    isDisabled: false,
    isElevated: false,
    handleClick: () => {},
    isText: false,
};

CustomButton.propTypes = {
    label: PropTypes.string.isRequired,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    isTransaprent: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isElevated: PropTypes.bool,
    handleClick: PropTypes.func,
    isText: PropTypes.bool,
};

export default CustomButton;
