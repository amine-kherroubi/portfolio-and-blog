# Dead Code & Unused Files Report

Generated: $(date)

## Summary

This report identifies unused files and dead code in the codebase that can be safely removed to reduce maintenance burden and improve code clarity.

## Unused Component Files (5 files)

### 1. `src/components/CursorFollower.astro`
- **Status**: Not imported anywhere
- **Size**: ~232 lines
- **Action**: Delete if cursor follower feature is not needed

### 2. `src/components/Timeline.astro`
- **Status**: Not imported anywhere
- **Size**: ~260 lines
- **Action**: Delete if timeline component is not needed

### 3. `src/components/SkillsGrid.astro`
- **Status**: Not imported anywhere
- **Size**: ~246 lines
- **Action**: Delete if skills grid component is not needed

### 4. `src/components/SectionHeader.astro`
- **Status**: Not imported anywhere
- **Size**: ~31 lines
- **Action**: Delete if section header component is not needed

### 5. `src/layouts/BlogLayout.astro`
- **Status**: Not imported anywhere
- **Note**: Blog posts use `BaseLayout` directly instead
- **Size**: ~83 lines
- **Action**: Delete if not planning to use this layout

## Unused Utility Files (3 files)

### 1. `src/utils/accessibility.ts`
- **Status**: Entire file unused
- **Functions**: `generateId()`, `getAriaCurrent()`, `getNavAriaLabel()`
- **Size**: ~37 lines
- **Action**: Delete entire file

### 2. `src/utils/aria.ts`
- **Status**: Entire file unused
- **Functions**: `generateAriaId()`, `prefersReducedMotion()`
- **Size**: ~24 lines
- **Action**: Delete entire file

### 3. `src/utils/constants.ts` (Partially unused)
- **Status**: Most constants unused
- **Unused exports**:
  - `LAYOUT` - Not used anywhere
  - `BREAKPOINTS` - Not used anywhere
  - `ANIMATION` - Not used anywhere
  - `Z_INDEX` - Not used anywhere
- **Used exports**:
  - `PAGE_IDS` - Used in multiple pages
- **Action**: Remove unused constants, keep `PAGE_IDS`

## Unused Functions in Used Files

### `src/utils/format.ts`
- **Unused functions**:
  - `formatDate()` - Not used
  - `formatDateShort()` - Not used
  - `getRelativeTime()` - Not used
- **Used functions**:
  - `getCurrentYear()` - Used in Footer.astro
- **Action**: Remove unused functions, keep `getCurrentYear()`

### `src/config/tags.ts`
- **Unused functions**:
  - `getTagsByCategory()` - Not used
  - `getAllCategories()` - Not used
- **Used functions**:
  - `getTagsByIds()` - Used in multiple components
  - `TAGS` - Used in multiple components
- **Action**: Remove unused functions

## Documentation Files

### `guides/tagging_and_filtering.md`
- **Status**: Documentation only, not referenced in code
- **Action**: Keep if useful for developers, or move to README/docs

## Recommendations

### High Priority (Safe to Delete)
1. `src/utils/accessibility.ts` - Entire file unused
2. `src/utils/aria.ts` - Entire file unused
3. Unused functions in `src/utils/format.ts`
4. Unused functions in `src/config/tags.ts`
5. Unused constants in `src/utils/constants.ts`

### Medium Priority (Verify Before Deleting)
1. `src/components/CursorFollower.astro` - May be planned for future use
2. `src/components/Timeline.astro` - May be planned for future use
3. `src/components/SkillsGrid.astro` - May be planned for future use
4. `src/components/SectionHeader.astro` - May be planned for future use
5. `src/layouts/BlogLayout.astro` - May be planned for future use

### Estimated Cleanup Impact
- **Files to delete**: 2 utility files
- **Functions to remove**: ~7 functions
- **Constants to remove**: ~4 constant objects
- **Components to review**: 5 component files
- **Total lines of dead code**: ~600+ lines

## Next Steps

1. Review unused components to confirm they're not needed
2. Delete unused utility files (`accessibility.ts`, `aria.ts`)
3. Clean up unused functions from `format.ts` and `tags.ts`
4. Remove unused constants from `constants.ts`
5. Consider removing unused component files if not planned for use
