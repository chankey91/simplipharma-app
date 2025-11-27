# 💰 Accounting & Payment Collection - Complete Guide

## Overview

SimpliPharma now has a comprehensive accounting system to track payments, manage ledgers, and handle financial reporting. Admins can collect payments, view outstanding amounts, and generate financial reports.

---

## 🎯 Key Features

### 1. ✅ **Payment Collection**
- Record payments from retailers
- Multiple payment methods (Cash, Card, UPI, Bank Transfer, Cheque)
- Partial payment support
- Payment notes and tracking
- Payment history for each order

### 2. ✅ **Financial Dashboard**
- Total revenue overview
- Collected payments
- Outstanding amounts
- Payment status breakdown (Paid/Partial/Unpaid)
- Real-time updates

### 3. ✅ **Ledger Management**
- Complete transaction history
- Order-wise payment tracking
- Retailer-wise account statements
- Export ledger to Excel
- Date and amount tracking

### 4. ✅ **Retailer Accounts**
- Individual retailer statements
- Total ordered amount
- Total paid amount
- Outstanding dues
- Complete order history per retailer

### 5. ✅ **Reports & Export**
- Export full ledger to Excel
- Accounting summary
- Payment collection reports
- Downloadable and shareable

---

## 📱 How to Use

### Accessing Accounting Panel

1. **Login as Admin**
2. **Toggle Admin Mode** (shield icon)
3. **Tap "Accounting" Tab** (wallet icon)
4. **View Financial Dashboard**

---

## 💵 Payment Collection Workflow

### Step 1: View Outstanding Orders

The Accounting screen shows all orders with outstanding payments:

```
Outstanding Payments Section:
- Order ID
- Retailer email
- Order date
- Total amount
- Paid amount
- Due amount
- Payment status (color-coded)
```

### Step 2: Collect Payment

1. **Find the order** with outstanding payment
2. **Tap "Collect" button** (green cash icon)
3. **Payment modal opens**

### Step 3: Enter Payment Details

**Payment Collection Form:**

```
Order: #abc12345
Total: ₹5,000.00
Paid: ₹2,000.00
Due: ₹3,000.00

Payment Amount: [Enter amount]
Payment Method: [Cash] [Card] [UPI] [Bank Transfer] [Cheque]
Notes: [Optional notes...]

[Record Payment]
```

**Fields:**
- **Payment Amount** - Amount received (must not exceed due amount)
- **Payment Method** - Choose payment mode
- **Notes** - Optional (e.g., "Cheque #1234", "UPI Ref: 123456")

### Step 4: Record Payment

1. **Enter amount** (e.g., ₹1,500)
2. **Select method** (e.g., UPI)
3. **Add notes** (optional)
4. **Tap "Record Payment"**
5. **Success!** Payment recorded

### Payment Status Updates Automatically:

| Scenario | Status |
|----------|--------|
| Paid ₹0 of ₹5,000 | **Unpaid** (Red) |
| Paid ₹2,000 of ₹5,000 | **Partial** (Orange) |
| Paid ₹5,000 of ₹5,000 | **Paid** (Green) |

---

## 📊 Financial Dashboard

### Summary Cards (Top Section):

#### Card 1: Total Revenue
```
💰 ₹1,25,450.00
Total Revenue
```
- Sum of all order amounts
- Blue background

#### Card 2: Collected
```
✅ ₹95,200.00
Collected
```
- Total payments received
- Green background
- Money in hand

#### Card 3: Outstanding
```
⚠️ ₹30,250.00
Outstanding
```
- Pending payments
- Red background
- Amounts to be collected

### Payment Status Stats:

```
┌──────────────────────────────┐
│  Payment Status              │
├──────────────────────────────┤
│   15        8         4      │
│  Paid    Partial   Unpaid    │
│   ━━      ━━━━      ━━━      │
│  Green   Orange     Red      │
└──────────────────────────────┘
```

Shows distribution of orders by payment status.

---

## 📖 Ledger & Transaction History

### Ledger View (Main Screen):

**Outstanding Payments Section:**
- Shows orders with pending payments
- Latest orders first
- Quick access to collect payment
- View payment history

**Each Order Card Shows:**
```
┌────────────────────────────────┐
│ #abc12345                      │
│ retailer@email.com             │
│ 25 Oct 2025                    │
│                                │
│ Total: ₹5,000.00               │
│ Paid: ₹2,000.00                │
│ Due: ₹3,000.00 (Orange)        │
│                                │
│ [💵 Collect] [📋 History]      │
└────────────────────────────────┘
```

### Payment History:

1. **Tap "History" button** on any order
2. **Modal opens** showing all payments for that order

**Payment History View:**
```
Payment History for Order #abc12345

✅ ₹2,000.00
   UPI
   24 Oct 2025, 3:45 PM
   Notes: UPI Ref: 123456789

✅ ₹1,500.00
   Cash
   20 Oct 2025, 11:20 AM
   Notes: Cash payment

✅ ₹1,000.00
   Card
   15 Oct 2025, 2:30 PM
```

