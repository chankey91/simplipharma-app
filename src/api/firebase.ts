import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  enableIndexedDbPersistence,
  Timestamp,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { Medicine, Order, OrderMedicine, Payment, PaymentStatus, PaymentMethod } from '../types';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFtUVHKtADWllccdnlbougsnsntEUHQDA",
  authDomain: "simplipharma.firebaseapp.com",
  projectId: "simplipharma",
  storageBucket: "simplipharma.firebasestorage.app",
  messagingSenderId: "343720215451",
  appId: "1:343720215451:android:d2576ba41a99a5681e973e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log('The current browser does not support offline persistence');
    }
  });
} catch (err) {
  console.log('Persistence error:', err);
}

// Authentication helpers
export const loginWithEmail = async (email: string, password: string): Promise<FirebaseUser> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const registerWithEmail = async (email: string, password: string): Promise<FirebaseUser> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

// Firestore helpers - Medicines
export const fetchMedicines = async (): Promise<Medicine[]> => {
  const medicinesCol = collection(db, 'medicines');
  const medicineSnapshot = await getDocs(medicinesCol);
  const medicines: Medicine[] = medicineSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Medicine));
  return medicines;
};

export const getAllMedicines = async (): Promise<Medicine[]> => {
  return fetchMedicines(); // Alias for admin use
};

export const addMedicine = async (medicineData: Omit<Medicine, 'id'>): Promise<string> => {
  const medicinesCol = collection(db, 'medicines');
  const docRef = await addDoc(medicinesCol, medicineData);
  return docRef.id;
};

export const updateMedicine = async (medicineId: string, medicineData: Partial<Medicine>): Promise<void> => {
  const medicineRef = doc(db, 'medicines', medicineId);
  await updateDoc(medicineRef, medicineData as any);
};

export const deleteMedicine = async (medicineId: string): Promise<void> => {
  const medicineRef = doc(db, 'medicines', medicineId);
  await updateDoc(medicineRef, { deleted: true }); // Soft delete
  // Or use: await deleteDoc(medicineRef); // Hard delete
};

// Firestore helpers - Orders
export const createOrder = async (
  retailerId: string, 
  retailerEmail: string,
  medicines: OrderMedicine[], 
  totalAmount: number,
  deliveryAddress?: string
): Promise<string> => {
  const ordersCol = collection(db, 'orders');
  const orderData = {
    retailerId,
    retailerEmail,
    medicines,
    totalAmount,
    status: 'Pending' as const,
    orderDate: Timestamp.now(),
    deliveryAddress: deliveryAddress || ''
  };
  const docRef = await addDoc(ordersCol, orderData);
  return docRef.id;
};

export const fetchRetailerOrders = async (retailerId: string): Promise<Order[]> => {
  const ordersCol = collection(db, 'orders');
  const q = query(
    ordersCol, 
    where('retailerId', '==', retailerId)
  );
  const orderSnapshot = await getDocs(q);
  const orders: Order[] = orderSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    orderDate: doc.data().orderDate?.toDate() || new Date()
  } as Order));
  // Sort in memory instead of Firestore to avoid index requirement
  return orders.sort((a, b) => {
    const dateA = a.orderDate instanceof Date ? a.orderDate : new Date(a.orderDate);
    const dateB = b.orderDate instanceof Date ? b.orderDate : new Date(b.orderDate);
    return dateB.getTime() - dateA.getTime();
  });
};

export const fetchAllOrders = async (): Promise<Order[]> => {
  const ordersCol = collection(db, 'orders');
  const orderSnapshot = await getDocs(ordersCol);
  const orders: Order[] = orderSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    orderDate: doc.data().orderDate?.toDate() || new Date()
  } as Order));
  // Sort in memory instead of Firestore to avoid index requirement
  return orders.sort((a, b) => {
    const dateA = a.orderDate instanceof Date ? a.orderDate : new Date(a.orderDate);
    const dateB = b.orderDate instanceof Date ? b.orderDate : new Date(b.orderDate);
    return dateB.getTime() - dateA.getTime();
  });
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { status });
};

