import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Award, Zap, ChevronRight, Shield, Sword, Shirt } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, getCharacterStats, getUserRank, signOut } from '../services/firebase';

const getRank = (score: number): string => {
  if (score <= 100) return 'Private';
  if (score <= 300) return 'Corporal';
  if (score <= 600) return 'Sergeant';
  if (score <= 900) return 'Lieutenant';
  if (score <= 1200) return 'Captain';
  if (score <= 1500) return 'Major';
  if (score <= 1800) return 'Colonel';
  return 'General';
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [characterStats, setCharacterStats] = useState<any>({
    level: 1,
    experience: 0,
    nextLevel: 100,
    stats: {
      strength: 10,
      intelligence: 10,
      creativity: 10,
      focus: 10
    }
  });
  const [userRank, setUserRank] = useState<string>('Private');
  
  const achievements = [
    { id: '1', title: 'Task Master', description: 'Complete 100 tasks', progress: 78, icon: <Zap size={20} color="#000" /> },
    { id: '2', title: 'Workout Warrior', description: 'Log 30 workout sessions', progress: 100, icon: <Shield size={20} color="#000" /> },
    { id: '3', title: 'Early Bird', description: 'Complete 20 tasks before 9 AM', progress: 45, icon: <Award size={20} color="#000" /> },
  ];
  
  const inventory = [
    { id: '1', name: 'Legendary Sword', type: 'weapon', rarity: 'Legendary', icon: <Sword size={20} color="#000" /> },
    { id: '2', name: 'Epic Shield', type: 'armor', rarity: 'Epic', icon: <Shield size={20} color="#000" /> },
    { id: '3', name: 'Mystic Robe', type: 'outfit', rarity: 'Rare', icon: <Shirt size={20} color="#000" /> },
  ];

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user profile
      const profile = await getUserProfile(user!.uid);
      setUserProfile(profile);
      
      // Load character stats
      const stats = await getCharacterStats(user!.uid);
      if (stats) {
        const level = Math.floor(Math.sqrt((profile?.points || 0) / 10)) + 1;
        const experience = profile?.points || 0;
        const nextLevel = Math.pow(level + 1, 2) * 10;
        
        setCharacterStats({
          level,
          experience,
          nextLevel,
          stats: stats.stats || {
            strength: 10,
            intelligence: 10,
            creativity: 10,
            focus: 10
          }
        });
      }
      
      // Load user rank
      const rankData = await getUserRank(user!.uid);
      if (rankData) {
        setUserRank(rankData.rank);
      } else {
        setUserRank(getRank(profile?.points || 0));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.message}>Please sign in to view your profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={handleLogout}>
          <Settings size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileHeader}>
          {user && user.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.characterImage} />
          ) : (
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=500&auto=format&fit=crop' }} 
              style={styles.characterImage} 
            />
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.username}>{userProfile?.username || user.displayName || 'Adventurer'}</Text>
            <Text style={styles.levelText}>Level {characterStats.level}</Text>
            
            <View style={styles.experienceContainer}>
              <View style={styles.experienceBar}>
                <View 
                  style={[
                    styles.experienceFill, 
                    { width: `${(characterStats.experience / characterStats.nextLevel) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.experienceText}>
                {characterStats.experience} / {characterStats.nextLevel} XP
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rankSection}>
          <View style={styles.rankCard}>
            <Text style={styles.rankTitle}><Award size={20} color="#000" /> Your Rank</Text>
            <Text style={styles.rankText}>{userRank}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Character Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Strength</Text>
              <View style={styles.statBarContainer}>
                <View style={[styles.statBar, { width: `${characterStats.stats.strength}%` }]} />
              </View>
              <Text style={styles.statValue}>{characterStats.stats.strength}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Intelligence</Text>
              <View style={styles.statBarContainer}>
                <View style={[styles.statBar, { width: `${characterStats.stats.intelligence}%` }]} />
              </View>
              <Text style={styles.statValue}>{characterStats.stats.intelligence}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Creativity</Text>
              <View style={styles.statBarContainer}>
                <View style={[styles.statBar, { width: `${characterStats.stats.creativity}%` }]} />
              </View>
              <Text style={styles.statValue}>{characterStats.stats.creativity}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Focus</Text>
              <View style={styles.statBarContainer}>
                <View style={[styles.statBar, { width: `${characterStats.stats.focus}%` }]} />
              </View>
              <Text style={styles.statValue}>{characterStats.stats.focus}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {achievements.map(achievement => (
            <View key={achievement.id} style={styles.achievementItem}>
              <View style={styles.achievementIcon}>
                {achievement.icon}
              </View>
              
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
                
                <View style={styles.achievementProgress}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${achievement.progress}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>{achievement.progress}%</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Inventory</Text>
            <TouchableOpacity>
              <ChevronRight size={20} color="#000" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inventoryGrid}>
            {inventory.map(item => (
              <TouchableOpacity key={item.id} style={styles.inventoryItem}>
                <View style={styles.inventoryIcon}>
                  {item.icon}
                </View>
                <Text style={styles.inventoryName}>{item.name}</Text>
                <Text style={[
                  styles.inventoryRarity,
                  item.rarity === 'Legendary' && styles.legendaryText,
                  item.rarity === 'Epic' && styles.epicText,
                  item.rarity === 'Rare' && styles.rareText,
                ]}>
                  {item.rarity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.enterMetaSpaceButton}>
          <Text style={styles.enterMetaSpaceText}>Enter Meta Space</Text>
        </TouchableOpacity>
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#000',
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  characterImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#000',
    marginBottom: 4,
  },
  levelText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  experienceContainer: {
    marginTop: 4,
  },
  experienceBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  experienceFill: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 4,
  },
  experienceText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000',
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
  },
  statsGrid: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666',
    width: 100,
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  statBar: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 4,
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#000',
    width: 30,
    textAlign: 'right',
  },
  achievementItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  achievementDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#666',
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  inventoryItem: {
    width: '33.33%',
    padding: 8,
  },
  inventoryIcon: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  inventoryName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  inventoryRarity: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  legendaryText: {
    color: '#FFD700',
    fontFamily: 'Inter-SemiBold',
  },
  epicText: {
    color: '#9370DB',
    fontFamily: 'Inter-SemiBold',
  },
  rareText: {
    color: '#4169E1',
    fontFamily: 'Inter-SemiBold',
  },
  enterMetaSpaceButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  enterMetaSpaceText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  rankSection: {
    marginBottom: 24,
  },
  rankCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 16,
  },
  rankTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000',
    marginBottom: 8,
  },
  rankText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#000',
  },
});