import { redirect } from "next/navigation";

export default function AskRedirect(): never {
  redirect("/create");
}
