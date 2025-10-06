import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  if (!isVisible) return null

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className="fixed bottom-20 md:bottom-8 right-4 sm:right-6 z-40 rounded-full shadow-cosmic animate-fade-in h-12 w-12 sm:h-14 sm:w-14"
      variant="hero"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
    </Button>
  )
}
