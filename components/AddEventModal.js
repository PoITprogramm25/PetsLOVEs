import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Switch,
  Platform
} from 'react-native';
import { usePet } from '../context/PetContext';
import moment from 'moment';
import 'moment/locale/ru';
import DateTimePicker from '@react-native-community/datetimepicker';

moment.locale('ru');

const AddEventModal = ({ visible, onClose, initialDate }) => {
  const { addEvent, addWalk, getLastVetInfo, getLastGroomerInfo } = usePet();
  const [eventType, setEventType] = useState(null);
  const [date, setDate] = useState(new Date(initialDate || moment().format('YYYY-MM-DD')));
  const [time, setTime] = useState(new Date());
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [location, setLocation] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [autoFill, setAutoFill] = useState(false);

  useEffect(() => {
    if (eventType === 'vet') {
      const lastInfo = getLastVetInfo();
      if (lastInfo && autoFill) {
        setAddress(lastInfo.address || '');
        setPhone(lastInfo.phone || '');
      }
    } else if (eventType === 'groomer') {
      const lastInfo = getLastGroomerInfo();
      if (lastInfo && autoFill) {
        setAddress(lastInfo.address || '');
        setPhone(lastInfo.phone || '');
      }
    }
  }, [eventType, autoFill]);

  const resetForm = () => {
    setEventType(null);
    setDate(new Date(initialDate || moment().format('YYYY-MM-DD')));
    setTime(new Date());
    setAddress('');
    setPhone('');
    setComment('');
    setLocation('');
    setAutoFill(false);
  };

  const handleSave = () => {
    if (!eventType) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите тип события');
      return;
    }

    const eventDate = new Date(date);
    eventDate.setHours(time.getHours(), time.getMinutes());

    if (eventType === 'walk') {
      const walkData = {
        type: 'walk',
        date: eventDate.toISOString(),
        location: location || undefined,
        comment: comment || undefined,
        photos: [],
        createdAt: new Date().toISOString()
      };
      
      addWalk(walkData);
      Alert.alert('Успех', 'Прогулка добавлена!');
      onClose();
      resetForm();
      return;
    }

    const eventData = {
      type: eventType,
      date: eventDate.toISOString(),
      address: address || undefined,
      phone: phone || undefined,
      comment: comment || undefined,
      createdAt: new Date().toISOString()
    };

    addEvent(eventData);
    Alert.alert('Успех', 'Запись создана!');
    onClose();
    resetForm();
  };

  const renderTypeSelector = () => (
    <View style={styles.typeSelector}>
      <Text style={styles.sectionTitle}>Выберите тип:</Text>
      <View style={styles.typeButtons}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            eventType === 'vet' && styles.typeButtonSelectedVet
          ]}
          onPress={() => setEventType('vet')}
        >
          <Text style={[
            styles.typeButtonText,
            eventType === 'vet' && styles.typeButtonTextSelected
          ]}>🩺 Ветеринар</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeButton,
            eventType === 'groomer' && styles.typeButtonSelectedGroomer
          ]}
          onPress={() => setEventType('groomer')}
        >
          <Text style={[
            styles.typeButtonText,
            eventType === 'groomer' && styles.typeButtonTextSelected
          ]}>✂️ Грумер</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeButton,
            eventType === 'walk' && styles.typeButtonSelectedWalk
          ]}
          onPress={() => setEventType('walk')}
        >
          <Text style={[
            styles.typeButtonText,
            eventType === 'walk' && styles.typeButtonTextSelected
          ]}>🚶 Прогулка</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderForm = () => {
    if (!eventType) return null;

    return (
      <View style={styles.formContainer}>
        {(eventType === 'vet' || eventType === 'groomer') && (
          <>
            <TouchableOpacity
              style={styles.autoFillSwitch}
              onPress={() => setAutoFill(!autoFill)}
            >
              <Text style={styles.autoFillLabel}>
                Автозаполнить из последней записи
              </Text>
              <Switch
                value={autoFill}
                onValueChange={setAutoFill}
                trackColor={{ false: '#ccc', true: '#4CAF50' }}
              />
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateTimeLabel}>
            {eventType === 'walk' ? 'Дата' : 'Дата и время'}
          </Text>
          <Text style={styles.dateTimeValue}>
            {eventType === 'walk' 
              ? moment(date).format('DD.MM.YYYY')
              : moment(date).format('DD.MM.YYYY, HH:mm')
            }
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode={eventType === 'walk' ? 'date' : 'datetime'}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate);
                if (eventType !== 'walk') {
                  setTime(selectedDate);
                }
              }
            }}
          />
        )}

        {eventType === 'walk' && (
          <>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="📍 Место прогулки (опционально)"
              placeholderTextColor="#999"
            />
          </>
        )}

        {(eventType === 'vet' || eventType === 'groomer') && (
          <>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder={`📍 Адрес ${eventType === 'vet' ? 'ветклиники' : 'парикмахерской'}`}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="📞 Контактный телефон"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </>
        )}

        <TextInput
          style={[styles.input, styles.textArea]}
          value={comment}
          onChangeText={setComment}
          placeholder="💬 Комментарий (опционально)"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Сохранить</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        onClose();
        resetForm();
      }}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => {
            onClose();
            resetForm();
          }}
        >
          <View style={[
            styles.modalContainer,
            eventType === 'vet' && styles.modalContainerVet,
            eventType === 'groomer' && styles.modalContainerGroomer,
            eventType === 'walk' && styles.modalContainerWalk,
          ]}>
            <Text style={styles.modalTitle}>Добавить запись</Text>
            {renderTypeSelector()}
            <ScrollView style={styles.modalScroll}>
              {renderForm()}
            </ScrollView>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                onClose();
                resetForm();
              }}
            >
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
    width: '92%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContainerVet: {
    borderTopWidth: 4,
    borderTopColor: '#87CEEB',
  },
  modalContainerGroomer: {
    borderTopWidth: 4,
    borderTopColor: '#FFB6C1',
  },
  modalContainerWalk: {
    borderTopWidth: 4,
    borderTopColor: '#90EE90',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    padding: 20,
    paddingBottom: 0,
    textAlign: 'center',
  },
  modalScroll: {
    paddingHorizontal: 20,
  },
  typeSelector: {
    padding: 20,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  typeButtonSelectedVet: {
    backgroundColor: '#87CEEB',
  },
  typeButtonSelectedGroomer: {
    backgroundColor: '#FFB6C1',
  },
  typeButtonSelectedWalk: {
    backgroundColor: '#90EE90',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  typeButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  formContainer: {
    paddingBottom: 20,
  },
  autoFillSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  autoFillLabel: {
    fontSize: 14,
    color: '#555',
  },
  dateTimeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateTimeLabel: {
    fontSize: 14,
    color: '#555',
  },
  dateTimeValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fafafa',
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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

export default AddEventModal;