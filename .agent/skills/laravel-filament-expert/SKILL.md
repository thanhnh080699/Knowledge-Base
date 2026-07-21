---
name: laravel-filament-expert
description: Expert in PHP web application development using Filament Admin Panel & Form/Table Builder for Laravel. Defines the design of Resources, Forms, Tables, Relation Managers, Widgets, and optimizes Livewire performance.
when_to_use: "Projects with a composer.json file containing 'filament/' or PHP files defining Filament Resources, Pages, or Widgets."
---

# Skill: Laravel Filament Expert

This detailed guidance is automatically loaded when the project is detected to be using the Laravel Filament Framework (TALL Stack - Tailwind CSS, Alpine.js, Laravel, Livewire).

---

## 🏗️ 1. Filament Resource & Pages Structure

*   **Creating Resources**: Always use standard Artisan commands to generate Resources:
    ```bash
    php artisan make:filament-resource Product --generate
    ```
    *(The `--generate` option automatically reads the database schema to generate basic form and table configurations).*
*   **Directory Organization**: Ensure child Pages (`CreateProduct`, `EditProduct`, `ListProducts`, `ViewProduct`) are neatly organized within the `Pages` directory of the Resource.
*   **Clusters**: For large projects, use **Clusters** to group related Resources on the navigation bar, keeping the UI clean and uncluttered.

---

## 📝 2. Form Builder (Form Design)

*   **Layout Organization**:
    *   Do not stack all fields in a single long vertical column. Use `Grid`, `Section`, `Tabs`, or `Card` to group related information (e.g., General Info, Pricing, Media).
    *   Use secondary sections (sidebar layout) for status or metadata by utilizing `Grid::make(['default' => 1, 'lg' => 3])` combined with `Group` to allocate a 2:1 column ratio.
*   **Select Field Optimization (Performance)**:
    *   For large relation tables (e.g., Users or Products with thousands of records), it is **mandatory** to use `searchable()` combined with `preload(false)` to prevent overloading the server's memory when loading pages.
    *   Use `getOptionLabelFromRecordUsing()` or `getSearchResultsUsing()` to optimize and customize search queries.
*   **Reactive & Dynamic Fields**:
    *   Use `reactive()` and `afterStateUpdated()` to dynamically change the values of other fields based on the current field (e.g., auto-populating a Slug from a Title).
    *   Use `debounce()` or `lazy()` on text input fields that trigger reactive state to avoid sending excessive Livewire requests while the user is typing.
*   **Validation**:
    *   Define validation directly on components (`required()`, `maxLength()`, `unique()`, `numeric()`).
    *   Use `validationAttribute()` to customize field names shown in error messages if necessary.

---

## 📊 3. Table Builder (Data Lists)

*   **Columns**:
    *   Use the appropriate Column type for the data representation: `TextColumn` for strings/numbers, `ImageColumn` for images, `ToggleColumn` or `IconColumn` for boolean values.
    *   Format data clearly using methods like `money()`, `date()`, `dateTime()`, or `badge()`.
*   **Search & Filters**:
    *   Only configure `searchable()` on columns that actually need search functionality and are indexed in the database.
    *   Use specialized filters (`SelectFilter`, `TernaryFilter`) to help users filter data quickly.
    *   For complex relationship filters, write explicit queries in the `query()` method of the Filter.
*   **Eager Loading**:
    *   When displaying related table columns (e.g., `category.name`), ensure eager loading is defined in the `getTableQuery()` method of the Page or Resource to prevent N+1 query issues:
      ```php
      protected static function getTableQuery(): Builder
      {
          return parent::getTableQuery()->with(['category']);
      }
      ```
*   **Actions**:
    *   Use Filament Actions (`EditAction`, `DeleteAction`, `ViewAction`) instead of creating custom routes/controllers for CRUD logic.
    *   Use `BulkActions` to handle batch operations safely. Always require confirmation for destructive actions using `requiresConfirmation()`.

---

## 🔗 4. Relation Managers

*   **Design**:
    *   Use `RelationManager` (`php artisan make:filament-relation-manager`) to manage `hasMany` or `belongsToMany` relationships directly on the Edit/View pages of the parent record.
    *   This keeps the interface coherent and avoids creating too many separate management pages.
*   **State Separation**:
    *   Avoid loading too many Relation Managers at once for large datasets. Consider utilizing lazy loading configurations or presenting them within tabs.

---

## 🛡️ 5. Authorization & Security

*   **Laravel Policies Integration**:
    *   Filament automatically detects Laravel Policies by default. Always create a Policy for each Model managed by Filament to enforce specific permissions (`viewAny`, `create`, `update`, `delete`).
*   **Field-level Authorization**:
    *   Use `visible()` or `hidden()` to conditionally show or hide sensitive fields or actions based on the current user's permissions:
      ```php
      TextInput::make('cost_price')
          ->visible(fn () => auth()->user()->can('view_cost_price')),
      ```

---

## ⚡ 6. Performance Optimization & Livewire State

*   **Livewire State Management**:
    *   Limit storing large objects or overly complex arrays directly inside public Livewire properties, as they are serialized and transmitted between the client and server on every request.
*   **Caching**:
    *   For Widgets displaying complex charts or statistics, use Laravel Cache to store query results for a short duration (e.g., 5-10 minutes) instead of executing heavy SQL queries on every Dashboard page load.
