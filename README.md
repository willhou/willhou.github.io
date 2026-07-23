# ezi.am

The source for Will Hou's personal website.

## Local development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run verify
```

`npm run verify` creates the production site in `dist` and confirms that
`app-ads.txt`, `CNAME`, `robots.txt`, and every privacy policy remain unchanged
in the published output.

## GitHub Pages

The deployment workflow runs when changes reach `master`. In the repository
settings, set **Pages > Build and deployment > Source** to **GitHub Actions**
before merging the redesign.
