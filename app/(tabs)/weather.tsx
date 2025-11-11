import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Coordenadas aproximadas de cidades brasileiras
  const cityCoordinates: { [key: string]: { lat: string; lon: string; name: string } } = {
    'são paulo': { lat: '-23.5505', lon: '-46.6333', name: 'São Paulo, SP' },
    'rio de janeiro': { lat: '-22.9068', lon: '-43.1729', name: 'Rio de Janeiro, RJ' },
    'brasília': { lat: '-15.7975', lon: '-47.8919', name: 'Brasília, DF' },
    'salvador': { lat: '-12.9714', lon: '-38.5014', name: 'Salvador, BA' },
    'fortaleza': { lat: '-3.7172', lon: '-38.5433', name: 'Fortaleza, CE' },
    'belo horizonte': { lat: '-19.9167', lon: '-43.9345', name: 'Belo Horizonte, MG' },
    'manaus': { lat: '-3.1190', lon: '-60.0217', name: 'Manaus, AM' },
    'curitiba': { lat: '-25.4284', lon: '-49.2733', name: 'Curitiba, PR' },
    'recife': { lat: '-8.0476', lon: '-34.8770', name: 'Recife, PE' },
    'porto alegre': { lat: '-30.0346', lon: '-51.2177', name: 'Porto Alegre, RS' },
    'belém': { lat: '-1.4554', lon: '-48.4902', name: 'Belém, PA' },
    'goiânia': { lat: '-16.6864', lon: '-49.2643', name: 'Goiânia, GO' },
    'florianópolis': { lat: '-27.5954', lon: '-48.5480', name: 'Florianópolis, SC' },
    'vitória': { lat: '-20.3155', lon: '-40.3128', name: 'Vitória, ES' },
    'campinas': { lat: '-22.9056', lon: '-47.0608', name: 'Campinas, SP' },
  };

  const searchWeather = async () => {
    if (!city.trim()) {
      Alert.alert('Atenção', 'Digite o nome de uma cidade brasileira');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cityLower = city.toLowerCase().trim();
      const coordinates = cityCoordinates[cityLower];

      if (!coordinates) {
        throw new Error('Cidade não encontrada. Tente: São Paulo, Rio, Brasília, etc.');
      }

      // API Open-Meteo - TOTALMENTE GRATUITA E SEM CHAVE
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,pressure_msl&timezone=America/Sao_Paulo&forecast_days=1`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar dados do clima');
      }

      const data = await response.json();

      if (data && data.current) {
        setWeatherData({
          ...data.current,
          cityName: coordinates.name,
          condition: getWeatherCondition(data.current.weather_code)
        });
      } else {
        throw new Error('Dados do clima não disponíveis');
      }

    } catch (err: any) {
      setError(err.message || 'Erro ao buscar previsão do tempo');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Converter código do tempo para descrição em português
  const getWeatherCondition = (weatherCode: number) => {
    const conditions: { [key: number]: { text: string; emoji: string } } = {
      0: { text: 'Céu limpo', emoji: '☀️' },
      1: { text: 'Principalmente limpo', emoji: '🌤️' },
      2: { text: 'Parcialmente nublado', emoji: '⛅' },
      3: { text: 'Nublado', emoji: '☁️' },
      45: { text: 'Nevoeiro', emoji: '🌫️' },
      48: { text: 'Nevoeiro', emoji: '🌫️' },
      51: { text: 'Garoa leve', emoji: '🌦️' },
      53: { text: 'Garoa moderada', emoji: '🌦️' },
      55: { text: 'Garoa densa', emoji: '🌦️' },
      61: { text: 'Chuva leve', emoji: '🌧️' },
      63: { text: 'Chuva moderada', emoji: '🌧️' },
      65: { text: 'Chuva forte', emoji: '🌧️' },
      80: { text: 'Pancadas de chuva leve', emoji: '🌦️' },
      81: { text: 'Pancadas de chuva moderada', emoji: '🌧️' },
      82: { text: 'Pancadas de chuva forte', emoji: '⛈️' },
      95: { text: 'Tempestade', emoji: '⛈️' },
      96: { text: 'Tempestade com granizo leve', emoji: '⛈️' },
      99: { text: 'Tempestade com granizo forte', emoji: '⛈️' },
    };

    return conditions[weatherCode] || { text: 'Condição desconhecida', emoji: '🌈' };
  };

  return (
    <>
      <Tabs.Screen
        options={{
          title: 'Clima Real',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'partly-sunny-outline' : 'partly-sunny'} 
              color={color} 
              size={24} 
            />
          ),
        }}
      />
      
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          <Text style={styles.title}>🌤️ Clima em Tempo Real</Text>
          <Text style={styles.subtitle}>Dados meteorológicos reais - API Open-Meteo</Text>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ex: São Paulo, Rio, Brasília..."
              placeholderTextColor="#999"
              value={city}
              onChangeText={setCity}
              onSubmitEditing={searchWeather}
            />
            <TouchableOpacity 
              style={styles.button} 
              onPress={searchWeather}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Buscando...' : 'Buscar Clima'}
              </Text>
            </TouchableOpacity>
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="gold" />
              <Text style={styles.loadingText}>Consultando dados em tempo real...</Text>
            </View>
          )}

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
              <Text style={styles.helpText}>
                Cidades disponíveis: São Paulo, Rio de Janeiro, Brasília, Salvador, Fortaleza, Belo Horizonte, Manaus, Curitiba, Recife, Porto Alegre, Belém, Goiânia, etc.
              </Text>
            </View>
          ) : null}

          {weatherData && !loading && (
            <View style={styles.weatherContainer}>
              
              <Text style={styles.cityName}>{weatherData.cityName}</Text>
              
              <View style={styles.mainWeather}>
                <Text style={styles.weatherEmoji}>
                  {weatherData.condition.emoji}
                </Text>
                <Text style={styles.temperature}>
                  {Math.round(weatherData.temperature_2m)}°C
                </Text>
                <Text style={styles.condition}>
                  {weatherData.condition.text}
                </Text>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailCard}>
                  <Text style={styles.detailEmoji}>🌡️</Text>
                  <Text style={styles.detailLabel}>Sensação</Text>
                  <Text style={styles.detailValue}>
                    {Math.round(weatherData.apparent_temperature)}°C
                  </Text>
                </View>
                
                <View style={styles.detailCard}>
                  <Text style={styles.detailEmoji}>💧</Text>
                  <Text style={styles.detailLabel}>Umidade</Text>
                  <Text style={styles.detailValue}>
                    {weatherData.relative_humidity_2m}%
                  </Text>
                </View>
                
                <View style={styles.detailCard}>
                  <Text style={styles.detailEmoji}>💨</Text>
                  <Text style={styles.detailLabel}>Vento</Text>
                  <Text style={styles.detailValue}>
                    {Math.round(weatherData.wind_speed_10m)} km/h
                  </Text>
                </View>
                
                <View style={styles.detailCard}>
                  <Text style={styles.detailEmoji}>📊</Text>
                  <Text style={styles.detailLabel}>Pressão</Text>
                  <Text style={styles.detailValue}>
                    {Math.round(weatherData.pressure_msl)} hPa
                  </Text>
                </View>
              </View>

              <View style={styles.apiInfo}>
                <Text style={styles.apiTitle}>ℹ️ Fonte dos Dados</Text>
                <Text style={styles.apiText}>
                  • Open-Meteo API - Dados em tempo real
                </Text>
                <Text style={styles.apiText}>
                  • Totalmente gratuito - sem necessidade de cadastro
                </Text>
                <Text style={styles.apiText}>
                  • Atualizado automaticamente
                </Text>
              </View>

              <Text style={styles.updateTime}>
                Atualizado em: {new Date().toLocaleString('pt-BR')}
              </Text>
            </View>
          )}

          {!weatherData && !loading && !error && (
            <View style={styles.instructions}>
              <Text style={styles.instructionsTitle}>Como usar:</Text>
              <Text style={styles.instructionsText}>
                • Digite o nome de uma cidade brasileira
              </Text>
              <Text style={styles.instructionsText}>
                • Clique em "Buscar Clima"
              </Text>
              <Text style={styles.instructionsText}>
                • Veja dados meteorológicos em tempo real
              </Text>
              
              <View style={styles.features}>
                <Text style={styles.featuresTitle}>✅ Funcionalidades:</Text>
                <Text style={styles.featuresText}>• Temperatura atual</Text>
                <Text style={styles.featuresText}>• Condições do tempo</Text>
                <Text style={styles.featuresText}>• Umidade e vento</Text>
                <Text style={styles.featuresText}>• Dados em tempo real</Text>
                <Text style={styles.featuresText}>• Totalmente gratuito</Text>
              </View>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#134761',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    color: 'gold',
    fontStyle: 'italic',
  },
  searchContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: 'gold',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#134761',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 235, 59, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: 'gold',
  },
  errorText: {
    color: 'gold',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  helpText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 18,
  },
  weatherContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
  },
  mainWeather: {
    alignItems: 'center',
    marginBottom: 25,
  },
  weatherEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'gold',
    marginBottom: 5,
  },
  condition: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  detailEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 5,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  apiInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  apiTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'gold',
    marginBottom: 8,
  },
  apiText: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 3,
    lineHeight: 16,
  },
  updateTime: {
    textAlign: 'center',
    fontSize: 12,
    color: '#ccc',
    fontStyle: 'italic',
  },
  instructions: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gold',
    marginBottom: 15,
  },
  instructionsText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
    lineHeight: 20,
  },
  features: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gold',
    marginBottom: 10,
  },
  featuresText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default WeatherApp;