---
name: nextjs-react-expert
description: Expert in React and Next.js web application development. Provides best practices on Client/Server components, CSS optimization, hydration, and rendering.
when_to_use: "Project detected to have a package.json containing 'next' or 'react' or files with extensions .jsx, .tsx"
---

# Skill: Next.js & React Expert

This deep-dive guide is automatically loaded when the project is detected to use Next.js or React.

---

## 🎨 1. Interface Design & Aesthetics (UI/UX Aesthetics)

*   **Use Rich Aesthetics**: Avoid using monotonous colors (plain red, plain blue). Use subtle, modern color palettes (such as the HSL color system, sleek dark mode, smooth gradients, and glassmorphism effects).
*   **Typography**: Use modern fonts from Google Fonts (such as Inter, Roboto, Outfit) instead of default browser fonts.
*   **Dynamic Designs**: Increase user interaction with smooth hover effects and micro-animations.
*   **Absolutely No Placeholders**: When illustrative images are needed, use the image generation tool (`generate_image`) instead of inserting blank links or gray placeholder images.
*   **Responsive**: Every interface must be optimized for mobile devices (Mobile First), tablets, and desktops.

---

## 🏗️ 2. Component Design Principles (Server vs Client)

*   **Default to Server Components**: All components in the `app/` directory (Next.js App Router) are Server Components by default to optimize page loading and SEO.
*   **Use Client Components Correctly**:
    *   Only add the `"use client"` directive on the first line of the file when the component uses:
        *   Interactive hooks (`useState`, `useEffect`, `useReducer`, `useRef`).
        *   Browser APIs (`window`, `document`, `localStorage`).
        *   User events (`onClick`, `onChange`, `onSubmit`).
*   **Separate Concerns**: Place interactive client logic into the smallest possible components, avoiding `"use client"` declarations in large pages (`page.tsx`) or the root layout component.
*   **State Management**: Prefer using React Context for small local state and libraries like Zustand for global state. Keep deep prop-drilling to a minimum.

---

## ⚡ 3. Rendering & Hydration Optimization

*   **Hydration Mismatch Errors**: Avoid using browser APIs directly during HTML rendering (e.g., `typeof window !== 'undefined'`, `new Date()`, `Math.random()`). If they must be used, use `useEffect` to update the state after mounting:
    ```tsx
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);
    if (!isMounted) return <Placeholder />;
    ```
*   **Lazy Loading**: Use `next/dynamic` for heavy client components or modals that only appear on click:
    ```tsx
    import dynamic from 'next/dynamic';
    const HeavyChart = dynamic(() => import('@/components/HeavyChart'), { ssr: false });
    ```
*   **Image Optimization**: Use Next.js's `<Image>` tag instead of standard `<img>` tags for automatic compression and lazy loading.

---

## 🔍 4. SEO Best Practices

Every public website must automatically integrate the following SEO standards:
*   **Title Tags**: Set a unique, descriptive title tag containing main keywords for each page.
*   **Meta Descriptions**: Add compelling descriptions under 160 characters to improve click-through rate (CTR).
*   **Heading Structure**: Use **exactly one** `<h1>` tag per page and establish a logical heading hierarchy (`<h2>`, `<h3>`...).
*   **Semantic HTML**: Prefer using semantic HTML5 tags such as `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`, `<section>` instead of overusing `<div>` tags.
*   **Unique IDs**: Ensure all interactive elements (buttons, input forms) have unique and meaningful `id` attributes to support automated UI testing.

---

## 🎨 5. Styling Best Practices

*   **CSS Modules**: Name files as `[ComponentName].module.css`. Maximize the use of CSS Modules to prevent class name conflicts and increase reusability. Avoid direct style imports without modules to prevent global style pollution.
*   **Tailwind CSS (If Used)**:
    *   Only use when the project explicitly requires it and the version has been agreed upon.
    *   Group classes neatly, avoiding excessively long lines.
    *   Use libraries like `tailwind-merge` and `clsx` to merge dynamic classes safely.
