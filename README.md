# The Innovations Tools

A curated collection of 12 free, open-source browser tools. No signup, no ads, no data leaves your device.

**Live site:** https://tools.theinnovations.tech

---

## Tools

| Tool | Category | Description |
|------|----------|-------------|
| PDF Toolkit | Files | Merge, split & compress PDFs |
| Image Compressor | Images | Compress PNG/JPG to WebP — fully offline |
| QR Code Generator | Utilities | Instant QR from any URL or text |
| Password Generator | Security | Cryptographically secure passwords |
| Color Palette Generator | Design | Harmonious palettes from any base colour |
| Word Counter | Writing | Words, chars, sentences, reading time |
| Image Resizer | Images | Resize to exact px or social presets |
| Background Remover | Images | AI-powered, WASM, in-browser |
| Resume Builder | Career | ATS-friendly PDF export, auto-saves |
| Age Calculator | Utilities | Exact age, countdown, zodiac sign |
| Currency Converter | Finance | Live rates, 30+ currencies |
| Unit Converter | Utilities | Length, weight, temperature, speed, area, volume |

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS with custom brand tokens
- **Animations:** Framer Motion
- **PDF manipulation:** pdf-lib (merge/split/compress)
- **QR codes:** qrcode
- **AI background removal:** @imgly/background-removal (WebAssembly)
- **PDF export:** @react-pdf/renderer
- **Sitemap:** next-sitemap

---

## Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/theinnovationstech/tools.git
cd tools

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open http://localhost:3000 in your browser.

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## How to Add a New Tool

1. **Register the tool** in [`lib/tools.ts`](lib/tools.ts):
   ```ts
   { slug: "my-tool", name: "My Tool", desc: "One-line description", icon: "🔧", category: "Utilities" }
   ```

2. **Create the component** at `components/tools/MyTool.tsx`:
   ```tsx
   "use client";
   import { motion } from "framer-motion";

   export default function MyTool() {
     return (
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.4 }}
         className="flex flex-col gap-6"
       >
         {/* tool UI */}
       </motion.div>
     );
   }
   ```

3. **Register it in the route** at [`app/tools/[slug]/page.tsx`](app/tools/[slug]/page.tsx):
   - Import your component
   - Add it to `liveTools`
   - Add a 140–160 char SEO description to `richDescriptions`
   - Add 6–8 keywords to `toolKeywords`

4. **Run `tsc --noEmit`** to verify no type errors before committing.

---

## Project Structure

```
app/
  layout.tsx          # Root layout: metadata, ToastProvider, BackToTop
  page.tsx            # Homepage: HeroSection + WhySection + ToolsGrid
  about/page.tsx      # About page
  tools/[slug]/
    page.tsx          # Dynamic tool route
    loading.tsx       # Suspense skeleton
  not-found.tsx       # Custom 404

components/
  Navbar.tsx          # Fixed nav with mobile right-drawer
  Footer.tsx
  HeroSection.tsx     # Hero with stats + CTA
  WhySection.tsx      # 3-card benefit strip
  ToolsGrid.tsx       # Filterable grid with AnimatePresence
  ToolCard.tsx
  Toast.tsx           # Global toast context + useToast hook
  BackToTop.tsx       # Scroll-triggered button
  tools/              # Individual tool components

lib/
  tools.ts            # Tool registry
  colorUtils.ts       # HSL math for Color Palette
  unitConversions.ts  # Conversion factors for Unit Converter
```

---

## License

MIT © The Innovations — see [LICENSE](LICENSE) for details.
