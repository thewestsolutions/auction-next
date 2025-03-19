import { createClient } from "@/src/lib/supabase-server";
import ProfileForm from "./profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  return <ProfileForm user={data.user} />;
}
