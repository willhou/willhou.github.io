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
`CNAME`, `robots.txt`, the privacy and terms pages, and their shared stylesheet
match across those three locations.

## Digital Clock Widget legal pages

The Android app links to `https://ezi.am/privacy/dcw.html`; keep that URL stable.
Its Terms of Service are at `https://ezi.am/terms/dcw.html`. Both are standalone
HTML pages with shared styles at `/legal/dcw.css` and links from the home-page
footer. They work without JavaScript.

Update the matching files in the repository root and `public` together, then
run `npm run verify`. The build copies `public` into `dist`. See the
[source review and maintenance notes](docs/legal/dcw-review.md) before updating
data-practice disclosures. Changes pushed to `master` deploy through the GitHub
Pages workflow.

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
