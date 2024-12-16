import React, { useRef, useEffect, useState } from 'react';
import { View, Animated, StyleSheet, Text, SafeAreaView, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const ITEM_HEIGHT = 60;
const ITEM_MARGIN = 4;
const VISIBLE_ITEMS = 3;
const VIEWPORT_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS + ITEM_MARGIN * (VISIBLE_ITEMS - 1);

interface RankItem {
  id: number;
  rank: number;
  name: string;
  score: string;
  bonus: string;
  isUser: boolean;
}

export default function App() {
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const [data] = useState<RankItem[]>(
    Array(20).fill(0).map((_, i) => ({
      id: i + 1,
      rank: i + 1,
      name: i === 12 ? "Kmonkey11" : `Player ${i + 1}`,
      score: "434,000",
      bonus: "$12",
      isUser: i === 12
    }))
  );

  useEffect(() => {
    setTimeout(() => {
      // Main scroll animation
      Animated.timing(scrollAnim, {
        toValue: (13 - 7) * (ITEM_HEIGHT + ITEM_MARGIN),
        duration: 1000,
        useNativeDriver: true,
      }).start();

      // Continuous bounce animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.spring(bounceAnim, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          })
        ])
      ).start();
    }, 1000);
  }, []);

  const renderRankItem = (item: RankItem) => {
    const translateY = scrollAnim.interpolate({
      inputRange: [0, (13 - 7) * (ITEM_HEIGHT + ITEM_MARGIN)],
      outputRange: [0, (13 - 7) * (ITEM_HEIGHT + ITEM_MARGIN)],
    });

    const bounceTranslateY = bounceAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 8], // Bounce height
    });

    return (
      <Animated.View
        key={item.id}
        style={[
          styles.rankItem,
          item.rank === 13 && styles.rank13Item,
          {
            transform: [
              { translateY: item.rank === 13 ? 0 : translateY },
              { translateY: item.rank === 13 ? 0 : bounceTranslateY }
            ]
          }
        ]}
      >
        <View style={styles.rankContent}>
          <Text style={[styles.rankText, item.rank === 13 && styles.rank13Text]}>
            {item.rank}
          </Text>
          <View style={styles.playerInfo}>
            <Text style={[styles.nameText, item.rank === 13 && styles.rank13Text]}>
              {item.name}
            </Text>
            <Text style={[styles.scoreText, item.rank === 13 && styles.rank13Text]}>
              {item.score}
            </Text>
          </View>
          <View style={[styles.bonusContainer, item.rank === 13 && styles.rank13BonusContainer]}>
            <Text style={[styles.bonusText, item.rank === 13 && styles.rank13BonusText]}>
              BONUS {item.bonus}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.viewportContainer}>
        <Animated.View
          style={[
            styles.scrollContainer,
            {
              transform: [{ translateY: scrollAnim }]
            }
          ]}
        >
          {data
            .filter(item => item.rank >= 7 && item.rank <= 14)
            .sort((a, b) => a.rank - b.rank)
            .map(item => {
              if (item.rank === 13) return null;
              return renderRankItem(item);
            })}
        </Animated.View>
        {renderRankItem(data.find(item => item.rank === 13)!)}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1E',
    justifyContent: 'center',
  },
  viewportContainer: {
    height: VIEWPORT_HEIGHT,
    overflow: 'hidden',
  },
  scrollContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -(12 * (ITEM_HEIGHT + ITEM_MARGIN)),
  },
  rankItem: {
    height: ITEM_HEIGHT,
    backgroundColor: '#1A1A2E',
    marginHorizontal: 16,
    marginVertical: ITEM_MARGIN / 2,
    borderRadius: 8,
  },
  rank13Item: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: ITEM_HEIGHT + ITEM_MARGIN,
    backgroundColor: '#2A2A3E',
    borderWidth: 1,
    borderColor: '#4CAF50',
    transform: [{ scale: 1.1 }],
    zIndex: 1,
  },
  rankContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: '100%',
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 14,
    width: 30,
    opacity: 0.7,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 8,
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.7,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  rank13Text: {
    opacity: 1,
    fontWeight: '500',
  },
  bonusContainer: {
    backgroundColor: '#2A2A3E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rank13BonusContainer: {
    backgroundColor: '#1A1A2E',
  },
  bonusText: {
    color: '#6C47FF',
    fontSize: 12,
  },
  rank13BonusText: {
    color: '#4CAF50',
  },
});