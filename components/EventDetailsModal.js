import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions
} from 'react-native';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

const EventDetailsModal = ({ visible, event, onClose }) => {
  const [showFullComment, setShowFullComment] = useState(false);

  if (!event) return null;

  const getHeaderColor = (type) => {
    switch(type) {
      case 'vet': return '#87CEEB';
      case 'groomer': return '#FFB6C1';
      case 'walk': return '#90EE90';
      default: return '#ccc';
    }
  };

  const getTitle = (type) => {
    switch(type) {
      case 'vet': return 'Приём у ветеринара';
      case 'groomer': return 'Приём к грумеру';
      case 'walk': return 'Прогулка';
      default: return 'Событие';
    }
  };

  const getTextColor = (type) => {
    return type === 'walk' ? '#333' : '#fff';
  };

  const renderVetContent = () => (
    <>
      <Text style={styles.detailText}>
        🕐 {moment(event.date).format('DD.MM.YYYY, HH:mm')}
      </Text>
      {event.address && (
        <Text style={styles.detailText}>📍 {event.address}</Text>
      )}
      {event.phone && (
        <Text style={styles.detailText}>📞 {event.phone}</Text>
      )}
      {event.comment && (
        <TouchableOpacity onPress={() => setShowFullComment(!showFullComment)}>
          <Text style={styles.commentLabel}>💬 Комментарий:</Text>
          <Text 
            style={styles.commentText}
            numberOfLines={showFullComment ? undefined : 2}
          >
            {event.comment}
          </Text>
          {event.comment.length > 50 && (
            <Text style={styles.showMoreText}>
              {showFullComment ? 'Свернуть' : 'Показать полностью'}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </>
  );

  const renderGroomerContent = () => (
    <>
      <Text style={[styles.detailText, { color: '#333' }]}>
        🕐 {moment(event.date).format('DD.MM.YYYY, HH:mm')}
      </Text>
      {event.address && (
        <Text style={[styles.detailText, { color: '#333' }]}>📍 {event.address}</Text>
      )}
      {event.phone && (
        <Text style={[styles.detailText, { color: '#333' }]}>📞 {event.phone}</Text>
      )}
      {event.comment && (
        <TouchableOpacity onPress={() => setShowFullComment(!showFullComment)}>
          <Text style={[styles.commentLabel, { color: '#333' }]}>💬 Комментарий:</Text>
          <Text 
            style={[styles.commentText, { color: '#555' }]}
            numberOfLines={showFullComment ? undefined : 2}
          >
            {event.comment}
          </Text>
          {event.comment.length > 50 && (
            <Text style={[styles.showMoreText, { color: '#666' }]}>
              {showFullComment ? 'Свернуть' : 'Показать полностью'}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </>
  );

  const renderWalkContent = () => (
    <>
      <Text style={styles.detailText}>
        📅 {moment(event.date).format('DD.MM.YYYY')}
      </Text>
      {event.location && (
        <Text style={styles.detailText}>📍 {event.location}</Text>
      )}
      {event.comment && (
        <TouchableOpacity onPress={() => setShowFullComment(!showFullComment)}>
          <Text style={styles.commentLabel}>💬 Комментарий:</Text>
          <Text 
            style={styles.commentText}
            numberOfLines={showFullComment ? undefined : 2}
          >
            {event.comment}
          </Text>
          {event.comment.length > 50 && (
            <Text style={styles.showMoreText}>
              {showFullComment ? 'Свернуть' : 'Показать полностью'}
            </Text>
          )}
        </TouchableOpacity>
      )}
      {event.photos && event.photos.length > 0 && (
        <View style={styles.photosContainer}>
          <Text style={styles.photosLabel}>📸 Фотографии ({event.photos.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {event.photos.map((photo, index) => (
              <View key={index} style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>🖼️ Фото {index + 1}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );

  const renderContent = () => {
    switch(event.type) {
      case 'vet': return renderVetContent();
      case 'groomer': return renderGroomerContent();
      case 'walk': return renderWalkContent();
      default: return <Text style={styles.detailText}>Неизвестный тип события</Text>;
    }
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
            <View style={[
              styles.modalHeader,
              { backgroundColor: getHeaderColor(event.type) }
            ]}>
              <Text style={[
                styles.modalTitle,
                { color: getTextColor(event.type) }
              ]}>
                {getTitle(event.type)}
              </Text>
            </View>
            <ScrollView style={styles.modalBody}>
              {renderContent()}
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
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  commentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 4,
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
  photosLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
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

export default EventDetailsModal;