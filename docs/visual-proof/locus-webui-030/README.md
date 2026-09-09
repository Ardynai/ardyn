# WebUI 0.3.0 recovery component proof

Current as of 2026-09-09. This is the actual `LocusEmbedConnection` component,
console CSS and installed 0.3.0 shared browser verifier in Chromium. The parent
and child have distinct synthetic HTTPS origins through Playwright route fixtures.
GET/POST fixture requests invoke the actual `createLocusEmbedServer`; one otherwise
successful POST response is deliberately corrupted after signing to prove HTTP
success cannot clear the alert. A fresh correctly signed request then recovers.

The screenshot heading/explanatory text belong to the test harness, not the console
layout. This is not a full Next application run, real TLS deployment, live registry,
founder credential, production key, host admission or vendor proof. Only existing
public test identities were imported; all key-generation APIs remained blocked.
The temporary public-fixture key copy was removed after its resolved path check.

Command: `node C:/Users/Josh/Documents/batch6-ardyn-030-visual.mjs`, under the
key-generation-blocking Node preload. Output: two viewports, four states, four axe
checks, zero serious/critical violations, zero invalid replies posted, verified
recovery passed, fullNextApplication false. No browser page exceptions or mobile
overflow. All four screenshots were inspected.

| Screenshot         | SHA-256                                                          |
| ------------------ | ---------------------------------------------------------------- |
| invalid-1440.png   | 997454d1e9059ddc87a13ae94ccaa4493f585faa8134461f8166c76d70c6e3e2 |
| invalid-390.png    | c90a9ba499d9b47b33e86be2934315f5054bb1206643aa1d6fcda96562182f56 |
| recovered-1440.png | b51902ff997ad31e7a55312b42c8cd2547b01de62a378fff2fb1e1eb442e264c |
| recovered-390.png  | 2c1386f49080caf7e01feec0f97aaf79363e3bb90de934592a42ba76590f8c65 |

STOP: `NEXT_FRAMEWORK_KEY_REQUIRED`. The framework environment key is absent.
Do not run unguarded Next build/dev, generate a key or reuse another checkout's
cache. Founder configuration must use the secure environment workflow, never chat
or git. Prior full-console screenshots remain historical evidence only.
