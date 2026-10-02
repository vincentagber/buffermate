## 2026-10-02 - Added missing ARIA labels to icon-only buttons
**Learning:** Found a recurring pattern in the app's components, particularly in PostPreview.tsx, where icon-only buttons (like bookmark, share, heart, etc.) lack accessible names for screen readers. Some states are dynamic (e.g., like vs. unlike).
**Action:** When working on interactive UI elements in this repository, always ensure icon-only buttons have descriptive aria-label attributes, utilizing conditional logic for dynamic states to provide an inclusive UX.
