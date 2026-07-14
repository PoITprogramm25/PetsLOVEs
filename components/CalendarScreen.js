import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Platform
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { usePet } from '../context/PetContext';
import EventDetailsModal from './EventDetailsModal';
import AddEventModal from './AddEventModal';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

const CalendarScreen = ({ route, navigation }) => {
  const { events, getEventsForDate } = usePet();
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    updateMarkedDates();
    loadEventsForDate(selectedDate);
  }, [events, selectedDate]);

  const updateMarkedDates = () => {
    const marked = {};
    events.forEach(event => {
      const date = moment(event.date).format('YYYY-MM-DD');
      if (!marked[date]) {
        marked[date] = {
          dots: [],
          selected: false,
        };
      }
      
      let dotColor = '#4CAF50'; // green for walk
      if (event.type === 'vet') dotColor = '#87CEEB'; // light blue for vet
      if (event.type === 'groomer') dotColor = '#FFB6C1'; // light pink for groomer
      
      marked[date].dots.push({
        color: dotColor,
        key: event.id,
      });
    });

    // Добавляем выделение для выбранной даты
    if (marked[selectedDate]) {
      marked[selectedDate].selected = true;
      marked[selectedDate].selectedColor = '#4CAF50';
    }

    setMarkedDates(marked);
  };

  const loadEventsForDate = (date) => {
    const eventsForDate = getEventsForDate(date);
    setSelectedEvents(eventsForDate);
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    loadEventsForDate(day.dateString);
  };

  const handleEventPress = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const getEventColor = (type) => {
    switch(type) {
      case 'vet': return '#87CEEB';
      case 'groomer': return '#FFB6C1';
      case 'walk': return '#90EE90';
      default: return '#ccc';
    }
  };

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
      case 'vet': return 'Приём у ветеринара';
      case 'groomer': return 'Приём к грумеру';
      case 'walk': return 'Прогулка';
      default: return 'Событие';
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        theme={{
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#4CAF50',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#4CAF50',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#4CAF50',
          selectedDotColor: '#ffffff',
          arrowColor: '#4CAF50',
          monthTextColor: '#2d4150',
          textMonthFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14,
        }}
        markingType={'multi-dot'}
        markedDates={markedDates}
        onDayPress={handleDayPress}
      />

      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>
          События на {moment(selectedDate).format('D MMMM YYYY')}
        </Text>
        <ScrollView style={styles.eventsList}>
          {selectedEvents.length > 0 ? (
            selectedEvents.map(event => (
              <TouchableOpacity
                key={event.id}
                style={[
                  styles.eventItem,
                  { backgroundColor: getEventColor(event.type) }
                ]}
                onPress={() => handleEventPress(event)}
              >
                <View style={styles.eventItemContent}>
                  <Text style={styles.eventIcon}>{getEventIcon(event.type)}</Text>
                  <View style={styles.eventItemInfo}>
                    <Text style={styles.eventItemTitle}>{getEventTitle(event.type)}</Text>
                    <Text style={styles.eventItemTime}>
                      {moment(event.date).format('HH:mm')}
                    </Text>
                  </View>
                  <Text style={styles.eventItemArrow}>›</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noEventsContainer}>
              <Text style={styles.noEventsText}>Нет событий на этот день</Text>
              <TouchableOpacity
                style={styles.addEventButtonSmall}
                onPress={() => setShowAddModal(true)}
              >
                <Text style={styles.addEventButtonSmallText}>+ Добавить событие</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <EventDetailsModal
        visible={showEventDetails}
        event={selectedEvent}
        onClose={() => setShowEventDetails(false)}
      />

      <AddEventModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        initialDate={selectedDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  calendar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  eventsContainer: {
    flex: 1,
    padding: 16,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  eventsList: {
    flex: 1,
  },
  eventItem: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  eventItemInfo: {
    flex: 1,
  },
  eventItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  eventItemTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  eventItemArrow: {
    fontSize: 24,
    color: '#666',
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noEventsText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },
  addEventButtonSmall: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addEventButtonSmallText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default CalendarScreen;