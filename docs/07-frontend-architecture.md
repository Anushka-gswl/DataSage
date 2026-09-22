# 07 — Frontend Architecture

## Overview

The DataSage frontend is a Next.js 14 application using the App Router. It serves both SEO-optimized public pages (landing, property detail) and interactive authenticated experiences (dashboard, comparison, recommendations).

---

## Technology Choices

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14.x (App Router) | Framework — SSR, routing, API abstraction |
| React | 18.x | UI component library |
| TypeScript | 5.x | Type safety across the frontend |
| SWR | 2.x | Data fetching, caching, revalidation |
| Leaflet | 1.9.x | Interactive maps |
| react-leaflet | 4.x | React bindings for Leaflet |
| CSS Modules | Built-in | Scoped component styling |
| Recharts | 2.x | Charts (SHAP visualization, price trends) |
| Zod | 3.x | Form validation (mirrors Pydantic on backend) |

---

## Rendering Strategy

| Page | Strategy | Rationale |
|------|----------|-----------|
| Landing page | SSG (Static Site Generation) | Content rarely changes. Maximum performance. |
| Property search results | SSR with client-side pagination | SEO for initial results. SWR handles subsequent pages. |
| Property detail | SSR | SEO critical. Meta tags with property info for social sharing. |
| User dashboard | CSR (Client-Side Rendering) | Authenticated, personalized, no SEO need. |
| Comparison page | CSR | Interactive, no SEO need. |
| Admin dashboard | CSR | Authenticated, internal tool. |
| Auth pages (login, register) | SSR | Fast load, simple forms. |

---

## Directory Structure

```
frontend/
├── public/
│   ├── images/                # Static assets
│   └── favicon.ico
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout (nav, footer, providers)
│   │   ├── page.tsx           # Landing page (/)
│   │   ├── login/
│   │   │   └── page.tsx       # /login
│   │   ├── register/
│   │   │   └── page.tsx       # /register
│   │   ├── onboarding/
│   │   │   └── page.tsx       # /onboarding (multi-step wizard)
│   │   ├── search/
│   │   │   └── page.tsx       # /search?locality=...&bhk=...
│   │   ├── properties/
│   │   │   └── [id]/
│   │   │       └── page.tsx   # /properties/:id (property detail)
│   │   ├── compare/
│   │   │   └── page.tsx       # /compare
│   │   ├── dashboard/
│   │   │   ├── page.tsx       # /dashboard (recommendations, saved)
│   │   │   ├── saved/
│   │   │   │   └── page.tsx   # /dashboard/saved
│   │   │   ├── history/
│   │   │   │   └── page.tsx   # /dashboard/history
│   │   │   └── preferences/
│   │   │       └── page.tsx   # /dashboard/preferences
│   │   └── admin/
│   │       ├── layout.tsx     # Admin layout (sidebar nav)
│   │       ├── page.tsx       # /admin (overview)
│   │       ├── datasets/
│   │       │   └── page.tsx   # /admin/datasets
│   │       ├── models/
│   │       │   └── page.tsx   # /admin/models
│   │       ├── users/
│   │       │   └── page.tsx   # /admin/users
│   │       └── audit/
│   │           └── page.tsx   # /admin/audit
│   ├── components/
│   │   ├── common/            # Shared UI components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Badge/
│   │   │   ├── Modal/
│   │   │   ├── Skeleton/
│   │   │   ├── Toast/
│   │   │   ├── Pagination/
│   │   │   └── EmptyState/
│   │   ├── layout/
│   │   │   ├── Navbar/
│   │   │   ├── Footer/
│   │   │   ├── Sidebar/
│   │   │   └── MobileNav/
│   │   ├── property/
│   │   │   ├── PropertyCard/
│   │   │   ├── PropertyGallery/
│   │   │   ├── PricingAnalysis/
│   │   │   ├── LocationSection/
│   │   │   ├── InvestmentSection/
│   │   │   ├── ExplanationSection/
│   │   │   ├── SimilarProperties/
│   │   │   └── ComparisonTable/
│   │   ├── search/
│   │   │   ├── SearchBar/
│   │   │   ├── FilterPanel/
│   │   │   ├── SortDropdown/
│   │   │   └── ResultsList/
│   │   ├── map/
│   │   │   ├── PropertyMap/
│   │   │   ├── POIMarker/
│   │   │   └── MapControls/
│   │   ├── dashboard/
│   │   │   ├── RecommendationList/
│   │   │   ├── SavedPropertyList/
│   │   │   └── SearchHistoryList/
│   │   ├── onboarding/
│   │   │   ├── BudgetStep/
│   │   │   ├── BHKStep/
│   │   │   ├── LocalityStep/
│   │   │   ├── CommuteStep/
│   │   │   ├── LifestyleStep/
│   │   │   └── PropertyTypeStep/
│   │   └── admin/
│   │       ├── SystemHealthPanel/
│   │       ├── DatasetTable/
│   │       ├── ModelVersionList/
│   │       ├── UserManagementTable/
│   │       └── AuditLogTable/
│   ├── hooks/
│   │   ├── useAuth.ts         # Auth state and actions
│   │   ├── useProperties.ts   # Property search/detail fetching
│   │   ├── useValuation.ts    # Valuation data fetching
│   │   ├── useComparison.ts   # Comparison list management
│   │   ├── usePreferences.ts  # User preferences
│   │   └── useLocalStorage.ts # Typed localStorage wrapper
│   ├── lib/
│   │   ├── api.ts             # API client (fetch wrapper)
│   │   ├── auth.ts            # Token management, refresh logic
│   │   ├── format.ts          # INR formatting, date formatting
│   │   ├── constants.ts       # App-wide constants
│   │   └── types.ts           # Shared TypeScript types
│   ├── contexts/
│   │   ├── AuthContext.tsx     # Auth provider
│   │   └── CompareContext.tsx  # Comparison list provider
│   └── styles/
│       ├── globals.css        # CSS custom properties, reset, typography
│       ├── variables.css      # Design tokens
│       └── utilities.css      # Utility classes (spacing, text)
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## State Management Architecture

### Server State (SWR)

All data from the backend API is managed by SWR:

```typescript
// hooks/useProperties.ts
import useSWR from 'swr';
import { api } from '@/lib/api';

