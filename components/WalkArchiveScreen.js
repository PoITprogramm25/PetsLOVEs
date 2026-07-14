import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  Dimensions
} from 'react-native';
import { usePet } from '../context/PetContext';
import WalkDetailsModal from './WalkDetailsModal';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

const WalkArchiveScreen = ({ navigation }) => {
  const { walks } = usePet();
  const [selectedWalk, setSelectedWalk] = useState(null);
  const [showWalkDetails, setShowWalkDetails] = useState(false);

  const getWalkIcon = (walk) => {
    if (walk.photos && walk.photos.length > 0) {
      return '📸';
    }
    return '🚶';
  };

  const formatDate = (date) => {
    return moment(date).format('DD.MM.YYYY');
  };

  const handleWalkPress = (walk) => {
    setSelectedWalk(walk);
    setShowWalkDetails(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {walks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🚶</Text>
            <Text style={styles.emptyTitle}>Нет прогулок</Text>
            <Text style={styles.emptyText}>
              Добавьте первую прогулку из календаря
            </Text>
          </View>
        ) : (
          walks.map((walk, index) => (
            <TouchableOpacity
              key={walk.id || index}
              style={styles.walkCard}
              onPress={() => handleWalkPress(walk)}
            >
              <View style={styles.walkCardHeader}>
                <Text style={styles.walkIcon}>{getWalkIcon(walk)}</Text>
                <View style={styles.walkCardInfo}>
                  <Text style={styles.walkCardDate}>
                    {formatDate(walk.date)}
                  </Text>
                  {walk.location && (
                    <Text style={styles.walkCardLocation}>
                      📍 {walk.location}
                    </Text>
                  )}
                </View>
                <Text style={styles.walkCardArrow}>›</Text>
              </View>
              {walk.comment && (
                <Text style={styles.walkCardComment} numberOfLines={2}>
                  {walk.comment}
                </Text>
              )}
              {walk.photos && walk.photos.length > 0 && (
                <View style={styles.walkCardPhotos}>
                  <Text style={styles.walkCardPhotosText}>
                    📸 {walk.photos.length} фото
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <WalkDetailsModal
        visible={showWalkDetails}
        walk={selectedWalk}
        onClose={() => {
          setShowWalkDetails(false);
          setSelectedWalk(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  walkCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  walkCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walkIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  walkCardInfo: {
    flex: 1,
  },
  walkCardDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  walkCardLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  walkCardArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  walkCardComment: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  walkCardPhotos: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  walkCardPhotosText: {
    fontSize: 13,
    color: '#4CAF50',
  },
});

export default WalkArchiveScreen;