Shows:
- Payment amount
- Payment method
- Date and time
- Notes (if any)
- Checkmark icon for confirmed

---

## 👥 Retailer Account Statements

### View Retailer Accounts:

**Retailer Accounts Section:**
- Lists all retailers with orders
- Shows total ordered and due amounts
- Tap to view detailed statement

**Retailer Card:**
```
┌────────────────────────────────┐
│ Medical Store XYZ              │
│ store@email.com                │
│                                │
│ ₹25,000.00                     │
│ Due: ₹5,000.00                 │
└────────────────────────────────┘
```

### Detailed Retailer Statement:

1. **Tap on retailer card**
2. **Full-screen statement opens**

**Statement View:**
```
┌────────────────────────────────┐
│ ← Account Statement            │
├────────────────────────────────┤
│ Medical Store XYZ              │
│ store@email.com                │
├────────────────────────────────┤
│ Total Ordered    Total Paid    │
│ ₹25,000.00      ₹20,000.00     │
│                                │
│     Outstanding                │
│      ₹5,000.00                 │
├────────────────────────────────┤
│ Order History                  │
│                                │
│ ┌─────────────────────────┐   │
│ │ #abc123   25 Oct 2025   │   │
│ │ ₹5,000   Partial        │   │
│ └─────────────────────────┘   │
│                                │
│ ┌─────────────────────────┐   │
│ │ #def456   20 Oct 2025   │   │
│ │ ₹8,000   Paid           │   │
│ └─────────────────────────┘   │
└────────────────────────────────┘
```

**Includes:**
- Retailer information
- Summary statistics
- Complete order history
- Payment status for each order
- Scrollable list

---

## 📥 Export Ledger

### Export Accounting Data:

1. **Tap Export Icon** (📥) in header
2. **Ledger generates**
3. **Excel file created**
4. **Share dialog opens**

### Excel Ledger Format:

| Sr No | Date | Order ID | Retailer | Order Amount | Paid Amount | Due Amount | Payment Status | Order Status |
|-------|------|----------|----------|--------------|-------------|------------|----------------|--------------|
| 1 | 26/10/25 | abc12345 | store@email.com | 5000.00 | 2000.00 | 3000.00 | Partial | Dispatched |
| 2 | 25/10/25 | def67890 | shop@email.com | 3000.00 | 3000.00 | 0.00 | Paid | Delivered |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |
| | **TOTAL** | | | **125450.00** | **95200.00** | **30250.00** | | |

**Features:**
- All orders with payment details
- Summary row at bottom
- Proper column widths
- Ready for Excel/Google Sheets
- Date formatted
- Amounts with 2 decimals

### File Name Format:
```
accounting_ledger_2025-10-26.xlsx
```

### Use Cases:

✅ **Accounting Software Import**
- Export to Excel
- Import into Tally/QuickBooks
- Match with bank statements

✅ **Financial Analysis**
- Calculate revenue trends
- Identify slow payers
- Analyze payment methods

✅ **Auditing**
- Complete transaction trail
- Payment documentation
- Compliance records

✅ **Management Reports**
- Monthly financial summary
- Outstanding collections
- Revenue tracking

---

## 🎯 Common Workflows

### Daily Payment Collection:

**Morning Routine:**
```
1. Open Accounting tab
2. Check Outstanding section
3. For each pending payment:
   - Contact retailer
   - Collect payment
   - Record in system
   - Select payment method
   - Add notes (ref numbers)
4. Payment status updates automatically
```

### End of Day Reconciliation:

**Evening Routine:**
```
1. Review collected payments
2. Match with cash/bank receipts
3. Export ledger for the day
4. Save Excel file
5. Update accounting software
6. Archive records
```

### Weekly Financial Review:

**Every Week:**
```
1. Open Accounting dashboard
2. Review summary cards
3. Check outstanding amounts
4. Identify overdue payments
5. Send reminders to retailers
6. Export weekly ledger
7. Generate reports for management
```

### Monthly Closing:

**Month End:**
```
1. Export full month ledger
2. Reconcile all payments
3. Generate statements for all retailers
4. Send statements via email
5. Follow up on outstanding dues
6. Archive monthly records
7. Submit reports to accounts team
```

---

## 💡 Best Practices

### Payment Collection:

1. **Always Record Immediately**
   - Collect → Record → Confirm
   - Don't delay entry
   - Real-time accuracy

2. **Use Proper Payment Method**
   - Select correct method
   - Important for accounting
   - Helps in bank reconciliation

3. **Add Reference Notes**
   - UPI: Add transaction ID
   - Cheque: Add cheque number and bank
   - Card: Add last 4 digits
   - Bank Transfer: Add reference number

4. **Verify Amounts**
   - Double-check amount entered
   - Cannot exceed due amount
   - System prevents overpayment

### Ledger Management:

1. **Regular Exports**
   - Export daily or weekly
   - Don't wait till month-end
   - Backup in multiple locations

