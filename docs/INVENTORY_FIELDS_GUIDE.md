# 📦 Comprehensive Inventory Fields Guide - SimpliPharma

## 🎯 Overview

SimpliPharma now supports **comprehensive inventory management** with all the fields from your existing medicine database! You can now import your entire inventory with pricing, schemes, stock levels, and more.

---

## 📋 Complete Field List

### Basic Information
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **ID** | Text | Auto | Unique product identifier | `auto-generated` |
| **Code** | Text | No | Product code/SKU | `ITAPL525`, `ITONW001` |
| **Product Name** | Text | **Yes** | Full product name | `01 AY IGF 20GM`, `100% WHEY GOLD 10LBS` |
| **Unit** | Text | No | Unit of measurement | `PCS`, `TAB`, `POW`, `2PCS` |
| **Category** | Text | **Yes** | Product category | `Pain Relief`, `Antibiotic`, `Supplement` |
| **Manufacturer** | Text | **Yes** | Manufacturing company | `APL`, `ON WHEY`, `MANKIND(OTC)` |
| **Company** | Text | No | Distribution company | `ANGLO FRENCH DRUGS & IND. LTD.` |

### Pricing Information
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **Cost Price** | Number | No | Actual cost to you | `83.5080` |
| **Purchase Price** | Number | No | Price at which purchased | `8,399.00` |
| **M.R.P.** | Number | No | Maximum Retail Price | `13,999.00`, `189.00` |
| **Sales Price** | Number | No | Selling price to customer | `124.55`, `55.38` |
| **Display Price** | Number | No | Price shown in app | `55.38` |
| **Value** | Number | No | Total value | `0.00` |

### Stock Information
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **Total Stock** | Number | No | Overall stock quantity | `100` |
| **Current Stock** | Number | No | Available stock now | `95` |

### Scheme Information
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **Sales Scheme Deal** | Number | No | Deal quantity for sales | `10` |
| **Sales Scheme Free** | Number | No | Free quantity in sales | `2` |
| **Purc.Scheme Deal** | Number | No | Deal quantity for purchase | `10` |
| **Purc.Scheme Free** | Number | No | Free quantity in purchase | `1` |

### Additional Details
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **Description** | Text | No | Product description | `Whey protein isolate supplement` |
| **Dosage** | Text | No | Dosage information | `500mg`, `10ml twice daily` |
| **Composition** | Text | No | Active ingredients | `Paracetamol 500mg, Caffeine 65mg` |
| **Side Effects** | Text | No | Possible side effects | `May cause drowsiness` |
| **Image URL** | Text | No | Product image link | `https://example.com/product.jpg` |

---

## 📥 Importing Your Existing Excel Data

### Step 1: Prepare Your Excel File

Your current Excel format is **fully compatible**! The column headers match:

```
Code | Product Name | Unit | Current Stock | Sales Scheme Deal | Sales Scheme Free | 
Purc.Scheme Deal | Purc.Scheme Free | Cost Price | Value | M.R.P. | Purchase Price | 
Sales Price | Company | Manufacturer
```

✅ **Your file is ready to import as-is!**

### Step 2: Import Process

1. **Open SimpliPharma App**
2. **Login as Admin**
3. **Toggle Admin Mode** (tap shield icon)
4. **Go to "Products" Tab**
5. **Tap the Upload Icon** (📤) in the header
6. **Select Your Excel File**
7. **Wait for Processing**
8. **View Import Summary**

The import will:
- ✅ Add new products (if Product Name is unique)
- ✅ Update existing products (matched by Code or Name)
- ✅ Skip invalid rows
- ✅ Show detailed summary

### Step 3: Verify Imported Data

After import:
- Check the product count in header
- Scroll through products
- Verify pricing and stock levels
- Test searching for products

---

## 📤 Exporting Your Inventory

### Export to Excel

1. **Go to Products Tab** (Admin Mode)
2. **Tap Download Icon** (📥)
3. **Confirm Export**
4. **Save or Share the File**

The exported Excel will have **ALL fields** including:
- All pricing details
- Stock levels
- Schemes
- Product codes
- Company info
- Everything!

### Excel Format

The exported file will have these columns in order:
```
ID, Code, Product Name, Unit, Current Stock, Sales Scheme Deal, Sales Scheme Free,
Purc.Scheme Deal, Purc.Scheme Free, Cost Price, Value, M.R.P., Purchase Price,
Sales Price, Company, Manufacturer, Category, Description, Dosage, Composition,
Side Effects, Image URL
```

---

## 🔄 Bulk Update Workflow

### Scenario: Update Stock Levels

1. **Export current inventory** to Excel
2. **Open in Excel/Google Sheets**
3. **Update "Current Stock" column**
4. **Save the file**
5. **Import back into app**
6. **All stock levels updated!**

### Scenario: Add Multiple Products

