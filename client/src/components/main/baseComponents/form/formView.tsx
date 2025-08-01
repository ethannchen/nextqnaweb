import React from "react";
import "./formView.css";
import { FormProps } from "../../../../types/pageTypes";
import Box from "@mui/material/Box";

/**
 * A higher order component for form elements
 *
 * @param {*} { children } children component to be rendered within
 * @return the form component
 */
const Form: React.FC<FormProps> = ({ children }) => {
  return <Box className="form">{children}</Box>;
};

export default Form;
