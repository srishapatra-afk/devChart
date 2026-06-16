# devChart | Student Club Collaboration Hub

`devChart` is a premium, high-fidelity project management and collaboration platform tailored specifically for student clubs and sub-teams. It transforms basic task tracking into an interactive workspace combining a Kanban-style workflow board, a real-time team bulletin for announcements, and a visual member directory.

Built with a sleek, dark-themed glassmorphism aesthetic, `devChart` utilizes glowing borders, responsive cards, and fluid transitions to deliver a premium user experience.

<img width="948" height="539" alt="Screenshot 2026-06-15 183652" src="https://github.com/user-attachments/assets/10ec68e3-4031-454c-84c3-38ea8c51638c" />


---

## Features Implemented

### 1. Core Kanban Board & Workflow
- **Interactive Board Columns**: Tasks are grouped into three distinct lanes: **To Do**, **In Progress**, and **Done**.
- **HTML5 Drag-and-Drop**: Smoothly move tasks between columns. The target columns animate with scales and neon highlights when a card is dragged over them.
- **Advanced Filtering**: Live search bar filters tasks on-the-fly, accompanied by dropdown filters for **Priority** (Low, Medium, High) and **Domain/Tag** (Development, Design, Marketing, Logistics, General).
- **In-Board Modals**: Create or edit tasks seamlessly via dialog drawers directly over the Kanban board without page reloads.

### 2. Live Team Member Directory (Feature 1)
- **Profile Cards**: Displays all club members, roles, and department tags (Management, Development, Design, Marketing, Operations) with custom initials avatars.
- **Department Searching**: Locate sub-team members quickly with department dropdown filtering and a text search bar.
- **Onboarding Form**: Quickly add new members with custom role listings and colors.
- **Assigned Tasks Integration**: Clicking a member card reveals a drawer showcasing their profile, email, and a **real-time list of all tasks assigned to them**.

### 3. Club Bulletin Board & Announcements (Feature 2)
- **Announcements Timeline**: Keeps members aligned on critical meetings, event timelines, and deliverables.
- **Urgency Alerts**: Urgent announcements render with a pulsing warning glow, and red warning status badges.
- **Emoji Reactions**: Interactive reaction buttons (👍, ❤️, 🎉, 🚀) allow team members to react to notices in real time, with atomic increments saved instantly in MongoDB.
- **Directory Link**: Author selections are populated directly from the Member Directory.

### 4. Real-time Workflow Analytics (Feature 3)
- **Diagnostic Panel**: Integrated at the top of the dashboard page, displaying counts of active, finished, and pending items.
- **Task Completion Bar**: Visual indicator showing the percentage of tasks moved to the "Done" stage, updating automatically as tasks change lanes.

---

## Technology Stack
- **FRONTEND**: Next.js 16.2 (App Router with Turbopack compilation)
- **LANGUAGE**: TypeScript
- **BACKEND**: TNext.js API Routes
- **DATABASE**: MongoDB Atlas
- **ODM**: Mongoose
- **STYLING**: CSS + Glassmorphism
- **ROUTING**: Next.js app router
- **STATE**: React hooks
- **DRAG AND DROP**: HTML5 Drag and Drop API
- **DEPLOYMENT**: Vercel
- **VERSION CONTROL**: Git and Github

---

## Setup Instructions

### Prerequisites
- Node.js (v20 or higher recommended)
- npm (v10 or higher)
- A MongoDB Atlas account or a local MongoDB database instance

### 1. Install Dependencies
Clone the repository and run:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/devchart?retryWrites=true&w=majority
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for Production
To verify compiling and build optimization:
```bash
npm run build
```

---

## Deployment Instructions

The application is fully optimized for hosting on **Vercel** with Next.js App Router integrations.

1. **Push your code** to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Expand the **Environment Variables** section and add:
   - Key: `MONGODB_URI`
   - Value: `your-mongodb-atlas-connection-string`
5. Click **Deploy**. Vercel will automatically compile, optimize, and serve the application globally.

---

## Known Limitations
- **Lack of Multi-tenant Auth**: All club members access the same workspace. In a production build, integration with NextAuth (or Auth0) would enable private dashboards per club organization.
- **Mock User Sessions**: Task assignments are based on selections from the member directory rather than logged-in user sessions.
