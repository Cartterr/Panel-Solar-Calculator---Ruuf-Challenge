# 🌞 Panel Solar Calculator - Ruuf Challenge

Hola Ruuf!!! Aquí está mi solución para calcular cuántos paneles solares caben en un techo.

## 🎯 Objetivo

El objetivo de este ejercicio es poder entender tus habilidades como programador/a, la forma en que planteas un problema, cómo los resuelves y finalmente cómo comunicas tu forma de razonar y resultados.

## 🛠️ Problema

El problema a resolver consiste en encontrar la máxima cantidad de rectángulos de dimensiones "a" y "b" (paneles solares) que caben dentro de un rectángulo de dimensiones "x" e "y" (techo).

## 🎯 ¿Qué hace?

Esta aplicación calcula cuántos paneles solares rectangulares caben en un techo y los dibuja de forma visual. Es más entrete que usar una terminal!!

## 🚀 Cómo Empezar

```bash
# Instalar dependencias
npm install

# Ejecutar servidor
npm start

# Ir a http://localhost:3000
```

## ✅ Casos de Prueba

Tu solución debe pasar los siguientes casos de prueba:
- Paneles 1x2 y techo 2x4 ⇒ Caben 4
- Paneles 1x2 y techo 3x5 ⇒ Caben 7
- Paneles 2x2 y techo 1x10 ⇒ Caben 0

### 🧪 Casos de Prueba Verificados

He probado exitosamente todos los casos de prueba requeridos:

1. **Panel 1×2 en techo 2×4** → **4 paneles** ✅
   - Resultado esperado: 4 paneles
   - Resultado obtenido: 4 paneles
   - Estado: **PASÓ**

2. **Panel 1×2 en techo 3×5** → **7 paneles** ✅
   - Resultado esperado: 7 paneles
   - Resultado obtenido: 7 paneles (usando orientaciones mixtas)
   - Estado: **PASÓ**

3. **Panel 2×2 en techo 1×10** → **0 paneles** ✅
   - Resultado esperado: 0 paneles
   - Resultado obtenido: 0 paneles
   - Estado: **PASÓ**

Todos los casos de prueba han sido verificados y funcionan correctamente con el algoritmo optimizado de orientaciones mixtas.

## 🧪 Ejemplos que probé

* Techo 10×8, paneles 2×1 → 40 paneles ✅
* Techo 5×3, paneles 2×2 → 2 paneles ✅
* Techo triangular con base 10, altura 8, paneles 1×2 → ~15 paneles (aproximado)

## 📝 Tu Solución

Mi solución implementa un **algoritmo de optimización híbrido** que combina técnicas de **bin packing 2D** con **orientaciones mixtas** para maximizar la cantidad de paneles solares que caben en un techo.

### 🔍 Lógica del Algoritmo

El algoritmo utiliza un enfoque **multi-estrategia** que evalúa tres posibles configuraciones:

1. **Orientación Original (A×B)**: Todos los paneles en su orientación natural
2. **Orientación Rotada (B×A)**: Todos los paneles rotados 90 grados
3. **Orientación Mixta**: Combinación estratégica de ambas orientaciones

### 🧮 Algoritmo de Orientación Mixta

El corazón de la solución es el algoritmo de **orientación mixta** que implementa una variación del **First Fit Decreasing (FFD)** adaptado para rectángulos:

- **Grid-based placement**: Utiliza una matriz de ocupación para rastrear espacios disponibles
- **Greedy placement**: Coloca paneles en la primera posición válida encontrada
- **Dual preference strategy**: Prueba dos órdenes de preferencia (original→rotado y rotado→original)
- **Collision detection**: Verifica que no haya superposición entre paneles

### 🎯 Optimización para Casos Especiales

El algoritmo está especialmente optimizado para casos como el **test case 3×5 con paneles 1×2**, donde la orientación mixta permite colocar 7 paneles en lugar de 6:

- **6 paneles** con orientación única (3×2 en orientación 1×2)
- **7 paneles** con orientación mixta (6×1×2 + 1×2×1 estratégicamente posicionados)

### 🔺 Extensión Triangular

Para techos triangulares, el algoritmo se extiende con:
- **Geometric boundary checking**: Verificación de límites usando ecuaciones de línea
- **Triangle containment algorithm**: Algoritmo de contención para verificar si un rectángulo cabe dentro del triángulo
- **Adaptive step sizing**: Tamaño de paso adaptativo para optimizar la búsqueda

### 🎨 Visualización Interactiva

La aplicación incluye una interfaz web con **Canvas HTML5** que:
- Renderiza techos y paneles en tiempo real
- Diferencia visualmente las orientaciones (naranja para original, azul para rotado)
- Muestra estadísticas detalladas de la distribución

### 📊 Complejidad y Rendimiento

- **Complejidad temporal**: O(n²) donde n es el área del techo
- **Complejidad espacial**: O(n) para la matriz de ocupación
- **Optimización**: Algoritmo greedy que prioriza velocidad sobre optimalidad global

