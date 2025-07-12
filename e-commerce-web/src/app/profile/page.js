// app/profile/page.js
import ClientProfile from "../../components/ClientProfile";

export const metadata = {
  title: "Profile",
  description:
    "Welcome to Farzeen Finds — your destination for curated fashion, lifestyle picks, and inspiration by Farzeen Wasif.",
};

export default function ProfilePage() {
  return <ClientProfile />;
}
