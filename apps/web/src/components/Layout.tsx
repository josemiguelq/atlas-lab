import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar.js";

export function Layout() {
  return (
    <div className="flex h-full flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w px-4 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
