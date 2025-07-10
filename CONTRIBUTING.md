# 🤝 Contributing Guidelines

¡Gracias por contribuir a este proyecto!  
Por favor, sigue estas convenciones de estilo y estructura:

---

## ✨ Nomenclatura de Archivos y Carpetas

- Componentes se ubican en `/src/components`.
- Features se ubican en `/src/features`.
- Hooks se ubican en `/src/hooks`.
- Usa **kebab-case** para carpetas.
- Usa **PascalCase** para archivos de componentes y hooks.

---

## ✨ Estructura de Componentes

✅ **Client Components**

```tsx
'use client';

export const MiComponente = () => {
  // JSX aquí
};
```

✅ Server Actions

```tsx
'use server';

export async function miServerAction(params) {
  // Lógica de servidor aquí
}
```

✅ Hooks

```tsx
export const useMiHook = () => {
  // Hook logic
};
```

✨ Reglas de ESLint y Prettier

- Usa comillas simples.

- Siempre punto y coma al final.

- Usa const para componentes y hooks.

- Usa export async function para Server Actions.

- Formatea antes de commitear (npm run format).

✨ Commits

- Usa mensajes claros en inglés.

Ejemplo:

- feat: add contact form

- fix: handle fetch error

- chore: update dependencies
