interface MensaRequestPayload {
  date?: Date;
  mensaId?: 1 | 2;
  lang?: "de" | "en";
}

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export async function getMensaHTML(request?: MensaRequestPayload) {
  const date = request?.date ?? new Date();

  // Calculate the first day of the week (Monday)
  const thisMonday = new Date(date);
  const mondayOffset = date.getDay() === 0 ? -6 : 1 - date.getDay();
  thisMonday.setDate(date.getDate() + mondayOffset);

  // Next Monday
  const nextMonday = new Date(date);
  const nextMondayOffset = date.getDay() === 0 ? 1 : 8 - date.getDay();
  nextMonday.setDate(date.getDate() + nextMondayOffset);

  const formData = new URLSearchParams();
  formData.append("func", "make_spl");
  formData.append("locId", (request?.mensaId ?? 1).toString());
  formData.append("lang", request?.lang ?? "de");
  formData.append("date", formatDate(date));
  formData.append("startThisWeek", formatDate(thisMonday));
  formData.append("startNextWeek", formatDate(nextMonday));

  const url =
    "https://sw-ulm-spl51.maxmanager.xyz/inc/ajax-php_konnektor.inc.php";

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const htmlContent = await response.text();

  return htmlContent;
}
