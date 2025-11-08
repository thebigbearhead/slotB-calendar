## CSS Editing Guide

Use this map to quickly jump to the right stylesheet when making visual adjustments:

| Area | File | Notes |
| --- | --- | --- |
| Global colors, typography, themes | `src/index.css` | Houses CSS variables for light/dark themes. Update color tokens here to impact every view. |
| Root layout + auth wrappers | `src/components/Auth.css` | Styles the login/register hero split layout and shared auth form controls. |
| Calendar grid + header | `src/components/Calendar.css` | Contains nav buttons, calendar cells, and the new square mock logo styles. |
| Booking modal | `src/components/BookingModal.css` | Adjust padding/sizes for create/edit dialogs. |
| Activity sidebar | `src/components/ActivitySidebar.css` | Controls the right-hand activity feed plus the user info card now highlighted at the top. |
| Profile management page | `src/components/ProfilePage.css` | Update profile card, avatar uploader, and password form styling here. |
| Avatar crop overlay | `src/components/AvatarCropper.css` | Customize the cropping modal backdrop, range slider, and buttons. |
| Admin dashboard | `src/components/AdminDashboard.css` | Guides the minimal dashboard layout, tables, and config form spacing. |

Tips:
1. **Keep variables** – whenever changing colors, prefer tweaking `:root` vars in `index.css` so both light/dark themes update consistently.
2. **Scoped overrides** – component styles are isolated per file; create new utility classes inside the relevant component CSS instead of altering globals when possible.
3. **Consistent spacing** – existing cards use 16/24px spacing increments. Matching those values maintains visual rhythm.
4. **Test both themes** – flip the in-app theme toggle after edits to ensure contrast is acceptable in light and dark modes. Adjust the `[data-theme="dark"]` palette as needed.*** End Patch*** End Patch
