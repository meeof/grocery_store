import React from 'react';
import {Overlay} from "react-bootstrap";
import useWindowSize from "../../hooks/useWindowSize";
import {breakpoints} from "../../StyledGlobal";

const CustomOverlay = ({show, color, message, target}) => {
    const width = useWindowSize();
    const placement = (width >= breakpoints.rawFromLarge ? "right" : "top-start")
    return (
        <Overlay target={target} show={show} placement={placement}>
            {({
                  placement: _placement,
                  arrowProps: _arrowProps,
                  show: _show,
                  popper: _popper,
                  hasDoneInitialMeasure: _hasDoneInitialMeasure,
                  ...props
              }) => (
                <div
                    {...props}
                    style={{
                        position: 'absolute',
                        left: '20px',
                        backgroundColor: `${color || 'rgba(31, 125, 99, 0.85)'}`,
                        padding: '2px 10px',
                        color: 'white',
                        borderRadius: 3,
                        zIndex: 9999,
                        ...props.style,
                    }}
                >
                    {message}
                </div>
            )}
        </Overlay>
    );
};

export default CustomOverlay;