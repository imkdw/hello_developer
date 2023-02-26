export const dateFormat = (date?: string) => {
  if (!date) {
    return "";
  }

  const formattedDate = new Intl.DateTimeFormat("ko", { dateStyle: "medium" }).format(new Date(date));
  const formattedTime = new Intl.DateTimeFormat("ko", { timeStyle: "short" }).format(new Date(date));

  return `${formattedDate} ${formattedTime}`;
};
