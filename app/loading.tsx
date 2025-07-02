export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></span>
      <span className="ml-4 text-lg text-muted-foreground">加载中...</span>
    </div>
  )
} 