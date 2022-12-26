declare global {
  interface Window {
    geolocation: any;
    setKey: any;
  }
}
export enum AnimType {
  MAKERS_FUND = "Makers Fund",
  BlockXYZ = "Block XYZ",
  REVEAL = "Reveal",
  BIRD = "Bird",
  WATCH = "Watch",
  TOY_SHADER = "Toy Shader",
  DISPLACEMENT_SHADER = "Displacement Shader",
  SPACE_DUST = "Space Dust",
  TEXT_DUST_ANIM = "Text Dust Anim",
  YogForm = "Yog Form",
  TEXT_STRACE = "Text Strace",
  FACE_SELECTION = "Face Selection",
  STRIP_GLOBE = "Strip Globe",
}

export interface IShader {
  vertex: string;
  fragment: string;
}
export interface IState {
  count: number;
  page: PageView;
}

export enum PageView {
  HOME = "HOME",
  ABOUT = "ABOUT",
  PORTFOLIO = "PORTFOLIO",
  CONTACT = "CONTACT",
  NEWS = "NEWS",
}
export enum TouchType {
  touchDown = "touchDown",
  touchMove = "touchMove",
  touchUp = "touchUp",
}
