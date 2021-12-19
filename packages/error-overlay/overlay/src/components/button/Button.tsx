import clsx from 'clsx';
import { FunctionComponent } from 'react';

export type ButtonProps = {
  btn?: 'primary' | 'secondary';
  color?: 'gray' | 'green' | 'light';
  size?: 'sm' | 'xs';
  linkStyle?: boolean;
  bordered?: boolean;
};

const Button: FunctionComponent<
  ButtonProps &
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
> = ({
  children,
  className,
  color = 'gray',
  size = 'sm',
  bordered = false,
  linkStyle = false,
  type = 'button',
  disabled,
  ...restProps
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        'tracking-tighter border-2 transition-all',
        {
          'p-2 text-[0.6rem] md:text-xs': size === 'xs',
          'py-2 px-3 text-xs md:text-sm': size === 'sm',
          'border-transparent': linkStyle,
          'active:scale-90': !disabled && (linkStyle || size === 'xs'),
          'active:scale-95': !disabled && !linkStyle,
          'cursor-not-allowed opacity-40': disabled,
          'text-slate-600 hover:text-slate-800': color === 'gray',
          [bordered
            ? 'border-slate-500 hover:border-slate-700 hover:bg-slate-100'
            : 'border-slate-200 bg-slate-200 hover:border-slate-300 hover:bg-slate-300']:
            !linkStyle && color === 'gray',
          'text-slate-500 hover:text-slate-300': color === 'light',
          [bordered
            ? 'border-slate-500 hover:border-slate-700 hover:bg-slate-100'
            : 'border-slate-200 bg-slate-200 hover:border-slate-300 hover:bg-slate-300']:
            !linkStyle && color === 'gray',
          'text-emerald-600 hover:text-emerald-700': color === 'green',
          [bordered
            ? 'border-emerald-500 hover:border-emerald-600 hover:bg-emerald-50'
            : 'border-emerald-100 bg-emerald-100 hover:border-emerald-200 hover:bg-emerald-200']:
            !linkStyle && color === 'green'
        },
        className
      )}
      {...restProps}>
      {children}
    </button>
  );
};

export default Button;
