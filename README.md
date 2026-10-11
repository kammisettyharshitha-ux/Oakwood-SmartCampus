# Smart Campus Analytics: Student Success Platform

A full-stack, AI-powered student retention and success intelligence platform built with React 19, TypeScript, Tailwind CSS, Vite, and Node.js (Express).

---

## 🚀 Running in Visual Studio Code (Local Setup)

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended, v20+ preferred)
  - Check in your terminal: `node -v`
- **npm** (comes with Node.js) or **pnpm** / **yarn** / **bun**
- **Visual Studio Code** ([Download VS Code](https://code.visualstudio.com/))

---

### Step-by-Step Instructions

#### 1. Open the Project in VS Code
1. Open Visual Studio Code.
2. Click **File** > **Open Folder...** (or press `Ctrl+K Ctrl+O` on Windows / `Cmd+O` on macOS).
3. Select this project root folder (containing `package.json`).

#### 2. Open the Integrated Terminal
- Press `Ctrl + ~` (Windows/Linux) or `Cmd + ~` (macOS), or go to the top menu: **Terminal** > **New Terminal**.

#### 3. Install Dependencies
In the terminal, execute:
```bash
npm install
```

#### 4. Configure Environment Variables (Optional)
1. Copy `.env.example` to `.env`:
   - On Windows (PowerShell):
     ```powershell
     Copy-Item .env.example .env
     ```
   - On macOS / Linux / Git Bash:
     ```bash
     cp .env.example .env
     ```
2. *(Optional)* Add your Google Gemini API key if you want live AI diagnostic insights:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   PORT=3000
   ```
   *(Note: The platform features high-accuracy heuristic calculation fallbacks, so the system works even without an API key!)*

#### 5. Start the Development Server
Run:
```bash
npm run dev
```

#### 6. Open in Your Browser
- Open your browser and navigate to:
  ```
  http://localhost:3000
  ```
- VS Code will also display a pop-up in the bottom-right corner: *"Open in Browser"*. Click it to launch.

---

## 🛠️ Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Runs the full-stack development server on `http://localhost:3000` |
| **Production Build** | `npm run build` | Builds the client bundle into the `dist/` directory |
| **Production Start** | `npm start` | Launches the server in production mode |
| **Lint & Type Check**| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |

---

## 🎓 Key Features

1. **Faculty Authentication & Registration**:
   - First-time faculty registration (Name, Institutional Email, Password, Department, Designation).
   - Instant login validation with quick seed presets (e.g. `dr.arun@university.edu`).
2. **Add Student & Multi-Stream Data Ingestion**:
   - Prominent **+ Add Student** button with live 7-stream metric inputs.
   - Real-time Student Success Score (0-100) calculator and risk flags.
3. **Sky Blue Aesthetic**:
   - Realistic university dashboard styling with modern cards, charts, and modal dialogs.
4. **Student 360° Profile & Intervention Center**:
   - Longitudinal progress tracking, academic recovery workflows, and exportable reports.
