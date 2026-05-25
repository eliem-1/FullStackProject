# FullStackProject

This repository contains a simple full-stack example with a .NET backend and a Vite + React frontend.

## Structure
- `Backend/` - .NET backend project
- `Frontend/` - Vite + React frontend

## Quick Start

Backend (requires .NET SDK 7+ or 8+):

```powershell
cd Backend
dotnet build
dotnet run
```

Frontend (requires Node 18+ and npm):

```bash
cd Frontend
npm install
npm run dev
```

### Frontend environment
A local `.env` file is included in `Frontend/` to make the API base URL configurable.

### What’s new
- Backend now exposes a single task API implementation and avoids duplicate routes.
- Added `GET`, `POST`, `DELETE`, and `PATCH /api/tasks/{id}/toggle` support for task management.
- Task model now includes completion state and a creation timestamp.
- Frontend now supports deleting tasks and toggling completion state.
- Added loading/error UI and responsive task card styling.

## CI
A GitHub Actions workflow runs a build for the backend and frontend on pushes and pull requests.

## License
This project is licensed under the MIT License - see the `LICENSE` file for details.
