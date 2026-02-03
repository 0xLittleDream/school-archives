

# NcsMemories - Implementation Plan

## Overview
A premium digital archive platform for school memories, featuring a polished public website and a secure admin dashboard. Multi-branch support with flexible tagging, real authentication, and full content management.

---

## Phase 1: Foundation & Design System

### Brand Identity
- **Primary color palette**: Navy Blue/Royal Blue (#1a365d, #2563eb) with white/light grey backgrounds
- **Typography**: Elegant serif for headings (Playfair Display), clean sans-serif for body (Inter)
- **Design tokens**: Large spacing, soft shadows, rounded cards, premium feel
- **Mobile-first responsive approach throughout

### Core Layout Components
- Site header with logo "NcsMemories" and navigation
- Footer with creator credit: "Website created solely by @dr3am8r" (linked to Instagram)
- Consistent card components for collections
- Loading states and empty states

---

## Phase 2: Database & Backend Setup (Lovable Cloud)

### Database Tables
1. **branches** - School branches (name, code like "104", location, logo)
2. **collections** - Memory collections (title, description, cover image, date, branch, photo count)
3. **photos** - Individual photos (image URL, caption, collection reference)
4. **tags** - Flexible tagging system (name, color)
5. **collection_tags** - Many-to-many relationship
6. **user_roles** - Admin role management (user_id, role)
7. **site_content** - Editable page content (page name, section, content)

### Authentication & Roles
- Email/password authentication
- Admin role system with invite capability
- Protected admin routes
- Session persistence

### File Storage
- Storage bucket for photo uploads
- Secure access policies

---

## Phase 3: Branch Selection System

### First-Time Visitor Experience
- Modal/fullscreen overlay on first visit
- "Welcome to NcsMemories - Select Your School" message
- Visual cards for each branch with logo and name
- Selection stored in local storage for persistence

### Branch Switching
- Indicator in header showing current branch
- Easy switch option accessible throughout the site
- All content filters automatically by selected branch

---

## Phase 4: Public Website

### Home Page
- Hero section: "NCS Memories" title with subtitle "Preserving moments. Celebrating journeys."
- Two CTA buttons: "Explore Our Collections" and "View Farewell 2025"
- Featured collections grid (4-6 highlighted collections)
- Quick stats (total photos, total collections)

### Memories Page
- Grid-based gallery layout
- Filter by tags (Farewell, Annual Day, Cultural Events, Sports, etc.)
- Each collection card shows: cover image, title, date, photo count, tags
- Smooth hover animations

### Farewell 2025 (Special Section)
- Dedicated page for current year's farewell content
- Premium gallery layout with larger featured images
- Easy navigation through all farewell photos

### Events Page
- Chronological listing of school events
- Grouped by year if needed
- Quick links to related collections

### About Page
- Editable content section about NcsMemories
- School network information
- Mission/purpose of the archive

### Individual Collection View
- Full gallery grid of all photos in collection
- Lightbox view for individual photos
- Collection details (title, date, description, tags)
- Photo download option (optional)

---

## Phase 5: Admin Dashboard

### Admin Authentication
- Secure login page at /admin
- Protected routes - redirects non-admins to login
- Session-based access control

### Dashboard Home
- Quick stats overview (total collections, photos, branches)
- Recent uploads
- Quick action buttons

### Branch Management
- View all branches
- Add new branch (name, code, location, logo upload)
- Edit existing branches
- Delete branches (with confirmation)

### Collections Management
- Table/grid view of all collections
- Create new collection:
  - Title, description, date
  - Select branch
  - Upload cover image
  - Assign tags
- Edit collection details
- Delete collection (with confirmation)
- View photo count per collection

### Photo Upload System
- Select target collection
- Multi-image upload with drag-and-drop
- Upload progress indicators
- Auto-update photo count on collection
- Preview before upload
- Bulk delete capability

### Tags Management
- View all tags
- Create new tags with custom colors
- Edit tag names
- Delete tags

### Admin Management
- View list of current admins
- Invite new admin via email
- Remove admin access

### Page Editor
- Edit Home page hero text
- Edit About page content
- Simple rich text editing
- Save changes with preview

---

## Phase 6: Sample Data & Polish

### Sample Content
- 3 sample branches (NCS Vizag (104), NCS Hyderabad, NCS Bangalore)
- Sample tags (Farewell, Annual Day, Cultural Events, Sports, Achievements)
- 3-4 demo collections with placeholder images
- Sample photos in each collection

### Final Polish
- Page transitions and animations
- Loading skeletons
- Error handling with friendly messages
- 404 page styling
- SEO meta tags
- Favicon and branding

---

## Navigation Structure

**Public Site:**
- Home → /
- Memories → /memories
- Farewell 2025 → /farewell-2025
- Events → /events
- About → /about
- Collection Detail → /collection/:id

**Admin Dashboard:**
- Login → /admin/login
- Dashboard → /admin
- Branches → /admin/branches
- Collections → /admin/collections
- Photos → /admin/photos
- Tags → /admin/tags
- Admins → /admin/users
- Page Editor → /admin/pages

---

## Key User Flows

1. **First Visit**: Visitor lands → Branch selection modal → Home page (filtered to branch)
2. **Browse Memories**: Home → Memories → Filter by tag → Click collection → View photos in lightbox
3. **Admin Upload**: Login → Dashboard → Collections → Create/Select collection → Upload photos
4. **Manage Branches**: Admin → Branches → Add new branch → Save → Appears in public selector

