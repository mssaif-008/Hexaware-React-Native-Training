import { View, Text, StyleSheet } from 'react-native';

export default function Settings() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.text}>App configuration and preferences will appear here.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#0D0D0D', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 20
    },
    title: { 
        fontFamily: 'DMSerifDisplay_400Regular', 
        color: '#fff', 
        fontSize: 32, 
        marginBottom: 16 
    },
    text: { 
        fontFamily: 'Inter_400Regular', 
        color: '#bbb', 
        fontSize: 16,
        textAlign: 'center'
    },
});
