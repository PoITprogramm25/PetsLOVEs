import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal
} from 'react-native';
import { usePet } from '../context/PetContext';
import EventDetailsModal from './EventDetailsModal';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

const HistoryArchiveScreen = ({ navigation }) => {
  const { history } = usePet();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  const getEventIcon = (type) => {
    switch(type) {
      case 'vet': return '🩺';
      case 'groomer': return '✂️';
      case 'walk': return '🚶';
      default: return '📅';
    }
  };

  const getEventTitle = (type) => {
    switch(type) {
      case 'vet': return 'Ветеринар';
      case 'groomer': return 'Грумер';
      case 'walk': return 'Прогулка';
      default: return 'Событие';
    }
  };

  const formatDate = (date) => {
    return moment(date).format('DD.MM.YYYY HH:mm');
  };

  const handleEventPress = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyTitle}>Нет записей в архиве</Text>
            <Text style={styles.emptyText}>
              Записи старше 7 дней будут автоматически перемещены сюда
            </Text>
          </View>
        ) : (
          history
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((event, index) => (
              <TouchableOpacity
                key={event.id || index}
                style={styles.historyCard}
                onPress={() => handleEventPress(event)}
              >
                <View style={styles.historyCardContent}>
                  <View style={styles.historyCardIcon}>
                    <Text style={styles.historyCardIconText}>
                      {getEventIcon(event.type)}
                    </Text>
                  </View>
                  <View style={styles.historyCardInfo}>
                    <Text style={styles.historyCardTitle}>
                      {getEventTitle(event.type)}
                    </Text>
                    <Text style={styles.historyCardDate}>
                      {formatDate(event.date)}
                    </Text>
                    {event.address && (
                      <Text style={styles.historyCardDetail} numberOfLines={1}>
                        📍 {event.address}
                      </Text>
                    )}
                    {event.location && (
                      <Text style={styles.historyCardDetail} numberOfLines={1}>
                        📍 {event.location}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.historyCardArrow}>›</Text>
                </View>
              </TouchableOpacity>
            ))
        )}
      </ScrollView>

      <EventDetailsModal
        visible={showEventDetails}
        event={selectedEvent}
        onClose={() => {
          setShowEventDetails(false);
          setSelectedEvent(null);
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
    paddingHorizontal: 32,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  historyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyCardIconText: {
    fontSize: 22,
  },
  historyCardInfo: {
    flex: 1,
  },
  historyCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyCardDate: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  historyCardDetail: {
    fontSize: 13,
    color: '#666',
    marginTop: 1,
  },
  historyCardArrow: {
    fontSize: 20,
    color: '#ccc',
    marginLeft: 8,
  },
});

export default HistoryArchiveScreen;