import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await fetch("https://ghibliapi.vercel.app/films/");
        const json = await res.json();
        setData(json); // 👈 aquí está la corrección
      } catch (error) {
        console.log('Error al obtener datos:', error);
      }
    };
    obtenerDatos();
  }, []);

  return (
    <ScrollView>
      <View style={styles.lista}>
        {data.map((film, index) => (
          <View key={index} style={styles.item}>
            <Text>{film.title}</Text> {/* 👈 la API devuelve "title", no "name" */}
            <Image
              source={{ uri: film.image }}
              style={styles.imagen}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  },
  imagen: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  buscador: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
});