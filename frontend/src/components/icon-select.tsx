import { useState } from "react";
import "./icon-select.css";

export type IconSelectOption = {
  value: string;
  label: string;
  iconPath?: string | null;
};

type IconSelectProps = {
  value: string;
  placeholder: string;
  options: IconSelectOption[];
  onChange: (value: string) => void;
  className?: string;
};

export default function IconSelect({
  value,
  placeholder,
  options,
  onChange,
  className = "",
}: IconSelectProps) {
  const [open, setOpen] = useState(false);

  const selected = options.find((option) => option.value === value);

  return (
    <div className={`icon-select ${className}`}>
      <button
        type="button"
        className="icon-select-button"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="icon-select-content">
          {selected?.iconPath && (
            <img src={selected.iconPath} alt="" className="icon-select-img" />
          )}

          <span>{selected?.label ?? placeholder}</span>
        </span>

        <span>▼</span>
      </button>

      {open && (
        <div className="icon-select-menu">
          <div className="icon-select-scroll">
            <button
              type="button"
              className="icon-select-option"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              {placeholder}
            </button>

            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className="icon-select-option"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.iconPath && (
                  <img src={option.iconPath} alt="" className="icon-select-img" />
                )}

                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}