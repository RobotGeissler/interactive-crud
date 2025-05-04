export default function Loading() {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-lg text-gray-700">Loading todos...</p>
      </div>
    );
  }
  