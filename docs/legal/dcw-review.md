# Digital Clock Widget legal-page review

Reviewed November 4, 2026. Public documents:

- Privacy: <https://ezi.am/privacy/dcw.html> (existing app-linked URL retained)
- Terms: <https://ezi.am/terms/dcw.html>

## Sources and scope

The terms were adapted from the owner's completed `docs/legal/terms-of-service.txt`
in the Digital Clock Widget checkout. All twelve sections and body paragraphs
were preserved in the initial publication; headings, links, and layout were
formatted for the website. At the owner's subsequent request, the postal address
and phone number were removed from both public pages, retaining company and email
contact details.

The Android source reviewed was `willhou/digitalclock` at
`3aa6754cb78e52a2dff82476ebec3009f7ad253b`, the `6.5.0` release tag. The review
examined actual initialization and call sites in addition to dependencies. It
was a source/configuration review, not a device traffic capture or an audit of
all third-party SDK internals. Earlier app versions can differ.

Owner confirmations in this chat:

- The app is available to everyone, all ages, with an Everyone content rating.
- Retention follows the services' retention schedules.
- Only active advertising partners should be included in the policy.

The company, developer name, postal address, email, and phone were checked
against the [public Google Play listing](https://play.google.com/store/apps/details?id=com.maize.digitalClock).

## Implementation evidence

Paths below are relative to the Android repository at the reviewed commit.

| Topic | Evidence | Disclosure decision |
| --- | --- | --- |
| Analytics and crash collection | `app/src/main/java/com/maize/digitalClock/DigitalClockApplication.kt`, `util/Logging.kt` | Release builds enable Analytics and Crashlytics in `Application.onCreate`, independently of UMP. Release logging includes INFO and above and recorded exceptions; DEBUG/VERBOSE are filtered. No app-wide opt-out or Firebase consent call was found. |
| Analytics events | `app/src/main/java/com/maize/digitalClock/analytics/WidgetTelemetry.kt`, `feature/clockface/.../ClockFaceTelemetry.kt`, `core/ads/.../AdTelemetry.kt`, screen-view calls in fragments | Disclose screen views, widget count/setup, clock styles, ad delivery/rewards/errors/timing/revenue. Do not claim all configuration stays exclusively on device. |
| Crash context | `DigitalClockApplication.kt`, `SettingsActivity.kt`, `ads/AdsCoordinator.kt`, `DigitalAppWidgetLayout.kt` | Disclose widget diagnostics, settings/ad-initialization state, WebView metadata, standard SDK diagnostics and installation identifiers. No app account-based user ID is assigned. |
| Calendar | `feature/alarm/src/main/kotlin/com/maize/digitalClock/feature/alarm/Alarm.kt`, app manifest, `SettingsListFragment.kt` | Optional READ_CALENDAR; queries event ID, title, and start time with time filters; displays locally and opens a calendar intent. No app calendar upload found. Calendar-provider sync is separate. |
| Settings and unlocks | `core/database/.../WidgetConfig.kt`, `WidgetRewardUnlock.kt`, `WidgetRewardUnlockDao.kt`, `core/datastore` | Local Room configuration and per-widget reward type/timestamp; local legacy preferences. Foreign-key cascade removes rewards with the widget record. Avoid guaranteed restoration. |
| Backups | `app/src/main/AndroidManifest.xml`, `analytics/WidgetTelemetry.kt` | `allowBackup=true`; no app-specific exclusion rules found for settings/database. Widget-setup bookkeeping explicitly uses `noBackupFilesDir`; support attachments use cache. Disclose cloud/device transfer according to OS and provider settings. |
| Support | `core/diagnostics/.../Diagnostics.kt`, `DiagnosticData.kt`, `LogCollector.kt` | Chooser with ACTION_SEND_MULTIPLE, diagnostics JSON, compressed available logcat, addressed to apps@ezi.am. Sending is user-controlled. Diagnostics include launcher, device, locale/time zone, settings/tap actions/city, calendar permission, and next-alarm time/creator. No promise of anonymous logs. |
| Ad initialization and choices | `SettingsActivity.kt`, `ads/AdsCoordinator.kt`, `MediationConsent.kt`, `ConsentSignals.kt`, `SettingsListFragment.kt`, `MoreOptionsBottomSheetFragment.kt` | UMP update/forms and `canRequestAds` gate; prior choices can apply. Privacy opens UMP options only when required/available, otherwise the policy URL. Relevant signals forwarded to mediation. UMP is not an Analytics/Crashlytics off switch. |
| Ad partners | `app/build.gradle.kts`, `gradle/libs.versions.toml`, live AdMob report, owner confirmation | Public list is active services, not a list of all bundled libraries. Google Mobile Ads Next-Gen 1.5.0 and UMP 4.0.0 are declared in the reviewed release. |
| Remote Config | `DigitalClockApplication.kt`; repository-wide fetch/activate search | Bundled and local defaults/config settings are initialized. No remote fetch/activation call found. Do not infer active remote configuration downloads solely from the dependency. |
| Children's controls | `SettingsActivity.kt`, `core/ads/.../AdsSdk.kt`, repository-wide child/under-age flag search | No age screen, parental-consent flow, or explicit child-directed/under-age SDK request tagging was found in the reviewed source. Do not assert these protections exist or claim no child data collection. |

## Live service checks

- AdMob app identity matched Android package `com.maize.digitalClock`.
- The app-filtered mediation report for October 5–November 3, 2026 showed
  impressions for Google AdMob, InMobi, Liftoff Monetize, LY Ads Network, Meta
  Audience Network, Pangle, and Unity Ads. This establishes activity, not that
  each provider receives data on every request. No private financial or
  user-level report data is included in the public policy.
- The Analytics connector matched property `ezi-digital-clock`. Its API did
  not expose retention settings, so the Google Analytics Admin > Data retention
  screen was inspected read-only: **event data 2 months; user data 14 months;
  reset on new user activity ON**. No service settings were changed.

## Official documentation checked

- [Google Mobile Ads Next-Gen data disclosure](https://developers.google.com/admob/android/next-gen/privacy/play-data-disclosure)
- [Google UMP integration and choices](https://developers.google.com/admob/android/privacy)
- [Google Analytics data collection](https://support.google.com/analytics/answer/11593727?hl=en)
- [Google Analytics retention](https://support.google.com/analytics/answer/7667196?hl=en)
- [Firebase Android disclosures](https://firebase.google.com/docs/android/play-data-disclosure)
- [Firebase privacy, retention, processing locations, and security](https://firebase.google.com/support/privacy)
- [Android Auto Backup](https://developer.android.com/identity/data/autobackup)
- [LY mediation integration](https://developers.google.com/admob/android/next-gen/mediation/line)
- Provider privacy notices linked in the policy. Some providers use client-rendered
  pages, regional notices, or browser access restrictions; do not treat a provider's
  full list of possible data collection as proof of this app's actual behavior.
- [European Commission: individual privacy rights](https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en)
- [California Attorney General: CCPA](https://oag.ca.gov/privacy/ccpa)
- [FTC: COPPA guidance](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)
- [Google Play trader declaration guidance](https://support.google.com/googleplay/android-developer/answer/17594752)

## Remaining issues and limits

1. **Children's privacy implementation needs review.** The owner confirms an
   all-ages audience, while source does not implement an age screen, parental
   consent, or explicit child-directed ad flags. Content rating alone does not
   resolve children's data-processing requirements. Review Play target-audience
   declarations, AdMob account controls, partner suitability, and actual SDK
   behavior before claiming child-specific protections. Updating these web pages
   does not change the Android app or establish legal compliance.
2. **Analytics/Crashlytics consent is separate from ads.** Collection starts in
   release app processes and is not controlled by UMP. Confirm the appropriate
   legal basis and any needed consent controls for the actual regions served;
   the public policy accurately states the current behavior rather than promising
   an unimplemented opt-out.
3. **Support mailbox retention has no confirmed fixed deletion period.** The
   owner follows provider retention schedules; mailbox/Vault rules and any
   exports were not inspected. The policy does not invent an automatic deadline.
4. **Provider and business details are bounded by the evidence.** Exact
   per-provider traffic, downstream recipients, console-level settings, transfer
   arrangements, and legal bases for every jurisdiction were not independently
   audited. Do not infer a particular contract or certification from an SDK.

## Maintaining and publishing

Validation completed for this update: `npm run verify` passed all five existing
generator tests, the production build, app-ads freshness, and all eight mirrored
public-file checks. A separate HTML check confirmed unique IDs, section anchors,
internal link targets, one H1 per page, and an exact whitespace-normalized match
of every terms body paragraph to the supplied draft. Browser review covered both
pages at desktop and 390px phone width, reciprocal navigation, the retention
anchor, and home-page footer links. No horizontal overflow or browser console
errors were observed.

Keep `privacy/dcw.html` and `public/privacy/dcw.html` identical, and likewise
`terms/dcw.html` / `public/terms/dcw.html` and `legal/dcw.css` /
`public/legal/dcw.css`. `npm run verify` checks all copies against the build.
The home-page footer and both legal pages link to both documents.

Use the existing GitHub Pages workflow: changes reaching `master` run verification
and deploy `dist`. Confirm the two HTTPS URLs return the actual documents after
deployment. The Terms URL can then be entered in Play Console's app-level trader
status page; this repository update does not itself submit the Play Console form.
