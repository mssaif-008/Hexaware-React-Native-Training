import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const setStorageItemAsync = async (key, value) => {
    if (Platform.OS === 'web') {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.error('Local storage error', e);
        }
    } else {
        await SecureStore.setItemAsync(key, value);
    }
};

export const getStorageItemAsync = async (key) => {
    if (Platform.OS === 'web') {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.error('Local storage error', e);
            return null;
        }
    } else {
        return await SecureStore.getItemAsync(key);
    }
};

export const removeStorageItemAsync = async (key) => {
    if (Platform.OS === 'web') {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Local storage error', e);
        }
    } else {
        await SecureStore.deleteItemAsync(key);
    }
};