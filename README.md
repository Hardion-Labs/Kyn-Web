# Kyn-Web

Site da linguagem [Kyn](https://github.com/Hardion-Labs/Kyn), da Hardion Labs:
<https://hardion-labs.github.io/Kyn-Web/>

Feito com Vite, React, TypeScript e Tailwind CSS.

## Desenvolvimento

Requer Node.js 22.12 ou superior (o deploy usa a versão 24).

```sh
npm ci           # instala as dependências
npm run dev      # servidor de desenvolvimento
npm run build    # gera o site em dist/
npm run preview  # serve localmente o conteúdo de dist/
```

## Publicação no GitHub Pages

A cada push na branch `main`, o workflow
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) compila o site e
publica a pasta `dist/` no GitHub Pages. Também dá para rodá-lo manualmente em
**Actions → Deploy no GitHub Pages → Run workflow**.

Configuração necessária (uma única vez): em **Settings → Pages → Build and
deployment → Source**, selecione **GitHub Actions**.

> **Por que não "Deploy from a branch"?** Nesse modo o GitHub Pages publica o
> código-fonte sem compilar. O `index.html` da raiz aponta para `/src/main.tsx`,
> que o navegador não consegue executar, e o site aparece totalmente em branco.
