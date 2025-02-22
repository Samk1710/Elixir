import { cn } from "@/lib/utils"
import * as React from "react"

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { className, children, ...rest } = props

  return (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-background p-6 shadow-sm dark:border-muted-foreground", className)}
      {...rest}
    >
      {children}
    </div>
  )
})

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { className, children, ...rest } = props

  return (
    <div ref={ref} className={cn("flex items-center justify-between", className)} {...rest}>
      {children}
    </div>
  )
})

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  (props, ref) => {
    const { className, ...rest } = props

    return <h2 ref={ref} className={cn("text-lg font-semibold tracking-tight", className)} {...rest} />
  },
)

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  (props, ref) => {
    const { className, ...rest } = props

    return <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...rest} />
  },
)

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { className, children, ...rest } = props

  return (
    <div ref={ref} className={cn("mt-4 space-y-4", className)} {...rest}>
      {children}
    </div>
  )
})

export const Input = React.forwardRef<HTMLInputElement, React.HTMLAttributes<HTMLInputElement>>((props, ref) => {
  const { className, ...rest } = props

  return (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:ring-0 file:focus:ring-0 dark:border-muted-foreground dark:bg-muted",
        className,
      )}
      {...rest}
    />
  )
})

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, children, variant = "default", ...rest } = props

  const color =
    variant === "default"
      ? "primary"
      : variant === "outline"
        ? "muted"
        : variant === "destructive"
          ? "destructive"
          : "primary"

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "outline" &&
          "border-border bg-background hover:bg-muted dark:border-muted-foreground dark:bg-muted dark:hover:bg-muted-foreground",
        variant === "destructive" &&
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-destructive/90 dark:text-destructive-foreground",
        variant === "default" &&
          "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary/90 dark:text-primary-foreground",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
})

export const Award = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span {...props} className="h-5 w-5 text-primary" />
)
export const Heart = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span {...props} className="h-5 w-5 text-primary" />
)
export const MessageSquare = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span {...props} className="h-5 w-5 text-primary" />
)
export const Share2 = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span {...props} className="h-5 w-5 text-primary" />
)