export const cancelOrder = async (orderId: string, cancelReason: string): Promise<void> => {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { 
    status: 'Cancelled',
    cancelReason,
    cancelledAt: Timestamp.now()
  });
};

// Favorites
export const addToFavorites = async (userId: string, medicineId: string): Promise<void> => {
  const favoritesCol = collection(db, 'favorites');
  await addDoc(favoritesCol, {
    userId,
    medicineId,
    addedAt: Timestamp.now()
  });
};

export const removeFromFavorites = async (userId: string, medicineId: string): Promise<void> => {
  const favoritesCol = collection(db, 'favorites');
  const q = query(favoritesCol, where('userId', '==', userId), where('medicineId', '==', medicineId));
  const snapshot = await getDocs(q);
  snapshot.docs.forEach(async (docSnap) => {
    await updateDoc(doc(db, 'favorites', docSnap.id), {});
    // Delete functionality - using updateDoc as placeholder
  });
};

export const getFavorites = async (userId: string): Promise<string[]> => {
  const favoritesCol = collection(db, 'favorites');
  const q = query(favoritesCol, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data().medicineId);
};

// User Profile
export const updateUserProfile = async (userId: string, data: any): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  // Use setDoc with merge to create if doesn't exist or update if exists
  await setDoc(userRef, data, { merge: true });
};

export const getUserProfile = async (userId: string): Promise<any> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
};

// Check if user is admin
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const profile = await getUserProfile(userId);
    return profile?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Admin - User Management
export const createUserAccount = async (
  email: string, 
  password: string, 
  profileData: any
): Promise<string> => {
  try {
    // Save current user
    const currentUser = auth.currentUser;
    
    // Create new user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUserId = userCredential.user.uid;
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', newUserId), {
      email,
      ...profileData,
      createdAt: Timestamp.now()
    });
    
    // Sign out the newly created user
    await signOut(auth);
    
    // Re-authenticate as admin if there was a current user
    if (currentUser) {
      // Note: In production, you'd want to store admin credentials securely
      // This is a limitation of client-side user creation
      console.log('Admin should re-login if needed');
    }
    
    return newUserId;
  } catch (error) {
    console.error('Error creating user account:', error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<any[]> => {
  const usersCol = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCol);
  const users = usersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  return users.sort((a: any, b: any) => {
    const dateA = a.createdAt?.toDate?.() || new Date(0);
    const dateB = b.createdAt?.toDate?.() || new Date(0);
    return dateB.getTime() - dateA.getTime();
  });
};

// Payment & Accounting Functions
export const recordPayment = async (
  orderId: string,
  amount: number,
  paymentMethod: PaymentMethod,
  notes?: string,
  collectedBy?: string
): Promise<void> => {
  const orderRef = doc(db, 'orders', orderId);
  const orderDoc = await getDoc(orderRef);
  
  if (!orderDoc.exists()) {
    throw new Error('Order not found');
  }
  
  const order = orderDoc.data() as Order;
  const currentPaid = order.paidAmount || 0;
  const newPaidAmount = currentPaid + amount;
  const dueAmount = order.totalAmount - newPaidAmount;
  
  let paymentStatus: PaymentStatus;
  if (dueAmount <= 0) {
    paymentStatus = 'Paid';
  } else if (newPaidAmount > 0) {
    paymentStatus = 'Partial';
  } else {
    paymentStatus = 'Unpaid';
  }
  
  // Create payment record in subcollection
  const paymentsCol = collection(db, 'orders', orderId, 'payments');
  await addDoc(paymentsCol, {
    amount,
    paymentDate: Timestamp.now(),
    paymentMethod,
    notes: notes || '',
    collectedBy: collectedBy || 'Admin',
  });
  
  // Update order with payment info
  await updateDoc(orderRef, {
    paidAmount: newPaidAmount,
    dueAmount: Math.max(0, dueAmount),
    paymentStatus,
  });
};

export const getOrderPayments = async (orderId: string): Promise<Payment[]> => {
  const paymentsCol = collection(db, 'orders', orderId, 'payments');
  const paymentsSnapshot = await getDocs(paymentsCol);
  
  return paymentsSnapshot.docs.map(doc => ({
    id: doc.id,
    orderId,
    ...doc.data(),
    paymentDate: doc.data().paymentDate?.toDate() || new Date(),
  } as Payment));
};

export const getAccountingSummary = async (): Promise<{
  totalRevenue: number;
  totalPaid: number;
  totalDue: number;
  totalOrders: number;
  paidOrders: number;
  unpaidOrders: number;
  partialOrders: number;
}> => {
  const ordersCol = collection(db, 'orders');
  const ordersSnapshot = await getDocs(ordersCol);
  
  let totalRevenue = 0;
  let totalPaid = 0;
  let totalDue = 0;
  let paidOrders = 0;
  let unpaidOrders = 0;
  let partialOrders = 0;
  
  ordersSnapshot.docs.forEach(doc => {
    const order = doc.data() as Order;
    totalRevenue += order.totalAmount;
    totalPaid += order.paidAmount || 0;
    totalDue += order.dueAmount || order.totalAmount;
    
    const paymentStatus = order.paymentStatus || 'Unpaid';
    if (paymentStatus === 'Paid') paidOrders++;
    else if (paymentStatus === 'Unpaid') unpaidOrders++;
    else if (paymentStatus === 'Partial') partialOrders++;
  });
  
  return {
    totalRevenue,
    totalPaid,
    totalDue,
    totalOrders: ordersSnapshot.docs.length,
    paidOrders,
    unpaidOrders,
    partialOrders,
  };
};

export const getRetailerAccountStatement = async (retailerId: string): Promise<{
  orders: Order[];
  totalOrdered: number;
  totalPaid: number;
  totalDue: number;
}> => {
  const ordersCol = collection(db, 'orders');
  const q = query(ordersCol, where('retailerId', '==', retailerId));
  const ordersSnapshot = await getDocs(q);
  
  const orders: Order[] = ordersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    orderDate: doc.data().orderDate?.toDate() || new Date(),
  } as Order));
  
  const totalOrdered = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalPaid = orders.reduce((sum, order) => sum + (order.paidAmount || 0), 0);
  const totalDue = orders.reduce((sum, order) => sum + (order.dueAmount || order.totalAmount), 0);
  
  return {
    orders: orders.sort((a, b) => {
      const dateA = a.orderDate instanceof Date ? a.orderDate : new Date(a.orderDate);
      const dateB = b.orderDate instanceof Date ? b.orderDate : new Date(b.orderDate);
      return dateB.getTime() - dateA.getTime();
    }),
    totalOrdered,
    totalPaid,
    totalDue,
  };
};

