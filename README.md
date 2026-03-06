# Work Order Timeline Dashboard

A frontend scheduling dashboard built with **Angular** for managing production work orders across multiple work centers.  
The application visualizes orders on an interactive timeline and allows users to create, edit, and delete work orders while preventing scheduling conflicts.

---

# Features

- Interactive **timeline-based scheduling**
- **Day / Week / Month zoom levels**
- **Create, edit, and delete work orders**
- **Overlap validation** for orders within the same work center
- **Color-coded order status**
- **Sticky work center sidebar**
- **Horizontal timeline scrolling**
- **Responsive layout**
- **Reactive forms for order management**

---

# Tech Stack

- **Angular**
- **TypeScript**
- **Reactive Forms**
- **RxJS**
- **CSS Grid + Flexbox**

---

# How It Works

Each work center is displayed as a row in the timeline.

Work orders are rendered as bars whose position and width are calculated based on their start and end dates.

```
left = (startDate - timelineStart) * pixelsPerDay
width = (endDate - startDate) * pixelsPerDay
```

This allows the timeline to dynamically scale depending on the selected zoom level.

The application supports:

- Day view
- Week view
- Month view

---

# Overlap Validation

When creating or editing an order, the application checks if another order already exists on the same work center during the same time range.

If an overlap occurs, the operation is rejected and an error message is displayed.

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

Clone the repository and install dependencies.

```bash
npm install
```

Start the development server.

```bash
ng serve
```

Open the application in your browser.

```
http://localhost:4200
```

---

# Usage

Users can:

- Click a **timeline cell** to create a new work order
- Click an **existing order bar** to edit it
- Change **zoom levels** using the timeline controls
- Delete orders using the edit panel

---

# Demo

A Loom video demonstration accompanies this submission and showcases:

- Timeline navigation
- Order creation
- Editing and deleting orders
- Overlap validation
- Zoom functionality

---

# Author

Ishan Rajvi