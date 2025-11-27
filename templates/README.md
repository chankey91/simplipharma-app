# SimpliPharma Templates

This folder contains template files for importing data into SimpliPharma.

## Excel Templates

### `SimpliPharma_Inventory.xlsx`
Main template for importing medicine inventory.

**Columns:**
- `name` - Medicine name (required)
- `category` - Medicine category (required)
- `price` - Price in currency (required)
- `stock` - Available quantity (required)
- `manufacturer` - Manufacturer name (required)
- `description` - Product description (optional)
- `dosage` - Dosage information (optional)
- `composition` - Chemical composition (optional)
- `sideEffects` - Side effects information (optional)
- `imageUrl` - Product image URL (optional)

### `SimpliPharma_Test_200.xlsx`
Test data with 200 sample medicines for testing bulk import functionality.

## Usage

### In Mobile App (Admin):
1. Go to Admin → Products
2. Tap the "Import" button
3. Select an Excel file
4. The app will validate and import all medicines

### Creating Your Own Template:
1. Copy `SimpliPharma_Inventory.xlsx`
2. Keep the column headers exactly as shown
3. Fill in your medicine data
4. Required fields must not be empty
5. Save as `.xlsx` format

## Field Requirements

### Required Fields:
- ✅ name
- ✅ category
- ✅ price (must be positive number)
- ✅ stock (must be positive integer)
- ✅ manufacturer

### Optional Fields:
- description
- dosage
- composition
- sideEffects
- imageUrl

## Tips

- Keep medicine names consistent
- Use standard category names (Pain Relief, Antibiotics, Vitamins, etc.)
- Price should be numeric without currency symbols
- Stock should be whole numbers
- For imageUrl, use publicly accessible image URLs

## See Also

- `/docs/EXCEL_TEMPLATE_GUIDE.txt` - Detailed template guide
- `/docs/EXCEL_TEMPLATE_FORMAT.txt` - Format specifications
- `/docs/QUICK_IMPORT_GUIDE.txt` - Quick import guide
- `/docs/INVENTORY_FIELDS_GUIDE.md` - Field descriptions

