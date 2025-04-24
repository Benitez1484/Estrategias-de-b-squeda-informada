// Implementación del algoritmo A* para optimización SEO
class SeoEstado {
    constructor(velocidad, keywords, enlaces, legibilidad, costo = 0) {
      this.velocidad = velocidad;
      this.keywords = keywords;
      this.enlaces = enlaces;
      this.legibilidad = legibilidad;
      this.costo = costo;
    }
    
    // Clonar estado para simular acciones
    clonar() {
      return new SeoEstado(
        this.velocidad,
        this.keywords,
        this.enlaces,
        this.legibilidad,
        this.costo
      );
    }
    
    // Aplicar acción y retornar nuevo estado
    aplicarAccion(tipo) {
      const nuevoEstado = this.clonar();
      
      if (nuevoEstado[tipo] < 100) {
        nuevoEstado[tipo] += 10;
        nuevoEstado.costo += 1;
      }
      
      return nuevoEstado;
    }
    
    // Verificar si el estado es óptimo (todos los valores en 100)
    esOptimo() {
      return this.velocidad === 100 && 
             this.keywords === 100 && 
             this.enlaces === 100 && 
             this.legibilidad === 100;
    }
  }
  
  // Funciones de evaluación para algoritmo A*
  class AlgoritmoAStar {
    constructor() {
      this.pesos = {
        velocidad: 0.25,
        keywords: 0.30,
        enlaces: 0.20,
        legibilidad: 0.25
      };
    }
    
    // Función heurística h(n): Estima el costo al objetivo
    // Devuelve un valor entre 0-100 donde más bajo es mejor
    calcularHeuristica(estado) {
      let valorTotal = 0;
      let valorActual = 0;
      
      for (let prop in this.pesos) {
        valorTotal += 100 * this.pesos[prop]; // Valor óptimo ponderado
        valorActual += estado[prop] * this.pesos[prop]; // Valor actual ponderado
      }
      
      // Calcular diferencia al objetivo (menor es mejor)
      const diferencia = valorTotal - valorActual;
      
      return Math.round(diferencia);
    }
    
    // Función de evaluación f(n) = g(n) + h(n)
    calcularEvaluacion(estado) {
      const h = this.calcularHeuristica(estado);
      const g = estado.costo;
      return g + h;
    }
    
    // Simular el algoritmo A* para encontrar mejor acción
    encontrarMejorAccion(estadoActual) {
      const acciones = ['velocidad', 'keywords', 'enlaces', 'legibilidad'];
      let mejorAccion = null;
      let mejorEvaluacion = Infinity;
      
      // Evaluar cada acción posible
      for (const accion of acciones) {
        if (estadoActual[accion] < 100) {
          const nuevoEstado = estadoActual.aplicarAccion(accion);
          const evaluacion = this.calcularEvaluacion(nuevoEstado);
          
          if (evaluacion < mejorEvaluacion) {
            mejorEvaluacion = evaluacion;
            mejorAccion = accion;
          }
        }
      }
      
      return { accion: mejorAccion, evaluacion: mejorEvaluacion };
    }
  }
  
  // Gestor de la interfaz de usuario
  class InterfazUI {
    constructor(estado, algoritmo) {
      this.estado = estado;
      this.algoritmo = algoritmo;
      this.historialAcciones = [];
    }
    
    // Actualizar elementos visuales
    actualizarUI() {
      // Actualizar valores textuales
      document.getElementById('velocidad').textContent = this.estado.velocidad;
      document.getElementById('keywords').textContent = this.estado.keywords;
      document.getElementById('enlaces').textContent = this.estado.enlaces;
      document.getElementById('legibilidad').textContent = this.estado.legibilidad;
      
      // Actualizar barras de progreso
      document.getElementById('velocidad-bar').style.width = `${this.estado.velocidad}%`;
      document.getElementById('keywords-bar').style.width = `${this.estado.keywords}%`;
      document.getElementById('enlaces-bar').style.width = `${this.estado.enlaces}%`;
      document.getElementById('legibilidad-bar').style.width = `${this.estado.legibilidad}%`;
      
      // Actualizar métricas del algoritmo A*
      const heuristica = this.algoritmo.calcularHeuristica(this.estado);
      const evaluacion = this.algoritmo.calcularEvaluacion(this.estado);
      
      document.getElementById('heuristica').textContent = heuristica;
      document.getElementById('coste').textContent = this.estado.costo;
      document.getElementById('evaluacion').textContent = evaluacion;
      
      // Verificar botones deshabilitados
      this.actualizarBotones();
      
      // Si es estado óptimo, mostrar alerta
      if (this.estado.esOptimo()) {
        setTimeout(() => {
          alert('¡Felicidades! Has alcanzado el estado óptimo para tu sitio web.');
        }, 300);
      }
    }
    
    // Deshabilitar botones que ya llegaron a 100
    actualizarBotones() {
      const botones = {
        'velocidad': document.getElementById('btn-velocidad'),
        'keywords': document.getElementById('btn-keywords'),
        'enlaces': document.getElementById('btn-enlaces'),
        'legibilidad': document.getElementById('btn-legibilidad')
      };
      
      for (const tipo in botones) {
        if (this.estado[tipo] >= 100) {
          botones[tipo].disabled = true;
          botones[tipo].innerHTML = `<i class="fas fa-check-circle"></i> ${botones[tipo].innerText.split(' ').slice(1).join(' ')} (Completado)`;
        }
      }
    }
    
    // Agregar acción al historial
    agregarAlHistorial(tipo, resultado) {
      const historicoDiv = document.getElementById('historial-acciones');
      
      // Eliminar mensaje inicial si existe
      const noHistorial = historicoDiv.querySelector('.no-historial');
      if (noHistorial) {
        historicoDiv.removeChild(noHistorial);
      }
      
      // Crear nuevo elemento de historial
      const nuevoItem = document.createElement('div');
      nuevoItem.className = 'historial-item';
      
      // Formato del mensaje según tipo de acción
      const mensajes = {
        'velocidad': 'Optimización de velocidad',
        'keywords': 'Mejora de palabras clave',
        'enlaces': 'Adición de enlaces internos',
        'legibilidad': 'Mejora de legibilidad'
      };
      
      // Crear iconos según tipo
      const iconos = {
        'velocidad': 'fas fa-tachometer-alt',
        'keywords': 'fas fa-key',
        'enlaces': 'fas fa-link',
        'legibilidad': 'fas fa-font'
      };
      
      nuevoItem.innerHTML = `
        <span><i class="${iconos[tipo]}"></i> ${mensajes[tipo]}</span>
        <span>f(n): ${resultado}</span>
      `;
      
      // Insertar al inicio para que lo más reciente esté arriba
      historicoDiv.insertBefore(nuevoItem, historicoDiv.firstChild);
      
      // Limitar historial a 10 elementos
      this.historialAcciones.push({ tipo, resultado });
      if (this.historialAcciones.length > 10) {
        this.historialAcciones.shift();
      }
    }
    
    // Recomendar siguiente acción (A*)
    recomendarSiguienteAccion() {
      const recomendacion = this.algoritmo.encontrarMejorAccion(this.estado);
      
      if (recomendacion.accion) {
        const botones = {
          'velocidad': document.getElementById('btn-velocidad'),
          'keywords': document.getElementById('btn-keywords'),
          'enlaces': document.getElementById('btn-enlaces'),
          'legibilidad': document.getElementById('btn-legibilidad')
        };
        
        // Resaltar botón recomendado
        for (const btn in botones) {
          botones[btn].classList.remove('recomendado');
        }
        
        botones[recomendacion.accion].classList.add('recomendado');
      }
    }
  }
  
  // Instanciar clases y preparar aplicación
  const estadoInicial = new SeoEstado(30, 40, 20, 50, 0);
  const astar = new AlgoritmoAStar();
  const ui = new InterfazUI(estadoInicial, astar);
  
  // Inicializar UI
  document.addEventListener('DOMContentLoaded', () => {
    ui.actualizarUI();
  });
  
  // Función global para aplicar acciones
  function aplicarAccion(tipo) {
    // Aplicar acción si no está al máximo
    if (ui.estado[tipo] < 100) {
      // Crear nuevo estado
      const nuevoEstado = ui.estado.aplicarAccion(tipo);
      
      // Actualizar estado actual
      ui.estado = nuevoEstado;
      
      // Calcular evaluación con algoritmo A*
      const evaluacion = astar.calcularEvaluacion(nuevoEstado);
      
      // Actualizar UI
      ui.actualizarUI();
      
      // Agregar al historial
      ui.agregarAlHistorial(tipo, evaluacion);
      
      // Recomendar siguiente mejor acción
      ui.recomendarSiguienteAccion();
    }
  }