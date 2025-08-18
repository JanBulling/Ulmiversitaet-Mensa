import { MensaMenu } from "@/components/home/mensa-menu";
import { getMenuForDate } from "@/lib/db-integration/get-for-date";

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { date } = await searchParams;

  let selectedDate: Date;
  if (date !== undefined) {
    if (typeof date === "string") {
      selectedDate = new Date(date);
    } else {
      selectedDate = new Date(date[0]);
    }

    if (isNaN(selectedDate.getTime())) {
      selectedDate = new Date();
    }
  } else {
    selectedDate = new Date();
    if (selectedDate.getDay() === 6) {
      selectedDate.setDate(selectedDate.getDate() + 2);
    } else if (selectedDate.getDay() === 0) {
      selectedDate.setDate(selectedDate.getDate() + 1);
    }
  }
  selectedDate.setHours(8, 0, 0, 0);

  const initialMensaMenu = await getMenuForDate(selectedDate);

  return (
    <div className="my-4">
      <MensaMenu initialMenu={initialMensaMenu} initialDate={selectedDate} />
    </div>
  );
}
