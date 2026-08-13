# API Integration

This frontend consumes the RentRover backend through server actions, client
queries, and one internal Next.js proxy route. The backend base URL is read from
`BACKEND_API_URL`, and all protected requests forward the `accessToken` stored
in the app's httpOnly cookie.

Backend base path: `/api`

## Authentication

| Frontend UI / flow | Frontend integration file | Backend endpoint |
| --- | --- | --- |
| Login page, role-based dashboard redirect | `src/app/(auth)/_actions/AuthActions.ts` used by `src/app/(auth)/_components/LoginForm.tsx` | `POST /api/auth/login` |
| Register customer/provider account | `src/app/(auth)/_actions/AuthActions.ts` used by `src/app/(auth)/_components/RegisterForm.tsx` | `POST /api/auth/register` |
| Refresh expired access token | `src/app/services/auth/refreshToken.ts` | `POST /api/auth/refresh-token` |
| Current user/profile lookup for server usage | `src/app/services/auth/getMe.ts` | `GET /api/auth/me` |
| Current user lookup for client header/profile menus | `src/app/api/me/route.ts`, `src/lib/api/auth.api.ts` | Frontend proxy: `GET /api/me`, backend: `GET /api/auth/me` |

## Public Marketplace

| Frontend UI / flow | Frontend integration file | Backend endpoint |
| --- | --- | --- |
| Home page category section | `src/app/(public)/_actions/homeActions.ts` used by `src/app/(public)/page.tsx` | `GET /api/categories` |
| Home page featured/top gear | `src/app/(public)/_actions/homeActions.ts` used by `src/app/(public)/page.tsx` | `GET /api/gear` |
| Home page platform stats | `src/app/(public)/_actions/homeActions.ts` used by `src/app/(public)/page.tsx` | `GET /api/gear/meta/stats` |
| Home page public reviews/testimonials | `src/app/(public)/_actions/homeActions.ts` used by `src/app/(public)/page.tsx` | `GET /api/reviews/public` |
| Public browse gear page | `src/app/(customer)/_actions/gearActions.ts` used by `src/app/(public)/gear/page.tsx` | `GET /api/gear` |
| Public browse category filters | `src/app/(public)/_actions/homeActions.ts` used by `src/app/(public)/gear/page.tsx` | `GET /api/categories` |
| Public single gear details | `src/app/(customer)/_actions/gearActions.ts` used by `src/app/(public)/gear/[id]/page.tsx` | `GET /api/gear/:id` |
| Gear booking widget on public gear details | `src/app/(customer)/_actions/rentalActions.ts` used by `src/app/(public)/gear/_components/GearBookingSection.tsx` | `POST /api/rentals` |

## Customer Dashboard

| Frontend UI / flow | Frontend integration file | Backend endpoint |
| --- | --- | --- |
| Customer dashboard summary cards | `src/app/(customer)/_actions/rentalActions.ts`, `src/app/(customer)/_actions/paymentActions.ts`, `src/app/(customer)/_actions/reviewActions.ts` used by `src/app/(customer)/dashboard/customer/page.tsx` | `GET /api/rentals`, `GET /api/payments`, `GET /api/reviews` |
| Customer rent/browse dashboard page | `src/app/(customer)/_actions/gearActions.ts`, `src/app/(customer)/_actions/categoryActions.ts` used by `src/app/(customer)/dashboard/customer/rent/page.tsx` | `GET /api/gear`, `GET /api/categories` |
| Customer rent details and rental creation | `src/app/(customer)/_actions/gearActions.ts`, `src/app/(customer)/_actions/rentalActions.ts` used by `src/app/(customer)/dashboard/customer/rent/[id]/page.tsx` | `GET /api/gear`, `POST /api/rentals` |
| Customer rental list | `src/app/(customer)/_actions/rentalActions.ts` used by `src/app/(customer)/dashboard/customer/rentals/page.tsx` | `GET /api/rentals` |
| Customer rental details | `src/app/(customer)/_actions/rentalActions.ts` used by `src/app/(customer)/dashboard/customer/rentals/[id]/page.tsx` | `GET /api/rentals/:id` |
| Customer payment checkout | `src/app/(customer)/_actions/paymentActions.ts` used by `src/app/(customer)/dashboard/customer/payment/[id]/page.tsx` | `POST /api/payments/create` |
| Customer review list and submission | `src/app/(customer)/_actions/reviewActions.ts`, `src/app/(customer)/_actions/rentalActions.ts` used by `src/app/(customer)/dashboard/customer/reviews/page.tsx` | `GET /api/reviews`, `POST /api/reviews`, `GET /api/rentals` |

