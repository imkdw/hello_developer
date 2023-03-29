export const emailValidation = (email: string) => {
  /**
   * 1. 이메일이 비어있는지 확인
   * 2. 이메일 형식이 올바른지 확인(정규식 / RFC 5322)
   */
  const emailRegExp =
    // eslint-disable-next-line
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

  if (email.length === 0 || !email.match(emailRegExp)) {
    return false;
  }

  return true;
};

export const passwordValidation = (password: string) => {
  /**
   * 1. 비밀번호가 10자리 이상인지 확인
   * 2. 비밀번호가 특수문자를 포함하는지 확인
   */
  // eslint-disable-next-line
  const specialCharRegExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
  if (password.length < 10 || !password.match(specialCharRegExp)) {
    return false;
  }

  return true;
};

export const nicknameValidation = (nickname: string) => {
  /**
   * 1. 닉네임이 2~8자리인지 확인
   * 2. 닉네임에 특수문자가 미포함 되어있는지 확인
   */
  // eslint-disable-next-line
  const specialCharRegExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
  if (!(nickname.length >= 2 && nickname.length <= 8) || nickname.match(specialCharRegExp)) {
    return false;
  }

  return true;
};
