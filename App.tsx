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
const VIEWPORT_HEIGHT =
  ITEM_HEIGHT * VISIBLE_ITEMS + ITEM_MARGIN * (VISIBLE_ITEMS - 1);

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
  const [status, setStatus] = useState('before'); //before, running, after
  const scrollY = useRef(new Animated.Value(0)).current;
  const bounceAnim1 = useRef(new Animated.Value(1)).current;
  const [data] = useState<RankItem[]>(
    Array(20)
      .fill(0)
      .map((_, i) => ({
        id: i + 1,
        rank: i + 1,
        name: i === 12 ? '13th player' : `Player ${i + 1}`,
        score: '434,000',
        bonus: '$12',
        isUser: i === 12,
      })),
  );
  console.log(
    '🚀 ~ App ~ data:',
    data.filter(item => item.rank >= 7 && item.rank <= 14),
  );
  useEffect(() => {
    scrollY.addListener(({value}) => {
      // Calculate the scale factor based on scroll position and time
      const scaleFactor = 1 + (value / 100) * 0.2; // Adjust the scaling factor as needed
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
        toValue: 3 * (ITEM_HEIGHT + ITEM_MARGIN),
        duration: 2000,
        useNativeDriver: true,
      }).start();

      // bounce animation for rank 13  while scrolling whenever it hovers other ranks
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 8,
            duration: 500,
            useNativeDriver: true,
          }),
          // height a bit bigger and samller to make it bounce effect
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
      // stop bounce animation after 2 seconds
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
          return new Promise((resolve, reject) => {
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

      // stop bounce animation after 2 seconds
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
    const translateY = scrollAnim.interpolate({
      inputRange: [
        0,
        ITEM_HEIGHT + ITEM_MARGIN,
        3 * (ITEM_HEIGHT + ITEM_MARGIN),
      ],
      outputRange: [
        0,
        ITEM_HEIGHT + ITEM_MARGIN,
        1 * (ITEM_HEIGHT + ITEM_MARGIN),
      ],
    });

    const bounceTranslateY = bounceAnim.interpolate({
      inputRange: [0, 8],
      outputRange: [0, 8], // Bounce height
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
              {translateY: item.rank === 13 ? 0 : bounceTranslateY},
            ],
          },
        ]}>
        <View style={styles.rankContent}>
          {item.rank === 13 ? null : (
            <>
              <Text>{item.rank}</Text>
              <View style={styles.playerInfo}>
                <Text
                  style={[
                    styles.nameText,
                    item.rank === 13 && styles.rank13Text,
                  ]}>
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.scoreText,
                    item.rank === 13 && styles.rank13Text,
                  ]}>
                  {item.score}
                </Text>
              </View>
              <View
                style={[
                  styles.bonusContainer,
                  item.rank === 13 && styles.rank13BonusContainer,
                ]}>
                <Text
                  style={[
                    styles.bonusText,
                    item.rank === 13 && styles.rank13BonusText,
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
          // {
          //   height: ITEM_HEIGHT * 1.1,
          // },
          {
            transform: [{scale: bounceAnim1}],
          },
        ]}>
        <View style={styles.rankContent}>
          <Text>{item.rank}</Text>
          <View style={styles.playerInfo}>
            <Text
              style={[styles.nameText, item.rank === 13 && styles.rank13Text]}>
              {item.name}
            </Text>
            <Text
              style={[styles.scoreText, item.rank === 13 && styles.rank13Text]}>
              {item.score}
            </Text>
          </View>
          <View
            style={[
              styles.bonusContainer,
              item.rank === 13 && styles.rank13BonusContainer,
            ]}>
            <Text
              style={[
                styles.bonusText,
                item.rank === 13 && styles.rank13BonusText,
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
          {data
            .filter(item => item.rank >= 7 && item.rank <= 14)
            .map(item => {
              return renderRankItem(item);
            })}
        </Animated.View>
        {renderMyRank(data.find(item => item.rank === 13)!)}
      </View>
      <TouchableOpacity
        onPress={() => {
          onStartAnimate();
        }}>
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
    top: -(5 * (ITEM_HEIGHT + ITEM_MARGIN)),
  },
  rankItem: {
    height: ITEM_HEIGHT,
    // backgroundColor: '#1A1A2E',
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
