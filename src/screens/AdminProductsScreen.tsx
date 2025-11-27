import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { 
  getAllMedicines, 
  addMedicine, 
  updateMedicine, 
  deleteMedicine 
} from '../api/firebase';
import { Medicine } from '../types';

export const AdminProductsScreen: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  
  // Form fields - Basic
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('');
  const [stock, setStock] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  
  // Form fields - Pricing
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [salesPrice, setSalesPrice] = useState('');
  
  // Form fields - Schemes
  const [salesSchemeDeal, setSalesSchemeDeal] = useState('');
  const [salesSchemeFree, setSalesSchemeFree] = useState('');
  const [purchaseSchemeDeal, setPurchaseSchemeDeal] = useState('');
  const [purchaseSchemeFree, setPurchaseSchemeFree] = useState('');
  
  // Form fields - Other
  const [value, setValue] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [dosage, setDosage] = useState('');
  const [composition, setComposition] = useState('');
  const [sideEffects, setSideEffects] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const data = await getAllMedicines();
      setMedicines(data);
    } catch (error) {
      console.error('Error loading medicines:', error);
      Alert.alert('Error', 'Failed to load medicines');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMedicines();
  };

  const openCreateModal = () => {
    setEditingMedicine(null);
    clearForm();
    setModalVisible(true);
  };

  const openEditModal = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    // Basic fields
    setCode(medicine.code || '');
    setName(medicine.name);
    setCategory(medicine.category);
    setUnit(medicine.unit || '');
    setStock(medicine.stock.toString());
    setCurrentStock(medicine.currentStock?.toString() || medicine.stock.toString());
    
    // Pricing fields
    setPrice(medicine.price.toString());
    setCostPrice(medicine.costPrice?.toString() || '');
    setMrp(medicine.mrp?.toString() || '');
    setPurchasePrice(medicine.purchasePrice?.toString() || '');
    setSalesPrice(medicine.salesPrice?.toString() || medicine.price.toString());
    
    // Scheme fields
    setSalesSchemeDeal(medicine.salesSchemeDeal?.toString() || '');
    setSalesSchemeFree(medicine.salesSchemeFree?.toString() || '');
    setPurchaseSchemeDeal(medicine.purchaseSchemeDeal?.toString() || '');
    setPurchaseSchemeFree(medicine.purchaseSchemeFree?.toString() || '');
    
    // Other fields
    setValue(medicine.value?.toString() || '');
    setManufacturer(medicine.manufacturer);
    setCompany(medicine.company || '');
    setDescription(medicine.description || '');
    setDosage(medicine.dosage || '');
    setComposition(medicine.composition || '');
    setSideEffects(medicine.sideEffects || '');
    setImageUrl(medicine.imageUrl || '');
    setModalVisible(true);
  };

  const clearForm = () => {
    // Basic fields
    setCode('');
    setName('');
    setCategory('');
    setUnit('');
    setStock('');
    setCurrentStock('');
    
    // Pricing fields
    setPrice('');
    setCostPrice('');
    setMrp('');
    setPurchasePrice('');
    setSalesPrice('');
    
    // Scheme fields
    setSalesSchemeDeal('');
    setSalesSchemeFree('');
    setPurchaseSchemeDeal('');
    setPurchaseSchemeFree('');
    
    // Other fields
    setValue('');
    setManufacturer('');
    setCompany('');
    setDescription('');
    setDosage('');
    setComposition('');
    setSideEffects('');
    setImageUrl('');
  };

  const handleSave = async () => {
    if (!name.trim() || !category.trim() || !manufacturer.trim()) {
      Alert.alert('Error', 'Please fill all required fields (Name, Category, Manufacturer)');
      return;
    }

    // Parse numeric values
    const priceNum = price ? parseFloat(price) : 0;
    const stockNum = stock ? parseInt(stock) : 0;
    const currentStockNum = currentStock ? parseInt(currentStock) : stockNum;
    const costPriceNum = costPrice ? parseFloat(costPrice) : undefined;
    const mrpNum = mrp ? parseFloat(mrp) : undefined;
    const purchasePriceNum = purchasePrice ? parseFloat(purchasePrice) : undefined;
    const salesPriceNum = salesPrice ? parseFloat(salesPrice) : priceNum;
    const valueNum = value ? parseFloat(value) : undefined;
    
    const salesSchemeDealNum = salesSchemeDeal ? parseFloat(salesSchemeDeal) : undefined;
    const salesSchemeFreeNum = salesSchemeFree ? parseFloat(salesSchemeFree) : undefined;
    const purchaseSchemeDealNum = purchaseSchemeDeal ? parseFloat(purchaseSchemeDeal) : undefined;
    const purchaseSchemeFreeNum = purchaseSchemeFree ? parseFloat(purchaseSchemeFree) : undefined;

    setSaving(true);
    try {
      const medicineData: any = {
        // Basic fields
        code: code.trim() || undefined,
        name: name.trim(),
        category: category.trim(),
        unit: unit.trim() || undefined,
        stock: stockNum,
        currentStock: currentStockNum,
        
        // Pricing fields
        price: priceNum,
        costPrice: costPriceNum,
        mrp: mrpNum,
        purchasePrice: purchasePriceNum,
        salesPrice: salesPriceNum,
        
        // Scheme fields
        salesSchemeDeal: salesSchemeDealNum,
        salesSchemeFree: salesSchemeFreeNum,
        purchaseSchemeDeal: purchaseSchemeDealNum,
        purchaseSchemeFree: purchaseSchemeFreeNum,
        
        // Other fields
        value: valueNum,
        manufacturer: manufacturer.trim(),
        company: company.trim() || undefined,
        description: description.trim() || undefined,
        dosage: dosage.trim() || undefined,
        composition: composition.trim() || undefined,
        sideEffects: sideEffects.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
      };

      // Remove undefined values
      Object.keys(medicineData).forEach(key => 
        medicineData[key] === undefined && delete medicineData[key]
      );

      if (editingMedicine) {
        await updateMedicine(editingMedicine.id, medicineData);
        Alert.alert('Success', 'Medicine updated successfully');
      } else {
        await addMedicine(medicineData);
        Alert.alert('Success', 'Medicine added successfully');
      }
      
      setModalVisible(false);
      loadMedicines();
    } catch (error: any) {
      console.error('Save error:', error);
      Alert.alert('Error', error.message || 'Failed to save medicine');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (medicine: Medicine) => {
    Alert.alert(
      'Delete Medicine',
      `Are you sure you want to delete "${medicine.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMedicine(medicine.id);
              Alert.alert('Success', 'Medicine deleted successfully');
              loadMedicines();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete medicine');
            }
          },
        },
      ]
    );
  };

  const handleExport = async () => {
    try {
      if (medicines.length === 0) {
        Alert.alert('Info', 'No products to export');
        return;
      }

      Alert.alert(
        'Export Inventory',
        `Export ${medicines.length} products to Excel?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Export',
            onPress: async () => {
              try {
                // Prepare data for Excel with all fields
                const exportData = medicines.map(med => ({
                  'ID': med.id,
                  'Code': med.code || '',
                  'Product Name': med.name,
                  'Unit': med.unit || '',
                  'Current Stock': med.currentStock || med.stock,
                  'Sales Scheme Deal': med.salesSchemeDeal || 0,
                  'Sales Scheme Free': med.salesSchemeFree || 0,
                  'Purc.Scheme Deal': med.purchaseSchemeDeal || 0,
                  'Purc.Scheme Free': med.purchaseSchemeFree || 0,
                  'Cost Price': med.costPrice || 0,
                  'Value': med.value || 0,
                  'M.R.P.': med.mrp || 0,
                  'Purchase Price': med.purchasePrice || 0,
                  'Sales Price': med.salesPrice || med.price,
                  'Company': med.company || '',
                  'Manufacturer': med.manufacturer,
                  'Category': med.category,
                  'Description': med.description || '',
                  'Dosage': med.dosage || '',
                  'Composition': med.composition || '',
                  'Side Effects': med.sideEffects || '',
                  'Image URL': med.imageUrl || '',
                }));

                // Create workbook and worksheet
                const ws = XLSX.utils.json_to_sheet(exportData);
                
                // Set column widths for better readability
                ws['!cols'] = [
                  { wch: 20 }, // ID
                  { wch: 15 }, // Code
                  { wch: 30 }, // Product Name
                  { wch: 10 }, // Unit
                  { wch: 12 }, // Current Stock
                  { wch: 15 }, // Sales Scheme Deal
                  { wch: 15 }, // Sales Scheme Free
                  { wch: 15 }, // Purc.Scheme Deal
                  { wch: 15 }, // Purc.Scheme Free
                  { wch: 12 }, // Cost Price
                  { wch: 12 }, // Value
                  { wch: 12 }, // M.R.P.
                  { wch: 12 }, // Purchase Price
                  { wch: 12 }, // Sales Price
                  { wch: 25 }, // Company
                  { wch: 25 }, // Manufacturer
                  { wch: 15 }, // Category
                  { wch: 30 }, // Description
                  { wch: 15 }, // Dosage
                  { wch: 25 }, // Composition
                  { wch: 25 }, // Side Effects
                  { wch: 30 }, // Image URL
                ];

                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Medicines');

                // Generate Excel file
                const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
                const fileName = `medicines_inventory_${new Date().toISOString().split('T')[0]}.xlsx`;
                
                // Use cache directory for better compatibility
                const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

                console.log('Writing file to:', fileUri);

                // Write file
                await FileSystem.writeAsStringAsync(fileUri, wbout, {
                  encoding: FileSystem.EncodingType.Base64,
                });

                console.log('File written successfully');

                // Check if sharing is available
                const isAvailable = await Sharing.isAvailableAsync();
                console.log('Sharing available:', isAvailable);

                if (isAvailable) {
                  // Share file with dialog title
                  await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    dialogTitle: 'Save Inventory Excel File',
                    UTI: 'com.microsoft.excel.xlsx',
                  });
                  
                  Alert.alert(
                    'Export Successful!',
                    `Exported ${medicines.length} products.\n\nFile: ${fileName}\n\nYou can now save it to your device or share it.`
                  );
                } else {
                  Alert.alert(
                    'Export Successful!',
                    `File saved at:\n${fileUri}\n\nYou can find it in your file manager.`
                  );
                }
              } catch (innerError: any) {
                console.error('Export error:', innerError);
                Alert.alert(
                  'Export Failed',
                  `Error: ${innerError.message || 'Unknown error'}\n\nPlease try again or contact support.`
                );
              }
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Export error:', error);
      Alert.alert('Error', error.message || 'Failed to start export');
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      setImporting(true);

      const fileUri = result.assets[0].uri;
      console.log('Reading file from:', fileUri);
      
      // Copy file to a clean temp location to avoid DocumentPicker caching issues
      const tempUri = `${FileSystem.cacheDirectory}temp_import_${Date.now()}.xlsx`;
      console.log('Copying to temp location:', tempUri);
      
      try {
        await FileSystem.copyAsync({
          from: fileUri,
          to: tempUri
        });
        console.log('File copied successfully');
      } catch (copyError: any) {
        console.error('File copy error:', copyError);
        Alert.alert('Error', 'Could not process file. Please try again.');
        setImporting(false);
        return;
      }
      
      // Read from temp location
      let fileContent: string;
      try {
        fileContent = await FileSystem.readAsStringAsync(tempUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        console.log('File content length (base64):', fileContent.length);
      } catch (readError: any) {
        console.error('File read error:', readError);
        Alert.alert('Error', 'Could not read file. Please try again.');
        setImporting(false);
        return;
      }

      if (!fileContent || fileContent.length === 0) {
        Alert.alert('Error', 'File is empty. Please check the file.');
        setImporting(false);
        return;
      }

      // Parse Excel with base64 type
      let workbook;
      try {
        console.log('Parsing Excel with XLSX...');
        
        workbook = XLSX.read(fileContent, { 
          type: 'base64',
          cellFormula: false,
          cellHTML: false,
          cellNF: false,
          cellStyles: false,
          cellText: false,
          cellDates: false,
          sheetStubs: false,
          sheetRows: 0,  // 0 means all rows
          bookDeps: false,
          bookFiles: false,
          bookProps: false,
          bookSheets: false,
          bookVBA: false
        });
        
        console.log('Parsing complete');
      } catch (parseError: any) {
        console.error('XLSX parse error:', parseError);
        Alert.alert('Error', `Failed to parse Excel file: ${parseError.message}`);
        setImporting(false);
        
        // Clean up temp file
        try {
          await FileSystem.deleteAsync(tempUri, { idempotent: true });
        } catch {}
        return;
      }
      
      // Clean up temp file after parsing
      try {
        await FileSystem.deleteAsync(tempUri, { idempotent: true });
      } catch (cleanupError) {
        console.log('Cleanup warning:', cleanupError);
      }
      console.log('Workbook object keys:', Object.keys(workbook).join(', '));
      console.log('Workbook sheets:', workbook.SheetNames);
      console.log('Workbook.Sheets exists?', !!workbook.Sheets);
      console.log('Workbook.Sheets keys:', Object.keys(workbook.Sheets || {}).join(', '));
      
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        Alert.alert('Error', 'Excel file has no sheets. Please check the file.');
        setImporting(false);
        return;
      }
      
      // Try re-parsing with different method if Sheets is empty
      if (!workbook.Sheets || Object.keys(workbook.Sheets).length === 0) {
        console.log('Sheets object empty, trying alternative parsing...');
        
        try {
          // Re-read file content from URI directly
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          console.log('File exists:', fileInfo.exists, 'Size:', fileInfo.size);
          
          // Try reading as array buffer
          const arrayBuffer = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          
          // Parse with array option
          const newWorkbook = XLSX.read(arrayBuffer, { 
            type: 'base64',
            cellStyles: false,
            cellHTML: false,
            sheetStubs: true
          });
          
          console.log('Re-parsed Sheets keys:', Object.keys(newWorkbook.Sheets || {}).join(', '));
          
          if (newWorkbook.Sheets && Object.keys(newWorkbook.Sheets).length > 0) {
            workbook = newWorkbook;
            console.log('Successfully re-parsed with sheets!');
          }
        } catch (retryError: any) {
          console.error('Retry parse failed:', retryError);
        }
      }
      
      const sheetName = workbook.SheetNames[0];
      console.log('Reading sheet:', sheetName);
      
      const worksheet = workbook.Sheets?.[sheetName];
      console.log('Worksheet retrieved?', !!worksheet);
      
      if (!worksheet) {
        Alert.alert(
          'Error', 
          'Could not read worksheet data. This may be a compatibility issue with the Excel file format.\n\nTry:\n1. Opening the file in Excel\n2. Save As → Excel Workbook (.xlsx)\n3. Try importing again'
        );
        setImporting(false);
        return;
      }
      
      // Get range to check if worksheet has data
      const range = worksheet['!ref'];
      console.log('Worksheet range:', range);
      
      // Parse as array of arrays first (more reliable)
      const rawData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: '',
        blankrows: false 
      });
      
      console.log('Raw data rows:', rawData.length);
      
      if (!rawData || rawData.length < 2) {
        Alert.alert(
          'Error', 
          'Excel file appears to be empty or has no data rows.\n\n' +
          'Make sure your Excel file has:\n' +
          '• Column headers in the first row\n' +
          '• At least one data row below the headers'
        );
        setImporting(false);
        return;
      }
      
      // Convert to objects manually
      const headers = rawData[0] as string[];
      console.log('Headers:', headers.join(', '));
      
      const jsonData = rawData.slice(1).map((row: any) => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] !== undefined ? row[index] : '';
        });
        return obj;
      }).filter((row: any) => {
        // Filter out completely empty rows
        return Object.values(row).some(val => val !== '' && val !== null && val !== undefined);
      });

      console.log('Parsed rows:', jsonData.length);
      if (jsonData.length > 0) {
        console.log('First row:', JSON.stringify(jsonData[0]));
      }

      if (!jsonData || jsonData.length === 0) {
        Alert.alert(
          'Error', 
          'No valid data found in Excel file.\n\nPlease check the file format.'
        );
        setImporting(false);
        return;
      }

      // Show progress alert for large imports
      if (jsonData.length > 100) {
        Alert.alert(
          'Large Import Detected',
          `You're importing ${jsonData.length.toLocaleString()} products. This may take a few minutes.\n\nThe app will notify you when complete.`,
          [{ text: 'Continue', style: 'default' }]
        );
      }

      // Process import with all fields
      let added = 0;
      let updated = 0;
      let errors: string[] = [];
      let skipped = 0;

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i] as any;
        
        try {
          // Helper function to get numeric value
          const getNum = (value: any): number | undefined => {
            if (value === null || value === undefined || value === '') return undefined;
            const num = parseFloat(value);
            return isNaN(num) ? undefined : num;
          };

          const medicineData: any = {
            // Basic fields
            code: row['Code'] || row.code || '',
            name: row['Product Name'] || row['Name'] || row.name || '',
            category: row['Category'] || row.category || 'General',  // Default category
            unit: row['Unit'] || row.unit || '',
            stock: parseInt(row['Stock'] || row.stock || 0),
            currentStock: parseInt(row['Current Stock'] || row['CurrentStock'] || row.currentStock || row['Stock'] || row.stock || 0),
            
            // Pricing fields
            price: getNum(row['Sales Price'] || row['Price'] || row.price || row['M.R.P.'] || row['MRP']) || 0,
            costPrice: getNum(row['Cost Price'] || row['CostPrice'] || row.costPrice),
            mrp: getNum(row['M.R.P.'] || row['MRP'] || row.mrp),
            purchasePrice: getNum(row['Purchase Price'] || row['PurchasePrice'] || row.purchasePrice),
            salesPrice: getNum(row['Sales Price'] || row['SalesPrice'] || row.salesPrice),
            
            // Scheme fields
            salesSchemeDeal: getNum(row['Sales Scheme Deal'] || row['SalesSchemeDeal'] || row.salesSchemeDeal),
            salesSchemeFree: getNum(row['Sales Scheme Free'] || row['SalesSchemeFree'] || row.salesSchemeFree),
            purchaseSchemeDeal: getNum(row['Purc.Scheme Deal'] || row['PurchaseSchemeDeal'] || row.purchaseSchemeDeal),
            purchaseSchemeFree: getNum(row['Purc.Scheme Free'] || row['PurchaseSchemeFree'] || row.purchaseSchemeFree),
            
            // Other fields
            value: getNum(row['Value'] || row.value),
            manufacturer: row['Manufacturer'] || row.manufacturer || row['Company'] || row.company || 'Unknown',
            company: row['Company'] || row.company || '',
            description: row['Description'] || row.description || '',
            dosage: row['Dosage'] || row.dosage || '',
            composition: row['Composition'] || row.composition || '',
            sideEffects: row['Side Effects'] || row['SideEffects'] || row.sideEffects || '',
            imageUrl: row['Image URL'] || row['ImageURL'] || row.imageUrl || '',
          };

          // Remove empty/undefined values
          Object.keys(medicineData).forEach(key => {
            if (medicineData[key] === undefined || medicineData[key] === '') {
              delete medicineData[key];
            }
          });

          // Validate required fields (only name is truly required now)
          if (!medicineData.name) {
            skipped++;
            continue;
          }

          // Check if medicine exists (by ID, Code, or Name)
          const existingId = row['ID'] || row.id;
          const existingCode = row['Code'] || row.code;
          const existing = medicines.find(m => 
            (existingId && m.id === existingId) ||
            (existingCode && m.code === existingCode) ||
            (medicineData.name && m.name.toLowerCase() === medicineData.name.toLowerCase())
          );

          if (existing) {
            await updateMedicine(existing.id, medicineData);
            updated++;
          } else {
            await addMedicine(medicineData);
            added++;
          }
        } catch (error) {
          errors.push(`Error processing: ${row['Product Name'] || row['Name'] || 'Unknown'}`);
        }
      }

      setImporting(false);
      loadMedicines();

      // Show results
      let message = `Import completed!\n\n✅ Added: ${added}\n📝 Updated: ${updated}`;
      if (skipped > 0) {
        message += `\n⏭️ Skipped: ${skipped} (empty rows)`;
      }
      if (errors.length > 0) {
        message += `\n\n❌ Errors: ${errors.length}\n${errors.slice(0, 3).join('\n')}`;
        if (errors.length > 3) {
          message += `\n... and ${errors.length - 3} more`;
        }
      }
      
      const totalProcessed = added + updated + skipped + errors.length;
      console.log(`Import summary: ${totalProcessed}/${jsonData.length} rows processed`);
      
      Alert.alert('Import Complete', message);
    } catch (error: any) {
      setImporting(false);
      console.error('Import error:', error);
      Alert.alert('Error', error.message || 'Failed to import file');
    }
  };

  const renderMedicineCard = ({ item }: { item: Medicine }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardCategory}>{item.category}</Text>
          <Text style={styles.cardManufacturer}>{item.manufacturer}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => openEditModal(item)}
          >
            <Ionicons name="create-outline" size={20} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash-outline" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Price:</Text>
          <Text style={styles.detailValue}>₹{item.price.toFixed(2)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Stock:</Text>
          <Text style={[styles.detailValue, item.stock === 0 && styles.outOfStock]}>
            {item.stock} units
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Inventory Management</Text>
          <Text style={styles.headerSubtitle}>{medicines.length} total products</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={handleExport}>
            <Ionicons name="download-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleImport}
            disabled={importing}
          >
            {importing ? (
              <ActivityIndicator size="small" color="#FF9800" />
            ) : (
              <Ionicons name="cloud-upload-outline" size={24} color="#FF9800" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id}
        renderItem={renderMedicineCard}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="medical-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No medicines yet</Text>
            <Text style={styles.emptySubtext}>Add your first product or import from Excel</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={styles.fab} onPress={openCreateModal}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Add/Edit Medicine Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.sectionHeader}>📦 Basic Information *</Text>
            
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Product Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., ITAPL525"
                  value={code}
                  onChangeText={setCode}
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Unit</Text>
                <TextInput
                  style={styles.input}
                  placeholder="PCS, TAB, POW"
                  value={unit}
                  onChangeText={setUnit}
                />
              </View>
            </View>

            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Paracetamol 500mg"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Category *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Pain Relief, Antibiotic"
              value={category}
              onChangeText={setCategory}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Manufacturer *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Cipla"
                  value={manufacturer}
                  onChangeText={setManufacturer}
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Company</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., APL"
                  value={company}
                  onChangeText={setCompany}
                />
              </View>
            </View>

            <Text style={styles.sectionHeader}>💰 Pricing Information</Text>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Cost Price (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={costPrice}
                  onChangeText={setCostPrice}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Purchase Price (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={purchasePrice}
                  onChangeText={setPurchasePrice}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>M.R.P. (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={mrp}
                  onChangeText={setMrp}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Sales Price (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={salesPrice}
                  onChangeText={setSalesPrice}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Display Price (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Value</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  value={value}
                  onChangeText={setValue}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <Text style={styles.sectionHeader}>📊 Stock Information</Text>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Total Stock</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={stock}
                  onChangeText={setStock}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Current Stock</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={currentStock}
                  onChangeText={setCurrentStock}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <Text style={styles.sectionHeader}>🎁 Scheme Information</Text>

            <Text style={styles.label}>Sales Scheme</Text>
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <TextInput
                  style={styles.input}
                  placeholder="Deal (e.g., 10)"
                  value={salesSchemeDeal}
                  onChangeText={setSalesSchemeDeal}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.halfWidth}>
                <TextInput
                  style={styles.input}
                  placeholder="Free (e.g., 2)"
                  value={salesSchemeFree}
                  onChangeText={setSalesSchemeFree}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <Text style={styles.label}>Purchase Scheme</Text>
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <TextInput
                  style={styles.input}
                  placeholder="Deal (e.g., 10)"
                  value={purchaseSchemeDeal}
                  onChangeText={setPurchaseSchemeDeal}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.halfWidth}>
                <TextInput
                  style={styles.input}
                  placeholder="Free (e.g., 2)"
                  value={purchaseSchemeFree}
                  onChangeText={setPurchaseSchemeFree}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <Text style={styles.sectionHeader}>📝 Additional Details</Text>

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Brief product description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Dosage</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 500mg, 10ml"
              value={dosage}
              onChangeText={setDosage}
            />

            <Text style={styles.label}>Composition</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Active ingredients"
              value={composition}
              onChangeText={setComposition}
              multiline
              numberOfLines={2}
            />

            <Text style={styles.label}>Side Effects</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Possible side effects"
              value={sideEffects}
              onChangeText={setSideEffects}
              multiline
              numberOfLines={2}
            />

            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChangeText={setImageUrl}
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {editingMedicine ? 'Update Product' : 'Add Product'}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 13,
    color: '#2196F3',
    marginBottom: 2,
  },
  cardManufacturer: {
    fontSize: 12,
    color: '#999',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  cardDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  outOfStock: {
    color: '#F44336',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

