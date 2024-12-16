import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Easing } from 'react-native';

const ROW_HEIGHT = 60;
const VISIBLE_ITEMS = 3;
const ANIMATION_DURATION = 300;
const STEP_DELAY = 100;
const { width } = Dimensions.get('window');

export default function IncrementalRankChangeAnimation() {
  const oldRank = 100;
  const newRank = 4;
  const [currentRank, setCurrentRank] = useState(oldRank);
  
  const userPosition = useRef(new Animated.Value(0)).current;
  const otherPosition = useRef(new Animated.Value(0)).current;
  const bottomRowOpacity = useRef(new Animated.Value(1)).current;

  const [visibleRanks, setVisibleRanks] = useState([
    { rank: oldRank - 1, id: `${oldRank - 1}` },
    { rank: oldRank, id: `${oldRank}`, isUser: true },
    { rank: oldRank + 1, id: `${oldRank + 1}` }
  ]);

  useEffect(() => {
    if (currentRank > newRank) {
      startClimbingAnimation();
    }
  }, [currentRank]);

  const startClimbingAnimation = () => {
    userPosition.setValue(0);
    otherPosition.setValue(0);
    bottomRowOpacity.setValue(1);

    Animated.parallel([
      // User row jumps up
      Animated.sequence([
        Animated.timing(userPosition, {
          toValue: -ROW_HEIGHT,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
        Animated.spring(userPosition, {
          toValue: -ROW_HEIGHT,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),

      // Other rows slide down
      Animated.timing(otherPosition, {
        toValue: ROW_HEIGHT,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),

      // Bottom row fades out
      Animated.timing(bottomRowOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => updateRanks(), STEP_DELAY);
    });
  };

  const updateRanks = () => {
    const nextRank = currentRank - 1;
    setCurrentRank(nextRank);
    setVisibleRanks([
      { rank: nextRank - 1, id: `${nextRank - 1}` },
      { rank: nextRank, id: `${nextRank}`, isUser: true },
      { rank: nextRank + 1, id: `${nextRank + 1}` }
    ]);
    userPosition.setValue(0);
    otherPosition.setValue(0);
    bottomRowOpacity.setValue(1);
  };

  const renderRow = (rank, index) => {
    const translateY = rank.isUser ? userPosition : otherPosition;
    const opacity = index === 2 ? bottomRowOpacity : 1;

    return (
      <Animated.View
        key={`rank-${rank.id}`}
        style={[
          styles.row,
          rank.isUser && styles.userRow,
          {
            transform: [{ translateY }],
            opacity,
            position: 'absolute',
            top: index * ROW_HEIGHT,
            width: '90%',
          }
        ]}
      >
        <View style={styles.rankContainer}>
          <View style={styles.rankLeftSection}>
            <Text style={[styles.rankNumber, rank.isUser && styles.userText]}>
              {rank.rank}.
            </Text>
            <Text style={[styles.playerName, rank.isUser && styles.userText]}>
              {rank.isUser ? 'Player Name2733' : `Player ${Math.floor(Math.random() * 900000)}`}
            </Text>
          </View>
          <View style={styles.bonusContainer}>
            <Text style={[styles.bonusText, rank.isUser && styles.userBonusText]}>
              ${Math.floor(Math.random() * 20 + 5)}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.rankListContainer}>
        {visibleRanks.map((rank, index) => renderRow(rank, index))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankListContainer: {
    height: ROW_HEIGHT * VISIBLE_ITEMS,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
  },
  row: {
    height: ROW_HEIGHT,
    backgroundColor: '#2A2A3E',
    borderRadius: 8,
    padding: 16,
    marginVertical: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userRow: {
    backgroundColor: '#2A2A3E',
    borderWidth: 1,
    borderColor: '#6C47FF',
    shadowColor: '#6C47FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rankLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.7,
    marginRight: 8,
  },
  playerName: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  userText: {
    opacity: 1,
    fontWeight: '500',
  },
  bonusContainer: {
    marginLeft: 'auto',
  },
  bonusText: {
    color: '#FFFFFF',
    opacity: 0.7,
    fontSize: 16,
  },
  userBonusText: {
    opacity: 1,
    fontWeight: '500',
    color: '#6C47FF',
  }
});