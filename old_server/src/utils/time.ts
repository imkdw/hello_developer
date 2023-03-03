export class Time {
  /**
   * 현재 시간을 mysql datetime 형식에 맞게 변형하여 반환해주는 함수
   * @returns {string} - 현재시간(YYYY-MM-DD HH:MM:SS)
   */
  static now = () => {
    return new Date().toISOString().slice(0, 19).replace("T", " ");
  };
}
