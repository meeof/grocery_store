import {css} from "styled-components";
class Breakpoints {
    get rawSmall() {
        return 575.5;
    }
    get rawFromSmall() {
        return 576;
    }
    get rawLarge() {
        return 991.5;
    }
    get rawFromLarge() {
        return 992;
    }
    get small() {
        return css`
          max-width: 575.5px
        `
    }
    get fromSmall() {
        return css`
          min-width: 576px
        `
    }
    get medium() {
        return css`
          max-width: 767.5px
        `
    }
    get fromMedium() {
        return css`
          min-width: 768px
        `
    }
    get large() {
        return css`
          max-width: 991.5px
        `
    }
    get fromLarge() {
        return css`
          min-width: 992px
        `
    }
    get extraLarge() {
        return css`
          max-width: 1399.5px
        `
    }
    get fromExtraLarge() {
        return css`
          min-width: 1400px
        `
    }
}
export const breakpoints = new Breakpoints();
class Colors {
    get lightColor () {
        return 'lightgray'
    }
    get extraLightColor () {
        return '#f8f9fa'
    }
    get descriptionColor () {
        return 'gray';
    }
    get main () {
        return 'rgba(25,135,84,1)' //'rgba(25,135,84,1)' RGBA ONLY
    }
    get mainOpacity () {
        return 'rgba(25,135,84,.5)'
    }
    get opacityRed () {
        return 'rgba(255, 100, 100,0.85)'
    }
    get opacityPrimary () {
        return 'rgba(13,110,253,0.85)'
    }
    get bootstrapMainVariant () {
        return 'success'
    }
    get bootstrapMainVariantOutline () {
        return 'outline-success'
    }
    get bootstrapOtherVariant () {
        return 'dark'
    }
    get bootstrapOtherVariantOutline () {
        return 'outline-dark'
    }
}
export const colors = new Colors();
class Animations {
    getGradient (opacity) {
        const opacityColor = colors.main.replace(/(?<=,)[0-9.](?=\))/g, opacity);
        return css`
          @keyframes shopButtonAnim {
            0% {
              background: transparent;
            }
            25% {
              background: linear-gradient(0.25turn, ${opacityColor}, transparent, transparent, transparent);
            }
            50% {
              background: linear-gradient(0.25turn, ${opacityColor}, ${opacityColor}, transparent ,transparent);
            }
            75% {
              background: linear-gradient(0.25turn, ${opacityColor}, ${opacityColor}, ${opacityColor}, transparent);
            }
            100% {
              background: linear-gradient(0.25turn, ${opacityColor}, ${opacityColor}, ${opacityColor}, ${opacityColor});
            }
          }
        `
    }
}
export const animations = new Animations();

export const customGrid = css`
  display: grid;
  gap: 40px;
  @media (${breakpoints.medium}) {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media (${breakpoints.fromMedium}) and (${breakpoints.large}) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (${breakpoints.fromLarge}) and (${breakpoints.extraLarge}) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (${breakpoints.fromExtraLarge}) {
    grid-template-columns: repeat(6, 1fr);
  }
`
export const customGrid2 = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 50px;
  @media (${breakpoints.fromSmall}) and (${breakpoints.large}) {
    grid-template-columns: 1fr 1fr;
  }
  @media (${breakpoints.small}) {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`
export const marginsPage = css`
  margin-left: 24px;
  margin-right: 24px;
  @media (${breakpoints.small}) {
    margin-left: 8px;
    margin-right: 8px;
  }
`
export const paddingsPage = css`
  padding: 8px 24px;
  @media (${breakpoints.small}) {
    padding: 8px;
  }
`
export const flexColumn = css`
  display: flex;
  flex-direction: column;
`
export const largeButton = css`
  height: 54px;
`
export const marginsCenter = css`
  margin-left: auto;
  margin-right: auto;
`
export const freeButtonWidth = '300px';
export const smallButtonWidth = '80px';
export const marginSmall = '10px';
export const marginMedium = '20px';
export const iconsSize = '34px';
export const importantStar = css`
  content: ' *';
  color: red;
`
export const styledCheckbox = css`
  input[type="radio"]:checked, input[type="checkbox"]:checked {
    background-color: ${colors.main};
    box-shadow: none;
    border: 3px solid ${colors.main};
  }
`
export const itemCategoryCard = css`
  .card {
    cursor: pointer;
    height: 100%;
    ${flexColumn};
    justify-content: space-between;
  }
  .card-body {
    padding: 5px;
    ${flexColumn};
    justify-content: flex-end;
  }
  .card-title {
    text-align: center;
  }
  @media (${breakpoints.small}) {
    .card {
      margin-bottom: ${marginSmall};
    }
  }
`