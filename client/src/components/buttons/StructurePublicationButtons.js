import React from 'react';
import styled from "styled-components";
import leftImg from '../../assets/structure_left.svg';
import rightImg from '../../assets/structure_right.svg';
import topImg from '../../assets/structure_top.svg';
import bottomImg from '../../assets/structure_bottom.svg';
import {Image} from "react-bootstrap";

const Styled = styled.div`
  .check-label {
    min-width: 40px;
    width: 100px;
    border: solid transparent 4px;
    border-radius: 5px;
    cursor: pointer;
    img {
      width: 100%;
    }
  }
  .active {
    border: solid ${({theme}) => theme.colors.main} 4px;
    padding: 2px;
  }
  .button-box {
    display: flex;
    justify-content: space-between;
  }
  .check-input {
    display: none;
  }
`
const StructurePublicationButtons = ({structure, setStructure}) => {
    return (
        <Styled>
            <div className={'mb-2'}>Вид</div>
            <div className={'button-box'}>
                <input type="radio" name="structurePublicationRadio"
                       className="check-input" id="StructurePublicationLeft" value={'left'} checked={structure === 'left'}
                       onChange={(e) => setStructure(e.target.value)}/>
                <label className={`check-label left ${structure === 'left' && 'active'}`} htmlFor="StructurePublicationLeft">
                    <Image src={leftImg}/>
                </label>
                <input type="radio" name="structurePublicationRadio"
                       className="check-input" id="StructurePublicationRight" value={'right'} checked={structure === 'right'}
                       onChange={(e) => setStructure(e.target.value)}/>
                <label className={`check-label right ${structure === 'right' && 'active'}`} htmlFor="StructurePublicationRight">
                    <Image src={rightImg}/>
                </label>
                <input type="radio" name="structurePublicationRadio"
                       className="check-input" id="StructurePublicationTop" value={'top'} checked={structure === 'top'}
                       onChange={(e) => setStructure(e.target.value)}/>
                <label className={`check-label top ${structure === 'top' && 'active'}`} htmlFor="StructurePublicationTop">
                    <Image src={topImg}/>
                </label>
                <input type="radio" name="structurePublicationRadio"
                       className="check-input" id="StructurePublicationBottom" value={'bottom'} checked={structure === 'bottom'}
                       onChange={(e) => setStructure(e.target.value)}/>
                <label className={`check-label bottom ${structure === 'bottom' && 'active'}`} htmlFor="StructurePublicationBottom">
                    <Image src={bottomImg}/>
                </label>
            </div>
        </Styled>
    );
};

export default StructurePublicationButtons;