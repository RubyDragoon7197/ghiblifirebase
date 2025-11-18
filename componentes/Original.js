import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

export default function Original() {
  const [peliculas, setPeliculas] = useState([]);
  const [peliculaActual, setPeliculaActual] = useState('');
  const [palabraOculta, setPalabraOculta] = useState('');
  const [letrasUsadas, setLetrasUsadas] = useState([]);
  const [errores, setErrores] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gano, setGano] = useState(false);

  const MAX_ERRORES = 6;
  const ABECEDARIO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    const obtenerPeliculas = async () => {
      try {
        const res = await fetch("https://ghibliapi.vercel.app/films/");
        const json = await res.json();
        setPeliculas(json);
        iniciarJuego(json);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las películas');
      }
    };
    obtenerPeliculas();
  }, []);

  const iniciarJuego = (movies) => {
    if (movies.length === 0) return;
    const pelicula = movies[Math.floor(Math.random() * movies.length)];
    setPeliculaActual(pelicula.title);
    setPalabraOculta(generarPalabraOculta(pelicula.title));
    setLetrasUsadas([]);
    setErrores(0);
    setGameOver(false);
    setGano(false);
  };

  const generarPalabraOculta = (palabra) => {
    return palabra
      .toUpperCase()
      .split('')
      .map((letra) => (letra === ' ' ? ' ' : '_'))
      .join('');
  };

  const revelarLetras = (letra, palabraOculta, palabraOriginal) => {
    return palabraOculta
      .split('')
      .map((char, i) => {
        return palabraOriginal.toUpperCase()[i] === letra ? letra : char;
      })
      .join('');
  };

  const seleccionarLetra = (letra) => {
    if (letrasUsadas.includes(letra) || gameOver) return;

    const nuevasLetras = [...letrasUsadas, letra];
    setLetrasUsadas(nuevasLetras);

    const palabraActualizada = revelarLetras(letra, palabraOculta, peliculaActual);
    setPalabraOculta(palabraActualizada);

    if (!peliculaActual.toUpperCase().includes(letra)) {
      const nuevosErrores = errores + 1;
      setErrores(nuevosErrores);

      if (nuevosErrores >= MAX_ERRORES) {
        setGameOver(true);
        Alert.alert('¡Perdiste!', `La película era: ${peliculaActual}`);
      }
    }

    if (palabraActualizada === peliculaActual.toUpperCase()) {
      setGano(true);
      setGameOver(true);
      Alert.alert('¡Ganaste!', `¡Adivinaste: ${peliculaActual}!`);
    }
  };

  const reiniciar = () => {
    iniciarJuego(peliculas);
  };

  const dibujarAhorcado = () => {
    const fases = [
      '  H\n  |\n  |\n  |\n  |\n  |',
      '  H\n  |\n  O\n  |\n  |\n  |',
      '  H\n  |\n  O\n  |\\ \n  |\n  |',
      '  H\n  |\n  O\n /|\\ \n  |\n  |',
      '  H\n  |\n  O\n /|\\ \n  |\n /  ',
      '  H\n  |\n  O\n /|\\ \n  |\n / \\ ',
    ];
    return fases[errores] || fases[fases.length - 1];
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>🎬 Ahorcados Studio Ghibli 🎬</Text>

      <View style={styles.ahorcado}>
        <Text style={styles.dibujo}>{dibujarAhorcado()}</Text>
      </View>

      <Text style={styles.errores}>
        Errores: {errores}/{MAX_ERRORES}
      </Text>

      <Text style={styles.palabra}>{palabraOculta}</Text>

      <View style={styles.letrasContainer}>
        {ABECEDARIO.map((letra) => (
          <TouchableOpacity
            key={letra}
            onPress={() => seleccionarLetra(letra)}
            disabled={letrasUsadas.includes(letra) || gameOver}
            style={[
              styles.botonLetra,
              letrasUsadas.includes(letra) && styles.letraUsada,
            ]}
          >
            <Text
              style={[
                styles.textoLetra,
                letrasUsadas.includes(letra) && styles.textoLetraUsada,
              ]}
            >
              {letra}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {gameOver && (
        <TouchableOpacity onPress={reiniciar} style={styles.botonReiniciar}>
          <Text style={styles.textoBoton}>Nuevo Juego</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  ahorcado: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  dibujo: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  errores: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#d32f2f',
  },
  palabra: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    letterSpacing: 8,
    color: '#1976d2',
    fontFamily: 'monospace',
  },
  letrasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
  },
  botonLetra: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1565c0',
  },
  letraUsada: {
    backgroundColor: '#ccc',
    borderColor: '#999',
  },
  textoLetra: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  textoLetraUsada: {
    color: '#666',
  },
  botonReiniciar: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  textoBoton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});