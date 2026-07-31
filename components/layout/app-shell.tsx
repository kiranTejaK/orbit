import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface AppShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function AppShell({ title, description, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header title={title} description={description} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
