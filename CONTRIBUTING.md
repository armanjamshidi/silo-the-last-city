# Contributing to SILO — The Last City

Contributions are welcome when they improve the model without presenting speculation as official canon.

## Before opening a pull request

1. Keep the change focused on one scene, system, interaction or documentation topic.
2. Label archive facts as `ON SCREEN`, `BOOK CANON` or `INFERRED`.
3. Cite an episode, chapter or official production source for canon corrections.
4. Preserve the no-WebGL fallback and keyboard-accessible controls.
5. Run:

```bash
npm run lint
npm test
npm run build:vercel
```

## Archive standards

- A zone should contain at least six useful facility or set anchors.
- Unknown level numbers must remain described as unknown or approximate.
- Series and book continuities should not be silently merged.
- New 3D detail must remain usable in both dark and light themes.
- Major views should be reachable through a shareable `#zone=…&view=…` link.

This is an unofficial fan project. Do not add copyrighted video, episode stills, scripts or large excerpts from the books.
