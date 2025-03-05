import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage = () => {
    const [origin, setOrigin] = useState('');
    const [redirectUri, setRedirectUri] = useState('');
    const { logout } = useAuth();

    const handleSubmit = () => {
        if (!origin || !redirectUri) {
            console.log('Both fields must be filled out.');
            return;
        }
        console.log('Authorized Origin:', origin);
        console.log('Authorized Redirect URI:', redirectUri);
    };

    const handleLogout = async () => {
        try {
            await logout();
            console.log('User logged out successfully.');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings Page</Text>
            <View style={styles.form}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Authorized JavaScript Origin:</Text>
                    <TextInput 
                        style={styles.input}
                        value={origin} 
                        onChangeText={setOrigin}
                        placeholder='Enter your JavaScript origin'
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Authorized Redirect URI:</Text>
                    <TextInput 
                        style={styles.input}
                        value={redirectUri} 
                        onChangeText={setRedirectUri}
                        placeholder='Enter your redirect URI'
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Save Settings</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: 'Inter-Bold',
    },
    form: {
        marginBottom: 20,
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontFamily: 'Inter-Medium',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
    },
    logoutButton: {
        backgroundColor: '#FF5733',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
    }
});

export default SettingsPage;