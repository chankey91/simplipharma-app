import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, updateUserProfile, getUserProfile } from '../api/firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

export const ProfileScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [shopName, setShopName] = useState('');
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const profile = await getUserProfile(user.uid);
      if (profile) {
        setDisplayName(profile.displayName || '');
        setPhoneNumber(profile.phoneNumber || '');
        setAddress(profile.address || '');
        setShopName(profile.shopName || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleChangePassword = async () => {
    if (!user || !user.email) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Please enter current password');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter new password');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    setChangingPassword(true);
    try {
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Change password
      await updatePassword(user, newPassword);
      
      Alert.alert('Success', 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Password change error:', error);
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Current password is incorrect');
      } else if (error.code === 'auth/too-many-requests') {
        Alert.alert('Error', 'Too many attempts. Please try again later.');
      } else {
        Alert.alert('Error', error.message || 'Failed to change password');
      }
    } finally {
      setChangingPassword(false);
    }
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={80} color="#2196F3" />
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        <Text style={styles.infoText}>
          Your profile is managed by the administrator. Please contact admin for any changes.
        </Text>
        
        <Text style={styles.label}>Display Name</Text>
        <View style={styles.disabledInput}>
          <Text style={styles.disabledText}>{displayName || 'Not set'}</Text>
        </View>

        <Text style={styles.label}>Shop Name</Text>
        <View style={styles.disabledInput}>
          <Text style={styles.disabledText}>{shopName || 'Not set'}</Text>
        </View>

        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.disabledInput}>
          <Text style={styles.disabledText}>{phoneNumber || 'Not set'}</Text>
        </View>

        <Text style={styles.label}>Address</Text>
        <View style={[styles.disabledInput, styles.textArea]}>
          <Text style={styles.disabledText}>{address || 'Not set'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        <Text style={styles.infoText}>
          You can change your password here for security purposes.
        </Text>
        
        <Text style={styles.label}>Current Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter current password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new password (min 6 characters)"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={handleChangePassword}
          disabled={changingPassword}
        >
          {changingPassword ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.changePasswordButtonText}>Change Password</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Need to Update Your Information?</Text>
        <Text style={styles.infoText}>
          Contact your administrator to update your profile details.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  disabledText: {
    fontSize: 14,
    color: '#888',
  },
  textArea: {
    minHeight: 80,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  changePasswordButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  changePasswordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

