/** Google Calendar template link for a tutoring slot. */
export function googleCalendarUrl(input: {
  title: string;
  startsAt: Date;
  endsAt: Date;
  details?: string;
  location?: string;
}) {
  const stamp = (value: Date) =>
    value
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    dates: `${stamp(input.startsAt)}/${stamp(input.endsAt)}`,
  });

  if (input.details?.trim()) params.set("details", input.details.trim());
  if (input.location?.trim()) params.set("location", input.location.trim());

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
