export const formatTime = (date: string): string => {
  // hh:mm AM or PM
  const dateObj = new Date(date);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();

  // 12시간 형식으로 변환
  const hour12 = hours % 12 || 12;
  const ampm = hours >= 12 ? "PM" : "AM";

  // 시간과 분을 2자리로 포맷
  const formattedHours = hour12.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const formatDate = (date: string): string => {
  // YYYY-MM-DD
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}