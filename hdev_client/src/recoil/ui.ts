import { atom } from "recoil";

/** 사이드메뉴 활성화/비활성화 여부 */
export const enableMenuState = atom({
  key: "enableSideMenuState",
  default: false,
});

/** 현재 페이지 */
export const currentPageState = atom({
  key: "currentPageState",
  default: "",
});

/** 동기 작업으로 인한 로딩상태 관리 */
export const isLoadingState = atom({
  key: "isLoadingState",
  default: false,
});
