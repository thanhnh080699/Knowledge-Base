---
name: tailwind-css-expert
description: Tailwind CSS design expert. Guidelines for using utility classes, responsive breakpoints, dark mode, custom configuration, and combining tailwind-merge/clsx.
when_to_use: "Project is detected to have 'tailwindcss' in package.json, or has configuration files like tailwind.config.js, tailwind.config.ts, or imports tailwindcss in CSS"
---

# Skill: Tailwind CSS Expert

This in-depth guide is automatically loaded when the project is detected to use Tailwind CSS for UI design.

---

## 🎨 1. Utility-First Mindset & Clean Classes

*   **Avoid Overusing `@apply`**: Only use `@apply` in CSS files for utility classes that are repeated extremely often (e.g., custom scrollbars, third-party typography). Prefer writing utility classes directly in HTML/React components for easier maintenance.
*   **Organize Classes Logically**: Arrange classes in a logical sequence (Layout -> Box Model -> Typography -> Visual -> Interactive/State -> Responsive):
    *   *Example*: `flex items-center justify-between w-full p-4 text-white bg-blue-500 hover:bg-blue-600 md:p-6`
*   **Avoid Class Duplication & Overwrites**: Always use `tailwind-merge` combined with `clsx` when merging classes dynamically to ensure that latter classes correctly override former ones (avoiding display issues caused by default CSS cascade):
    ```typescript
    import { twMerge } from 'tailwind-merge';
    import { clsx, ClassValue } from 'clsx';
    
    export function cn(...inputs: ClassValue[]) {
      return twMerge(clsx(inputs));
    }
    ```

---

## 📱 2. Responsive & State Prefixes

*   **Mobile First**: Design by default for mobile screens (no prefix), then add breakpoints (`sm:`, `md:`, `lg:`, `xl:`) to adjust the interface on larger screens.
*   **Interactive States**: Maximize the use of state prefixes like `hover:`, `focus:`, `active:`, and `disabled:` to create micro-interactions.
*   **Dark Mode**: Use the `dark:` prefix to define colors for dark mode. Ensure the dark mode configuration in tailwind config matches the application's class switching mechanism (e.g., the `class` selector on the `<html>` or `<body>` tag).

---

## ⚠️ 3. Compilation Error Prevention Rules (Purge/JIT Rules)

*   **No Dynamic Class Concatenation**: Tailwind CSS scans source code statically to generate the corresponding CSS. **Never** construct classes by dynamic string concatenation:
    *   *Wrong*: `text-${color}-500` (Tailwind will not detect it to build).
    *   *Right*: Use an object map or write the full class names:
        ```typescript
        const colorClasses = {
          red: 'text-red-500',
          blue: 'text-blue-500',
        };
        ```
