# Guía de Estilos Globales

## Descripción

El archivo `src/styles.css` contiene estilos globales, variables CSS y clases utilitarias que deben usarse en todos los bounded contexts (alerts, telemetry, history, labs, etc.) para mantener consistencia y evitar duplicación.

## Variables CSS Disponibles

### Colores
```css
var(--primary-color)       /* #1976d2 */
var(--primary-light)       /* #42a5f5 */
var(--primary-dark)        /* #1565c0 */
var(--secondary-color)     /* #424242 */
var(--success-color)       /* #4caf50 */
var(--warning-color)       /* #ff9800 */
var(--error-color)         /* #f44336 */
var(--info-color)          /* #2196f3 */
var(--background-color)    /* #fafafa */
var(--surface-color)       /* #ffffff */
var(--text-primary)        /* #212121 */
var(--text-secondary)      /* #757575 */
```

### Espaciado
```css
var(--spacing-xs)   /* 4px */
var(--spacing-sm)   /* 8px */
var(--spacing-md)   /* 16px */
var(--spacing-lg)   /* 24px */
var(--spacing-xl)   /* 32px */
var(--spacing-xxl)  /* 48px */
```

### Tipografía
```css
var(--font-size-xs)    /* 12px */
var(--font-size-sm)    /* 14px */
var(--font-size-md)    /* 16px */
var(--font-size-lg)    /* 18px */
var(--font-size-xl)    /* 20px */
var(--font-size-2xl)   /* 24px */
var(--font-size-3xl)   /* 32px */
```

### Bordes y Sombras
```css
var(--border-radius-sm)    /* 2px */
var(--border-radius-md)    /* 4px */
var(--border-radius-lg)    /* 8px */
var(--border-radius-xl)    /* 16px */

var(--shadow-sm)
var(--shadow-md)
var(--shadow-lg)
var(--shadow-xl)
```

## Clases Utilitarias

### Espaciado
- `.p-xs`, `.p-sm`, `.p-md`, `.p-lg`, `.p-xl` - Padding
- `.px-*`, `.py-*` - Padding horizontal/vertical
- `.m-*`, `.mx-*`, `.my-*`, `.mb-*`, `.mt-*` - Margin

### Flex Box
- `.flex` - `display: flex`
- `.flex-center` - Centrado con flex
- `.flex-between` - Espacio entre elementos
- `.flex-column` - Dirección columna
- `.flex-wrap` - Wrap habilitado
- `.gap-xs`, `.gap-sm`, `.gap-md`, `.gap-lg`, `.gap-xl` - Espaciado entre items

### Grid
- `.grid` - `display: grid`
- `.grid-2`, `.grid-3`, `.grid-4` - Grid con 2, 3 o 4 columnas

### Texto
- `.text-xs`, `.text-sm`, `.text-md`, `.text-lg`, `.text-xl`, `.text-2xl`, `.text-3xl` - Tamaños
- `.text-primary`, `.text-secondary`, `.text-disabled` - Colores
- `.text-success`, `.text-warning`, `.text-error`, `.text-info` - Estados
- `.text-bold`, `.text-semibold`, `.text-normal`, `.text-light` - Peso
- `.text-center`, `.text-left`, `.text-right` - Alineación

### Fondo y Bordes
- `.bg-primary`, `.bg-secondary`, `.bg-success`, `.bg-warning`, `.bg-error`, `.bg-surface`
- `.border`, `.border-primary`, `.border-success`, `.border-warning`, `.border-error`
- `.rounded-sm`, `.rounded-md`, `.rounded-lg`, `.rounded-xl`

### Sombras
- `.shadow-sm`, `.shadow-md`, `.shadow-lg`, `.shadow-xl`

### Otros
- `.cursor-pointer`
- `.hidden`
- `.opacity-50`, `.opacity-75`

## Componentes Base

### Card
```html
<div class="card">
  <!-- Contenido -->
</div>
```

### Container
```html
<div class="container">
  <!-- Contenido centrado -->
</div>
```

### Botones
```html
<button class="button-base button-primary">Primario</button>
<button class="button-base button-secondary">Secundario</button>
```

### Divisor
```html
<hr class="divider">
```

## Ejemplo de Uso en Bounded Context

En lugar de definir estilos repetitivos en cada componente, usa las clases globales:

### ❌ Sin Estilos Globales (Antes)
```css
/* alerts-page.css */
.drawer-container {
  padding: 24px;
  height: 100%;
  background-color: #ffffff;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.filters-bar {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
```

### ✅ Con Estilos Globales (Después)
```css
/* alerts-page.css - Solo estilos específicos del componente */
.drawer-container {
  height: 100%;
}

.alert-item {
  background-color: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}
```

```html
<!-- alerts-page.html -->
<div class="drawer-container p-lg bg-surface">
  <div class="summary-cards grid-4 gap-md mb-lg">
    <!-- Summary cards -->
  </div>
  
  <div class="filters-bar flex flex-wrap gap-md mb-lg">
    <!-- Filters -->
  </div>
  
  <div class="alerts-list">
    <!-- Alerts -->
  </div>
</div>
```

## Ventajas

1. **Consistencia Visual**: Todos los bounded contexts usan el mismo sistema de diseño
2. **Mantenimiento Simplificado**: Cambios de estilos globales afectan a todos los bounded contexts
3. **Menos Código CSS**: Menos duplicación en archivos CSS locales
4. **Facilidad de Escalado**: Agregar nuevos bounded contexts es más rápido
5. **Flexibilidad**: Las variables CSS permite temas (dark mode, etc.)

## Personalización por Bounded Context

Si necesitas un estilo específico para un bounded context:

```css
/* alerts.css - Estilos específicos de alerts */
.alert-item {
  padding: var(--spacing-md);
  border-left: 4px solid var(--primary-color);
}

.alert-item.warning {
  border-left-color: var(--warning-color);
}
```

Siempre usa las variables globales en lugar de valores hardcodeados.
