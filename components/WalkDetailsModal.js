import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

const { width } = Dimensions.get('window');

const WalkDetailsModal = ({ visible, walk, onClose }) => {
  const [showFullComment, setShowFullComment] = useState(false);

  if (!walk) return null;

  const formatDate = (date) => {
    return moment(date).format('DD MMMM YYYY, HH:mm');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackground} 
          activeOpacity={1} 
          onPress={onClose}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🚶 Прогулка</Text>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.detailText}>
                📅 {formatDate(walk.date)}
              </Text>
              
              {walk.location && (
                <Text style={styles.detailText}>
                  📍 {walk.location}
                </Text>
              )}

              {walk.comment && (
                <View style={styles.commentContainer}>
                  <Text style={styles.commentLabel}>💬 Комментарий:</Text>
                  <Text 
                    style={styles.commentText}
                    numberOfLines={showFullComment ? undefined : 3}
                  >
                    {walk.comment}
                  </Text>
                  {walk.comment.length > 100 && (
                    <TouchableOpacity onPress={() => setShowFullComment(!showFullComment)}>
                      <Text style={styles.showMoreText}>
                        {showFullComment ? 'Свернуть' : 'Показать полностью'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {walk.photos && walk.photos.length > 0 && (
                <View style={styles.photosContainer}>
                  <Text style={styles.photosTitle}>
                    📸 Фотографии ({walk.photos.length})
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {walk.photos.map((photo, index) => (
                      <View key={index} style={styles.photoCard}>
                        <Image source={{ uri: photo }} style={styles.photoImage} />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View style={styles.metaInfo}>
                <Text style={styles.metaText}>
                  Создано: {moment(walk.createdAt).format('DD.MM.YYYY HH:mm')}
                </Text>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(5px)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    backgroundColor: '#90EE90',
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 24,
  },
  commentContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  showMoreText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginTop: 4,
  },
  photosContainer: {
    marginTop: 12,
  },
  photosTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  photoCard: {
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  photoImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  metaInfo: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  metaText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  closeButton: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});

export default WalkDetailsModal;