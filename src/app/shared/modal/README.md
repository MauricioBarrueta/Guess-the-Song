# ReturnType<T> 
## Es un tipo utilitario de TypeScript que obtiene automáticamente el tipo de retorno de una función. Combinado con typeof, permite declarar variables con el mismo tipo que devuelve una función
## En este caso:
- Se utiliza para almacenar las referencias de setTimeout() y setInterval(), permitiendo cancelarlas posteriormente mediante clearTimeout() y clearInterval() sin preocuparse por las diferencias de tipos entre navegadores y Node.js

# clearTimeout() y clearInterval()
## Cancelan temporizadores creados previamente con setTimeout() y setInterval(), evitando que continúen ejecutándose