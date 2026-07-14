import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

class NotificationService {
  constructor() {
    this.configure();
  }

  configure() {
    PushNotification.configure({
      onRegister: function(token) {
        console.log('TOKEN:', token);
      },
      onNotification: function(notification) {
        console.log('NOTIFICATION:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  }

  setupNotifications() {
    // Создаем каналы для Android
    PushNotification.createChannel(
      {
        channelId: 'vet-channel',
        channelName: 'Уведомления ветеринара',
        channelDescription: 'Уведомления о приёмах у ветеринара',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`vet-channel created: ${created}`)
    );

    PushNotification.createChannel(
      {
        channelId: 'groomer-channel',
        channelName: 'Уведомления грумера',
        channelDescription: 'Уведомления о приёмах к грумеру',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`groomer-channel created: ${created}`)
    );

    PushNotification.createChannel(
      {
        channelId: 'walk-channel',
        channelName: 'Уведомления о прогулках',
        channelDescription: 'Уведомления о запланированных прогулках',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`walk-channel created: ${created}`)
    );
  }

  scheduleNotifications(event) {
    const eventDate = new Date(event.date);
    const petName = event.petName || 'питомца';
    const petType = event.petType || '';

    if (event.type === 'vet') {
      this.scheduleVetNotifications(eventDate, petName, event.address, event.id);
    } else if (event.type === 'groomer') {
      this.scheduleGroomerNotifications(eventDate, petName, event.address, event.id);
    } else if (event.type === 'walk') {
      this.scheduleWalkNotification(eventDate, petName, petType, event.id);
    }
  }

  scheduleVetNotifications(date, petName, address, phone, id) {
    const oneWeekBefore = new Date(date);
    oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);
    
    const threeDaysBefore = new Date(date);
    threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);

    const timeString = moment(date).format('HH:mm');
    const addressString = address ? `, ${address}` : '';

    // За неделю
    if (oneWeekBefore > new Date()) {
      PushNotification.localNotificationSchedule({
        channelId: 'vet-channel',
        title: '📅 Напоминание о приёме',
        message: `Через неделю у ${petName} приём в ${timeString} ${addressString}`,
        date: oneWeekBefore,
        allowWhileIdle: true,
        userInfo: { id: `${id}-week` },
      });
    }

    // За 3 дня
    if (threeDaysBefore > new Date()) {
      PushNotification.localNotificationSchedule({
        channelId: 'vet-channel',
        title: '📅 Напоминание о приёме',
        message: `Через 3 дня у любимого(ой) ${petName} приём к ветеринару в ${timeString} ${addressString}`,
        date: threeDaysBefore,
        allowWhileIdle: true,
        userInfo: { id: `${id}-3days` },
      });
    }

    // В день приёма
    PushNotification.localNotificationSchedule({
      channelId: 'vet-channel',
      title: '⚠️ Сегодня приём!',
      message: `Сегодня! Приём у ${petName} в ${timeString} ${addressString}. Не забудьте!`,
      date: date,
      allowWhileIdle: true,
      userInfo: { id: `${id}-day` },
    });
  }

  scheduleGroomerNotifications(date, petName, address, phone, id) {
    const oneWeekBefore = new Date(date);
    oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);
    
    const threeDaysBefore = new Date(date);
    threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);

    const timeString = moment(date).format('HH:mm');
    const addressString = address ? `, ${address}` : '';
    const phoneString = phone ? `, тел: ${phone}` : '';

    // За неделю
    if (oneWeekBefore > new Date()) {
      PushNotification.localNotificationSchedule({
        channelId: 'groomer-channel',
        title: '✂️ Напоминание о стрижке',
        message: `Через неделю у ${petName} стрижка в ${timeString} ${addressString}`,
        date: oneWeekBefore,
        allowWhileIdle: true,
        userInfo: { id: `${id}-week` },
      });
    }

    // За 3 дня
    if (threeDaysBefore > new Date()) {
      PushNotification.localNotificationSchedule({
        channelId: 'groomer-channel',
        title: '✂️ Напоминание о стрижке',
        message: `Через 3 дня у любимого(ой) ${petName} стрижка в ${timeString} ${addressString}`,
        date: threeDaysBefore,
        allowWhileIdle: true,
        userInfo: { id: `${id}-3days` },
      });
    }

    // В день приёма
    PushNotification.localNotificationSchedule({
      channelId: 'groomer-channel',
      title: '⚠️ Сегодня стрижка!',
      message: `Сегодня! Приём у грумера, у ${petName} в ${timeString} ${addressString}. Не забудьте!`,
      date: date,
      allowWhileIdle: true,
      userInfo: { id: `${id}-day` },
    });
  }

  scheduleWalkNotification(date, petName, petType, id) {
    const sound = petType === 'cat' ? 'мур' : 'тяф';
    
    PushNotification.localNotificationSchedule({
      channelId: 'walk-channel',
      title: '🚶 Время прогулки!',
      message: `Куда сегодня пойдете гулять? Будем ждать ваших эмоций (${sound})`,
      date: date,
      allowWhileIdle: true,
      userInfo: { id: `${id}-walk` },
    });
  }

  cancelNotifications(eventId) {
    // Отмена уведомлений по ID
    PushNotification.getScheduledLocalNotifications((notifications) => {
      notifications.forEach(notification => {
        if (notification.userInfo && notification.userInfo.id.includes(eventId)) {
          PushNotification.cancelLocalNotification(notification.id);
        }
      });
    });
  }
}

export default new NotificationService();