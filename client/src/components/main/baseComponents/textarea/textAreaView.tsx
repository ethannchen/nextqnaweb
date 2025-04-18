import "../input/inputView.css";
import { TextareaProps } from "../../../../types/pageTypes";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";

/**
 * A generic component for a textarea input field in a form
 *
 * @param {TextareaProps} {
 *   title - title of the text area
 *   mandatory - if this field is mandatory, default to true
 *   hint - hint for the text area
 *   id - id of the text area component
 *   val - value of the text area
 *   setState - state setter for the value
 *   err - text area error
 * }
 * @return the text area component
 */
const Textarea = ({
  title,
  mandatory = true,
  hint,
  id,
  val,
  setState,
  err,
}: TextareaProps) => {
  return (
    <>
      <Typography className="input_title">
        {title}
        {mandatory ? "*" : ""}
      </Typography>
      {hint && <Typography className="input_hint">{hint}</Typography>}
      <TextField
        id={id}
        multiline
        rows={4}
        className="input_input"
        value={val}
        onChange={(e) => {
          setState(e.currentTarget.value);
        }}
      />
      {err && <Typography className="input_error">{err}</Typography>}
    </>
  );
};

export default Textarea;
