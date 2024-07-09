import React, {useState} from 'react';
import {standardValues, staticColors} from "../../StyledGlobal";
import {Form} from "react-bootstrap";
import {useTheme} from "styled-components";
import useWindowSize from "../../hooks/useWindowSize";

const Range = ({inputs, label, maxValue,  minRange, maxRange, setMinRange, setMaxRange}) => {
    !maxValue && (maxValue = 100);
    const theme = useTheme();
    const width = useWindowSize();
    const offset = 46;
    const valueFactor = maxValue / 100;
    const rangeFactor = width < 400 ? 2 : 3;
    const [wasActiveLeft, setWasActiveLeft] = useState(true);
    const [minDown, setMinDown] = useState(false);
    const [maxDown, setMaxDown] = useState(false);
    const rangeButtonLeftAfter = rangeFactor * minRange - 10;
    const rangeButtonRightAfter =  rangeFactor * maxRange - 10;
    const rangeButtonLeftActive = rangeButtonLeftAfter - (minDown ? 5000 : 0);
    const rangeButtonRightActive = rangeButtonRightAfter - (maxDown ? 5000 : 0);
    const getStyleRangeButton = (leftOrRight, ActiveOrAfter) => {
        if (ActiveOrAfter === 'active') {
            return {
                backgroundColor: 'rgba(220,53,69, 0)',
                position: "absolute",
                cursor: "pointer",
                width: (leftOrRight === 'left' ? minDown : maxDown) ? "10000px" : '20px',
                height: (leftOrRight === 'left' ? minDown : maxDown) ? "10000px" : '20px',
                left: leftOrRight === 'left' ? rangeButtonLeftActive : rangeButtonRightActive,
                top: (leftOrRight === 'left' ? minDown : maxDown) ? '-5000px' : '-6.5px',
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

    return <>
        <div style={{paddingBottom: (minDown || maxDown) ? '35px' : '15px'}}>
            <div style={{marginBottom: standardValues.marginSmall}}>{label}</div>
            <div style={{
                position: (minDown || maxDown) ? "absolute" : "relative",
                minWidth: width < 400 ? '220px' : '320px',
                width: '100%',
                minHeight: '20px',
                paddingLeft: '30px',
            }}>
                <div className={'range-line'} style={{
                    width: width < 400 ? '200px' : '300px',
                    height: '8px',
                    background: `linear-gradient(to right, ${staticColors.inputPlaceholderColor} ${minRange * rangeFactor + 'px'}, 
                ${theme.colors.main} ${minRange * rangeFactor + 'px'} ${maxRange * rangeFactor + 'px'}, 
                ${staticColors.inputPlaceholderColor} ${maxRange * rangeFactor + 'px'})`,
                    position: "absolute",
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
                            else if (e.clientX >= maxRange * rangeFactor + offset) {
                                setMinRange(maxRange);
                            }
                            else {
                                setMinRange((e.clientX - offset) / rangeFactor)
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
                            if (e.clientX > (width < 400 ? 200 : 300) + offset) {
                                setMaxRange(100);
                            }
                            else if (e.clientX - offset < minRange * rangeFactor) {
                                setMaxRange(minRange);
                            }
                            else {
                                setMaxRange((e.clientX - offset) / rangeFactor)
                            }
                        }
                    }}></div>
                    <div className={'max-range-after'} style={getStyleRangeButton('right', 'after')}></div>
                </div>
            </div>
        </div>
        {inputs && <div className={'price-input-box'} style={{display: "flex", paddingTop: standardValues.marginSmall, position: "relative"}}>
            <div className={'input-box'} style={{marginRight: standardValues.marginSmall, marginBottom: standardValues.marginMedium,}}>
                <div style={{
                    position: "absolute", height: '37.6px', paddingTop: '6px', paddingLeft: '10px',
                    color: staticColors.inputPlaceholderColor
                }}>от</div>
                <Form.Control type={'number'} placeholder={'0'} value={Math.round(minRange * valueFactor) !== 0 ?
                    Math.round(minRange * valueFactor) : ''}
                              onChange={(e) => {
                                  if (e.target.value <= 0) {
                                      setMinRange(0);
                                  }
                                  else if (e.target.value > maxRange * valueFactor) {
                                      setMinRange(maxRange)
                                  }
                                  else {
                                      setMinRange(e.target.value / valueFactor);
                                  }
                              }} style={{
                    paddingLeft: '40px'
                }}/>
            </div>
            <div className={'input-box'}>
                <div style={{
                    position: "absolute", height: '37.6px', paddingTop: '6px', paddingLeft: '10px',
                    color: staticColors.inputPlaceholderColor,
                }}>до</div>
                <Form.Control type={'number'} placeholder={'0'} value={Math.round(maxRange * valueFactor) !== 0 ?
                    (maxValue ? Math.round(maxRange * valueFactor) : maxValue) : ''}
                              onChange={(e) => {
                                  if (e.target.value > maxValue) {
                                      setMaxRange(100)
                                  }
                                  else if (e.target.value < minRange * valueFactor) {
                                      setMaxRange(minRange);
                                  }
                                  else {
                                      setMaxRange(e.target.value / valueFactor)
                                  }
                              }} style={{
                    paddingLeft: '40px'
                }}/>
            </div>
        </div>}
    </>
};

export default Range;