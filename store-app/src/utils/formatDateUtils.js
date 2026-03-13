export function formatDate(date) {
  if (!date) return "";

  const d = date?.toDate ? date.toDate() : new Date(date);

  const datePart = d
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .replace(",", "");

  const timePart = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${datePart} ${timePart}`;
}