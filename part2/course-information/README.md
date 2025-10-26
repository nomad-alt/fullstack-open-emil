# Course Information (Full Stack Open, Part 2)

Small React app for rendering courses and their parts. Demonstrates basic component composition and props usage.

## Features

- Course component hierarchy
  - `Course` → `Header`, `Content` → `Part`
- Total exercises
  - Sums exercises with `reduce` and shows per course
- Multiple courses support
  - `App` maps an array of courses to `<Course />`
- Separated module
  - `src/components/Course.jsx` exports the composed `Course`

## Run

- Install deps: `npm install`
- Start dev server: `npm run dev`

## Files

- `src/components/Course.jsx` – Course + subcomponents (Header, Part, Content, Total)
- `src/App.jsx` – defines `courses` and renders a list of `<Course />`

The app is resilient to adding/removing parts and renders without console errors.
