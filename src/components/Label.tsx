import * as React from 'react';

export interface ILabel {
    elementClass?: string;
    tooltip?: string;
    children: string;
    onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

// fixme: check props for valid text!!
const Label = ({onClick = () => {}, tooltip = '', children, elementClass = ''}: ILabel): JSX.Element =>
    <span className={elementClass} title={tooltip} onClick={onClick}>{children}</span>;

export default Label;
