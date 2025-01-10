import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const {width, height} = Dimensions.get('window');
const ITEM_HEIGHT = 60;
const ITEM_MARGIN = 8;
const VISIBLE_ITEMS = 3;
const VIEWPORT_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS + ITEM_MARGIN * (VISIBLE_ITEMS - 1);

// Rank configuration
const USER_RANK = 13;      // User's current rank
const TARGET_RANK = 10;    // Rank where user will move to
const TOTAL_RANKS = 20;    // Total number of ranks

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
  const [status, setStatus] = useState('before');
  const scrollY = useRef(new Animated.Value(0)).current;
  const bounceAnim1 = useRef(new Animated.Value(1)).current;
  
  const [data] = useState<RankItem[]>(
    Array(TOTAL_RANKS)
      .fill(0)
      .map((_, i) => ({
        id: i + 1,
        rank: i + 1,
        name: i === (USER_RANK - 1) ? `${USER_RANK}th player` : `Player ${i + 1}`,
        score: '434,000',
        bonus: '$12',
        isUser: i === (USER_RANK - 1),
      })),
  );

  useEffect(() => {
    scrollY.addListener(({value}) => {
      const scaleFactor = 1 + (value / 100) * 0.2;
      Animated.timing(bounceAnim, {
        toValue: scaleFactor,
        duration: 3000,
        useNativeDriver: true,
      }).start();
    });
  }, [scrollY]);

  const onStartAnimate = () => {
    setTimeout(() => {
      // Main scroll animation
      Animated.timing(scrollAnim, {
        toValue: (USER_RANK - TARGET_RANK -1) * (ITEM_HEIGHT + ITEM_MARGIN),
        duration: 2000,
        useNativeDriver: true,
      }).start();

      // bounce animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 8,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      setTimeout(() => {
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }, 2000);

      const bounceAnim1Steps = Array(10)
        .fill(0)
        .map((_, i) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              Animated.timing(bounceAnim1, {
                toValue: i % 2 === 0 ? 1.1 : 1,
                duration: 1000 / 10,
                useNativeDriver: true,
              }).start(() => {
                resolve({status: 'done'});
              });
            }, i * 200);
          });
        });

      Promise.all(bounceAnim1Steps).then(() => {
        setTimeout(() => {
          Animated.timing(bounceAnim1, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }).start();
        }, 2000);
      });

      setTimeout(() => {
        Animated.timing(bounceAnim1, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }, 2000);
    }, 1000);
  };

  const renderRankItem = (item: RankItem) => {
    const TotalJumps = (USER_RANK - TARGET_RANK ) * (ITEM_HEIGHT + ITEM_MARGIN);
    const ItemHeightIncludingMargin = ITEM_HEIGHT + ITEM_MARGIN;

    const translateY = scrollAnim.interpolate({
      inputRange: [
        0,
        ItemHeightIncludingMargin,
        TotalJumps,
      ],
      outputRange: [
        0,
        ItemHeightIncludingMargin,
        1*ItemHeightIncludingMargin,
      ],
    });

    const bounceTranslateY = bounceAnim.interpolate({
      inputRange: [0, 8],
      outputRange: [0, 8],
    });

    Animated.spring(bounceAnim, {
      toValue: 1.1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();

    const animatedStyle = {
      transform: [{scale: bounceAnim}],
    };
    
    return (
      <Animated.View
        key={item.id}
        style={[
          styles.rankItem,
          animatedStyle,
          {
            transform: [
              {translateY: translateY},
              {translateY: item.rank === USER_RANK ? 0 : bounceTranslateY},
            ],
          },
        ]}>
        <View style={styles.rankContent}>
          {item.rank === USER_RANK ? null : (
            <>
              <Text>{item.rank}</Text>
              <View style={styles.playerInfo}>
                <Text
                  style={[
                    styles.nameText,
                    item.rank === USER_RANK && styles.rank13Text,
                  ]}>
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.scoreText,
                    item.rank === USER_RANK && styles.rank13Text,
                  ]}>
                  {item.score}
                </Text>
              </View>
              <View
                style={[
                  styles.bonusContainer,
                  item.rank === USER_RANK && styles.rank13BonusContainer,
                ]}>
                <Text
                  style={[
                    styles.bonusText,
                    item.rank === USER_RANK && styles.rank13BonusText,
                  ]}>
                  BONUS {item.bonus}
                </Text>
              </View>
            </>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderMyRank = (item: RankItem) => {
    return (
      <Animated.View
        key={item.id}
        style={[
          styles.rankItem,
          styles.rank13Item,
          {
            transform: [{scale: bounceAnim1}],
          },
        ]}>
        <View style={styles.rankContent}>
          <Text>{item.rank}</Text>
          <View style={styles.playerInfo}>
            <Text
              style={[styles.nameText, item.rank === USER_RANK && styles.rank13Text]}>
              {item.name}
            </Text>
            <Text
              style={[styles.scoreText, item.rank === USER_RANK && styles.rank13Text]}>
              {item.score}
            </Text>
          </View>
          <View
            style={[
              styles.bonusContainer,
              item.rank === USER_RANK && styles.rank13BonusContainer,
            ]}>
            <Text
              style={[
                styles.bonusText,
                item.rank === USER_RANK && styles.rank13BonusText,
              ]}>
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
              transform: [{translateY: scrollAnim}],
            },
          ]}>
          {data.map(item => renderRankItem(item))}
        </Animated.View>
        {renderMyRank(data.find(item => item.rank === USER_RANK)!)}
      </View>
      <TouchableOpacity onPress={onStartAnimate}>
        <Text
          style={{
            textAlign: 'center',
            color: '#FFFFFF',
            fontSize: 24,
            marginTop: 100,
          }}>
          Start
        </Text>
      </TouchableOpacity>
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
    backgroundColor: 'grey',
  },
  scrollContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: (-(USER_RANK - 2) * (ITEM_HEIGHT + ITEM_MARGIN)),
  },
  rankItem: {
    height: ITEM_HEIGHT,
    backgroundColor: 'blue',
    marginLeft: 30,
    marginHorizontal: 20,
    marginVertical: ITEM_MARGIN / 2,
    borderRadius: 8,
  },
  rank13Item: {
    position: 'absolute',
    left: -20,
    right: 0,
    top: ITEM_HEIGHT + ITEM_MARGIN,
    backgroundColor: '#2A2A3E',
    borderWidth: 1,
    borderColor: '#4CAF50',
    transform: [{scale: 1.1}],
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