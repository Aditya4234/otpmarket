import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-[#804dee] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-secondary mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button href="/">Go Home</Button>
      </div>
    </div>
  );
}