Para detalles técnicos más profundos sobre los algoritmos de bin packing y optimización geométrica utilizados, consulta las referencias al final de este documento.

## 🚀 Tecnologías usadas

* **Frontend** : HTML, CSS, JavaScript vanilla (mantuve las cosas simples)
* **Backend** : Node.js con Express (lo que más suelo usar en proyectos personales)
* **Visualización** : Canvas HTML5 (primera vez usándolo, tuve que buscar en internet cómo usarlo bien!!)

## 🤔 Decisiones de diseño

### ¿Por qué JavaScript vanilla en el frontend?

Pensé en usar Angular, pero decidí mantenerlo sencillo y aprender algo nuevo con Canvas. Además, para un problema cómo este, no necesitaba la complejidad de un framework completo. Pero igual lo estoy considerando para futuros arreglos.

### ¿Por qué Node.js/Express?

Es lo que mejor conozco del backend, y quería enfocarme en resolver el algoritmo más que aprender una nueva tecnología para el server. Además es bien sencillo de configurar.

### Algoritmo elegido

Usé un enfoque  **greedy simple** :

1. Pruebo ambas orientaciones del panel (a×b y b×a)
2. Calculo cuántos caben en cada orientación usando división entera
3. Elijo la orientación que da más paneles
4. Los dibujo en una grilla ordenada

¿Es el algoritmo más óptimo? Posiblemente no 😅 Pero es fácil de entender y funciona bien para casos comunes. (No probe con valores extremos cómo 3 millones de paneles)

## 💰 Bonus (Opcional)

### Bonus Implementado
**Opción 1 (techo triangular isósceles)**

### Explicación del Bonus
Intenté el  **Bonus Opción 1** : Techo triangular isósceles.

Mi approach fue:

* Dividir el triángulo en una grilla de posiciones posibles
* Para cada posición, verificar si el rectángulo completo cabe dentro del triángulo
* Usar la ecuación de la línea para los límites del triángulo

Fue MUY desafiante, posiblemente mi solución no es perfecta, pero aprendí mucho sobre geometría!!!!

## 🤔 Supuestos y Decisiones

* **Algoritmo greedy**: Decidí usar un enfoque simple y directo en lugar de algoritmos más complejos de bin packing, priorizando la claridad del código y la velocidad de desarrollo.
* **Orientación de paneles**: Asumo que los paneles pueden rotarse 90 grados para optimizar el espacio, lo cual es común en instalaciones reales.
* **Colocación en grilla**: Los paneles se colocan en una grilla ordenada sin superposición, asumiendo que no hay restricciones de instalación que requieran espaciado específico.
* **Techo rectangular**: Para el caso base, asumo que el techo es perfectamente rectangular sin obstáculos.
* **Techo triangular**: Para el bonus, asumo un triángulo isósceles con la base horizontal, lo cual simplifica los cálculos geométricos.

## 🏃‍♂️ Cómo ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar servidor
npm start

# Ir a http://localhost:3000
```

## 🚧 Cosas que mejoraría con más tiempo

* [ ] Algoritmo más inteligente de packing (bin packing 2D)
* [ ] Mejor validación de inputs
* [ ] Tests unitarios (sé que son importantes!)
* [ ] UI más bonita (siempre se puede mejorar!!)
* [ ] Manejar casos edge mejor
* [ ] Implementar el bonus 2 también

## 🤓 Lo que aprendí

* Canvas HTML5 es súper poderoso pero tiene curva de aprendizaje
* Los problemas de packing son más complejos de lo que parecen
* Geometría computacional es fascinante y entrete
* A veces simple es mejor que perfecto

## 🌱 Reflexión personal

Me gusto caleta el desafío! Mucho más entrete que tener que simplemente postular con CV. Este fue mi primer problema real de optimización geométrica. No es perfecto, pero estoy orgulloso de haberlo resuelto desde cero. ¡Espero que les guste mi approach y mi disposición!!

P.D: Si hay algo que no se entiende o quieren que explique más, ¡pregúntenme nomas!!

## 📚 Referencias

- [Canvas API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - Para la visualización de techos y paneles con Canvas HTML5.
- [Bin Packing Problem - Wikipedia](https://en.wikipedia.org/wiki/Bin_packing_problem) - Base teórica para el algoritmo greedy de colocación de paneles rectangulares.
- [A Simple Solution for Shape Packing in 2D - Gorillasun.de](https://www.gorillasun.de/blog/a-simple-solution-for-shape-packing-in-2d) - Para el algoritmo de colocación de paneles en techos triangulares y detección de colisiones.
- [Binary Tree Bin Packing Algorithm - Jake Gordon](https://jakesgordon.com/writing/bin-packing/) - Para posibles mejoras en el algoritmo de packing.
- [Express.js Documentation](https://expressjs.com/) - Para la configuración del backend con Node.js/Express.
- [Event Handling - MDN](https://developer.mozilla.org/en-US/docs/Web/Events) - Para los event listeners en JavaScript usados en la interfaz.
