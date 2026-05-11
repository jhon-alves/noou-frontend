# Noou.

Noou. é uma plataforma web desenvolvida com foco em agentes de IA.

## Stack principal

- Vite
- React
- TypeScript
- TailwindCSS
- shadcn/ui
- Zustand
- TanStack Query
- React Router
- React Hook Form
- Zod
- i18next
- Vitest

## Pré-requisitos

Antes de iniciar, garanta que você tenha instalado:

- Node.js 20+
- npm
- Git

## Instalação

Clone o repositório:

```bash
git clone <repository-url>
```

Acesse a pasta do projeto:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute o projeto em staging:

```bash
npm run stg
```

Execute o projeto em produção:

```bash
npm run prod
```

## Build

Build de desenvolvimento:

```bash
npm run build:dev
```

Build de staging:

```bash
npm run build:stg
```

Build de produção:

```bash
npm run build:prod
```

## Padrões de branch

As branches devem seguir o padrão: **tipo/descricao-curta**

- feature - Usada para desenvolvimento de novas funcionalidades, telas, componentes ou fluxos.
- hotfix - Usada para correções urgentes em produção ou ajustes críticos que precisam ser entregues rapidamente.
- release - Usada para preparação de uma versão de entrega, agrupando ajustes finais, validações, correções pequenas e estabilização antes do deploy.

Exemplos:

```
feature/add-new-functionality
hotfix/adjust-prompt-bug
release/refatora-código sem alterar comportamento
```

## Padrões de commit

[Código-da-tarefa] - descrição do que foi feito

Exemplos:

- [DEV-1] - add inbox page
- [DEV-2] - fix send payload
- [DEV-3] - adjust abort container

## Rotas

As rotas principais ficam em: **src/routes/AppRoutes.tsx**

O projeto utiliza:

- rotas públicas;
- rotas privadas;
- lazy loading para páginas menos acessadas;
- loaders/skeletons para fallback visual.

## Internacionalização

O projeto utiliza i18next com suporte para português e inglês.

Arquivos de tradução:

- src/i18n/locales/pt/translation.json
- src/i18n/locales/en/translation.json

Uso em componentes:

```bash
import { useTranslation } from "react-i18next"

export function Example() {
  const { t } = useTranslation()

  return <h1>{t("example.title")}</h1>
}
```
