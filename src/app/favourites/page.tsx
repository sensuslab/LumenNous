import { redirect } from "next/navigation";

export default function FavouritesRedirect(): never {
  redirect("/saved");
}
