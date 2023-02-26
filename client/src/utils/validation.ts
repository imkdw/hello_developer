/**
 * 회원가입시 이메일 유효성을 검증
 * @param {string} email - 사용자의 이메일 주소
 * @returns {boolean}
 */
export const emailValidation = (email: string) => {
  /**
   * 1. 이메일이 비어있는지 확인
   * 2. 이메일 형식이 올바른지 확인(정규식 / RFC 5322)
   */
  const emailRegExp =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

  if (email.length === 0 || !email.match(emailRegExp)) {
    return false;
  }

  return true;
};

/**
 * 회원가입시 비밀번호 유효성을 검증
 * @param {string} password - 사용자의 비밀번호
 * @returns {boolean}
 */
export const passwordValidation = (password: string) => {
  /**
   * 1. 비밀번호가 10자리 이상인지 확인
   * 2. 비밀번호가 특수문자를 포함하는지 확인
   */
  const specialCharRegExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
  if (password.length < 10 || !password.match(specialCharRegExp)) {
    return false;
  }

  return true;
};

/**
 * 회원가입시 닉네임 유효성을 검증
 * @param {string} nickname - 사용자의 닉네임
 * @returns {boolean}
 */
export const nicknameValidation = (nickname: string) => {
  /**
   * 1. 닉네임이 2자리 이상, 8자리 이하인지 확인
   * 2. 닉네임에 특수문자가 미포함 되어있는지 확인
   */
  const specialCharRegExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
  if (!(nickname.length >= 2 && nickname.length <= 8) || nickname.match(specialCharRegExp)) {
    return false;
  }

  return true;
};

/**
 * 게시글 작성시 제목의 유효성을 검증
 * @param {string} title - 게시글의 제목
 */
export const titleValidation = (title: string) => {
  /**
   * 1. 제목은 1~50자로 설정 필요
   */
  if (title.length === 0 || title.length >= 50) {
    return false;
  }

  return true;
};

/**
 * 게시글 작성시 카테고리의 유효성을 검증
 * @param {string} category - 게시글의 카테고리
 */
export const categoryValidation = (category: string) => {
  /**
   * 1. 카테고리는 none(선택안함) 외에 값을 골라야함
   */
  if (category === "none") {
    return false;
  }

  return true;
};

/**
 * 게시글 작성시 태그의 유효성 검증
 * @param {string} tag - 게시글의 태그 텍스트
 */
export const tagsValidation = (tag: string) => {
  /**
   * 1. 태그는 최대 10자 까지 설정가능
   */
  if (tag.length > 10) {
    return false;
  }

  return true;
};

/**
 * 게시글 작성시 본문의 유효성 검증
 * @param {string} content - 게시글 내용
 */
export const contentValidation = (content: string) => {
  /**
   * 1. 내용은 1 ~ 100,000자 사이로 입력 필요
   */
  if (content.length === 0 || content.length > 100000) {
    return false;
  }

  return true;
};
