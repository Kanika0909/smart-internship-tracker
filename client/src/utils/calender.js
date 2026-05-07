export function downloadICS(title, date) {
  const start = new Date(date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const content = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DTSTART:${start}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([content], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "interview.ics";
  a.click();
}