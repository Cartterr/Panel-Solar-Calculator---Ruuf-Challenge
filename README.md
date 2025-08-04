# 🌞 Panel Solar Calculator - Ruuf Challenge

Hola Ruuf!!! Aquí está mi solución para calcular cuántos paneles solares caben en un techo.

## 🎯 ¿Qué hace?

Esta aplicación calcula cuántos paneles solares rectangulares caben en un techo y los dibuja de forma visual. Es más entrete que usar una terminal!!

## 🚀 Tecnologías usadas

* **Frontend** : HTML, CSS, JavaScript vanilla (mantuve las cosas simples)
* **Backend** : Node.js con Express (lo que más suelo usar)
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

## 🎁 Bonus implementado

Intenté el  **Bonus Opción 1** : Techo triangular isósceles.

Mi approach fue:

* Dividir el triángulo en una grilla de posiciones posibles
* Para cada posición, verificar si el rectángulo completo cabe dentro del triángulo
* Usar la ecuación de la línea para los límites del triángulo

Fue MUY desafiante, posiblemente mi solución no es perfecta, pero aprendí mucho sobre geometría!!!!

## 🏃‍♂️ Cómo ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar servidor
npm start

# Ir a http://localhost:3000
```

## 🧪 Ejemplos que probé

* Techo 10×8, paneles 2×1 → 40 paneles ✅
* Techo 5×3, paneles 2×2 → 2 paneles ✅
* Techo triangular con base 10, altura 8, paneles 1×2 → ~15 paneles (aproximado)

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
- [Binary Tree Bin Packing Algorithm - Jake Gordon](https://jakesgordon.com/writing/binary-tree-bin-packing-algorithm) - Para posibles mejoras en el algoritmo de packing.
- [Express.js Documentation](https://expressjs.com/) - Para la configuración del backend con Node.js/Express.
- [Event Handling - MDN](https://developer.mozilla.org/en-US/docs/Web/Events) - Para los event listeners en JavaScript usados en la interfaz.