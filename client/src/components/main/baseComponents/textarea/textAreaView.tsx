import "../input/inputView.css";
import { TextareaProps } from "../../../../types/pageTypes";

// A generic component for a textarea input field in a form
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
      <div className="input_title">
        {title}
        {mandatory ? "*" : ""}
      </div>
      {hint && <div className="input_hint">{hint}</div>}
      <textarea
        id={id}
        className="input_input"
        value={val}
        onChange={(e) => {
          setState(e.currentTarget.value);
        }}
      />
      {err && <div className="input_error">{err}</div>}
    </>
  );
};

export default Textarea;
