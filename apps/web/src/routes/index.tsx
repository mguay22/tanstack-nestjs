import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            TanStack Start + NestJS
          </h1>
          <p className="text-xl text-gray-600">
            A fullstack demo showcasing modern React patterns
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <FeatureCard
            title="Route Loaders"
            description="Data fetching that happens before rendering, with automatic loading states"
            icon="⚡"
          />
          <FeatureCard
            title="Search Params"
            description="Type-safe URL search params for filtering and pagination"
            icon="🔍"
          />
          <FeatureCard
            title="Pending UI"
            description="Built-in pending states during navigation and mutations"
            icon="⏳"
          />
          <FeatureCard
            title="NestJS Backend"
            description="Scalable Node.js backend with decorators and dependency injection"
            icon="🚀"
          />
        </div>

        <div className="text-center">
          <Link
            to="/tasks"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            View Tasks Demo
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Frontend: localhost:3000 | API: localhost:3001</p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
