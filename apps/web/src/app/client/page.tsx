import { ClientShell } from "../client-shell";
import { ViewSwitcher } from "../view-switcher";

/**
 * /client page — renders the 1280×720 simulated LoL client window centered in the
 * viewport. The root `/` is now the landing hub; this route carries the client clone.
 *
 * `h-screen overflow-hidden` pins body.scrollHeight to the viewport height (720px
 * at 1280×720), preventing the 32px ViewSwitcher from pushing body.scrollHeight to
 * 752px.
 *
 * ViewSwitcher is taken out of normal flow (`absolute top-0`) so it floats above the
 * window without contributing to the page's flow height. At viewports larger than
 * 720px the window is centered and the switcher sits visibly above it; at exactly
 * 720px the switcher overlays the window's top edge (intentional at that tight test
 * viewport — the full client window is still unclipped). The integrated chrome (#385)
 * has no title bar, so the top edge is the navbar.
 */
export default function ClientPage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-hextech-black flex items-center justify-center">
      {/* Portfolio tab strip — absolute so it doesn't push body.scrollHeight */}
      <div className="absolute top-0 inset-x-0 flex justify-center z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <ViewSwitcher />
        </div>
      </div>
      <ClientShell />
    </div>
  );
}
