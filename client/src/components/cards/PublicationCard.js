import React from 'react';
import {Image} from "react-bootstrap";
import {dateString} from "../../usefulFunctions";
import styled from "styled-components";
import {breakpoints, standardValues, staticColors} from "../../StyledGlobal";
import Publication from "../modals/Publication";
import DelButton from "../buttons/DelButton";

const Styled = styled.div`
  ${(props) => (!props.$one && `border-bottom: solid ${staticColors.inputPlaceholderColor} 1px`)};
  margin: ${standardValues.marginMedium};
  ${(props) => (props.$one && `margin: 0`)};
  position: relative;
  h2 {
    margin-bottom: ${standardValues.marginSmall};
  }
  i {
    display: inline-block;
    color: ${staticColors.inputPlaceholderColor};
    margin-bottom: ${standardValues.marginSmall};
  }
  p {
    margin-bottom: ${standardValues.marginSmall};
    margin-top: ${standardValues.marginSmall};
    text-align: justify;
  }
  .content-box {
    display: flex;
    ${(props) => (props.$structure === 'right' && `flex-direction: row-reverse`)};
    ${(props) => (props.$structure === 'top' && `flex-direction: column`)};
    ${(props) => (props.$structure === 'bottom' && `flex-direction: column-reverse`)};
    ${(props) => ((props.$structure === 'bottom' || props.$structure === 'top') && `align-items: center`)};
    img {
      max-height: 240px;
      width: min-content;
    }
    p {
      margin: 0;
      ${(props) => (props.$structure === 'left' && `margin-left: ${standardValues.marginSmall}`)};
      ${(props) => (props.$structure === 'right' && `margin-right: ${standardValues.marginSmall}`)};
      ${(props) => (props.$structure === 'top' && `margin-top: ${standardValues.marginSmall}`)};
      ${(props) => (props.$structure === 'bottom' && `margin-bottom: ${standardValues.marginSmall}`)};
    }
    @media (${breakpoints.small}) {
      flex-direction: column;
      p {
        margin: 0;
      }
      img {
        margin-bottom: ${standardValues.marginSmall};
        width: 100%;
      }
    }
  }
  .links-box {
    display: flex;
    padding: ${standardValues.marginSmall};
    flex-wrap: wrap;
    .link {
      margin-right: ${standardValues.marginSmall};
      margin-bottom: ${standardValues.marginSmall};
      padding: ${standardValues.marginSmall};
      background-color: ${({theme}) => theme.colors.main};
      border-radius: 5px;
      text-decoration: none;
      color: ${({theme}) => theme.colors.btnTextColor};
    }
    .link:hover {
      color: ${({theme}) => theme.colors.textColor};
    }
  }
`

const PublicationCard = ({publication, isAuth, delFun, one}) => {
    const created = dateString(publication.createdAt);
    return (
        <Styled $structure={publication.structure} $one={one}>
            {(isAuth?.role === 'ADMIN' && !one) && <>
                <Publication publication={publication}/>
                <DelButton delFun={delFun} id={publication.id} name={'публикацию'}/>
            </>}
            <h2>{publication.title}</h2>
            <i>{created}</i>
            <div className={'content-box'}>
                {publication.image && <Image src={process.env.REACT_APP_API_URL + publication.image}/>}
                <p>{publication.text}</p>
            </div>
            <div className={'links-box'}>
                {JSON.parse(publication.links).map((link, index) => {
                    return <a className={'link'} key={'link' + index} href={link.content}>{link.title}</a>
                })}
            </div>
        </Styled>
    );
};

export default PublicationCard;