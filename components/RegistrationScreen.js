import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { usePet } from '../context/PetContext';
import * as ImagePicker from 'react-native-image-picker';

const RegistrationScreen = ({ navigation }) => {
  const { savePetData } = usePet();
  const [petType, setPetType] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [photo, setPhoto] = useState(null);

  const handlePickImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets) {
        setPhoto(response.assets[0].uri);
      }
    });
  };

  const handleRegister = () => {
    if (!petType) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите тип питомца');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите кличку питомца');
      return;
    }
    if (!age || isNaN(age) || parseInt(age) <= 0) {
      Alert.alert('Ошибка', 'Пожалуйста, введите корректный возраст');
      return;
    }

    const petData = {
      type: petType,
      name: name.trim(),
      age: parseInt(age),
      photo: photo || null,
      registeredAt: new Date().toISOString()
    };

    savePetData(petData);
    navigation.navigate('PetProfile');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Регистрация питомца</Text>
      
      <View style={styles.photoContainer}>
        <TouchableOpacity onPress={handlePickImage} style={styles.photoButton}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>Добавить фото</Text>
              <Text style={styles.photoPlaceholderSubText}>(необязательно)</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.typeContainer}>
        <Text style={styles.label}>Тип питомца:</Text>
        <View style={styles.typeButtons}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              petType === 'dog' && styles.typeButtonSelected
            ]}
            onPress={() => setPetType('dog')}
          >
            <Text style={[
              styles.typeButtonText,
              petType === 'dog' && styles.typeButtonTextSelected
            ]}>🐕 Собака</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              petType === 'cat' && styles.typeButtonSelected
            ]}
            onPress={() => setPetType('cat')}
          >
            <Text style={[
              styles.typeButtonText,
              petType === 'cat' && styles.typeButtonTextSelected
            ]}>🐈 Кошка</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Кличка:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Введите кличку"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Возраст (лет):</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Введите возраст"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Зарегистрировать</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  photoButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ddd',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  photoPlaceholderSubText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  typeContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  typeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  typeButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 10,
    marginTop: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RegistrationScreen;