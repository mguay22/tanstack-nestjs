# TanStack Router + Query + NestJS: Building Fullstack Apps with Modern React

## Lecture Overview

**Duration:** ~60-75 minutes
**Level:** Intermediate
**Prerequisites:** Basic React, TypeScript, REST APIs

---

## Introduction (5 min)

### Opening Hook

Today we're building a fullstack application using the TanStack ecosystem and NestJS:

- **TanStack Router** - Type-safe routing for React
- **TanStack Query** - Powerful data fetching and caching
- **NestJS** - Scalable Node.js framework with TypeScript

By the end of this lecture, you'll understand how to:

1. Set up a monorepo with Turborepo
2. Create type-safe routes with search params
3. Implement data fetching with TanStack Query
4. Build a REST API with NestJS
5. Connect everything seamlessly

### Why This Stack?

| Technology          | Why Use It                                              |
| ------------------- | ------------------------------------------------------- |
| **TanStack Router** | Type-safe routing, search params, nested layouts        |
| **TanStack Query**  | Caching, background refetching, mutations, devtools     |
| **NestJS**          | Decorators, dependency injection, scalable architecture |
| **Turborepo**       | Monorepo tooling, parallel builds, shared configs       |
| **Tailwind CSS**    | Rapid UI development, utility-first CSS                 |

---

## Part 1: Project Setup (10 min)

### Monorepo Structure

```
tanstack-router-nestjs/
├── apps/
│   ├── web/          # TanStack Router frontend
│   └── api/          # NestJS backend
├── package.json      # Root workspace config
├── pnpm-workspace.yaml
└── turbo.json        # Turborepo task config
```

### Key Concept: Turborepo

Turborepo allows us to:

- Run both apps in parallel with `pnpm dev`
- Share configurations across packages
- Cache builds for faster iterations

### Demo: Starting the Apps

```bash
pnpm dev
```

This runs both:

- Frontend on `http://localhost:3000`
- API on `http://localhost:3001`

---

## Part 2: Why Not Next.js? Comparing Approaches (10 min)

### The Landscape Today

Most tutorials default to Next.js for fullstack React. But there are compelling reasons to consider alternatives.

### Architecture Comparison

| Aspect              | Next.js                     | TanStack Router + NestJS            |
| ------------------- | --------------------------- | ----------------------------------- |
| **Frontend**        | React (tightly coupled)     | React (standalone)                  |
| **Backend**         | API Routes / Server Actions | Dedicated NestJS server             |
| **Routing**         | File-based (pages/app dir)  | File-based (type-safe)              |
| **Data Fetching**   | Server Components, `fetch`  | Route loaders, any client           |
| **Deployment**      | Vercel-optimized            | Deploy anywhere independently       |
| **Backend Scaling** | Limited (serverless)        | Full control (containers, clusters) |

### When to Choose This Stack Over Next.js

#### 1. **You Need a Serious Backend**

Next.js API routes are thin wrappers. NestJS gives you:

```typescript
// NestJS: Real backend architecture
@Controller('tasks')
export class TasksController {
  constructor(
    private tasksService: TasksService,
    private authService: AuthService,    // Dependency injection
    private cacheService: CacheService,  // Easy to add services
  ) {}

  @UseGuards(AuthGuard)  // Decorators for cross-cutting concerns
  @Get()
  findAll() { ... }
}
```

vs Next.js:

```typescript
// Next.js: Just a function
export async function GET(request: Request) {
  // Manual everything - no DI, no decorators
  const auth = await checkAuth(request);
  const cache = await getCache();
  // ...
}
```

#### 2. **Independent Scaling**

```
Next.js:
┌─────────────────────────┐
│  Frontend + Backend     │  ← Scales together (wasteful)
│  (Same deployment)      │
└─────────────────────────┘

TanStack + NestJS:
┌─────────────┐    ┌─────────────┐
│  Frontend   │    │   Backend   │  ← Scale independently
│  (CDN/Edge) │    │ (3 replicas)│
└─────────────┘    └─────────────┘
```

#### 3. **Team Separation**

- **Frontend team**: Works in `apps/web`, deploys to Vercel/Netlify
- **Backend team**: Works in `apps/api`, deploys to AWS/GCP/Railway

No stepping on each other's toes. Different release cycles.

#### 4. **Type-Safety Without Magic**

TanStack Router's type safety is explicit:

```typescript
// Route params are inferred and type-checked
const { taskId } = Route.useParams();  // taskId: string

// Search params are validated
const { status } = Route.useSearch();  // status: TaskStatus

// Links are type-checked at compile time
<Link to="/tasks/$taskId" params={{ taskId: "123" }} />  // ✓
<Link to="/tasks/$taskId" params={{ id: "123" }} />      // ✗ Error!
```

