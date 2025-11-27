import { Order, Medicine } from '../types';

interface PurchaseFrequency {
  medicineId: string;
  count: number;
  lastPurchaseDate: Date | null;
}

interface ScoredMedicine {
  medicine: Medicine;
  score: number;
  reasons: string[];
}

/**
 * Analyze purchase frequency from user orders
 */
export const analyzePurchaseFrequency = (orders: Order[]): Record<string, PurchaseFrequency> => {
  const frequency: Record<string, PurchaseFrequency> = {};
  
  orders.forEach(order => {
    const orderDate = order.orderDate instanceof Date 
      ? order.orderDate 
      : new Date(order.orderDate);
    
    order.medicines.forEach(med => {
      if (!frequency[med.medicineId]) {
        frequency[med.medicineId] = {
          medicineId: med.medicineId,
          count: 0,
          lastPurchaseDate: null,
        };
      }
      
      frequency[med.medicineId].count += med.quantity;
      
      // Update last purchase date if this order is more recent
      if (!frequency[med.medicineId].lastPurchaseDate || 
          orderDate > frequency[med.medicineId].lastPurchaseDate!) {
        frequency[med.medicineId].lastPurchaseDate = orderDate;
      }
    });
  });
  
  return frequency;
};

/**
 * Calculate days since a date
 */
const daysSinceDate = (date: Date): number => {
  return (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24);
};

/**
 * Check if medicine needs reordering (30 days default interval)
 */
export const needsReorder = (lastPurchaseDate: Date | null, intervalDays: number = 30): boolean => {
  if (!lastPurchaseDate) return false;
  
  const daysSince = daysSinceDate(lastPurchaseDate);
  // Suggest reorder at 80% of the interval
  return daysSince >= (intervalDays * 0.8);
};

/**
 * Get current season based on month (India-centric)
 */
export const getCurrentSeason = (): 'summer' | 'monsoon' | 'winter' | 'spring' => {
  const month = new Date().getMonth() + 1;
  
  if (month >= 3 && month <= 5) return 'summer';
  if (month >= 6 && month <= 9) return 'monsoon';
  if (month >= 10 && month <= 11) return 'winter';
  return 'spring';
};

/**
 * Generate personalized recommendations based on purchase history
 */
export const generateRecommendations = (
  allMedicines: Medicine[],
  userOrders: Order[],
  count: number = 6
): Medicine[] => {
  
  if (userOrders.length === 0) {
    // New users: return first N medicines
    return allMedicines.slice(0, count);
  }
  
  // Analyze purchase frequency
  const purchaseFreq = analyzePurchaseFrequency(userOrders);
  
  // Score each medicine
  const scoredMedicines: ScoredMedicine[] = allMedicines.map(med => {
    let score = 0;
    const reasons: string[] = [];
    
    const freq = purchaseFreq[med.id];
    
    // Factor 1: Purchase frequency (weight: 5 points per purchase)
    if (freq && freq.count > 0) {
      score += freq.count * 5;
      
      if (freq.count >= 3) {
        reasons.push('⭐ Frequently purchased');
      } else {
        reasons.push('Previously purchased');
      }
      
      // Factor 2: Reorder prediction (weight: 10 points)
      if (freq.lastPurchaseDate && needsReorder(freq.lastPurchaseDate)) {
        score += 10;
        reasons.push('🔔 Time to reorder');
      }
      
      // Factor 3: Recency bonus (weight: 3 points if purchased in last 60 days)
      if (freq.lastPurchaseDate) {
        const daysSince = daysSinceDate(freq.lastPurchaseDate);
        if (daysSince < 60) {
          score += 3;
        }
      }
    }
    
    // Factor 4: Stock availability (weight: 1 point)
    if (med.stock > 0) {
      score += 1;
    } else {
      score -= 5; // Penalty for out of stock
    }
    
    return { medicine: med, score, reasons };
  });
  
  // Sort by score (descending) and return top N
  return scoredMedicines
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(item => item.medicine);
};

/**
 * Get medicines that need reordering
 */
export const getMedicinesNeedingReorder = (
  allMedicines: Medicine[],
  userOrders: Order[]
): Medicine[] => {
  
  if (userOrders.length === 0) return [];
  
  const purchaseFreq = analyzePurchaseFrequency(userOrders);
  const needsReordering: Medicine[] = [];
  
  allMedicines.forEach(med => {
    const freq = purchaseFreq[med.id];
    if (freq && freq.lastPurchaseDate && needsReorder(freq.lastPurchaseDate)) {
      needsReordering.push(med);
    }
  });
  
  return needsReordering;
};

/**
 * Get top purchased medicines
 */
export const getTopPurchased = (
  allMedicines: Medicine[],
  userOrders: Order[],
  count: number = 6
): Medicine[] => {
  
  if (userOrders.length === 0) return [];
  
  const purchaseFreq = analyzePurchaseFrequency(userOrders);
  
  // Sort medicines by purchase count
  const sorted = Object.values(purchaseFreq)
    .sort((a, b) => b.count - a.count)
    .slice(0, count)
    .map(freq => freq.medicineId);
  
  // Return medicine objects
  return sorted
    .map(id => allMedicines.find(m => m.id === id))
    .filter(m => m !== undefined) as Medicine[];
};

/**
 * Check if a specific medicine needs reordering for badge display
 */
export const shouldShowReorderBadge = (
  medicineId: string,
  userOrders: Order[]
): boolean => {
  const purchaseFreq = analyzePurchaseFrequency(userOrders);
  const freq = purchaseFreq[medicineId];
  
  return freq && freq.lastPurchaseDate ? needsReorder(freq.lastPurchaseDate) : false;
};

