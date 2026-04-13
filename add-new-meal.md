# GUIDE: ADD MEAL CATEGORY:

1. Add the category to the mealCategories array in the file "types/category.ts"
2. Update the database schema in "/lib/db/schema.ts". This is done automatically, only pushing the database changes
3. Update the mapping in category-parser.ts
4. Add an icon in the mealCategoryIconMap (optional)
5. Add a color in the mealCategoryColorMap (optional)
6. Adjust the useSingleCard array in the homepage if necessary