#### 5. **No Vendor Lock-in**

| Next.js Reality                  | This Stack            |
| -------------------------------- | --------------------- |
| Optimized for Vercel             | Deploy anywhere       |
| Middleware runs on Edge (Vercel) | Full Node.js runtime  |
| Image optimization (Vercel)      | Use any CDN           |
| ISR/caching (Vercel infra)       | Standard HTTP caching |

#### 6. **Simpler Mental Model**

Next.js App Router complexity:

- Server Components vs Client Components
- `"use client"` / `"use server"` directives
- Caching layers (fetch cache, full route cache, router cache)
- When does this code run? (Build? Request? Client?)

TanStack Router:

- Routes have loaders (fetch data)
- Components render (use data)
- That's it.

### When Next.js IS the Better Choice

Be balanced—Next.js wins when:

- **Content-heavy sites**: Blog, marketing, docs (SSG/ISR shine)
- **SEO is critical**: Server-rendered HTML out of the box
- **Small team, fast MVP**: One deployment, less infrastructure
- **Vercel is your platform**: First-class optimizations

### The Hybrid Approach

You can also use **TanStack Start** (TanStack's full-stack framework) for SSR while keeping NestJS:

```
┌──────────────────┐     ┌─────────────┐
│  TanStack Start  │────▶│   NestJS    │
│  (SSR + Client)  │     │   (API)     │
└──────────────────┘     └─────────────┘
```

Best of both worlds: SSR when needed, dedicated backend always.

---

## Part 3: NestJS Backend (15 min)

### NestJS Architecture

NestJS uses a modular architecture with three core concepts:

1. **Controllers** - Handle HTTP requests
2. **Services** - Business logic
3. **Modules** - Organize related code

### Code Walkthrough: Tasks Module

**Controller** (`tasks.controller.ts`):

```typescript
@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Query("status") status?: string) {
    return this.tasksService.findAll(status);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }
}
```

**Key Points:**

- Decorators define routes (`@Get`, `@Post`, `@Patch`, `@Delete`)
- Dependency injection via constructor
- DTOs for type-safe request bodies
- Query params with `@Query()`

### Demo: Testing the API

```bash
# List all tasks
curl http://localhost:3001/tasks

# Filter by status
curl http://localhost:3001/tasks?status=todo

# Create a task
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "New Task"}'
```

---

## Part 4: TanStack Router Frontend (15 min)

### Core Concepts

TanStack Router handles routing with type safety:

1. **File-based Routing** - Routes defined by file structure
2. **Search Params** - Type-safe URL parameters
3. **Type-safe Links** - Compile-time checked navigation

### File-Based Routing

```
src/routes/
├── __root.tsx        # Layout wrapper + QueryClientProvider
├── index.tsx         # "/" route
└── tasks/
    ├── index.tsx     # "/tasks" route
    └── $taskId.tsx   # "/tasks/:taskId" route
```

### Code Walkthrough: Search Params

**Tasks List Route** (`tasks/index.tsx`):

```typescript
export const Route = createFileRoute('/tasks/')({
  // Type-safe search params validation
  validateSearch: (search): TasksSearch => ({
    status: search.status || 'all',
    search: search.search || '',
  }),
  component: TasksPage,
});

function TasksPage() {
  // Access validated search params
  const { status, search } = Route.useSearch();

  // TanStack Query for data fetching with caching
  const { data: tasks, isLoading, error } = useTasksQuery({ status, search });
  // ...
}
```

### Demo: Search Params in Action

```typescript
// Navigate with search params - URL updates automatically
navigate({
  search: (prev) => ({ ...prev, status: "done" }),
});
```

Watch the URL update: `/tasks?status=done`

---

## Part 5: TanStack Query for Data Fetching (15 min)

### Why TanStack Query?

| Feature                   | Benefit                                    |
| ------------------------- | ------------------------------------------ |
| **Caching**               | Data cached and reused across components   |
| **Background Refetching** | Stale data shown while fetching fresh      |
| **Mutations**             | Easy create/update/delete with cache sync  |
| **Devtools**              | Visualize cache state and queries          |

### Setting Up QueryClient

**Root Route** (`__root.tsx`):

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
    },
  },
});

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Header />
      <Outlet />
      <ReactQueryDevtools />
    </QueryClientProvider>
  ),
});
```

### Query Keys Pattern

**Centralized Query Keys** (`lib/queries.ts`):

```typescript
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: { status?: string; search?: string }) =>
    [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};
