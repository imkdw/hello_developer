/**
 * 객체의 프로퍼티가 snake_case인 값을 camelCase로 변경해서 반환하는 함수
 * @param {T} - 객체
 */
export function changePropertySnakeToCamel<T>(obj: T) {
  const change = (snakeString: string) => {
    let item = snakeString;

    /** 단어에 _이 포함되면 계속 반복 */
    while (item.includes("_")) {
      const barIndex = item.indexOf("_"); // 언더바 위치
      item = item.replace("_", "");
      const left = item.slice(0, barIndex);
      let right = item.slice(barIndex);
      right = right.replace(right[0], right[0].toUpperCase());
      item = left + right;

      /** 더이상 언더바가 없다면 종료 */
      if (!item.includes("_")) {
        break;
      }
    }

    return item;
  };

  const tempObj: any = {};

  for (const item in obj) {
    const key = change(item);
    tempObj[key] = obj[item];
  }

  return tempObj;
}
