# Rank Animation Logic

## Core Variables
const ITEM_HEIGHT = 60; // Height of each rank item (pixels)
const ITEM_MARGIN = 8; // Margin between items (pixels)
const USER_RANK = 13; // Starting position
const TARGET_RANK = 10; // Target position
const TOTAL_RANKS = 20; // Total number of ranks in leaderboard


## Animation Calculation

The total movement distance is calculated using:
const movement = (USER_RANK - TARGET_RANK - 1) (ITEM_HEIGHT + ITEM_MARGIN) 
// (13 - 10 - 1) (60 + 8)
// 2 68
// = 136 pixels upward


## Visual Movement Sequence

### Initial Position

[Rank 8]
[Rank 9]
[Rank 10]
[Rank 11]
[Rank 12]
[USER RANK 13] <- Fixed at 68px from top
[Rank 14]
[Rank 15]

Final Position:
[Rank 8]
[Rank 9]
[USER RANK 13] <- Maintains fixed position
[Rank 10]
[Rank 11]
[Rank 12]
[Rank 14]
[Rank 15]

## Animation Implementation
// Main scroll animation
Animated.timing(scrollAnim, {
toValue: (USER_RANK - TARGET_RANK - 1) (ITEM_HEIGHT + ITEM_MARGIN),
duration: 2000,
useNativeDriver: true,
}).start();




## Key Animation Features

1. **Fixed Position**: User's rank card stays visually fixed while other ranks slide
2. **Movement Distance**: 136 pixels (2 positions × 68 pixels per position)
3. **Duration**: 2 seconds for complete animation
4. **Visual Effects**:
   - Bounce animation for transitioning ranks
   - Scale effects for emphasis
   - Smooth easing for natural movement

## Animation Flow

1. User triggers animation via "Start" button
2. Other rank items slide downward
3. Bounce effects activate during transition
4. Animation completes with user at new rank position
5. Final bounce effect for visual confirmation

## Technical Notes

- Uses React Native's Animated API
- Implements native driver for performance
- Maintains 60fps smooth animation
- Handles dynamic rank positions
- Supports variable item heights and margins