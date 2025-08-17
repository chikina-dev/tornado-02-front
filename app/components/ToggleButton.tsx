import type { MouseEventHandler, FC } from "react";

type Props = {
	open: boolean;
	onClick: MouseEventHandler;
	controls: string;
	label: string
};

export const ToggleButton: FC<Props> = ({ open, controls, label, onClick}) => {
	return (
    <button
      className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 ml-8"
      type="button"
      aria-controls={controls}
      aria-expanded={open}
      aria-label={label}
      onClick={onClick}
    >
      <span
        className={`block w-8 h-1 bg-white transition-transform duration-300 ${open ? "rotate-45 translate-y-3" : ""}`}
      ></span>
      <span
        className={`block w-8 h-1 bg-white transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`}
      ></span>
      <span
        className={`block w-8 h-1 bg-white transition-transform duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`}
      ></span>
    </button>
	)
}