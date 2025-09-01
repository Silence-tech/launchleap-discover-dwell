import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-cosmic",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-glass-border bg-glass/50 backdrop-blur-sm hover:bg-glass/80 hover:shadow-glass",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-glow",
        ghost: "hover:bg-glass/30 hover:backdrop-blur-sm hover:shadow-glass",
        link: "text-primary underline-offset-4 hover:underline",
        
        /* Glassmorphic variants */
        glass: "bg-glass/20 backdrop-blur-xl border border-glass-border/30 text-glass-foreground hover:bg-glass/40 hover:shadow-glass",
        cosmic: "bg-gradient-cosmic text-white shadow-cosmic hover:shadow-glow animate-cosmic-pulse",
        hero: "bg-primary/90 backdrop-blur-xl text-primary-foreground shadow-glow hover:bg-primary hover:shadow-cosmic hover:scale-105",
        neon: "bg-accent/20 backdrop-blur-sm border border-accent/30 text-accent hover:bg-accent/40 hover:shadow-glow",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-lg px-3",
        lg: "h-14 rounded-xl px-8 text-base",
        icon: "h-12 w-12",
        hero: "h-16 px-12 text-lg rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
