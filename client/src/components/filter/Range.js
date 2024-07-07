import React, {useState} from 'react';
import {breakpoints, staticColors} from "../../StyledGlobal";
import {Form} from "react-bootstrap";
import {useTheme} from "styled-components";
import useWindowSize from "../../hooks/useWindowSize";

const Range = ({minRange, maxRange, setMinRange, setMaxRange}) => {
    const theme = useTheme();
    const width = useWindowSize();
    const offset = 46;
    const factor = width < breakpoints.rawSmall ? 2 : 3;
    const [wasActiveLeft, setWasActiveLeft] = useState(true);
    const [minDown, setMinDown] = useState(false);
    const [maxDown, setMaxDown] = useState(false);
    const rangeButtonLeftAfter = factor * minRange - 10;
    const rangeButtonRightAfter =  factor * maxRange - 10;
    const rangeButtonLeftActive = rangeButtonLeftAfter - (minDown ? 5000 : 0);
    const rangeButtonRightActive = rangeButtonRightAfter - (maxDown ? 5000 : 0);
    const getStyleRangeButton = (leftOrRight, ActiveOrAfter) => {
        if (ActiveOrAfter === 'active') {
            return {
                backgroundColor: 'rgba(220,53,69, 0)',
                width: (leftOrRight === 'left' ? minDown : maxDown) ? "10000px" : '20px',
                height: (leftOrRight === 'left' ? minDown : maxDown) ? "10000px" : '20px',
                position: "absolute",
                left: leftOrRight === 'left' ? rangeButtonLeftActive : rangeButtonRightActive,
                cursor: "pointer",
                top: (leftOrRight === 'left' ? minDown : maxDown) ? '-5000px' : '-6px',
                zIndex: leftOrRight === 'left' ? (wasActiveLeft ? '4' : '3') : (wasActiveLeft ? '3' : '4')
            }
        }
        else {
            return  {
                backgroundColor: theme.colors.main,
                borderRadius: '50%',
                borderStyle: 'solid',
                width: '20px',
                height: '20px',
                position: "absolute",
                left: leftOrRight === 'left' ? rangeButtonLeftAfter : rangeButtonRightAfter,
                cursor: "pointer",
                top: '-6.5px',
                zIndex: leftOrRight === 'left' ? (wasActiveLeft ? '2' : '1') : (wasActiveLeft ? '1' : '2'),
            }
        }
    }
    return (
        <Form.Group controlId="formFilterPrice" style={{
            position: "absolute",
            minWidth: width < breakpoints.rawSmall ? '220px' : '320px',
            width: '100%',
            minHeight: '20px',
            paddingLeft: '30px',
        }}>
            <div className={'range-line'} style={{
                width: width < breakpoints.rawSmall ? '200px' : '300px',
                height: '8px',
                background: `linear-gradient(to right, ${staticColors.inputPlaceholderColor} ${minRange * factor + 'px'}, 
                ${theme.colors.main} ${minRange * factor + 'px'} ${maxRange * factor + 'px'}, 
                ${staticColors.inputPlaceholderColor} ${maxRange * factor + 'px'})`,
                position: "relative",
                borderRadius: '4px',
                top: '6.5px'
            }}>
                <div className={'min-range'} style={getStyleRangeButton('left', 'active')}
                     onMouseDown={(e) => {
                         setMinDown(true);
                         setWasActiveLeft(true);
                     }} onMouseUp={() => {
                    setMinDown(false);
                }} onMouseMove={(e) => {
                    if (minDown) {
                        if (e.clientX < offset) {
                            setMinRange(0);
                        }
                        else if (e.clientX >= maxRange * factor + offset) {
                            setMinRange(maxRange);
                        }
                        else {
                            setMinRange((e.clientX - offset) / factor)
                        }
                    }
                }}></div>
                <div className={'min-range-after'} style={getStyleRangeButton('left', 'after')}></div>
                <div className={'max-range'} style={getStyleRangeButton('right', 'active')}
                     onMouseDown={() => {
                         setMaxDown(true);
                         setWasActiveLeft(false);
                     }} onMouseUp={() => {
                    setMaxDown(false);
                }} onMouseMove={(e) => {
                    if (maxDown) {
                        if (e.clientX > (width < breakpoints.rawSmall ? 200 : 300) + offset) {
                            setMaxRange(100);
                        }
                        else if (e.clientX - offset < minRange * factor) {
                            setMaxRange(minRange);
                        }
                        else {
                            setMaxRange((e.clientX - offset) / factor)
                        }
                    }
                }}></div>
                <div className={'max-range-after'} style={getStyleRangeButton('right', 'after')}></div>
            </div>
        </Form.Group>
    );
};

export default Range;