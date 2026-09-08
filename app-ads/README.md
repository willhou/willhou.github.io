# Maintaining ezi.am/app-ads.txt

Edit the provider files in `sources/`; the build creates the single public
`https://ezi.am/app-ads.txt`. Provider files are inputs in the repository, not
endpoints that advertising crawlers need to discover.

## Structure and update workflow

```text
app-ads/
  config.json          # Owner domain and ordered list of source filenames
  sources/
    admob.txt
    unity.txt
    inmobi.txt
    vungle.txt
    meta.txt
    pangle.txt
    others.txt         # Existing records absent from the supplied files
  report.json          # Generated counts and conflicts, with file/line references
app-ads.txt            # Generated compatibility copy
public/app-ads.txt     # Generated input for Vite
dist/app-ads.txt       # Built file deployed to GitHub Pages
```

1. Replace a provider's file with its complete, account-specific dashboard
   export. Keep shared resellers in each provider file so future replacements
   remain independent. The original six supplied files were initially copied verbatim. Unity's
   verified DIRECT entry was subsequently moved from `others.txt` to `unity.txt`.
2. For a new provider, add a `.txt` file to `sources/` and add its filename to
   `config.json`. Remove both the filename and file when retiring a provider,
   and review `others.txt` for any remaining authorizations it supplied.
3. Run `npm run ads:build` to regenerate the two checked-in output copies and
   report, or `npm run verify` to also run tests and the production build.
4. Review the diff and `report.json`, then commit the inputs and generated files
   together. Deployment runs when changes reach `master`.
