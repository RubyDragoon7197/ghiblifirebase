import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator } from 'react-native';

export default function Home() {
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await fetch("https://ghibliapi.vercel.app/films/");
        const json = await res.json();
        setData(json); // 👈 la API devuelve un array directamente
      } catch (err) {
        console.log('Error al obtener datos:', err);
        setError('No se pudieron cargar las películas');
      } finally {
        setCargando(false);
      }
    };
    obtenerDatos();
  }, []);

  if (cargando) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Cargando películas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.lista}>
        {data.map((film, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.titulo}>{film.title}</Text>
            {film.image ? (
              <Image source={{ uri: film.image }} style={styles.imagen} />
            ) : (
              <Text style={{ fontSize: 12, color: 'gray' }}>Sin imagen disponible</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'space-between',
    padding: 10,
  },
  item: {
    backgroundColor: 'aliceblue',
    width: '48%',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 8,
  },
  imagen: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginTop: 5,
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});