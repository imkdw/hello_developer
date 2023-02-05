import { atom } from "recoil";

/** 사이드메뉴 활성화/비활성화 여부 */
export const enableSideMenuState = atom({
  key: "enableSideMenuState",
  default: false,
});

/** 현재 페이지 */
export const currentPageState = atom({
  key: "currentPageState",
  default: "",
});
