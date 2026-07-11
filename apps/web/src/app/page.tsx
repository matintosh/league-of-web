import { ClientShell } from "./client-shell";
import { ViewSwitcher } from "./view-switcher";

export default function Home() {
  return (
    <div className="min-h-screen bg-hextech-black flex flex-col items-center justify-center">
      <ViewSwitcher />
      <ClientShell />
    </div>
  );
}
