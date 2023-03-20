const dateFormater = (date?: string) => {
  if (!date) {
    return "";
  }

  const formattedDate = new Intl.DateTimeFormat("ko", { dateStyle: "medium" }).format(new Date(date));
  const formattedTime = new Intl.DateTimeFormat("ko", { timeStyle: "short" }).format(new Date(date));

  return `${formattedDate} ${formattedTime}`;
};

export default dateFormater;
