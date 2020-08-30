import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Alert,
} from 'react-native';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

const App = () => {
  // const [userLocation, setUserLocatin] = React.useState({
  //   latitude: '',
  //   longitude: '',
  // });
  React.useEffect(() => {
    BackgroundGeolocation.configure({
      startForeground: false, // Sadece android Konum senkronizasyon hizmetinin ön plan durumunda çalışmasına izin verin. Ön plan durumu ayrıca kullanıcıya bir bildirim sunulmasını gerektirir.
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 1, //Metre olarak değiştiğinde arka plan çalışma şartı
      distanceFilter: 1, //50, //Bir güncelleme olayı oluşturulmadan önce bir cihazın yatay olarak hareket etmesi gereken minimum mesafe (metre cinsinden ölçülür)
      notificationTitle: 'Arka planda izleme',
      notificationText: 'Aktif',
      debug: true, //Arka plan yaşam döngüsü değiştiğinde ses yayar.
      startOnBoot: false,
      stopOnTerminate: true, //Uygulama sonlandırıldığında durmaya zorlamak () için bunu etkinleştirin (ör. İOS'ta, ana sayfa düğmesine iki kez dokunun, uygulamayı hızlıca kaydırın).
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      //  interval: 20000, // Sadece ANDRODI İÇİN Milisaniye cinsinden konum güncellemeleri arasındaki minimum zaman aralığı
      //fastestInterval: 10000, // Sadece android Uygulamanızın konum güncellemelerini işleyebileceği milisaniye cinsinden en yüksek hız.
      //  activitiesInterval: 10000, // Sadece android Aktivite tanımanın gerçekleştiği milisaniye cinsinden oran. Daha büyük değerler, pil ömrünü uzatırken daha az etkinlik algılamasına neden olur.
      //stopOnStillActivity: false, // Sadece android STILL etkinliği algılandığında konum güncellemelerini durdurun
      activityType: 'OtherNavigation',
      url: 'http://192.168.81.15:3000/location', //Konumun gideceği api
      //syncUrl: 'http://192.168.81.15:3000/location', // konum gitmese alternative gideceği yer .Gönderilecek sunucu url'si konumların gönderilemediği yer
      //syncThreshold: 100, //Aynı anda sunucuya daha önce kaç tane başarısız konum gönderileceğini belirtir
      //maxLocations:10000,//DB'de depolanan maksimum konum sayısını sınırlayın.

      httpHeaders: {
        'X-FOO': 'bar',
      },
      // customize post properties
      postTemplate: {
        lat: '@latitude',
        lon: '@longitude',
        foo: 'bar', // you can also add your own properties
      },
      notificationsEnabled: false,
    });

    BackgroundGeolocation.on('location', location => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask(taskKey => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('stationary', stationaryLocation => {
      // handle stationary locations here
      //Actions.sendLocation(stationaryLocation);
      console.log('Sabit Konum : ', stationaryLocation);
    });

    BackgroundGeolocation.on('error', error => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation hizmeti başlatıldı');
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation hizmeti durduruldu');
    });

    BackgroundGeolocation.on('authorization', status => {
      console.log(
        '[INFO] BackgroundGeolocation authorization status: ' + status,
      );
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(
          () =>
            Alert.alert(
              'Uygulama konum izleme izni gerektiriyor',
              'Uygulama ayarlarını açmak ister misiniz?',
              [
                {
                  text: 'Evet',
                  onPress: () => BackgroundGeolocation.showAppSettings(),
                },
                {
                  text: 'Hayır',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            ),
          1000,
        );
      }
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] Uygulama arka planda');
      BackgroundGeolocation.getLocations(function(locations) {
        console.log('Depolanan tüm konumlar : ', locations); //depolanan tüm konumlar alınır
      });
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] Uygulama ön planda');
      BackgroundGeolocation.getLocations(function(locations) {
        console.log('ön planda iken depolanan tüm konumlar : ', locations);
      });
    });

    BackgroundGeolocation.on('abort_requested', () => {
      console.log('[INFO] Server responded with 285 Updates Not Required');

      // Here we can decide whether we want stop the updates or not.
      // If you've configured the server to return 285, then it means the server does not require further update.
      // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
      // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
    });

    BackgroundGeolocation.on('http_authorization', () => {
      console.log('[INFO] App needs to authorize the http requests');
    });

    BackgroundGeolocation.checkStatus(status => {
      console.log(
        '[INFO] BackgroundGeolocation service is running',
        status.isRunning,
      );
      console.log(
        '[INFO] BackgroundGeolocation services enabled',
        status.locationServicesEnabled,
      );
      console.log(
        '[INFO] BackgroundGeolocation auth status: ' + status.authorization,
      );

      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
      }
    });
    return () => {
      BackgroundGeolocation.removeAllListeners();
    };
  }, []);

  const getInfo = () => {
    BackgroundGeolocation.getConfig(function(config) {
      console.log(config);

      Alert.alert(config);
    });
  };
  const newMethodForMaster = () => {
    console.log('master üzerinde bir metot');
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.container}>
          <Text onPress={getInfo} style={{}}>
            Konum Bilgim
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {justifyContent: 'center', alignItems: 'center', padding: 20},
});

export default App;
