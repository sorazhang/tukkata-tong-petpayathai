# Tukkata Tong Petpayathai — Project Notes

## Logo / Image Assets

**Problem we hit:** Adding a logo PNG to the nav took a long time due to background issues.

Root cause: AI-generated images (Firefly, etc.) rarely export with true transparency even when they look transparent in the preview. The checkerboard pattern visible in Firefly is a UI indicator — it may not be saved as actual alpha transparency.

**What works:**
- Use Firefly's **"Remove Background"** button before downloading
- Or paste into **remove.bg** to strip the background automatically
- Export as **PNG**, not JPEG (JPEG has no transparency support)
- Verify the file: open in browser tab — transparent areas should show the page background, not grey/white/checkerboard

**If a background is still baked in, CSS workarounds:**
- White background + dark logo → `filter: invert(1)` + `mix-blend-mode: screen`
- Grey/checkered background → `filter: brightness(0.7) contrast(100)` + `mix-blend-mode: screen`
- These are imperfect — always prefer a truly transparent PNG

**Nav logo is at:** `components/Nav.tsx` — look for the `<img src="/logo7.png" ...>` line.
