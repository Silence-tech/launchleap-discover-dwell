import { Sidebar } from "./Sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <Sidebar />
      <main className="ml-80 min-h-screen">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}