export function usePropertyDetail(id: string) {
  const { data, error, isLoading } = useSWR(
    `/properties/${id}`,
    api.get
  );
  return { property: data, error, isLoading };
}

export function usePropertyValuation(id: string) {
  const { data, error, isLoading } = useSWR(
    `/properties/${id}/valuation`,
    api.get
  );
  return { valuation: data, error, isLoading };
}
```

### Client State (React Context)

Minimal client state for cross-cutting concerns:

1. **AuthContext**: Current user, tokens, login/logout/refresh actions
2. **CompareContext**: List of property IDs selected for comparison (max 4)

### Local State (Component useState)

- Form inputs, UI toggles, modal open/close, active tab, etc.

### Persistent Client State (localStorage)

- Comparison list for unauthenticated users
- Theme preference (future: dark mode)
- Dismissed banners

---

## API Client

Centralized API client with automatic token attachment and refresh:

```typescript
// lib/api.ts
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL!;
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
      // Attempt token refresh
      const refreshed = await this.refreshToken();
      if (refreshed) {
        return this.request<T>(method, path, body); // Retry
      }
      // Refresh failed — redirect to login
      redirectToLogin();
    }

    if (!res.ok) {
      const error = await res.json();
      throw new ApiError(res.status, error.detail, error.code);
    }

    return res.json();
  }
}

export const api = new ApiClient();
```

---

## Map Integration

### Architecture

Leaflet maps are rendered as client-only components (no SSR) since Leaflet requires a DOM:

```typescript
// components/map/PropertyMap/PropertyMap.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled
const MapContainer = dynamic(
  () => import('react-leaflet').then(m => m.MapContainer),
  { ssr: false }
);
```

### POI Rendering

POIs are rendered as category-coded markers:

| Category | Icon | Color |
|----------|------|-------|
| Schools | 🎓 | Blue |
| Hospitals | 🏥 | Red |
| Metro stations | 🚇 | Purple |
| Bus stops | 🚌 | Orange |
| Parks | 🌳 | Green |
| Shopping | 🛒 | Yellow |
| Restaurants | 🍽️ | Pink |

---

## Design System (CSS Custom Properties)

```css
/* styles/variables.css */
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-success: #16a34a;       /* Underpriced badge */
  --color-danger: #dc2626;        /* Overpriced badge */
  --color-info: #2563eb;          /* Fair price badge */
  --color-warning: #d97706;

  /* Surfaces */
  --color-bg: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-card: #ffffff;
  --color-border: #e2e8f0;

  /* Text */
  --color-text: #0f172a;
  --color-text-secondary: #64748b;
  --color-text-muted: #94a3b8;

  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Spacing scale (4px base) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Border radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}
```

---

## INR Formatting

All currency display uses the Indian numbering system:

```typescript
// lib/format.ts
export function formatINR(value: number): string {
  if (value >= 10_000_000) {
    return `₹${(value / 10_000_000).toFixed(2)} Cr`;
  }
  if (value >= 100_000) {
    return `₹${(value / 100_000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

// formatINR(12500000)  → "₹1.25 Cr"
// formatINR(4500000)   → "₹45.00 L"
// formatINR(85000)     → "₹85,000"
```

---

## Error Handling (Frontend)

### API Error Boundary

```typescript
// components/common/ErrorBoundary.tsx
// React Error Boundary wrapping each page section independently.
// If the pricing section fails, the rest of the property page still renders.
```

### Error States per Section

| Section | Error UX |
|---------|----------|
| Search results | "Unable to load results. [Retry]" |
| Property detail | Full-page error with retry |
| Pricing analysis | Section-level error: "AI analysis unavailable" |
| Map | "Map could not be loaded" with text-only POI list fallback |
| Recommendations | "Unable to load recommendations. [Retry]" |
| Admin dashboard | Section-level errors with retry per panel |

---

## Performance Optimizations

| Optimization | Implementation |
|-------------|----------------|
| Code splitting | Next.js automatic per-route splitting |
| Image optimization | `next/image` with WebP, lazy loading, responsive srcset |
| Font optimization | `next/font` with Inter — self-hosted, no layout shift |
| Map lazy loading | Dynamic import with `ssr: false`, loaded only when visible |
| Chart lazy loading | Dynamic import for Recharts components |
| SWR deduplication | SWR deduplicates identical requests within 2 seconds |
| Prefetching | Next.js `<Link>` prefetches routes on hover |

---

## Testing Strategy (Frontend)

| Type | Tool | Target |
|------|------|--------|
| Unit tests (components) | Jest + React Testing Library | All interactive components |
| Unit tests (hooks/utils) | Jest | All custom hooks and utility functions |
| Integration tests | Jest + MSW (Mock Service Worker) | API integration, auth flow |
| E2E tests | Playwright | Critical user flows (search, detail, compare) |
| Accessibility tests | jest-axe + Lighthouse CI | All pages |
| Visual regression | Playwright screenshots | Key pages per release |

---

## Related Documents

- [06 — System Architecture](06-system-architecture.md)
- [08 — Backend Architecture](08-backend-architecture.md)
- [10 — API Specification](10-api-specification.md)
- [23 — Testing Strategy](23-testing-strategy.md)
