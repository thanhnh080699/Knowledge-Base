import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // Node test harnesses use CommonJS to load transpiled TypeScript utilities.
    files: ["tests/**/*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" }
  },
  {
    ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"]
  }
]

export default eslintConfig
