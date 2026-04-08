# Agent Instructions

- Никогда не вноси изменения в файлы

## Проект

**Фреймворк:** Solid.js  
**Тесты:** Jest (`npm run test`)  
**Сборка:** Webpack (`npm run build`)  
**Локальный сервер:** (`npm run serve`)

## Структура

- `src/editor/` — редактор (контекст, контроллеры, виджеты)
- `src/viewer/` — вьювер (отображение сущностей)
- `src/entity/` — сущности и их типы
- `src/storage/` — хранилище данных
- `src/utility/` — общие виджеты и утилиты
- `src/asset/` — ассеты (изображения, фигуры)
- `src/i18n.ts` — интернационализация

## Конвенции

- Используется CSS Modules (`.module.scss`)
- Компоненты экспортируются через `index.ts`
- Контексты: `*Context` / `use*Context`
- Менеджеры: `*Manager`
- InputHandler: классы для обработки ввода в редакторе

## Важно

- TypeScript проверяется через `npx tsc --noEmit`