5. After deployment, visit the public file and use AdMob's **Apps > View all
   apps > app-ads.txt > Check for updates**. Allow at least 24 hours for the
   status to update. [Google's setup guide](https://support.google.com/admob/answer/9363762?hl=en)

`npm run dev` and `npm run build` regenerate automatically when started.
If source files change while the dev server is running, run `npm run ads:build`
again. `npm run ads:check` checks for stale generated files without writing them.
`npm run ads:test` runs focused parser and build tests.

The generator validates all sources before writing output. Missing, empty, or
malformed sources fail the deployment build. It accepts three or four fields,
comments, blank lines, a UTF-8 BOM, CRLF, and missing final newlines. It normalizes
domain capitalization, relationship capitalization, and separator spacing, but
preserves seller IDs and certification IDs exactly. Only identical full records
are deduplicated. A record with an optional certification ID and one without it
are both retained. The first source gets the emitted record; all provider inputs
keep their own copies. Conflicting relationships or nonempty certification IDs
produce review warnings, not guessed corrections.

Put the owner domain in `config.json`, without a scheme or path. The output
contains exactly one `ownerdomain=ezi.am`. Source files contain seller records
and comments only; additional metadata directives require an explicit generator
update, rather than being silently accepted from provider files.

## Why generate during the build?

The live endpoint is served by GitHub Pages. GitHub describes Pages as static
hosting that publishes built HTML, CSS, JavaScript, and other files; it does not
run a request-time application server. The repository's deployment already
builds with Vite. [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

Separate source files plus a generated public file is our engineering
recommendation for this setup, not an IAB-mandated folder layout or a claim
about how frequently other publishers use it. It provides the requested
maintenance benefits with no runtime fetches or new hosting service.

| Approach | Fit for this site |
| --- | --- |
| Build-time merge, static response | Recommended: validates each update before deployment and keeps serving the last successful deployment if a build fails. |
| Merge on each request in a Worker/server | Possible after adding runtime hosting/routing; useful if records change independently of deployments. Adds failure modes without a benefit for these checked-in inputs. |
| Managed third-party hosting with an HTTP redirect | Possible, but introduces another service to manage. Google supports HTTP redirects for app-ads.txt discovery. |

Advertising crawlers need the complete text response at the root URL. JavaScript
in the webpage cannot assemble it for them. There is no general-purpose
`include=unity.txt` mechanism in the standard. `SUBDOMAIN` and
`INVENTORYPARTNERDOMAIN` describe specific inventory relationships, not arbitrary
local file imports. [IAB specification](https://iabtechlab.com/wp-content/uploads/2022/04/Ads.txt-1.1.pdf),
[Google crawler and redirect rules](https://support.google.com/admob/answer/9363762?hl=en)

The existing `.openai/hosting.json` and Sites packaging are separate from the
confirmed live GitHub Pages endpoint. This change uses the existing GitHub
deployment, without migrating the domain or publishing a separate Sites copy.

## Migration audit — 2026-09-07

The live file, root file, and `public` file matched before migration: 643 seller
rows, 589 unique records after domain/spacing normalization. The six supplied
files contain 575 unique records. Initially, 152 unique existing records were
absent from those files. After moving the verified Unity DIRECT entry into
`unity.txt`, `others.txt` contains 150 active rows and one commented historical
Meta DIRECT row superseded by the supplied RESELLER declaration. The original
union contains 727 distinct records; the final output contains **726 active
records** after that correction.
The merge removes 22 duplicate input rows. These numbers describe records, not
the number of mediation integrations, active bidders, or new revenue sources.

All six attachments are treated as data. Seller entries were not executed or
interpreted as instructions. No account or certification IDs were invented.

The live HTTPS endpoint returned `200 OK`, `Content-Type: text/plain;
charset=utf-8`, and `Cache-Control: max-age=600`, with a GitHub server header.
The repository's robots.txt allows all crawlers. Public app-store listing links,
provider dashboards, SDK configuration, and revenue reports have not been
verified by this repository audit.

### Items to review in provider accounts

- **Google business domain is missing publicly.** Google's public
  [sellers.json](https://realtimebidding.google.com/sellers.json), fetched on the
  audit date, contained this exact record:

  ```json
  {
    "seller_id": "pub-9243771539778722",
    "seller_type": "PUBLISHER",
    "name": "EZI STUDIO INC"
  }
  ```

  Your name is already public, but no `domain` was present. The subsequently
  supplied AdMob screenshot confirms Transparent is selected and `ezi.am` is
  already entered, with a Verify button visible. This corrects the initial
  suggestion to add the domain: its entry is not missing. The screenshot does
  not establish successful ownership verification. Click Verify and follow
  the resulting instructions, then Save if enabled. Google's seller guide
  links to [Search Console ownership verification](https://support.google.com/webmasters/answer/9008080).
  A missing public domain can reflect incomplete verification or publication
  delay; the precise cause remains unconfirmed. Google says updates can take
  up to seven days. Adding OWNERDOMAIN to
  this repository does not update Google's seller record. Google publishes
  that file; an app publisher does not need to create a local sellers.json just
  for using mediation. [Google seller-information guide](https://support.google.com/admob/answer/9884382?hl=en)

- **Unity's DIRECT entry has been verified and moved into `unity.txt`.**
  `unity.com, 20675771, DIRECT, 96cabb5fbdde37a7` uses the Developer/seller ID.
  Unity's public [sellers.json](https://unity.com/sellers.json) lists `20675771`
  as a PUBLISHER named `mhhou323` with domain `ezi.am`. The Organization/Core ID
  `2475959658907` is a separate identifier and should not replace it. Use
  **Show full list** in Unity's organization settings for future updates.
  Unity's current documentation also calls for OWNERDOMAIN and alignment with
  the seller domain in sellers.json. [Unity's app-ads.txt guide](https://docs.unity.com/en-us/grow/ads/optimization/app-ads-txt)

- **Meta's relationship is resolved using its published template.** The
  supplied `meta.txt` says `RESELLER` for `1310236346537451`; the existing file
  said `DIRECT`. The exact Meta guide linked from Google's AdMob integration
  instructions lists both relationship types in its general field definition,
  but explicitly uses RESELLER in its Business ID and Property ID examples.
  We therefore use the supplied RESELLER row and preserve the old DIRECT row
  only as an inactive comment in `others.txt`. Using AdMob mediation is not, by
  itself, the reason to choose RESELLER. Confirm the numeric ID belongs to the
  intended Meta business/property; ownership cannot be established from these
  text files. If Meta later provides a different account-specific snippet,
  use that. [Meta's app-ads.txt guide](https://developers.facebook.com/documentation/audience-network/optimization/best-practices/authorized-sellers-app-ads),
  [Google's Meta integration guide](https://developers.google.com/admob/android/mediation/meta)

- **Review older authorizations.** `others.txt` includes MoPub, AppLovin, and
  FiveCDM direct entries plus older reseller chains. Preservation is not
  confirmation that they remain authorized or useful. MoPub is an obvious
  cleanup candidate: AppLovin announced its scheduled March 31, 2022 sunset.
  Confirm active relationships and remove obsolete records deliberately.
  [AppLovin announcement](https://investors.applovin.com/news/news-details/2022/AppLovin-Closes-Acquisition-of-Twitters-MoPub-Business/default.aspx)

### Other metadata and revenue checks

OWNERDOMAIN identifies the business that owns the app. It should align with
the business domain exposed by your sellers. MANAGERDOMAIN is for a primary or
exclusive monetization manager; using AdMob mediation does not by itself
establish that relationship, so none is added. CONTACT is optional and has not
been invented. [IAB owner and manager domain explanation](https://iabtechlab.com/why-ownerdomain-managerdomain-fields-are-important-additions-to-ads-txt/)

Confirm every monetized app's public store listing links to `https://ezi.am`
as its developer website (Google Play website; Apple's Marketing URL). Verify
the publisher snippets and successful crawl status in all provider dashboards.
The store website link is how crawlers discover your authorization file.
[Google setup requirements](https://support.google.com/admob/answer/9363762?hl=en)

This file protects authorized demand; it cannot guarantee higher eCPM or revenue.
Adding arbitrary sellers does not configure them in AdMob. Test every enabled
mediation source using Ad Inspector, check compatible SDK/adapter versions and
mapping, and check privacy/consent integrations using each provider's current
guide. [Ad Inspector](https://support.google.com/admob/answer/10159602?hl=en),
[Google's Meta integration guide](https://developers.google.com/admob/android/mediation/meta)

After configuration is verified, compare revenue per user, match/show rates,
latency, and retention by country, platform, and ad format. Test floors and
mediation changes against total revenue and user experience; a higher eCPM with
fewer impressions can reduce earnings. Google describes mediation optimization
and the tradeoff between ad volume and retention in its
[mediation guide](https://admob.google.com/home/resources/optimize-revenue-with-ad-mediation/)
and [ad strategy guide](https://admob.google.com/home/resources/optimize-in-app-advertising-strategy/).
