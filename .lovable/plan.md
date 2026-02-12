

# Kanban Board with AI Task Assistant

## Overview
A beautiful, interactive Kanban board with three columns (To Do, In Progress, Done), rich task cards matching the reference design, drag-and-drop functionality, an AI task assistant, and database persistence — all for a single user (no login required).

---

## 1. Kanban Board Layout
- **Header** with app title ("Tasks"), subtitle, and toolbar (Filter, Sort, Group by options)
- **Three columns**: To Do, In Progress, Done — each with a colored dot indicator, task count badge, and "+" button to add new tasks
- **Clean, white card-based design** matching the reference images with subtle shadows, rounded corners, and generous spacing

## 2. Rich Task Cards
Each card displays:
- **Status badge** (Not Started, In Research, On Track, Complete) with colored dot
- **Title** and **description** preview
- **Assignees** section with avatar placeholders
- **Due date** with flag icon
- **Priority label** (Low / Medium / High) color-coded (green, orange, red)
- **Footer stats**: Comments count, Links count, Subtask progress (e.g. 2/3)
- **Three-dot menu** for edit/delete actions

## 3. Drag & Drop
- Drag cards between columns to instantly update their status
- Visual feedback during drag (card lifts, drop zone highlights)
- Smooth animations on drop

## 4. Task Management
- **Add Task**: Click "+" on any column to create a new task with title, description, priority, due date, and status
- **Edit Task**: Click a card or use the menu to open an edit dialog
- **Delete Task**: Remove tasks via the three-dot menu

## 5. AI Task Assistant (Side Panel)
- A collapsible chat panel on the right side of the board
- **Task-focused AI** powered by Lovable AI (Gemini model) that can:
  - Suggest new tasks based on your current board
  - Help break down tasks into subtasks
  - Recommend priorities and next steps
- Streaming responses rendered with markdown support
- The AI is aware of your current board state for contextual suggestions

## 6. Database Persistence (Lovable Cloud)
- All tasks saved to a Supabase database automatically
- Board state persists between sessions — come back anytime and pick up where you left off
- Tasks table stores: title, description, status, column, priority, due date, assignees, comments count, links count, subtask progress

## 7. Visual Design (Matching Reference)
- Clean white background with light gray column backgrounds
- Colored status dots (yellow for To Do, blue for In Progress, green for Done)
- Rounded card corners with subtle shadows
- Color-coded priority badges
- Tab navigation bar (Overview, Board, List, Table, Timeline) with Board active
- Polished typography and consistent spacing throughout

