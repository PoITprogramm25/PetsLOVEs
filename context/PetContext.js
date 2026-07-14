import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const PetContext = createContext();

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet must be used within a PetProvider');
  }
  return context;
};

export const PetProvider = ({ children }) => {
  const [petData, setPetData] = useState(null);
  const [events, setEvents] = useState([]);
  const [walks, setWalks] = useState([]);
  const [history, setHistory] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  // Загрузка данных при запуске
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const pet = await AsyncStorage.getItem('petData');
      const eventsData = await AsyncStorage.getItem('events');
      const walksData = await AsyncStorage.getItem('walks');
      const historyData = await AsyncStorage.getItem('history');
      const medicalData = await AsyncStorage.getItem('medicalRecords');

      if (pet) setPetData(JSON.parse(pet));
      if (eventsData) setEvents(JSON.parse(eventsData));
      if (walksData) setWalks(JSON.parse(walksData));
      if (historyData) setHistory(JSON.parse(historyData));
      if (medicalData) setMedicalRecords(JSON.parse(medicalData));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const savePetData = async (data) => {
    try {
      await AsyncStorage.setItem('petData', JSON.stringify(data));
      setPetData(data);
    } catch (error) {
      console.error('Error saving pet data:', error);
    }
  };

  const addEvent = async (event) => {
    try {
      const newEvent = { ...event, id: Date.now().toString() };
      const updatedEvents = [...events, newEvent];
      await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
      setEvents(updatedEvents);

      // Добавляем в историю
      await addToHistory(newEvent);
      
      // Планируем уведомления
      NotificationService.scheduleNotifications(newEvent);
      
      return newEvent;
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const addToHistory = async (event) => {
    try {
      const historyEntry = {
        ...event,
        archivedAt: new Date().toISOString(),
        id: Date.now().toString()
      };
      const updatedHistory = [...history, historyEntry];
      await AsyncStorage.setItem('history', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  };

  const addWalk = async (walkData) => {
    try {
      const newWalk = { ...walkData, id: Date.now().toString() };
      const updatedWalks = [newWalk, ...walks];
      await AsyncStorage.setItem('walks', JSON.stringify(updatedWalks));
      setWalks(updatedWalks);
      
      // Добавляем в историю как событие прогулки
      const eventForHistory = {
        ...newWalk,
        type: 'walk',
        title: 'Прогулка',
        date: newWalk.date,
      };
      await addToHistory(eventForHistory);
      
      return newWalk;
    } catch (error) {
      console.error('Error adding walk:', error);
    }
  };

  const addMedicalRecord = async (record) => {
    try {
      const newRecord = { ...record, id: Date.now().toString() };
      const updatedRecords = [...medicalRecords, newRecord];
      await AsyncStorage.setItem('medicalRecords', JSON.stringify(updatedRecords));
      setMedicalRecords(updatedRecords);
      return newRecord;
    } catch (error) {
      console.error('Error adding medical record:', error);
    }
  };

  const getEventsForDate = (date) => {
    return events.filter(event => moment(event.date).isSame(date, 'day'));
  };

  const getEventsForMonth = (month) => {
    return events.filter(event => moment(event.date).isSame(month, 'month'));
  };

  // Автозаполнение адреса и телефона
  const getLastVetInfo = () => {
    const lastVet = events
      .filter(e => e.type === 'vet')
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    return lastVet ? { address: lastVet.address, phone: lastVet.phone } : null;
  };

  const getLastGroomerInfo = () => {
    const lastGroomer = events
      .filter(e => e.type === 'groomer')
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    return lastGroomer ? { address: lastGroomer.address, phone: lastGroomer.phone } : null;
  };

  // Очистка старых событий (старше 7 дней)
  const cleanupOldEvents = async () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
    
    const activeEvents = events.filter(event => 
      new Date(event.date) > sevenDaysAgo
    );
    
    const archivedEvents = events.filter(event => 
      new Date(event.date) <= sevenDaysAgo
    );
    
    // Добавляем в историю все старые события
    for (const event of archivedEvents) {
      await addToHistory(event);
    }
    
    await AsyncStorage.setItem('events', JSON.stringify(activeEvents));
    setEvents(activeEvents);
  };

  return (
    <PetContext.Provider value={{
      petData,
      events,
      walks,
      history,
      medicalRecords,
      savePetData,
      addEvent,
      addWalk,
      addMedicalRecord,
      getEventsForDate,
      getEventsForMonth,
      getLastVetInfo,
      getLastGroomerInfo,
      cleanupOldEvents,
      setWalks,
      setHistory,
      setMedicalRecords
    }}>
      {children}
    </PetContext.Provider>
  );
};