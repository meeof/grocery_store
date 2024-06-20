import React from 'react';
import {Overlay} from "react-bootstrap";
import useWindowSize from "../../hooks/useWindowSize";
import {breakpoints} from "../../StyledGlobal";
import {useTheme} from "styled-components";

const CustomOverlay = ({show, color, message, target}) => {
    const width = useWindowSize();
    const theme = useTheme();
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
                        backgroundColor: `${color || theme.colors.mainOpacity}`,
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