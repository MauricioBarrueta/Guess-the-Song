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


# Set
## Colección que almacena valores únicos, por lo que NO permite elementos duplicados. Útil cuando solo importa saber si un elemento existe o no
## Métodos más comunes:
- add(valor) → agrega un elemento
- has(valor) → verifica si un elemento existe
- clear() → elimina todos los elementos

# Map
## Colección que almacena datos en pares clave–valor. A diferencia de un objeto ({}), permite utilizar cualquier tipo de dato como clave y ofrece métodos específicos para gestionar la colección
## Métodos más comunes:
- set(clave, valor) → agrega o actualiza un elemento
- get(clave) → obtiene el valor asociado a una clave
- has(clave) → verifica si una clave existe
- clear() → elimina todos los elementos