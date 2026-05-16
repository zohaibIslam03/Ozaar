<div align="center">

<br />

# ⚡ Ozaar

### Free online tools for everyone — no signup, no ads, no limits.

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=white)](https://framer.com/motion)

<br />

**[🌐 Live Site](https://tools.theinnovations.tech)**
·
**[🐛 Report Bug](https://github.com/zohaibIslam03/Ozaar/issues)**
·
**[✨ Request Feature](https://github.com/zohaibIslam03/Ozaar/issues)**

<br />

</div>

---

## 🛠 What is Ozaar?

**Ozaar** is a collection of **12 free, open-source browser tools** built for everyone — students, freelancers, creators, and professionals.

Every tool runs **100% in your browser**. No uploads to servers. No accounts. No tracking. No paywalls. Just tools that work.

---

## ✨ Tools

| Tool | Description | Category |
|------|-------------|----------|
| 📄 **PDF Toolkit** | Merge, split & compress PDFs | Files |
| 🖼 **Image Compressor** | Compress PNG/JPG to WebP, up to 90% smaller | Images |
| ✂️ **Image Resizer** | Resize with social media presets & crop selector | Images |
| 🪄 **Background Remover** | AI-powered background removal in-browser | Images |
| ⬛ **QR Code Generator** | Generate QR codes from any URL or text | Utilities |
| 🔐 **Password Generator** | Cryptographically secure passwords | Security |
| 🎨 **Color Palette Generator** | Generate & export HEX/CSS palettes | Design |
| 📝 **Word Counter** | Count words, chars, reading time & more | Writing |
| 📋 **Resume Builder** | ATS-friendly resume with live preview & PDF export | Career |
| 📅 **Age Calculator** | Exact age, birthday countdown & zodiac | Utilities |
| 💱 **Currency Converter** | Live rates across 150+ currencies | Finance |
| 📐 **Unit Converter** | Length, weight, temperature, speed & more | Utilities |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/zohaibIslam03/Ozaar.git

# Navigate into the project
cd Ozaar

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | App Router, SSR, file-based routing |
| **TypeScript** | Type safety throughout |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations & page transitions |
| **@imgly/background-removal** | AI background removal (WASM) |
| **@react-pdf/renderer** | PDF generation in the browser |
| **@dnd-kit** | Drag-and-drop for resume builder |
| **pdf-lib** | PDF manipulation (merge, split, compress) |
| **qrcode** | QR code generation |

---

## 📁 Project Structure

```
Ozaar/
├── app/
│   ├── page.tsx              # Homepage
│   ├── about/page.tsx        # About page
│   ├── tools/
│   │   └── [slug]/page.tsx   # Dynamic tool pages
│   └── layout.tsx            # Root layout
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── sections/             # Homepage sections
│   ├── tools/                # Individual tool components
│   ├── tool-page/            # Tool page layout components
│   └── ui/                   # Shared UI components
├── lib/
│   ├── toolConfig.ts         # Tool metadata & SEO config
│   └── animations.ts         # Framer Motion variants
├── public/
│   └── bg-removal/           # AI model assets (WASM)
└── types/
    └── resume.ts             # Resume builder types
```

---

## 🔒 Privacy by Design

Every tool on Ozaar is built with privacy as the default:

- ✅ **No server uploads** — all processing happens in your browser
- ✅ **No analytics on your files** — we don't know what you process
- ✅ **No cookies** — we don't track sessions
- ✅ **No accounts** — open and use immediately
- ✅ **Works offline** — most tools work after first page load

---

## 🤝 Contributing

Contributions are welcome! Here's how to add a new tool:

1. **Fork** the repository
2. **Create** your tool component in `components/tools/YourTool.tsx`
3. **Add** the tool config in `lib/toolConfig.ts`
4. **Create** the route at `app/tools/your-tool-name/page.tsx`
5. **Submit** a Pull Request

```bash
# Create a feature branch
git checkout -b feature/my-new-tool

# Make your changes
# ...

# Commit with a clear message
git commit -m "feat: add [tool name] tool"

# Push and open a PR
git push origin feature/my-new-tool
```

---

## 📋 Adding a New Tool (Checklist)

- [ ] Create `components/tools/MyTool.tsx`
- [ ] Add entry to `lib/toolConfig.ts` with metadata, FAQs, features
- [ ] Create `app/tools/my-tool/page.tsx` using the tool page layout
- [ ] Add the tool card to the homepage tools grid
- [ ] Test on mobile (375px) and desktop (1440px)
- [ ] Run `tsc --noEmit` — no TypeScript errors
- [ ] Run `npm run build` — must pass

---

## 🐛 Known Issues

- **Background Remover**: Requires Google Chrome for best compatibility. The WASM AI model (~10 MB) downloads on first use.
- **PDF Toolkit**: Large PDF files (>50 MB) may be slow on older devices.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

This means you can:
- ✅ Use it commercially
- ✅ Modify it
- ✅ Distribute it
- ✅ Use it privately
- ✅ Fork it and build your own

---

## 🙏 Acknowledgements

Built with these amazing open-source projects:
- [Next.js](https://nextjs.org) by Vercel
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://framer.com/motion)
- [pdf-lib](https://pdf-lib.js.org)
- [@imgly/background-removal](https://img.ly)
- [@react-pdf/renderer](https://react-pdf.org)

---

<div align="center">

<br />

**Built with ❤️ by [Zohaib Islam](https://github.com/zohaibIslam03)**

<br />

⭐ **Star this repo if you find it useful!** ⭐

<br />

[![GitHub stars](https://img.shields.io/github/stars/zohaibIslam03/Ozaar?style=social)](https://github.com/zohaibIslam03/Ozaar/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/zohaibIslam03/Ozaar?style=social)](https://github.com/zohaibIslam03/Ozaar/network/members)

</div>
