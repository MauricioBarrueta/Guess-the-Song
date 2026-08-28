**COMENTARIOS DE LA LÓGICA DEL COMPONENTE GAME**

# filter()
## --> Recorre todo validSearchItems[], excluyendo únicamente la canción cuyo id coincida con el de la canción actual.

# some()
## --> Verifica si al menos un elemento de un arreglo cumple una condición. Devuelve un valor booleano: true → existe al menos un elemento - false → ningún elemento la cumple.

# slice()
## --> Devuelve una porción de un arreglo sin modificar el original. Recibe un índice inicial y uno final (no inclusivo) para determinar qué elementos copiar.
## --> Ejemplo:
- const letters = ['A', 'B', 'C', 'D'];
-- const result = letters.slice(0, 2);
-- console.log(result);  // ['A', 'B']
-- console.log(letters); // ['A', 'B', 'C', 'D']

# of()
## Función de RxJS que recibe uno o varios valores y los convierte en un Observable
## --> Ejemplo:
- of({ data: [], total: 0 })
-- crea un Observable que emite una vez:
- { data: [], total: 0 }

# map()
## Crea un nuevo arreglo transformando cada elemento del arreglo original mediante una función

# flat()
## Aplana un arreglo, eliminando uno o más niveles de arreglos anidados. También permite indicar cuántos niveles (.flat(2), por ejemplo)
## --> Ejemplo:
- const arrays = [[1, 2], [3, 4], [5]]
- const result = arrays.flat() --> [1, 2, 3, 4, 5]

# flatMap()
## Combina map() y flat() en una sola operación, transformando cada elemento y aplanando los arreglos resultantes en uno solo
## --> Ejemplo:
- [ { data: [track1, track2] }, { data: [track3, track4] } ] -> [track1, track2, track3, track4]

# forkJoin()
## Ejecuta varios Observable en paralelo y espera a que todos completen para emitir sus resultados en un solo arreglo
## --> Ejemplo:
- forkJoin([ observable1, observable2, observable3 ])
- Cuando termina cada uno, devuelve los resultados --> [result1, result2, result3]

# switchMap()
## Permite encadenar Observable, utilizando el valor emitido por uno para iniciar otro. Al suscribirse al nuevo Observable, cancela la suscripción anterior si llega una nueva emisión



# continue
## Omite la iteración actual de un ciclo y continúa con la siguiente

# replaceUrl: boolean
## --> Evita que el usuario regrese a la ruta anterior mediante el historial del navegador.



# Operador spread (...)
## --> Copia todos los elementos del arreglo de las incorrectas para agregarlos al que contiene la correcta

# Opeador Optional chaining (?)
## Permite acceder a una propiedad únicamente si el objeto anterior existe. Si artist es null o undefined, devuelve undefined en lugar de producir un error

# Operador Conversión a booleano (!!)
## Convierte un valor a boolean: valores definidos y truthy se convierten en true, mientras que valores falsy se convierten en false

# Operador Type predicate ([value] is number)
## Ejemplo:
- (id): id is number => !!id
## Indica a TypeScript que, cuando el filtro devuelve true, el valor id debe considerarse de tipo number



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