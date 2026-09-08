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

`npm run verify` tests the app-ads.txt generator, creates the production site in
`dist`, and checks that the generated `app-ads.txt` is current and identical in
the repository root, `public`, and published output. It also confirms that
`CNAME`, `robots.txt`, and every privacy policy remain unchanged.

## Updating app-ads.txt

Edit the individual provider files in `app-ads/sources/`. The build automatically
validates and merges them into `/app-ads.txt`, with `ownerdomain=ezi.am` and
duplicate records removed. Existing entries absent from the supplied provider
files are in `app-ads/sources/others.txt`.

Run `npm run ads:build` to refresh the checked-in output, or `npm run verify` for
the full build. Commit the source files and generated outputs together. Changes
deployed from `master` keep the public URL at `https://ezi.am/app-ads.txt`.
See [the maintenance guide and account review](app-ads/README.md).

## GitHub Pages

The deployment workflow runs when changes reach `master`. In the repository
settings, set **Pages > Build and deployment > Source** to **GitHub Actions**
before merging the redesign.
