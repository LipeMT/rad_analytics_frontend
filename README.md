# RAD Analytics

Dashboard de visualização de atividades acadêmicas desenvolvido com React, TypeScript e Tailwind CSS.

## Visão Geral

Este projeto apresenta uma interface interativa para explorar diferentes análises de atividades, incluindo:

- Descrição por período
- Distribuição de atividades
- Atividades por período
- Variação de atividades
- Docentes por atividade

A aplicação fornece navegação simples entre painéis por meio de um layout fixo com menu responsivo.

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- lucide-react
- html-to-image
- react-router-dom
- date-fns

## Estrutura do Projeto

- `src/main.tsx` - entrada da aplicação
- `src/App.tsx` - componente principal que renderiza o roteador
- `src/routes/index.tsx` - configuração de rotas
- `src/components/Layout` - layout e cabeçalho com menu
- `src/components/Pages` - páginas com visualizações de dados
- `src/components/Charts` - componentes de gráfico reutilizáveis
- `src/utils/exportToPng.ts` - utilitário para exportar gráficos como PNG
- `src/types` - tipos TypeScript

## Como Executar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Abra o endereço exibido no terminal (normalmente `http://localhost:5173`).

## Scripts Disponíveis

- `npm run dev` - inicia o servidor de desenvolvimento
- `npm run build` - cria a versão de produção
- `npm run preview` - pré-visualiza o build de produção localmente
- `npm run lint` - executa o ESLint no projeto

## Desenvolvimento

- Use componentes em `src/components` para manter o layout e as visualizações separados.
- Adicione novas páginas em `src/components/Pages` e registre-as em `src/routes/index.tsx`.
- Se precisar gerar imagens de gráficos, utilize `exportarPNG` em `src/utils/exportToPng.ts`.

## Observações

- O projeto já está configurado com Tailwind CSS e Vite.
- Embora `@supabase/supabase-js` esteja listado nas dependências, atualmente não há uso explícito de Supabase no código-fonte.

## Licença

Este projeto é privado e está configurado para uso local/educacional.
