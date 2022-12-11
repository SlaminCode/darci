import React from "react";
import ErrorView from "./ErrorView";

const rootStyle = {
    width: 400,
    position: "absolute",
    right: "var(--padding-content)",
    bottom: "var(--padding-content)",
    padding: "var(--padding-content)",

    display: "flex",
    flexDirection: "column",
    gap: 6,
};

const ErrorContainerView = (props) => {
    const errors = props.errors;

    return (
        <div style={rootStyle}>
            {errors.map((e, index) => {
                return <ErrorView error={e} key={index} />;
            })}
        </div>
    );
};

export default ErrorContainerView;
