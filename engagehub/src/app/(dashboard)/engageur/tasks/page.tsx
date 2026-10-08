import { redirect } from "next/navigation";

export default function TasksRedirectPage() {
  // Redirect to my-tasks which handles the list
  redirect("/engageur/my-tasks");
}