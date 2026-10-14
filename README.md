# Bootstrap Page Builder

A visual Bootstrap 5.2.3 page builder built with Next.js, React, Zustand, and
`@dnd-kit`. It provides a LayoutIt-style editor for creating responsive
Bootstrap pages by adding, nesting, editing, and rearranging containers, rows,
columns, and Bootstrap components.

## Features

- Bootstrap 5.2.3 CSS and JavaScript
- Visual container, row, and column guides in editor mode
- Drag-and-drop component placement with nested drop zones
- Bootstrap 12-column grid presets
- Responsive desktop, laptop, tablet, and mobile preview controls
- Component property editing through a compact popup
- Light and dark page themes
- Edit, developer, and preview modes
- Working Bootstrap interactions, including:
  - Accordion
  - Carousel
  - Collapse
  - Dropdown
  - Modal
  - Offcanvas
  - Popover
  - Tooltip
  - Navbar collapse
  - Dismissible alerts
- Downloadable standalone HTML with Bootstrap CSS, JavaScript, and the selected
  light or dark theme
- TypeScript type checking through the Next.js production build

## Supported components

### Layout

- Container
- Row
- Column

### Grid presets

- `12`
- `4 4 4`
- `2 10`
- `3 9`
- `4 8`
- `6 6`
- `8 4`
- `9 3`
- `10 2`
- `equals`
- `4 4 4 4`
- `Horizontal`
- `Mix and match`
- `No gutters`
- `Push and Pull`
- `Nesting`

Grid presets create real Bootstrap row and column structures. They are not
visual placeholders, so their generated structure can contain nested rows and
components.

### Content

- Hero / Jumbotron
- Text
- Button
- Button group
- Alert
- Card
- Badge
- Utilities / custom Bootstrap classes

### Bootstrap components

- Accordion
- Carousel
- Close button
- Collapse
- Dropdown
- Breadcrumb
- Nav / tabs
- Navbar
- Offcanvas
- List group
- Pagination
- Progress
- Spinner
- Toast
- Modal
- Popover
- Tooltip
- Placeholder

### Forms and media

- Table
- Form input
- Input group
- Floating label
- Image
- Figure
- Ratio

## Requirements

- Node.js 20 or newer is recommended
- npm

## Installation

From the project directory:

```bash
npm install
```

## Development

Start the Next.js development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

The development server supports hot reload while editing the builder.

## Production build

Create an optimized production build:

```bash
npm run build
```

Run the production build:

```bash
npm run start
```

The production server normally runs at:

```text
http://localhost:3000
```

## Using the builder

1. Add a layout structure from the sidebar:
   - Add a Container.
   - Add a Row inside the container.
   - Add one or more Columns inside the row.
2. Choose a grid preset when you want a predefined column layout.
3. Click a component to add it to the root, or drag it into a container, row,
   or column.
4. Drag components into nested columns and rows to build complex layouts.
5. Click **Edit** on a component to change its available properties.
6. Use **Remove** to delete a component or layout node.
7. Use the device buttons to inspect the layout at different viewport sizes.
8. Switch between **Edit**, **Developer**, and **Preview** modes.
9. Use the theme button to switch between light and dark page themes.
10. Click **Download** to export the page as standalone HTML.

The editor keeps its visual guides and editing controls separate from the
downloaded page. Exported HTML contains the Bootstrap page markup without the
builder controls.

## Theme behavior

The page theme is applied to the builder canvas and to exported HTML:

- Light mode uses Bootstrap light surfaces and dark text.
- Dark mode uses dark Bootstrap-compatible surfaces and light text.
- Modal, Navbar, form, card, accordion, table, alert, and other component
  content receives theme-specific colors.
- The properties popup remains a readable light editor surface in both page
  themes so that inputs and select options remain visible.

The builder root uses Bootstrap's theme attribute:

```html
<div data-bs-theme="light">
```

or:

```html
<div data-bs-theme="dark">
```

## Project structure

```text
app/
  globals.css             Builder layout, grid guides, and theme styles
  layout.tsx              App layout and Bootstrap CSS/runtime mounting
  page.tsx                Application entry page

components/
  BootstrapRuntime.tsx    Client-only Bootstrap JavaScript initialization
  BuilderApp.tsx          Main editor shell and theme/device state
  BuilderStore.tsx        Zustand node tree and editor state
  Canvas.tsx              Builder canvas and drag/drop surface
  ComponentLibrary.tsx    Component and grid preset sidebar
  ElementRenderer.tsx     Layout and Bootstrap component renderer
  PropertiesPanel.tsx     Component property editor popup
  Toolbar.tsx             Device, mode, theme, clear, and download controls

lib/
  download.ts             Browser download helper
  serialize.ts             Bootstrap HTML export generation
```

## Architecture notes

### State management

The builder uses Zustand to store:

- The node tree
- Parent and child relationships
- Selected node
- Currently edited node
- Component properties
- Root layout order

Each node contains an ID, type, properties, children, and parent ID. This
allows layout structures to be nested without coupling the renderer to a fixed
page template.

### Drag and drop

`@dnd-kit/core` provides the drag-and-drop interactions. Containers, rows, and
columns expose drop zones. A component can be inserted at the root or nested
inside an appropriate layout node.

### Bootstrap JavaScript

Bootstrap JavaScript is loaded dynamically on the client through
`BootstrapRuntime`. Dynamic loading avoids server-side rendering errors caused
by Bootstrap code requiring browser globals such as `document`.

Tooltips and popovers are initialized explicitly after rendering. Bootstrap's
data API handles the remaining interactive components.

### Export

The serializer generates a standalone HTML document containing:

- Bootstrap 5.2.3 CSS
- Bootstrap 5.2.3 JavaScript bundle
- The selected theme attribute
- Theme-specific exported styles
- The rendered component markup

Builder-only controls, drop zones, guide labels, and editor buttons are not
included in the exported page.

## Available npm scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create the optimized production build |
| `npm run start` | Start the production server |

## Main dependencies

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Bootstrap 5.2.3](https://getbootstrap.com/docs/5.2/)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [dnd-kit](https://dndkit.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Troubleshooting

### Port 3000 is already in use

Stop the process currently using port 3000, or start Next.js on another port:

```bash
npm run dev -- -p 3001
```

For a production server:

```bash
npm run start -- -p 3001
```

### The browser shows an older version

If `npm run start` is already running, it serves the build that existed when
the process started. After changing source files:

```bash
npm run build
```

Then restart the production server.

### Bootstrap interaction does not respond

Confirm that the browser has loaded the client runtime and refresh the page.
The Bootstrap JavaScript runtime is intentionally loaded on the client rather
than during server rendering.

### A Navbar link is not visible in the editor

The editor keeps Navbar links expanded so they can be edited at narrow preview
widths. Exported HTML retains Bootstrap's normal responsive Navbar collapse
behavior.

## License

This project is private by default as configured in `package.json`. Add a
license file before distributing it publicly.
