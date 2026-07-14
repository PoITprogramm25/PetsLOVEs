import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { usePet } from '../context/PetContext';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

const PetProfile = ({ navigation }) => {
  const { petData, events, walks, history, medicalRecords, addMedicalRecord, cleanupOldEvents } = usePet();
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [medicalType, setMedicalType] = useState('');
  const [medicalName, setMedicalName] = useState('');
  const [medicalDate, setMedicalDate] = useState('');
  const [medicalDescription, setMedicalDescription] = useState('');
  const [lastVetDate, setLastVetDate] = useState(null);
  const [nextVetDate, setNextVetDate] = useState(null);
  const [lastGroomerDate, setLastGroomerDate] = useState(null);
  const [nextGroomerDate, setNextGroomerDate] = useState(null);
  const [petAge, setPetAge] = useState(0);

  useEffect(() => {
    calculatePetAge();
    calculateDates();
    cleanupOldEvents();
  }, [petData, events]);

  const calculatePetAge = () => {
    if (petData && petData.registeredAt) {
      const registered = moment(petData.registeredAt);
      const now = moment();
      const years = now.diff(registered, 'years');
      setPetAge(petData.age + years);
    } else if (petData) {
      setPetAge(petData.age);
    }
  };

  const calculateDates = () => {
    const vetEvents = events.filter(e => e.type === 'vet').sort((a, b) => new Date(a.date) - new Date(b.date));
    const groomerEvents = events.filter(e => e.type === 'groomer').sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (vetEvents.length > 0) {
      const now = new Date();
      const pastVet = vetEvents.filter(e => new Date(e.date) <= now);
      const futureVet = vetEvents.filter(e => new Date(e.date) > now);
      
      if (pastVet.length > 0) {
        setLastVetDate(pastVet[pastVet.length - 1].date);
      }
      if (futureVet.length > 0) {
        setNextVetDate(futureVet[0].date);
      }
    }

    if (groomerEvents.length > 0) {
      const now = new Date();
      const pastGroomer = groomerEvents.filter(e => new Date(e.date) <= now);
      const futureGroomer = groomerEvents.filter(e => new Date(e.date) > now);
      
      if (pastGroomer.length > 0) {
        setLastGroomerDate(pastGroomer[pastGroomer.length - 1].date);
      }
      if (futureGroomer.length > 0) {
        setNextGroomerDate(futureGroomer[0].date);
      }
    }
  };

  const handleAddMedicalRecord = () => {
    if (!medicalType || !medicalName) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
      return;
    }

    const record = {
      type: medicalType,
      name: medicalName,
      date: medicalDate || new Date().toISOString(),
      description: medicalDescription,
      createdAt: new Date().toISOString()
    };

    addMedicalRecord(record);
    setShowMedicalModal(false);
    setMedicalType('');
    setMedicalName('');
    setMedicalDate('');
    setMedicalDescription('');
    Alert.alert('Успех', 'Запись добавлена');
  };

  const getPetIcon = () => {
    if (petData?.photo) {
      return { uri: petData.photo };
    }
    return petData?.type === 'dog' 
      ? require('../assets/dog-placeholder.png') 
      : require('../assets/cat-placeholder.png');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Информация о питомце */}
      <View style={styles.headerContainer}>
        <View style={styles.petInfoContainer}>
          <Image source={getPetIcon()} style={styles.petPhoto} />
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{petData?.name || 'Без имени'}</Text>
            <Text style={styles.petType}>
              {petData?.type === 'dog' ? '🐕 Собака' : '🐈 Кошка'}
            </Text>
            <Text style={styles.petAge}>Возраст: {petAge} лет</Text>
          </View>
        </View>
      </View>

      {/* Информационные блоки */}
      <View style={styles.infoContainer}>
        <TouchableOpacity 
          style={styles.infoBlock}
          onPress={() => navigation.navigate('CalendarScreen', { initialTab: 'vet' })}
        >
          <Text style={styles.infoBlockTitle}>🩺 Ветеринар</Text>
          <View style={styles.infoBlockContent}>
            <Text style={styles.infoText}>
              Последний приём: {lastVetDate ? moment(lastVetDate).format('DD.MM.YYYY') : 'Нет данных'}
            </Text>
            <Text style={[styles.infoText, styles.infoTextHighlight]}>
              Следующий приём: {nextVetDate ? moment(nextVetDate).format('DD.MM.YYYY') : 'Нет данных'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.infoBlock}
          onPress={() => navigation.navigate('CalendarScreen', { initialTab: 'groomer' })}
        >
          <Text style={styles.infoBlockTitle}>✂️ Грумер</Text>
          <View style={styles.infoBlockContent}>
            <Text style={styles.infoText}>
              Последняя стрижка: {lastGroomerDate ? moment(lastGroomerDate).format('DD.MM.YYYY') : 'Нет данных'}
            </Text>
            <Text style={[styles.infoText, styles.infoTextHighlight]}>
              Рекомендуется: {nextGroomerDate ? moment(nextGroomerDate).format('DD.MM.YYYY') : 'Нет данных'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.infoBlock}
          onPress={() => setShowMedicalModal(true)}
        >
          <Text style={styles.infoBlockTitle}>📋 Медицинские записи</Text>
          <View style={styles.infoBlockContent}>
            <Text style={styles.infoText}>
              Всего записей: {medicalRecords?.length || 0}
            </Text>
            <Text style={styles.infoTextSmall}>
              Нажмите для просмотра
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Кнопка архива прогулок */}
      <TouchableOpacity 
        style={styles.archiveButton}
        onPress={() => navigation.navigate('WalkArchive')}
      >
        <Text style={styles.archiveButtonText}>🚶 Архив прогулок</Text>
      </TouchableOpacity>

      {/* Кнопка архива записей */}
      <TouchableOpacity 
        style={styles.historyButton}
        onPress={() => navigation.navigate('HistoryArchive')}
      >
        <Text style={styles.historyButtonText}>📚 Архив записей</Text>
      </TouchableOpacity>

      {/* Модальное окно для медицинских записей */}
      <Modal
        visible={showMedicalModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Добавить медицинскую запись</Text>
            
            <Text style={styles.modalLabel}>Тип записи:</Text>
            <View style={styles.modalTypeButtons}>
              <TouchableOpacity
                style={[
                  styles.modalTypeButton,
                  medicalType === 'vaccine' && styles.modalTypeButtonSelected
                ]}
                onPress={() => setMedicalType('vaccine')}
              >
                <Text style={styles.modalTypeButtonText}>Прививка</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalTypeButton,
                  medicalType === 'surgery' && styles.modalTypeButtonSelected
                ]}
                onPress={() => setMedicalType('surgery')}
              >
                <Text style={styles.modalTypeButtonText}>Операция</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalTypeButton,
                  medicalType === 'diagnosis' && styles.modalTypeButtonSelected
                ]}
                onPress={() => setMedicalType('diagnosis')}
              >
                <Text style={styles.modalTypeButtonText}>Диагноз</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Название:</Text>
            <TextInput
              style={styles.modalInput}
              value={medicalName}
              onChangeText={setMedicalName}
              placeholder="Введите название"
              placeholderTextColor="#999"
            />

            <Text style={styles.modalLabel}>Дата (опционально):</Text>
            <TextInput
              style={styles.modalInput}
              value={medicalDate}
              onChangeText={setMedicalDate}
              placeholder="ДД.ММ.ГГГГ"
              placeholderTextColor="#999"
            />

            <Text style={styles.modalLabel}>Описание (опционально):</Text>
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              value={medicalDescription}
              onChangeText={setMedicalDescription}
              placeholder="Введите описание"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowMedicalModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={handleAddMedicalRecord}
              >
                <Text style={styles.modalSaveButtonText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  petInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  petType: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  petAge: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  infoContainer: {
    padding: 16,
  },
  infoBlock: {
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
  infoBlockTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoBlockContent: {
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  infoTextHighlight: {
    color: '#2196F3',
    fontWeight: '500',
  },
  infoTextSmall: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
  archiveButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  archiveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  historyButton: {
    backgroundColor: '#FF9800',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    fontWeight: '500',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fafafa',
    marginBottom: 16,
  },
  modalTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTypeButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  modalTypeButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  modalTypeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#f5f5f5',
  },
  modalCancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  modalSaveButton: {
    backgroundColor: '#4CAF50',
  },
  modalSaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PetProfile;