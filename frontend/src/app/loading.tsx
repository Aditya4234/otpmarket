export default function Loading() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#804dee] border-t-transparent rounded-full animate-spin" />
        <p className="text-secondary">Loading...</p>
      </div>
    </div>
  );
}