## Provider Dashboard

| Frontend UI / flow | Frontend integration file | Backend endpoint |
| --- | --- | --- |
| Provider dashboard summary | `src/app/(provider)/_actions/gearActions.ts`, `src/app/(provider)/_actions/orderActions.ts` used by `src/app/(provider)/dashboard/provider/page.tsx` | `GET /api/provider/gear`, `GET /api/provider/orders` |
| Provider gear list | `src/app/(provider)/_actions/gearActions.ts` used by `src/app/(provider)/dashboard/provider/gear/page.tsx` and `src/app/(provider)/_components/GearTable.tsx` | `GET /api/provider/gear` |
| Provider add new gear form | `src/app/(provider)/_actions/gearActions.ts`, `src/app/(provider)/_actions/categoryActions.ts` used by `src/app/(provider)/_components/ProviderGearForm.tsx` | `POST /api/provider/gear`, `GET /api/categories` |
| Provider edit gear form | `src/app/(provider)/_actions/gearActions.ts`, `src/app/(provider)/_actions/categoryActions.ts` used by `src/app/(provider)/dashboard/provider/gear/[id]/edit/page.tsx` and `src/app/(provider)/_components/ProviderGearForm.tsx` | `GET /api/gear/:id`, `PUT /api/provider/gear/:id`, `GET /api/categories` |
| Provider delete gear action | `src/app/(provider)/_actions/gearActions.ts` used by `src/app/(provider)/_components/GearTable.tsx` | `DELETE /api/provider/gear/:id` |
| Provider orders list and status updates | `src/app/(provider)/_actions/orderActions.ts` used by `src/app/(provider)/dashboard/provider/orders/page.tsx` | `GET /api/provider/orders`, `PATCH /api/provider/orders/:id` |

## Admin Dashboard

| Frontend UI / flow | Frontend integration file | Backend endpoint |
| --- | --- | --- |
| Admin dashboard summary | `src/app/(admin)/_actions/adminActions.ts` used by `src/app/(admin)/dashboard/admin/page.tsx` | `GET /api/admin/users`, `GET /api/admin/gear`, `GET /api/admin/rentals` |
| Admin user management | `src/app/(admin)/_actions/adminActions.ts` used by `src/app/(admin)/dashboard/admin/users/page.tsx` | `GET /api/admin/users`, `PATCH /api/admin/users/:id` |
| Admin gear moderation | `src/app/(admin)/_actions/adminActions.ts` used by `src/app/(admin)/dashboard/admin/gear/page.tsx` | `GET /api/admin/gear` |
| Admin rental management | `src/app/(admin)/_actions/adminActions.ts` used by `src/app/(admin)/dashboard/admin/rentals/page.tsx` | `GET /api/admin/rentals` |
| Admin category management | `src/app/(admin)/_actions/categoryActions.ts` used by `src/app/(admin)/dashboard/admin/categories/page.tsx` | `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id` |

## Notes

- Protected Admin, Provider, and Customer requests read `accessToken` from an
  httpOnly cookie in server actions and send it as `Authorization: Bearer <token>`.
- TanStack Query is used on dashboard/client pages for cached reads, mutations,
  and invalidation after create/update/delete actions.
- The Stripe webhook endpoint `POST /api/payments/webhook` is backend-to-Stripe
  infrastructure and is not called directly by the frontend.
- The current UI does not directly call `GET /api/categories/:id`,
  `GET /api/payments/:id`, or `GET /api/provider/orders/:id`; the visible flows
  use list/detail data from the implemented endpoints above.
