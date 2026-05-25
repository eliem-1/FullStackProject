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

## CI
A GitHub Actions workflow runs a build for the backend and frontend on pushes and pull requests.

## License
This project is licensed under the MIT License - see the `LICENSE` file for details.
