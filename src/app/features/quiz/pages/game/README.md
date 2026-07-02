# COMENTARIOS DE LA LÓGICA DEL COMPONENTE GAME

# filter()
## --> Recorre todo validSearchItems[], excluyendo únicamente la canción cuyo id coincida con el de la canción actual.

# some()
## --> Verifica si al menos un elemento de un arreglo cumple una condición. Devuelve un valor booleano: true → existe al menos un elemento - false → ningún elemento la cumple.

# slice()
## --> Devuelve una porción de un arreglo sin modificar el original. Recibe un índice inicial y uno final (no inclusivo) para determinar qué elementos copiar.
## --> Ejemplo
- const letters = ['A', 'B', 'C', 'D'];
-- const result = letters.slice(0, 2);
-- console.log(result);  // ['A', 'B']
-- console.log(letters); // ['A', 'B', 'C', 'D']

# Operador spread (...)
## --> Copia todos los elementos del arreglo de las incorrectas para agregarlos al que contiene la correcta.

# replaceUrl: boolean
## --> Evita que el usuario regrese a la ruta anterior mediante el historial del navegador.

# Algoritmo Fisher–Yates 
## --> Algoritmo de mezcla que intercambia elementos con posiciones aleatorias recorriendo el array de atrás hacia adelante, garantizando un shuffle uniforme sin sesgos.
## --> Ejemplo
- [A, B, C, D]
-- i = D → lo intercambia con B → [A, D, C, B]
-- i = C → lo intercambia con A → [C, D, A, B]
-- i = B → puede quedarse igual → [C, D, A, B]
-- Resultado → [C, D, A, B]