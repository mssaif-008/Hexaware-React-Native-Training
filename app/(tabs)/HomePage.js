import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { useState, useEffect } from 'react';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getStorageItemAsync, setStorageItemAsync } from '../../utils/storage';

export default function HomePage() {
    const navigation = useNavigation();
    const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

    const [applyStatus, setApplyStatus] = useState({});
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('https://api.joinrise.io/api/v1/jobs/public?page=1&limit=20&sort=asc&sortedBy=createdAt&includeDescription=true&isTrending=true');
                const json = await response.json();

                if (json.success && json.result && json.result.jobs) {
                    const formattedJobs = json.result.jobs.map((job) => ({
                        id: job._id,
                        title: job.title,
                        company: job.owner?.companyName || "Unknown Company",
                        location: job.locationAddress || "Remote",
                        salary: job.descriptionBreakdown?.salaryRangeMinYearly
                            ? `$${Math.round(job.descriptionBreakdown.salaryRangeMinYearly / 1000)}k - $${Math.round(job.descriptionBreakdown.salaryRangeMaxYearly / 1000)}k/yr`
                            : "Salary not specified",
                    }));

                    setJobs(formattedJobs);
                }
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
                Alert.alert("Error", "Could not fetch jobs from the server.");
            } finally {
                setLoading(false);
            }
        };

        const hydrateApplyStatus = async () => {
            try {
                const stored = await getStorageItemAsync('appliedJobs');
                if (stored) {
                    const appliedJobs = JSON.parse(stored);
                    const statusMap = {};
                    appliedJobs.forEach(job => {
                        statusMap[job.id] = "Applied";
                    });
                    setApplyStatus(statusMap);
                }
            } catch (error) {
                console.error("Failed to load applied status:", error);
            }
        };

        fetchJobs();
        hydrateApplyStatus();
    }, []);

    const handleApply = async (item) => {
        setApplyStatus((prev) => ({
            ...prev,
            [item.id]: "Applied",
        }));

        try {
            const stored = await getStorageItemAsync('appliedJobs');
            const appliedJobs = stored ? JSON.parse(stored) : [];
            if (!appliedJobs.find((j) => j.id === item.id)) {
                appliedJobs.push(item);
                await setStorageItemAsync('appliedJobs', JSON.stringify(appliedJobs));
            }
        } catch (error) {
            console.error("Failed to save applied job:", error);
        }

        Alert.alert("Application Successful", `You have applied for the ${item.title} position at ${item.company}.`);
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={openDrawer}>
                <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Available Openings</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Ionicons name="person-circle-outline" size={32} color="#CFFF04" />
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={styles.jobStrip}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.companyText}>{item.company}</Text>
            <View style={styles.jobDetailsRow}>
                <Text style={styles.detailText}>{item.location}</Text>
                <Text style={styles.separatorText}>•</Text>
                <Text style={styles.salaryText}>{item.salary}</Text>
            </View>
            <TouchableOpacity
                style={[styles.applyBtn, applyStatus[item.id] === "Applied" && styles.applyBtnDisabled]}
                onPress={() => handleApply(item)}
                disabled={applyStatus[item.id] === "Applied"}
            >
                <Text style={[styles.applyBtnText, applyStatus[item.id] === "Applied" && styles.applyBtnTextDisabled]}>
                    {applyStatus[item.id] ?? "Apply"}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#CFFF04" />
                    <Text style={styles.loadingText}>Fetching jobs...</Text>
                </View>
            ) : (
                <FlatList
                    data={jobs}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0D0D0D',
    },
    loadingText: {
        fontFamily: 'Inter_400Regular',
        color: '#bbb',
        marginTop: 10,
        fontSize: 16,
    },
    header: {
        paddingTop: 80,
        paddingBottom: 30,
        paddingHorizontal: 20,
        backgroundColor: '#0D0D0D',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'DMSerifDisplay_400Regular',
        fontSize: 32,
        color: '#fff',
    },
    listContent: {
        paddingBottom: 100,
    },
    jobStrip: {
        backgroundColor: '#111',
        padding: 20,
        paddingLeft: 20,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#CFFF04',
    },
    jobTitle: {
        fontFamily: 'Inter_700Bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        fontSize: 14,
        color: '#fff',
        marginBottom: 4,
    },
    companyText: {
        fontFamily: 'DMSerifDisplay_400Regular',
        fontSize: 24,
        color: '#fff',
        marginBottom: 12,
    },
    jobDetailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    detailText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
        color: '#888',
    },
    separatorText: {
        fontSize: 14,
        color: '#333',
        marginHorizontal: 8,
    },
    salaryText: {
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
        color: '#888',
    },
    applyBtn: {
        backgroundColor: '#CFFF04',
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    applyBtnDisabled: {
        backgroundColor: '#1E1E1E',
    },
    applyBtnText: {
        fontFamily: 'Inter_700Bold',
        color: '#0D0D0D',
        textTransform: 'uppercase',
        fontSize: 12,
        letterSpacing: 2,
    },
    applyBtnTextDisabled: {
        color: '#555',
    },
});