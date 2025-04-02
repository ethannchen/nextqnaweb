import React from "react";
import "./formView.css";
import { FormProps } from "../../../../types/pageTypes";

// A higher order component for form elements
const Form: React.FC<FormProps> = ({ children }) => {
  return <div className="form">{children}</div>;
};

export default Form;
