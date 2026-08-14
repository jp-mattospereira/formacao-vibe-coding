import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header will go here if needed, or we just rely on sidebar for mobile toggle later */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-6 lg:hidden">
          <span className="font-bold text-xl text-[#0B1A2E]">PropostaAI</span>
          {/* Mobile menu button could go here */}
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
