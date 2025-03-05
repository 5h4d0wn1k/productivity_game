import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, ChevronRight, Medal, Users, Crown } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { getGlobalLeaderboard, getUserProfile } from '../services/firebase';

interface LeaderboardUser {
  id: string;
  username: string;
  points: number;
  avatar?: string;
  rank?: string;
}

export default function LeaderboardScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('global');
  const [timeFrame, setTimeFrame] = useState('weekly');

  useEffect(() => {
    if (user) {
      loadLeaderboardData();
    }
  }, [user, activeTab, timeFrame]);

  const loadLeaderboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch global leaderboard data
      const leaderboard = await getGlobalLeaderboard();
      
      // Format the data
      const formattedData = leaderboard.map((userData: any) => ({
        id: userData.id,
        username: userData.username || 'Anonymous User',
        points: userData.points || 0,
        avatar: userData.avatar || null,
        rank: getRankFromPoints(userData.points || 0)
      }));
      
      // Sort by points (highest first)
      formattedData.sort((a, b) => b.points - a.points);
      
      setLeaderboardData(formattedData);
      
      // Find current user's rank
      if (user) {
        const userIndex = formattedData.findIndex(item => item.id === user.uid);
        setUserRank(userIndex !== -1 ? userIndex + 1 : null);
      }
    } catch (error) {
      console.error('Error loading leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankFromPoints = (points: number): string => {
    if (points >= 1800) return 'General';
    if (points >= 1500) return 'Colonel';
    if (points >= 1200) return 'Major';
    if (points >= 900) return 'Captain';
    if (points >= 600) return 'Lieutenant';
    if (points >= 300) return 'Sergeant';
    if (points >= 100) return 'Corporal';
    return 'Private';
  };

  const getRankColor = (rank: string): string => {
    switch (rank) {
      case 'General': return '#FFD700'; // Gold
      case 'Colonel': return '#C0C0C0'; // Silver
      case 'Major': return '#CD7F32'; // Bronze
      case 'Captain': return '#9370DB'; // Purple
      case 'Lieutenant': return '#4169E1'; // Royal Blue
      case 'Sergeant': return '#228B22'; // Forest Green
      case 'Corporal': return '#1E90FF'; // Dodger Blue
      default: return '#666666'; // Gray
    }
  };

  const getMedalIcon = (position: number) => {
    if (position === 0) return <Crown size={24} color="#FFD700" />;
    if (position === 1) return <Medal size={24} color="#C0C0C0" />;
    if (position === 2) return <Medal size={24} color="#CD7F32" />;
    return <Text style={styles.rankNumber}>{position + 1}</Text>;
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.message}>Please sign in to view the leaderboard</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'global' && styles.activeTab]}
          onPress={() => setActiveTab('global')}
        >
          <Users size={16} color={activeTab === 'global' ? '#fff' : '#000'} />
          <Text style={[styles.tabText, activeTab === 'global' && styles.activeTabText]}>Global</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Users size={16} color={activeTab === 'friends' ? '#fff' : '#000'} />
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>Friends</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timeFrameContainer}>
        <TouchableOpacity 
          style={[styles.timeFrameOption, timeFrame === 'weekly' && styles.activeTimeFrame]}
          onPress={() => setTimeFrame('weekly')}
        >
          <Text style={[styles.timeFrameText, timeFrame === 'weekly' && styles.activeTimeFrameText]}>Weekly</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.timeFrameOption, timeFrame === 'monthly' && styles.activeTimeFrame]}
          onPress={() => setTimeFrame('monthly')}
        >
          <Text style={[styles.timeFrameText, timeFrame === 'monthly' && styles.activeTimeFrameText]}>Monthly</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.timeFrameOption, timeFrame === 'allTime' && styles.activeTimeFrame]}
          onPress={() => setTimeFrame('allTime')}
        >
          <Text style={[styles.timeFrameText, timeFrame === 'allTime' && styles.activeTimeFrameText]}>All Time</Text>
        </TouchableOpacity>
      </View>

      {userRank !== null && (
        <View style={styles.userRankContainer}>
          <Text style={styles.userRankText}>Your Rank: #{userRank}</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <ScrollView style={styles.leaderboardList}>
          {leaderboardData.length === 0 ? (
            <Text style={styles.noDataText}>No leaderboard data available</Text>
          ) : (
            leaderboardData.map((item, index) => (
              <View 
                key={item.id} 
                style={[
                  styles.leaderboardItem,
                  user && item.id === user.uid && styles.currentUserItem
                ]}
              >
                <View style={styles.rankContainer}>
                  {getMedalIcon(index)}
                </View>
                
                <View style={styles.avatarContainer}>
                  {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.defaultAvatar, { backgroundColor: getRankColor(item.rank || 'Private') }]}>
                      <Text style={styles.avatarInitial}>{item.username.charAt(0).toUpperCase()}</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.userInfoContainer}>
                  <Text style={styles.username}>{item.username}</Text>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>{item.rank}</Text>
                  </View>
                </View>
                
                <View style={styles.pointsContainer}>
                  <Trophy size={16} color="#000" />
                  <Text style={styles.pointsText}>{item.points}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <View style={styles.challengeContainer}>
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeTitle}>Weekly Challenge</Text>
          <TouchableOpacity>
            <ChevronRight size={20} color="#000" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.challengeContent}>
          <View style={styles.challengeIconContainer}>
            <Trophy size={24} color="#FFD700" />
          </View>
          <View style={styles.challengeTextContainer}>
            <Text style={styles.challengeName}>Productivity Master</Text>
            <Text style={styles.challengeDescription}>Complete 20 tasks this week to earn 500 bonus points!</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#000',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#fff',
  },
  timeFrameContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  timeFrameOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  activeTimeFrame: {
    backgroundColor: '#000',
  },
  timeFrameText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#000',
  },
  activeTimeFrameText: {
    color: '#fff',
  },
  userRankContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  userRankText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderboardList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noDataText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  currentUserItem: {
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  rankContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  defaultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#fff',
  },
  userInfoContainer: {
    flex: 1,
  },
  username: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  rankBadge: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  rankText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#666',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  pointsText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#000',
    marginLeft: 4,
  },
  challengeContainer: {
    margin: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000',
  },
  challengeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  challengeTextContainer: {
    flex: 1,
  },
  challengeName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  challengeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
});