2. **Follow Up System**
   - Check Outstanding section daily
   - Contact retailers with dues
   - Set payment reminders
   - Maintain payment schedules

3. **Reconciliation**
   - Match system with bank statements
   - Verify cash in hand
   - Check UPI/card settlements
   - Identify discrepancies early

4. **Documentation**
   - Keep payment proofs
   - Save transaction screenshots
   - Maintain physical receipts
   - Archive systematically

### Retailer Relations:

1. **Regular Statements**
   - Send monthly statements
   - Clear communication
   - No surprises

2. **Payment Terms**
   - Set clear terms
   - Remind before due date
   - Be consistent

3. **Partial Payments**
   - Allow flexibility
   - Record accurately
   - Track remaining amount
   - Set next payment date

---

## 📊 Understanding Payment Status

### Status Colors:

#### 🟢 Paid (Green)
```
Total: ₹5,000
Paid: ₹5,000
Due: ₹0

Status: PAID ✓
```
- Fully paid
- No action needed
- Invoice can be closed

#### 🟠 Partial (Orange)
```
Total: ₹5,000
Paid: ₹2,000
Due: ₹3,000

Status: PARTIAL
```
- Partially paid
- Follow up required
- Track remaining amount
- Set next payment date

#### 🔴 Unpaid (Red)
```
Total: ₹5,000
Paid: ₹0
Due: ₹5,000

Status: UNPAID
```
- No payment received
- High priority
- Immediate follow-up
- May hold future orders

---

## 🔍 Troubleshooting

### Issue: Can't find an order

**Solution:**
- Check Outstanding Payments section
- If paid, order won't show there
- Use Retailer Accounts to find all orders
- Search by retailer email

### Issue: Wrong payment amount entered

**Solution:**
- Cannot undo payment currently
- Note the error
- Collect remaining/refund extra
- Add note in next payment
- Contact support for correction

### Issue: Payment status not updating

**Solution:**
- Pull to refresh the screen
- Check internet connection
- Verify payment was recorded
- Restart app if needed

### Issue: Export not working

**Solution:**
- Check storage permission
- Ensure internet connection
- Try again after some time
- File saves to cache first

### Issue: Retailer says they paid but not showing

**Solution:**
- Check payment history
- Verify retailer email matches
- Check if payment recorded for different order
- Review ledger export

---

## 📈 Financial Reports

### Quick Stats (At a Glance):

```
TOTAL REVENUE:     ₹1,25,450
COLLECTED:         ₹95,200 (76%)
OUTSTANDING:       ₹30,250 (24%)

PAYMENT STATUS:
✅ Paid:           15 orders
🟠 Partial:        8 orders
🔴 Unpaid:         4 orders

TOTAL ORDERS:      27
```

### Collection Efficiency:

```
Collection Rate = (Collected / Total Revenue) × 100
                = (95,200 / 125,450) × 100
                = 76%

Target: 90% collection rate
```

### Outstanding Aging:

View retailer statements to identify:
- Orders > 30 days unpaid
- Orders > 60 days unpaid
- Orders > 90 days unpaid

---

## 🎯 Quick Reference

### Payment Collection:
```
Accounting Tab → Outstanding → Collect → Enter Details → Record
```

### View Payment History:
```
Accounting Tab → Outstanding → History → View All Payments
```

### Retailer Statement:
```
Accounting Tab → Retailer Accounts → Tap Retailer → View Statement
```

### Export Ledger:
```
Accounting Tab → Export Icon (📥) → Share/Save
```

### Check Summary:
```
Accounting Tab → Top Cards → Revenue/Collected/Outstanding
```

---

## ✅ Feature Checklist

- [x] Payment collection with multiple methods
- [x] Partial payment support
- [x] Payment history tracking
- [x] Real-time payment status updates
- [x] Financial dashboard with summary
- [x] Outstanding payments tracking
- [x] Retailer-wise account statements
- [x] Complete ledger management
- [x] Excel export for accounting
- [x] Color-coded payment status
- [x] Payment notes and references
- [x] Pull to refresh
- [x] Error handling
- [x] Loading indicators

---

## 🚀 Ready to Use!

**Test it now:**
1. Press `r` to reload app
2. Login as admin
3. Toggle admin mode
4. Go to Accounting tab
5. View financial dashboard
6. Try collecting a payment
7. View payment history
8. Export ledger
9. Check retailer statements

Your complete accounting and payment collection system is ready! 💰✨

---

## 📞 Support & Tips

### For Accountants:
- Export ledger regularly
- Match with bank statements
- Keep backup of all exports
- Document discrepancies

### For Admin:
- Monitor Outstanding daily
- Follow up with retailers
- Maintain payment schedules
- Generate monthly reports

### For Management:
- Review dashboard weekly
- Check collection efficiency
- Analyze payment trends
- Set collection targets

---

**SimpliPharma Accounting - Making financial management simple!** 💰📊✨

