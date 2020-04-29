import React from "react";

const Input = React.forwardRef(
  ({ label, onKeyDown, onSubmit, ...props }, ref) => (
    <label>
      {`${label} `}
      <input
        onKeyDown={e => {
          onKeyDown && onKeyDown(e);
          if (
            e.keyCode === 13 &&
            !e.shiftKey &&
            !e.ctrlKey &&
            !e.altKey &&
            !e.metaKey
          ) {
            onSubmit && onSubmit(e);
          }
        }}
        {...props}
        ref={ref}
      />
      <br />
    </label>
  )
);

export default Input;