1. **Export existing inventory** (to get format)
2. **Add new rows** with product details
3. **Leave "ID" column empty** for new products
4. **Fill Code, Name, Category, Manufacturer** (required)
5. **Fill other fields as needed**
6. **Import the file**
7. **New products added!**

### Scenario: Update Pricing

1. **Export inventory**
2. **Update Cost Price, MRP, Sales Price columns**
3. **Import back**
4. **Pricing updated across all products!**

---

## 🎨 Product Form in App

When you add/edit a product manually in the app, you'll see organized sections:

### 📦 Basic Information
- Product Code
- Unit
- Product Name *
- Category *
- Manufacturer *
- Company

### 💰 Pricing Information
- Cost Price
- Purchase Price
- M.R.P.
- Sales Price
- Display Price (what customers see)
- Value

### 📊 Stock Information
- Total Stock
- Current Stock

### 🎁 Scheme Information
- **Sales Scheme**: Deal / Free
- **Purchase Scheme**: Deal / Free

### 📝 Additional Details
- Description
- Dosage
- Composition
- Side Effects
- Image URL

**Fields marked with * are required.**

---

## 💡 Pro Tips

### 1. Use Product Codes
- Always fill the "Code" field
- Makes updates easier
- Helps identify duplicates
- Good for inventory tracking

### 2. Keep Backups
- **Export regularly** to Excel
- Store backups safely
- Use version control (e.g., `inventory_2025_10_27.xlsx`)

### 3. Batch Operations
- Update multiple products at once via Excel
- Faster than manual editing
- Less prone to errors

### 4. Pricing Strategy
- Set **Cost Price** (what you paid)
- Set **Purchase Price** (your buying price)
- Set **M.R.P.** (maximum retail)
- Set **Sales Price** (actual selling price)
- Set **Display Price** (what customers see in app)

### 5. Schemes
- Use schemes for promotional offers
- Example: "Buy 10, Get 2 Free" = Deal: 10, Free: 2
- Track both sales and purchase schemes

### 6. Stock Management
- **Total Stock** = Full inventory
- **Current Stock** = Available for sale
- Difference = Reserved/Damaged/In-transit

---

## 🔍 Field Mapping Examples

### Example 1: From Your Excel

Your Excel row:
```
Code: ITAPL525
Product Name: 01 AY IGF 20GM
Unit: PCS
Current Stock: 0
Sales Scheme Deal: 0
Sales Scheme Free: 0
Purc.Scheme Deal: 0
Purc.Scheme Free: 0
Cost Price: 83.5080
Value: 0.00
M.R.P.: 90.00
Purchase Price: 65.24
Sales Price: 0.00
Company: ANGLO FRENCH DRUGS & IND. LTD.
Manufacturer: APL
```

**Imports perfectly as-is!**

### Example 2: Bulk Product (From Your Data)

Your Excel row:
```
Code: ITONW001
Product Name: 100% WHEY GOLD 10LBS
Unit: POW
Current Stock: 0
M.R.P.: 13,999.00
Purchase Price: 8,399.00
Sales Price: 0.00
Manufacturer: ON WHEY
```

**Also imports perfectly!**

---

## 🚀 Getting Started Checklist

- [ ] Locate your existing inventory Excel file
- [ ] Open SimpliPharma app
- [ ] Login as admin
- [ ] Toggle admin mode (shield icon)
- [ ] Go to Products tab
- [ ] Tap upload icon (📤)
- [ ] Select your Excel file
- [ ] Wait for import to complete
- [ ] Review import summary
- [ ] Verify products are loaded
- [ ] Test searching/filtering
- [ ] Export once to verify format
- [ ] Done! ✅

---

## 📞 Column Header Variations

The import function is **smart** and recognizes various header formats:

| Field | Recognized Headers |
|-------|-------------------|
| Product Name | `Product Name`, `Name`, `name` |
| Current Stock | `Current Stock`, `CurrentStock`, `currentStock`, `Stock`, `stock` |
| Sales Price | `Sales Price`, `SalesPrice`, `salesPrice`, `Price`, `price` |
| M.R.P. | `M.R.P.`, `MRP`, `mrp` |
| Purchase Price | `Purchase Price`, `PurchasePrice`, `purchasePrice` |
| Cost Price | `Cost Price`, `CostPrice`, `costPrice` |
| Sales Scheme Deal | `Sales Scheme Deal`, `SalesSchemeDeal`, `salesSchemeDeal` |
| Purc.Scheme Deal | `Purc.Scheme Deal`, `PurchaseSchemeDeal`, `purchaseSchemeDeal` |

**Your existing Excel headers work perfectly!**

---

## ✅ What's Next?

1. **Import your data** using the guide above
2. **Verify everything looks correct**
3. **Start using the app** for daily operations
4. **Export regularly** for backups
5. **Use Excel for bulk updates** when needed

---

## 🎉 You're All Set!

Your comprehensive medicine inventory with all pricing, schemes, and stock information is now fully supported in SimpliPharma!

**Happy Inventory Management! 📦✨**

