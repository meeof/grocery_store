import {css} from "styled-components";
export class Theme {
    static _dark = false;
    static get dark() {
        return this._dark;
    }
    static setDark(value) {
        this._dark = value;
    }
    getGradient (color, name) {
        return css`
          @keyframes ${name} {
            0% {
              background: transparent;
            }
            25% {
              background: linear-gradient(0.25turn, ${color}, transparent, transparent, transparent);
            }
            50% {
              background: linear-gradient(0.25turn, ${color}, ${color}, transparent ,transparent);
            }
            75% {
              background: linear-gradient(0.25turn, ${color}, ${color}, ${color}, transparent);
            }
            100% {
              background: linear-gradient(0.25turn, ${color}, ${color}, ${color}, ${color});
            }
          }
        `
    }
    colors = {
        main: Theme.dark ? 'rgba(25,135,84,1)' : 'rgba(13,110,253,1)',
        mainOpacity:Theme.dark ? 'rgba(25,135,84,.5)' : 'rgba(13,110,253,.5)',
        bootstrapMainVariant: Theme.dark ? 'success' : 'primary',
        bootstrapMainVariantOutline: Theme.dark ? 'outline-success' : 'outline-primary',
        extraLightColor: Theme.dark ? '#212529' : '#f8f9fa',
        lightColor: Theme.dark ? '#121212' : 'lightgray',
        descriptionColor: Theme.dark ? '#000000' : 'gray',
        bootstrapOtherVariantOutline: Theme.dark ? 'outline-light' : 'outline-dark',
        bootstrapOtherVariant: Theme.dark ? 'white' : null,
        backgroundColor :Theme.dark ? '#2B2B2B' : '',
        textColor: Theme.dark ? 'white' : 'black',
        btnTextColor: Theme.dark ? 'black' : '',
        inputColor: Theme.dark ? '#424242' : '',
        inputPlaceholderColor: Theme.dark ? 'rgba(168,168,168,0.66)' : '',
    }
    animations = {
        darkGradient: this.getGradient(`rgba(25,135,84,.7)`, 'darkGradient'),
        lightGradient: this.getGradient(`rgba(13,110,253,.7)`, 'lightGradient'),
    }
}
export const staticColors = {
    opacityRed: 'rgba(255, 100, 100,0.85)',
    bootstrapOtherVariant: 'dark',
    bootstrapOtherVariantOutline: 'outline-dark',
}
class Breakpoints {
    rawSmall = 575.5;
    rawFromSmall = 576;
    rawLarge = 991.5;
    rawFromLarge = 992;
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
export const importantStar = css`
  content: ' *';
  color: red;
`
export const standardValues = {
    freeButtonWidth: '300px',
    smallButtonWidth: '80px',
    marginSmall: '10px',
    marginMedium: '20px',
    iconsSize: '34px',
};
export const itemCategoryCard = css`
  .card {
    cursor: pointer;
    height: 100%;
    ${flexColumn};
    justify-content: space-between;
    border-width: 2px;
    border-color: ${({theme}) => theme.colors.lightColor};
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
      margin-bottom: ${standardValues.marginSmall};
    }
  }
`