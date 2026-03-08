# Work Order Timeline Dashboard

An interactive **manufacturing scheduling dashboard** built with **Angular 17**.  
The application visualizes production work orders across multiple work centers on a timeline and allows users to create, edit, and manage schedules while preventing conflicts.

This project was built as part of a **Frontend Technical Assessment**.

---

# Features

- Interactive **timeline-based scheduling interface**
- **Day / Week / Month zoom levels**
- **Create, edit, and delete work orders**
- **Overlap validation** to prevent conflicting schedules
- **Color-coded order status indicators**
- **Three-dot action menu** for editing and deleting orders
- **Sticky work center sidebar**
- **Horizontally scrollable timeline grid**
- **Slide-out order edit panel**
- **Reactive form validation**
- **Current day indicator**

---

# Tech Stack

- **Angular 17 (Standalone Components)**
- **TypeScript (strict mode)**
- **SCSS**
- **Reactive Forms**
- **ng-select**
- **ng-bootstrap Datepicker**
- **CSS Grid + Flexbox**

---

# Timeline Rendering Logic

Each work center is displayed as a row in the timeline.

Work orders are rendered as bars whose **position and width are dynamically calculated** from their start and end dates.

```ts
left = (startDate - timelineStart) * pixelsPerDay
width = (endDate - startDate) * pixelsPerDay
```

This allows the timeline to automatically adapt when switching between zoom levels.

Supported views:

- Day view
- Week view
- Month view

---

# Overlap Validation

When creating or editing a work order, the application checks whether another order exists on the same work center within the same date range.

If an overlap is detected:

- The order is not saved
- A validation error message is shown

This ensures **no conflicting schedules occur on the same work center**.

---

# Project Structure

```
src/app/

components/
  timeline/
    timeline.ts
    timeline.html
    timeline.scss

  order-panel/
    order-panel.ts
    order-panel.html
    order-panel.scss

services/
  data.ts

models/
  docs.ts
```

---

# Installation

Clone the repository and install dependencies:

```bash
npm install
```

Start the development server:

```bash
ng serve
```

Open the application in your browser:

```
http://localhost:4200
```

---

# Usage

Users can:

- Click an **empty timeline cell** to create a new work order
- Click the **three-dot menu on a bar** to edit or delete an order
- Change **zoom levels (Day / Week / Month)**
- Scroll horizontally to view different date ranges
- Manage work orders through the **slide-out order panel**

---

# Demo

A Loom video demo accompanies this submission and demonstrates:

- Timeline navigation
- Zoom levels
- Creating work orders
- Editing work orders
- Deleting work orders
- Overlap validation behavior

---

# AI Assistance

AI tools were used to assist with debugging, layout refinement, and implementation ideas.  
All architectural decisions and final implementation were reviewed and adapted manually.

---

# Author

**Ishan Rajvi**