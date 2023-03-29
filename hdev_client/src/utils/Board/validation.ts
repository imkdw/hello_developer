export const titleValidation = (title: string) => {
  /**
   * 1. 제목은 1~50자로 설정 필요
   */
  if (title.length === 0 || title.length >= 50) {
    return false;
  }

  return true;
};

export const categoryValidation = (category: string) => {
  /**
   * 1. 카테고리는 none(선택안함) 외에 값을 골라야함
   */
  if (category === "none") {
    return false;
  }

  return true;
};

export const tagsValidation = (tags: { [key: string]: string }[]) => {
  const tagMap: { [key: string]: boolean } = {};

  for (let i = 0; i < tags.length; i++) {
    const tagName = tags[i].name;
    if (tagName === "") continue;
    if (tagMap[tagName]) {
      return true;
    } else {
      tagMap[tagName] = true;
    }
  }

  return false;
};

export const contentValidation = (content: string) => {
  /**
   * 1. 내용은 1 ~ 100,000자 사이로 입력 필요
   */
  if (content.length === 0 || content.length > 100000) {
    return false;
  }

  return true;
};
