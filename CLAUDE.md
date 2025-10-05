# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tuberculosis Patient Transfer System for SEDES Cochabamba - a medical patient referral and counter-referral management system for tracking TB patients across hospitals in the Cochabamba health network.

**Architecture**: Full-stack web application with separate frontend/backend
- **Frontend**: React 19 + Vite + Tailwind CSS (SPA)
- **Backend**: Node.js 18 + Express 5 + MySQL 8
- **Authentication**: JWT with bcrypt (8-hour expiration)
- **Deployment**: IIS on Windows Server (production)

## Development Commands

### Backend (from `backend/` directory)
```bash
npm install                 # Install dependencies
npm run dev                 # Development server with nodemon (port 3000)
npm start                   # Production server
```

### Frontend (from `frontend/` directory)
```bash
npm install                 # Install dependencies
npm run dev                 # Development server with Vite (port 5173)
npm run build              # Production build (outputs to dist/)
npm run preview            # Preview production build
npm run lint               # Run ESLint
```

### Database Setup
```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE dbTuber;
USE dbTuber;

# Import database structure
mysql -u root -p dbTuber < "Bases de Datos/db19475_dump.sql"
```

## High-Level Architecture

### Role-Based Access Control (RBAC)
The system implements a strict hierarchical role system:

1. **admin** (Super Admin): Full system access
2. **sedes_admin** (SEDES Admin): Manages hospitals and networks, inherits admin permissions
3. **hospital_admin**: Manages staff for their assigned hospital only
4. **doctor**: Creates/manages referrals and patients
5. **nurse**: Creates/manages referrals and patients

**Key Pattern**: Higher roles inherit lower role permissions (admin > sedes_admin > hospital_admin), but medical staff (doctor/nurse) are separate from admin hierarchy.

### Authentication Flow
1. User logs in → JWT token issued (8h expiration)
2. Token stored in localStorage, sent via `x-auth-token` header
3. Middleware verifies token on protected routes (`authMiddleware.js`)
4. First login requires password change (`password_change_required` flag)
5. Passwords hashed with bcrypt (10 salt rounds)

### Data Access Patterns
**Hospital-scoped queries**: Most endpoints filter data by user's hospital unless user is admin/sedes_admin.

Example pattern used throughout controllers:
```javascript
if (!['admin', 'sedes_admin'].includes(req.user.role)) {
  query += ' AND hospital_id = ?';
  queryParams.push(req.user.hospital_id);
}
```

**Soft deletes**: Records marked inactive via `status` field (1=active, 0=inactive), never physically deleted.

### Referral Workflow
Core business logic for patient transfers:

1. **Referral Creation**: Doctor/nurse at Hospital A creates referral to send patient to Hospital B
   - Patient must exist in system first
   - Referral includes diagnosis, urgency level (alta/media/baja), clinical summary
   - Status: `pendiente` (pending)

2. **Referral Acceptance**: Staff at Hospital B reviews and accepts/rejects
   - Status changes to `aceptada` or `rechazada`
   - Patient's current hospital updates to Hospital B if accepted

3. **Counter-Reference Creation**: When treatment completes at Hospital B, creates counter-reference to send patient back to Hospital A
   - Includes treatment provided, final diagnosis, recommendations
   - Automatically returns patient to origin hospital

**Critical**: System prevents circular referrals by tracking hospital history per patient (`getPatientHospitalHistory`).

### Database Connection Management
Uses mysql2 connection pool with:
- 10 max connections
- Automatic reconnection on connection loss
- Ping every 5 minutes to keep connections alive (`config/db.js:64-71`)
- All queries use promise-based API: `pool.promise().query()`

### Frontend State Management
- **AuthContext** (`context/AuthContext.jsx`): Global auth state, user data, role checks
- **React Router v7**: Client-side routing with protected routes
- **Axios interceptors**: Auto-attach JWT token to all API requests
- **Toast notifications**: User feedback via react-toastify

### API Route Structure
All routes prefixed with `/api`:
```
/api/auth              → Login, password reset, password change
/api/hospitals         → Hospital CRUD (SEDES admin only)
/api/networks          → Network CRUD (SEDES admin only)
/api/municipalities    → Municipality data (read-only)
/api/staff             → Medical staff CRUD (hospital scoped)
/api/hospital-admins   → Hospital admin user management
/api/patients          → Patient records (hospital scoped)
/api/referrals         → Patient referrals between hospitals
/api/counter-references → Patient counter-references (return transfers)
```

## Environment Variables

### Backend (.env)
```
DB_HOST=db19475.public.databaseasp.net
DB_USER=db19475
DB_PASSWORD=5Zb-_y2X6Yq=
DB_NAME=dbTuber
DB_PORT=3306
JWT_SECRET=tubersedessecretkey2025
EMAIL_USER=yajuego69@gmail.com
EMAIL_PASSWORD=yayq hxtf oeof kyek
PORT=3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api  # or production API URL
```

## Important File Locations

### Backend Core Files
- `app.js` - Express server entry point, CORS config, route mounting
- `config/db.js` - MySQL pool configuration with keep-alive logic
- `middleware/authMiddleware.js` - JWT verification and role-based middleware
- `controllers/*` - Business logic for each entity
- `routes/*` - Route definitions with middleware

### Frontend Core Files
- `src/App.jsx` - Route definitions, protected route wrappers
- `src/context/AuthContext.jsx` - Global auth state and role helpers
- `src/services/*` - Axios API service layer (mirrors backend routes)
- `src/pages/*` - Page components
- `src/components/*` - Reusable UI components

## Production Deployment Notes

The system deploys to Windows Server with IIS using HttpPlatformHandler:
- Backend runs as Node.js process managed by IIS
- Frontend served as static files with URL Rewrite for React Router
- Environment variables configured in `web.config` (see README.md sections 10-11)
- Logs written to `backend/logs/` directory (requires write permissions)

## Common Patterns

### Controller Pattern
All controllers follow this structure:
```javascript
exports.controllerMethod = async (req, res) => {
  try {
    // 1. Extract user from req.user (set by auth middleware)
    // 2. Build query with role-based filtering
    // 3. Execute query with parameterized placeholders (prevents SQL injection)
    const [rows] = await pool.promise().query(query, params);
    // 4. Return JSON response
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error message' });
  }
};
```

### Frontend Service Pattern
```javascript
// services/*Service.js
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export const getItems = async () => {
  const response = await axios.get(`${API_URL}/endpoint`);
  return response.data;
};
```

### Protected Route Pattern
```javascript
// Wraps routes requiring specific roles
<SedesAdminRoute>
  <ProtectedRoute>
    <Component />
  </ProtectedRoute>
</SedesAdminRoute>
```

## Testing Credentials

See README.md section 8 for complete list. Quick reference:
- Super Admin: `admin` / `Sedes2025`
- SEDES Admin: `sedes_admin` / `sedes2025`
- Hospital Admin: `eee` / `B5n&y3Ht`

All users must change password on first login.
