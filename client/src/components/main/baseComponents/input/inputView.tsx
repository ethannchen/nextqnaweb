import "./inputView.css";
import { InputProps } from "../../../../types/pageTypes";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";

/**
 * A generic reusble component for the input field of a form.
 *
 * @param {InputProps} {
 *   title - title of the input
 *   hint - hint of the input
 *   id - id of the input component
 *   mandatory - if the input is mandatory, default to true
 *   val - value of the input
 *   setState - state setter of the input value
 *   err - input error
 * }
 * @return the input component
 */
const Input = ({
  title,
  hint,
  id,
  mandatory = true,
  val,
  setState,
  err,
}: InputProps) => {
  return (
    <>
      <Typography className="input_title">
        {title}
        {mandatory ? "*" : ""}
      </Typography>
      {hint && <Typography className="input_hint">{hint}</Typography>}
      <TextField
        id={id}
        className="input_input"
        type="text"
        value={val}
        onChange={(e) => {
          setState(e.target.value);
        }}
      />
      {err && <Typography className="input_error">{err}</Typography>}
    </>
  );
};

export default Input;
