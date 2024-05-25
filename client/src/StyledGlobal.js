import {css} from "styled-components";
class Breakpoints {
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
    get extraLightGray () {
        return '#f8f9fa'
    }
    get primary () {
        return '#198754'
    }
    get errorOverlayRed () {
        return 'rgba(255, 100, 100, 0.85)'
    }
    get bootstrapVariant () {
        return 'success'
    }
    get bootstrapVariantOutline () {
        return 'outline-success'
    }
}
export const colors = new Colors();
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
export const paddingPage = css`
  padding-left: 24px;
  padding-right: 24px;
  @media (${breakpoints.small}) {
    padding-left: 8px;
    padding-right: 8px;
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
export const marginSmall = '10px';
export const marginMedium = '20px';
