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
      className="flex flex-col justify-center items-center w-13 h-13 space-y-1.5"
      type="button"
      aria-controls={controls}
      aria-expanded={open}
      aria-label={label}
      onClick={onClick}
      >
    <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white flex items-center justify-center shadow-md">
		  <img src="/tornado-02-front/image/menu.png" alt="メニューボタン" width="30" />
    </div>
    </button>
	)
}