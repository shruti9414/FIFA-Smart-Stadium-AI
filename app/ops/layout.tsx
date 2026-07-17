import { AssistantLauncher } from "@/components/shared/assistant-launcher";

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-1 flex-col">
      {children}
      <div className="fixed bottom-6 right-6 z-30">
        <AssistantLauncher context="ops" />
      </div>
    </div>
  );
}