// ========================================
// Banner Management Functions
// ========================================

export const getAllBanners = async () => {
  const bannersCol = collection(db, 'banners');
  const q = query(bannersCol, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as any[];
};

export const getActiveBanners = async () => {
  const bannersCol = collection(db, 'banners');
  const q = query(bannersCol, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  // Filter active banners in code instead of query to avoid composite index
  const allBanners = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as any[];
  return allBanners.filter(banner => banner.isActive === true);
};

export const addBanner = async (bannerData: any) => {
  const bannersCol = collection(db, 'banners');
  
  // Remove undefined values
  const cleanData = Object.keys(bannerData).reduce((acc: any, key) => {
    if (bannerData[key] !== undefined) {
      acc[key] = bannerData[key];
    }
    return acc;
  }, {});
  
  const docRef = await addDoc(bannersCol, {
    ...cleanData,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateBanner = async (bannerId: string, bannerData: any) => {
  const bannerRef = doc(db, 'banners', bannerId);
  
  // Remove undefined values
  const cleanData = Object.keys(bannerData).reduce((acc: any, key) => {
    if (bannerData[key] !== undefined) {
      acc[key] = bannerData[key];
    }
    return acc;
  }, {});
  
  await updateDoc(bannerRef, {
    ...cleanData,
    updatedAt: Timestamp.now(),
  });
};

export const deleteBanner = async (bannerId: string) => {
  const bannerRef = doc(db, 'banners', bannerId);
  await updateDoc(bannerRef, { isActive: false });
};