```

**Benefits:**
- Consistent cache keys across the app
- Easy to invalidate related queries
- Type-safe key generation

### Query and Mutation Hooks

```typescript
// Fetching data
export function useTasksQuery(filters: { status?: string; search?: string }) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => api.tasks.list(filters),
  });
}

// Mutations with cache invalidation
export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.tasks.update(id, data),
    onSuccess: (updatedTask) => {
      // Update individual task cache
      queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}
```

### Using in Components

```typescript
function TaskDetailPage() {
  const { taskId } = Route.useParams();
  const { data: task, isLoading, error } = useTaskQuery(taskId);
  const updateMutation = useUpdateTaskMutation();

  const handleStatusChange = (newStatus: Task['status']) => {
    updateMutation.mutate({ id: taskId, data: { status: newStatus } });
  };

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <button
      onClick={() => handleStatusChange('done')}
      disabled={updateMutation.isPending}
    >
      {updateMutation.isPending ? 'Updating...' : 'Mark Done'}
    </button>
  );
}
```

**Key Points:**
- `isPending` for loading states during mutations
- Automatic cache invalidation on success
- No manual state management needed

---

## Part 6: Connecting Frontend & Backend (10 min)

### CORS Configuration

Enable CORS on the NestJS backend to allow requests from the frontend:

**NestJS Main** (`main.ts`):

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: "http://localhost:3000" });
  await app.listen(process.env.PORT ?? 3001);
}
```

### API Client Pattern

**Environment Variables** (`.env`):

```bash
VITE_API_URL=http://localhost:3001
```

**Centralized API Client** (`lib/api.ts`):

```typescript
const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  tasks: {
    list: async (params) => {
      const res = await fetch(`${API_URL}/tasks?${searchParams}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    // ... other methods
  },
};
```

**Benefits:**

- Single source of truth for API calls
- Easy to add authentication headers
- Consistent error handling
- API URL configurable per environment

### Type Sharing

Both apps share the same `Task` interface:

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  createdAt: string;
  updatedAt: string;
}
```

**Pro Tip:** In production, consider a shared `packages/types` package in your monorepo.

---

## Part 7: UI Patterns (5 min)

### Loading States

```typescript
pendingComponent: () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    <div className="h-12 bg-gray-200 rounded"></div>
  </div>
);
```

### Error Boundaries

```typescript
errorComponent: ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
    <h2 className="text-red-800">Error loading tasks</h2>
    <p className="text-red-600">{error.message}</p>
  </div>
);
```

### Optimistic Updates Pattern

```typescript
// 1. Update UI immediately
setTasks((prev) =>
  prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
);

// 2. Make API call
await api.tasks.update(id, { status: newStatus });

// 3. Revalidate to sync with server
router.invalidate();
```

---

## Summary & Key Takeaways

### What We Built

1. **Monorepo** with Turborepo for parallel development
2. **NestJS API** with CRUD endpoints and proper architecture
3. **TanStack Router frontend** with:
   - File-based routing
   - Route loaders for data fetching
   - Type-safe search params
   - Pending and error states

### This Stack vs Next.js

| Choose This Stack When...         | Choose Next.js When...  |
| --------------------------------- | ----------------------- |
| Backend needs real architecture   | Content/marketing sites |
| Teams work independently          | Small team, fast MVP    |
| Need to scale services separately | SEO is top priority     |
| Want deployment flexibility       | Already on Vercel       |
| Prefer explicit over magic        | Need SSR/SSG out of box |

### Best Practices Demonstrated

| Practice                  | Benefit                                    |
| ------------------------- | ------------------------------------------ |
| Route loaders             | No loading spinners, data ready on render  |
| Search params             | Shareable URLs, browser back/forward works |
| Centralized API client    | Consistent error handling                  |
| Pending components        | Better UX during navigation                |
| Error boundaries          | Graceful error handling                    |
| Separate frontend/backend | Independent scaling & deployment           |

### Next Steps

1. Add authentication (JWT with NestJS Guards)
2. Add a database (Prisma + PostgreSQL)
3. Deploy (Vercel for frontend, Railway/Render for API)
4. Add real-time updates (WebSockets with NestJS Gateway)
5. Explore TanStack Start for SSR needs

---

## Q&A Prompts

1. "When would you still choose Next.js over this stack?"
2. "How do you handle authentication across the two apps?"
3. "Can you add SSR to this setup?"
4. "How would you share types between frontend and backend?"
5. "What about TanStack Query—when would you add that?"

---

## Resources

- [TanStack Router Docs](https://tanstack.com/router)
- [TanStack Start Docs](https://tanstack.com/start) (for SSR)
- [NestJS Docs](https://docs.nestjs.com)
- [Turborepo Docs](https://turbo.build/repo)

---

_Generated for TanStack Router + NestJS lecture_
