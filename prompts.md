# AI Prompt Log

AI tools were used as a development assistant for debugging, architecture ideas, and UI improvements during the implementation of the Work Order Timeline dashboard.

Below are examples of prompts used during development that reflect the problem-solving process.

---

## Prompt 1 — Timeline Layout Strategy

**Prompt**

I am building a production scheduling timeline in Angular where rows represent work centers and bars represent work orders spanning multiple days. What is the best approach to render this efficiently using CSS grid or absolute positioning while allowing horizontal scrolling?

**Purpose**

To determine the most appropriate layout approach for a timeline-style scheduling UI.

**Outcome**

Used a grid-based timeline layout where work centers form rows and orders are positioned using calculated pixel offsets based on dates.

---

## Prompt 2 — Preventing Overlapping Work Orders

**Prompt**

How can I validate that work orders assigned to the same work center do not overlap in time when creating or editing an order in Angular?

**Purpose**

To implement scheduling validation logic in the data service.

**Outcome**

Implemented a validation check comparing start and end dates of orders belonging to the same work center before saving.

---

## Prompt 3 — Generating Non-Overlapping Demo Data

**Prompt**

I want to generate 1000 demo work orders for testing timeline performance. How can I programmatically create them so they do not overlap within the same work center?

**Purpose**

To stress test the UI and ensure the timeline can render large datasets.

**Outcome**

Implemented a generator that distributes orders across work centers and shifts start dates sequentially to avoid overlaps.

---

## Prompt 4 — Aligning Timeline Grid and Bars

**Prompt**

My timeline grid lines are slightly misaligned with the work order bars when I increase bar height. What CSS adjustments should I make so that row heights and grid lines stay aligned?

**Purpose**

To fix visual alignment issues between rows and order bars.

**Outcome**

Adjusted row height and bar positioning in the SCSS to ensure the grid lines and bars match.

---

## Prompt 5 — Reactive Forms for Order Editing

**Prompt**

What is the recommended way to prepopulate an Angular reactive form when editing an existing object while maintaining validation rules?

**Purpose**

To implement the order editing side panel.

**Outcome**

Used `patchValue()` in `ngOnInit()` to populate the reactive form with existing order data.

---

## Development Note

AI suggestions were used for guidance and debugging, but all code was reviewed, adapted, and implemented manually during development.