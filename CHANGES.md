# What changed — summary

39 files touched, ~1650 lines added. Everything type-checks and builds clean
(`npx tsc --noEmit` and `npm run build` both pass).

## 🔴 Security (do these before you deploy)

1. **DB credentials moved out of code** → `BackEnd/.env` (gitignored). The
   password that was in `Config/db.js` is already public in your git history —
   **rotate it on Railway**, then put the new connection string in `.env`.
2. **Passwords are now bcrypt-hashed** for both users and vendors. Existing
   plaintext passwords in your DB still work — on next login they're verified
   against the old plaintext value once, then silently re-hashed. No migration
   script needed, no one gets locked out.
3. **JWT auth** on every write route (`Middleware/auth.js` — `requireAuth`,
   `requireRole`, `optionalAuth`). Vendors can only touch their own restaurant
   and menu items; users can only touch their own account; only admins can see
   the full user/vendor lists or the global order log.
4. **Real admin login** (`/api/admin/login`, single-admin env-based —
   `ADMIN_USERNAME` / `ADMIN_PASSWORD` in `.env`). `/admin` and
   `/admin/addFood` are no longer open to anyone who finds the URL.
5. Set `JWT_SECRET` in `.env` to a long random string before deploying —
   `BackEnd/.env.example` has the full list of required vars.

## 🟠 Vendor portal — now actually wired end-to-end

- New **`/vendor/setup`** flow: on first login a vendor without a restaurant
  is routed here to create their listing, instead of `restrauntId` silently
  being empty everywhere.
- `VendorLayout` fetches the vendor's restaurant on load and blocks the rest
  of the panel until setup is done. Shows a "pending approval" banner if the
  admin hasn't approved them yet.
- **New vendor dashboard** with real stats (today's orders/revenue, pending
  orders, menu count, recent orders) instead of a static heading.
- **`VendorMenu`** now lists existing dishes grouped by category with edit
  and delete, not just a blind add form.
- **`VendorOrders`** pulls real orders for the vendor's restaurant and lets
  them advance status (placed → preparing → ready → out for delivery →
  delivered) instead of showing hardcoded mock data.
- **`VendorProfile`** is now editable (restaurant name, address, hours, cost,
  cuisines), not read-only.
- **Admin approval workflow**: new vendors are unapproved by default; their
  restaurant is hidden from public listings (`GET /api/restraunt/all`) until
  an admin approves them from the new "Vendors" tab in the admin dashboard.
  Admins and the vendor themselves can still preview an unapproved listing.

## 🟡 User-facing fixes

- Unified dark mode on `ThemeContext` everywhere — `Header` and the admin
  dashboard each had their own disconnected copy before; now there's one
  source of truth.
- Cart now blocks silently mixing items from two restaurants — `addItem`
  returns `'different_restaurant'` and the UI asks before clearing and
  switching.
- Veg/non-veg indicator now shows on menu items in `RestaurantDetail`.
- Centralized API calls through `src/lib/api.ts` (`apiJson`/`apiFetch`) —
  attaches the JWT automatically, single place to change the API base URL.
- Toast notifications (`ToastContext`) replacing ad-hoc inline banners in
  several flows.

## Follow-up round — the four remaining TODOs

- **Search already used the live API** — turned out this was done in the
  earlier pass; verified and left as-is.
- **Rate limiting**: `Middleware/rateLimit.js` — `loginLimiter` (10 attempts /
  15 min) on `/api/users/login`, `/api/vendors/login`, `/api/admin/login`;
  `registerLimiter` (20 / hour) on the two registration endpoints.
- **Order status polling**: `OrderDetails.tsx` now polls every 8s while an
  order isn't `delivered`/`cancelled`, shows a real step tracker (placed →
  preparing → ready → out for delivery → delivered) instead of the old
  hardcoded "Status: Delivered" text. Fixed the same hardcoded badge in the
  `Account.tsx` order list while I was in there.
- **Vendor self-service account editing**: new `PUT /api/vendors/:id` —
  vendors can edit owner name freely; changing business name or GST number
  automatically flips `isApproved` back to `false` (with a clear warning in
  the UI before they save) so the listing is re-reviewed rather than editing
  silently bypassing the approval you set up. `AuthContext` got an
  `updateUser()` helper so the local session reflects the change immediately.

## Still worth doing (didn't touch, flagging for later)

- No websocket/push updates — order status tracking uses polling (see
  above), which is fine at this scale but adds a request every 8s per open
  order-details tab.
- Vendor business-name/GST changes now auto re-trigger admin approval rather
  than routing through a separate change-request queue — simpler, and the
  vendor sees a clear warning before saving, but if you later want a formal
  approval history/audit trail this is the place to add it.
- Rate limiting is in-memory (`express-rate-limit` default store) — fine for
  a single instance, but if you ever scale the backend horizontally you'll
  want a shared store (Redis) so limits apply across instances.

## Deploy checklist

1. Rotate the Railway MySQL password.
2. `BackEnd/.env` — set `DATABASE_URL`, `JWT_SECRET`, `ADMIN_USERNAME`,
   `ADMIN_PASSWORD`.
3. `cd BackEnd && npm install` (adds `bcryptjs`, `jsonwebtoken`, `dotenv`,
   `express-rate-limit`).
4. If you have existing rows in the `orders` table, the new `status` ENUM
   column defaults to `'placed'` on sync — fine, but you may want to
   backfill delivered orders manually.
5. Frontend: optionally set `VITE_API_URL` if you're pointing at a different
   backend than the Railway URL baked into `src/lib/api.ts`.
