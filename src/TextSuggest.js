import React, { useRef, useState } from "react";
import Input from "./Input";

const TextSuggest = ({
  onSubmit,
  onChange,
  value: initialValue,
  suggest,
  suggestDelay = 100,
  maxSuggestions = 10,
  ...props
}) => {
  const [timeoutID, setTimeoutID] = useState(-1);
  const [value, setValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState(() =>
    suggest(value).slice(0, maxSuggestions)
  );
  const [focused, setFocused] = useState(false);
  const gainingFocus = useRef(false);

  const handleChange = e => {
    const value = e.target.value;

    clearTimeout(timeoutID);
    if (suggest) {
      setTimeoutID(
        setTimeout(() => {
          setSuggestions(suggest(value).slice(0, maxSuggestions));
        }, suggestDelay)
      );
    }

    setValue(value);
    onChange(e);
  };

  const inputRefs = useRef([]);

  const textSuggestStyles = {
    visibility: focused && suggestions.length ? "visible" : "hidden"
  };
  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    if (!gainingFocus.current) {
      setFocused(false);
    } else {
      gainingFocus.current = false;
    }
  };
  const handleKeyDown = i => e => {
    const length = suggestions.length + 1;
    const hasMoreBefore = i > 0;
    const hasMoreAfter = i < length - 1;

    if (!e.ctrlKey && !e.altKey && !e.metaKey) {
      if (e.keyCode === 9) {
        if (hasMoreAfter && !e.shiftKey) {
          gainingFocus.current = true;
          inputRefs.current[i + 1].focus();
          e.preventDefault();
        } else if (hasMoreBefore && e.shiftKey) {
          gainingFocus.current = true;
          inputRefs.current[i - 1].focus();
          e.preventDefault();
        }
      } else if (!e.shiftKey) {
        if (e.keyCode === 40) {
          gainingFocus.current = true;
          inputRefs.current[(i + 1) % (suggestions.length + 1)].focus();
          e.preventDefault();
        } else if (e.keyCode === 38) {
          gainingFocus.current = true;
          inputRefs.current[
            (i + suggestions.length) % (suggestions.length + 1)
          ].focus();
          e.preventDefault();
        } else if (e.keyCode === 27) {
          if (i === 0) {
            inputRefs.current[i].blur();
          } else {
            inputRefs.current[0].focus();
          }
          e.preventDefault();
        }
      }
    }
  };
  const handleItemClick = s => () => {
    handleChange({ target: { value: s } });

    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  return (
    <div className="textRoot">
      <Input
        {...props}
        onChange={handleChange}
        value={value}
        ref={ref => {
          inputRefs.current[0] = ref;
          return true;
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown(0)}
        onSubmit={onSubmit}
        type="text"
      />
      <div key="textSuggest" className="textSuggest" style={textSuggestStyles}>
        {suggestions.map((s, i) => (
          <div
            key={s}
            ref={ref => {
              inputRefs.current[i + 1] = ref;
              return true;
            }}
            className="textSuggestItem"
            tabIndex={0}
            onMouseDown={() => (gainingFocus.current = true)}
            onKeyDown={handleKeyDown(i + 1)}
            onKeyPress={e => {
              if (
                (e.which === 13 || e.which === 32) &&
                !e.shiftKey &&
                !e.ctrlKey &&
                !e.altKey &&
                !e.metaKey
              ) {
                e.preventDefault();
                handleItemClick(s)();
              }
            }}
            onClick={handleItemClick(s)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextSuggest;
