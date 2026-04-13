import { View, Text, StyleSheet } from 'react-native';

export default function HelpSupport() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Help & Support</Text>
            <Text style={styles.text}>How can we assist you today?</Text>
            <Text style={styles.subtext}>Contact us at support@joinrise.io</Text>
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
        color: '#CFFF04', 
        fontSize: 32, 
        marginBottom: 16 
    },
    text: { 
        fontFamily: 'Inter_400Regular', 
        color: '#fff', 
        fontSize: 18,
        marginBottom: 10
    },
    subtext: {
        fontFamily: 'Inter_400Regular', 
        color: '#bbb', 
        fontSize: 14,
    }
});
