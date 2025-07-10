# 🎨 Proyecto AI Base Assistant – Theme

Este proyecto usa un sistema de tokens de diseño basado en variables CSS con Tailwind.

---

## 🌈 Colores base

| Nombre            | Variable                   |
| ----------------- | -------------------------- |
| Fondo             | `--background`             |
| Texto             | `--foreground`             |
| Primario          | `--primary`                |
| Primario texto    | `--primary-foreground`     |
| Secundario        | `--secondary`              |
| Secundario texto  | `--secondary-foreground`   |
| Destructivo       | `--destructive`            |
| Destructivo texto | `--destructive-foreground` |
| Borde             | `--border`                 |
| Input             | `--input`                  |
| Ring              | `--ring`                   |

---

## 🌗 Dark Mode

Activa dark mode añadiendo la clase `dark` al `<html>`.

---

## 🎯 Ejemplos de uso

```html
<div class="bg-primary text-primary-foreground p-4">
  Componente con color primario
</div>

<button variant="destructive">Borrar</button>
```

🛠️ Variables personalizadas
Si quieres cambiar colores:
Edita :root en globals.css y actualiza los valores HSL.
