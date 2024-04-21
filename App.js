import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, PanResponder } from 'react-native';

const Game = () => {
  const [items, setItems] = useState([]);

  const handleAddRedItem = ({ nativeEvent }) => {
    const newItem = { id: Date.now(), color: 'red', position: { x: nativeEvent.locationX + 50, y: nativeEvent.locationY + 50 } };
    setItems(prevItems => [...prevItems, newItem]);
  };

  const mergeItems = (itemId1, itemId2) => {
    const item1 = items.find(item => item.id === itemId1);
    const item2 = items.find(item => item.id === itemId2);
    const newItem = {
      id: Date.now(),
      color: 'blue',
      position: {
        x: (item1.position.x + item2.position.x) / 2,
        y: (item1.position.y + item2.position.y) / 2
      }
    };
    setItems(prevItems => [...prevItems.filter(item => item.id !== itemId1 && item.id !== itemId2), newItem]);
  };

  const handleMergeBlueItems = (itemId1, itemId2) => {
    const item1 = items.find(item => item.id === itemId1);
    const item2 = items.find(item => item.id === itemId2);
    const newItem = {
      id: Date.now(),
      color: 'green',
      position: {
        x: (item1.position.x + item2.position.x) / 2,
        y: (item1.position.y + item2.position.y) / 2
      }
    };
    setItems(prevItems => [...prevItems.filter(item => item.id !== itemId1 && item.id !== itemId2), newItem]);
  };

  const handleMoveStart = itemId => {
    const newItems = items.map(item =>
      (item.id === itemId)
        ? { ...item, isMoving: true }
        : item
    );
    setItems(newItems);
  };

  const handleMoveEnd = () => {
    setItems(prevItems =>
      prevItems.map(item =>
        (item.isMoving)
          ? { ...item, isMoving: false }
          : item
      )
    );

    items.forEach((item1, index1) => {
      items.slice(index1 + 1).forEach(item2 => {
        const item1CenterX = item1.position.x + 20;
        const item1CenterY = item1.position.y + 20;
        const item2CenterX = item2.position.x + 20;
        const item2CenterY = item2.position.y + 20;
        const distance = Math.sqrt(Math.pow(item1CenterX - item2CenterX, 2) + Math.pow(item1CenterY - item2CenterY, 2));
        if (item1.color === 'blue' && item2.color === 'blue' && distance < 40) { // If the distance between the centers of two blue items is less than their radius (40)
          handleMergeBlueItems(item1.id, item2.id);
        }
        if (item1.color === 'red' && item2.color === 'red' && distance < 40) { // If the distance between the centers of two red items is less than their radius (40)
          mergeItems(item1.id, item2.id);
        }
      });
    });
  };

  const handleMoveItem = (itemId, { moveX, moveY }) => {
    setItems(prevItems =>
      prevItems.map(item =>
        (item.id === itemId && item.isMoving)
          ? { ...item, position: { x: moveX - 20, y: moveY - 20 } }
          : item
      )
    );
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      const touchedItem = items.find(item =>
        gestureState.x0 >= item.position.x &&
        gestureState.x0 <= item.position.x + 40 &&
        gestureState.y0 >= item.position.y &&
        gestureState.y0 <= item.position.y + 40
      );
      if (touchedItem) {
        handleMoveStart(touchedItem.id);
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      items.forEach(item => {
        if (item.isMoving) {
          handleMoveItem(item.id, gestureState);
        }
      });
    },
    onPanResponderRelease: () => {
      handleMoveEnd();
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.gameContainer}>
        {items.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.item,
              { backgroundColor: item.color, left: item.position.x, top: item.position.y },
            ]}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAddRedItem}>
        <View style={styles.buttonInner} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameContainer: {
    flex: 1,
    width: '100%',
  },
  item: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    zIndex: 1,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});

export default Game;
