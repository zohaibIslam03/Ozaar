export interface Feature {
  title: string;
  desc: string;
  icon: string;
}

export interface Step {
  title: string;
  description: string;
  icon: string;
}

export interface UseCase {
  title: string;
  scenario: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface ToolConfig {
  slug: string;
  name: string;
  tagline: string;
  taglineAccent: string;
  description: string;
  category: string;
  accentColor: string;
  accentLight: string;
  accentDark: string;
  heroPattern: string;
  icon: string;
  features: Feature[];
  howItWorks: Step[];
  useCases: UseCase[];
  faq: FAQ[];
  relatedTools: string[];
  stats: Stat[];
  metaTitle: string;
  metaDesc: string;
  keywords: string[];
  structuredData?: object;
}

const ACCENT = "#DF0A09";
const ACCENT_LIGHT = "#F5F5F5";
const ACCENT_DARK = "#B30807";

export const toolConfigs: Record<string, ToolConfig> = {
  "image-compressor": {
    slug: "image-compressor",
    name: "Image Compressor",
    tagline: "Smaller files.",
    taglineAccent: "Sharper results.",
    description:
      "Compress PNG, JPG, and GIF images to WebP format without visible quality loss. No uploads, no accounts, no limits. Your images never leave your browser.",
    category: "Images",
    accentColor: ACCENT,
    accentLight: ACCENT_LIGHT,
    accentDark: ACCENT_DARK,
    heroPattern:
      "radial-gradient(circle, #F0F0F0 1px, transparent 1px)",
    icon: "🖼️",
    stats: [
      { value: "Up to 90%", label: "size reduction" },
      { value: "0ms", label: "upload time" },
      { value: "WebP", label: "26% smaller than PNG" },
    ],
    features: [
      {
        title: "Up to 90% size reduction",
        desc: "Dramatically shrink image file sizes while preserving visual quality using modern compression algorithms.",
        icon: "compress",
      },
      {
        title: "PNG, JPG, GIF → WebP",
        desc: "Convert any common image format to the next-generation WebP format for maximum browser compatibility.",
        icon: "format",
      },
      {
        title: "Batch compress multiple files",
        desc: "Process dozens of images at once — drop them all in and download a zip of compressed files.",
        icon: "batch",
      },
      {
        title: "100% offline processing",
        desc: "All compression happens in your browser using Canvas API. Your images never touch a server.",
        icon: "offline",
      },
    ],
    howItWorks: [
      {
        title: "Drop your image",
        description:
          "Drag and drop your PNG, JPG, or GIF onto the upload area, or click to browse your files. Multiple files supported.",
        icon: "upload",
      },
      {
        title: "Adjust quality",
        description:
          "Use the quality slider to find the perfect balance between file size and visual quality. Preview updates in real time.",
        icon: "slider",
      },
      {
        title: "Download",
        description:
          "Click download to get your compressed WebP file instantly. No wait time, no email required.",
        icon: "download",
      },
    ],
    useCases: [
      {
        title: "E-commerce product photos",
        scenario: "Online Store Owner",
        description:
          "Faster page loads mean higher conversion rates. Compress product images to under 100KB and watch your Core Web Vitals improve overnight.",
      },
      {
        title: "Blog & article images",
        scenario: "Content Creator",
        description:
          "Google rewards fast pages. Compress every hero image and inline photo before publishing to boost your SEO score and reduce bounce rate.",
      },
      {
        title: "Social media assets",
        scenario: "Social Media Manager",
        description:
          "Stay within platform upload limits without sacrificing quality. Batch-compress your content calendar assets in seconds.",
      },
    ],
    faq: [
      {
        question: "Does compressing reduce image quality?",
        answer:
          "At quality settings above 75%, the difference is imperceptible to the human eye. Our quality slider lets you find the perfect balance — most users are happy at 80-85% quality with up to 70% file size reduction.",
      },
      {
        question: "What formats are supported?",
        answer:
          "You can upload PNG, JPG/JPEG, and GIF images. All compressed files are exported as WebP, which is supported by all modern browsers (Chrome, Firefox, Safari, Edge).",
      },
      {
        question: "Is there a file size limit?",
        answer:
          "No server-side limit exists since everything runs in your browser. Practical limits depend on your device's RAM — files up to 50MB work fine on most computers.",
      },
      {
        question: "Why WebP instead of JPEG?",
        answer:
          "WebP achieves 25-35% better compression than JPEG at the same visual quality. It supports transparency (like PNG) and animation (like GIF), making it the best all-around modern image format.",
      },
      {
        question: "Can I compress multiple images at once?",
        answer:
          "Yes — you can drag and drop multiple files at once or select multiple files via the file picker. Each is compressed independently so you can download them all.",
      },
    ],
    relatedTools: ["image-resizer", "bg-remover", "pdf-toolkit"],
    metaTitle:
      "Free Image Compressor Online — Compress PNG JPG to WebP | The Innovations",
    metaDesc:
      "Compress images online for free. Reduce PNG, JPG file sizes by up to 90% and convert to WebP. No upload required — runs entirely in your browser. No account needed.",
    keywords: [
      "image compressor",
      "compress image online",
      "png to webp",
      "reduce image size",
      "online image optimizer",
      "free image compression",
    ],
  },

  "resume-builder": {
    slug: "resume-builder",
    name: "Resume Builder",
    tagline: "Your resume.",
    taglineAccent: "Your opportunity.",
    description:
      "Build an ATS-friendly resume in minutes with our free online resume builder. Live preview, multiple templates, and one-click PDF export. No account required.",
    category: "Career",
    accentColor: ACCENT,
    accentLight: ACCENT_LIGHT,
    accentDark: ACCENT_DARK,
    heroPattern: "repeating-linear-gradient(transparent, transparent 23px, #F5F5F5 24px)",
    icon: "📋",
    stats: [
      { value: "ATS", label: "optimized templates" },
      { value: "1-click", label: "PDF export" },
      { value: "0", label: "signups needed" },
    ],
    features: [
      {
        title: "ATS-optimized templates",
        desc: "Pass automated resume screening systems used by 98% of Fortune 500 companies. Clean, parseable layouts.",
        icon: "check",
      },
      {
        title: "Live side-by-side preview",
        desc: "See your resume update in real time as you type. What you see is exactly what you get in the PDF.",
        icon: "eye",
      },
      {
        title: "One-click PDF export",
        desc: "Download a pixel-perfect PDF ready to attach to any job application, directly from your browser.",
        icon: "download",
      },
      {
        title: "Auto-saves to localStorage",
        desc: "Your progress is automatically saved in your browser. Close the tab and return later — everything is still there.",
        icon: "save",
      },
    ],
    howItWorks: [
      {
        title: "Fill in your details",
        description:
          "Enter your name, contact info, work experience, education, and skills using our guided step-by-step form.",
        icon: "edit",
      },
      {
        title: "Preview in real time",
        description:
          "Watch your professional resume take shape as you type. Switch between templates with one click.",
        icon: "eye",
      },
      {
        title: "Export as PDF",
        description:
          "Click 'Download PDF' to get a polished, ATS-friendly resume file ready to send to employers.",
        icon: "download",
      },
    ],
    useCases: [
      {
        title: "Fresh graduates",
        scenario: "Recent Graduate",
        description:
          "Land your first professional job with a clean, structured resume that highlights your education, projects, and internships in the best possible light.",
      },
      {
        title: "Career changers",
        scenario: "Career Switcher",
        description:
          "Highlight your transferable skills and reframe your experience for a new industry. Our templates are designed to present any background compellingly.",
      },
      {
        title: "Active job seekers",
        scenario: "Job Seeker",
        description:
          "Pass ATS filters at top companies. Our templates use clean, machine-readable formatting that applicant tracking systems parse correctly.",
      },
    ],
    faq: [
      {
        question: "Is this resume builder really free?",
        answer:
          "Yes, completely free. There are no premium tiers, no watermarks, no hidden fees. Every feature — including PDF export — is available to everyone with no account required.",
      },
      {
        question: "Will my resume pass ATS (Applicant Tracking System)?",
        answer:
          "Our templates are specifically designed for ATS compatibility. We use standard fonts, clear section headings, and avoid tables, columns, or graphics that ATS systems struggle to parse.",
      },
      {
        question: "Can I save my resume and edit it later?",
        answer:
          "Yes — your resume data is automatically saved to your browser's localStorage. As long as you use the same browser and don't clear site data, you can return and continue editing.",
      },
      {
        question: "What format does it export in?",
        answer:
          "Resumes are exported as PDF files, which is the universally accepted format for job applications and preserves your formatting perfectly on any device.",
      },
      {
        question: "How many templates are available?",
        answer:
          "Currently one clean, professional template optimized for ATS. We're adding more templates regularly — star us on GitHub to stay updated.",
      },
    ],
    relatedTools: ["word-counter", "pdf-toolkit", "color-palette"],
    metaTitle:
      "Free Resume Builder Online — ATS-Friendly PDF Export | The Innovations",
    metaDesc:
      "Build a professional resume online for free. ATS-optimized templates, live preview, and one-click PDF export. No account required. Saves automatically in your browser.",
    keywords: [
      "free resume builder",
      "resume maker online",
      "cv builder",
      "ats resume template",
      "resume pdf download",
      "professional resume creator",
    ],
  },

  "pdf-toolkit": {
    slug: "pdf-toolkit",
    name: "PDF Toolkit",
    tagline: "Merge. Split.",
    taglineAccent: "Conquer PDFs.",
    description:
      "Merge multiple PDFs into one, split by page range, or compress file size — entirely in your browser. No upload, no server, no sign-up required.",
    category: "Files",
    accentColor: ACCENT,
    accentLight: ACCENT_LIGHT,
    accentDark: ACCENT_DARK,
    heroPattern:
      "linear-gradient(45deg, #F5F5F5 25%, transparent 25%), linear-gradient(-45deg, #F5F5F5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #F5F5F5 75%), linear-gradient(-45deg, transparent 75%, #F5F5F5 75%)",
    icon: "📄",
    stats: [
      { value: "3 tools", label: "merge, split, compress" },
      { value: "0 bytes", label: "uploaded to servers" },
      { value: "PDF-lib", label: "powered" },
    ],
    features: [
      {
        title: "Merge unlimited PDFs",
        desc: "Combine any number of PDF files into a single document. Drag to reorder pages before merging.",
        icon: "merge",
      },
      {
        title: "Split by page range",
        desc: "Extract specific pages or split a large PDF into multiple smaller files — all in seconds.",
        icon: "split",
      },
      {
        title: "Compress file size",
        desc: "Reduce PDF size for email attachments or uploads without losing document quality.",
        icon: "compress",
      },
      {
        title: "Zero server processing",
        desc: "Everything runs via pdf-lib in your browser. Sensitive documents never leave your device.",
        icon: "offline",
      },
    ],
    howItWorks: [
      {
        title: "Select your operation",
        description: "Choose whether you want to merge, split, or compress your PDF files using the operation tabs.",
        icon: "select",
      },
      {
        title: "Upload your PDFs",
        description: "Drag and drop your PDF files into the upload area. For merge, you can add multiple files and reorder them.",
        icon: "upload",
      },
      {
        title: "Download the result",
        description: "Click process and your new PDF downloads instantly. No waiting, no email confirmation.",
        icon: "download",
      },
    ],
    useCases: [
      {
        title: "Combining contract pages",
        scenario: "Legal Professional",
        description:
          "Merge signed pages, addendums, and exhibits into a single organized PDF for client delivery or court filing.",
      },
      {
        title: "Extracting report sections",
        scenario: "Business Analyst",
        description:
          "Split a 200-page annual report to share only the relevant financial summary with specific stakeholders.",
      },
      {
        title: "Reducing attachment size",
        scenario: "Remote Worker",
        description:
          "Compress large PDF presentations or portfolios to fit under email attachment limits without going through IT.",
      },
    ],
    faq: [
      {
        question: "What is the maximum PDF size I can process?",
        answer:
          "There is no hard limit since everything runs in your browser. Practically, files up to 100MB work well. Very large files may be slow on low-RAM devices.",
      },
      {
        question: "Is my PDF secure?",
        answer:
          "Yes. Your files are processed entirely in your browser using the pdf-lib JavaScript library. Nothing is ever uploaded to any server.",
      },
      {
        question: "Can I merge more than 2 PDFs?",
        answer:
          "Yes — you can merge as many PDFs as you need. Add files in any order and drag to rearrange them before combining.",
      },
      {
        question: "Does splitting remove pages from the original?",
        answer:
          "No. Splitting creates new PDF files from your specified page ranges. Your original file is never modified.",
      },
      {
        question: "Will compression reduce text quality?",
        answer:
          "Text and vector graphics remain crisp after compression. Only embedded raster images may see slight quality reduction at high compression levels.",
      },
    ],
    relatedTools: ["image-compressor", "resume-builder", "word-counter"],
    metaTitle: "Free PDF Toolkit Online — Merge, Split & Compress PDFs | The Innovations",
    metaDesc:
      "Free online PDF toolkit. Merge PDFs, split by page range, and compress file size — all in your browser. No upload, no signup, no limits.",
    keywords: [
      "pdf merger online",
      "split pdf free",
      "compress pdf browser",
      "merge pdf no upload",
      "pdf tools",
      "pdf toolkit",
    ],
  },

  "qr-generator": {
    slug: "qr-generator",
    name: "QR Code Generator",
    tagline: "One scan.",
    taglineAccent: "Infinite possibilities.",
    description:
      "Generate QR codes instantly from any URL, text, or contact info. Customise size and colours, then download as PNG or SVG in seconds. No sign-up, no watermark.",
    category: "Utilities",
    accentColor: ACCENT,
    accentLight: ACCENT_LIGHT,
    accentDark: ACCENT_DARK,
    heroPattern:
      "linear-gradient(#F0F0F0 1px, transparent 1px), linear-gradient(90deg, #F0F0F0 1px, transparent 1px)",
    icon: "⬛",
    stats: [
      { value: "Instant", label: "generation" },
      { value: "PNG + SVG", label: "export formats" },
      { value: "No", label: "watermark ever" },
    ],
    features: [
      {
        title: "URL, text, or vCard",
        desc: "Generate QR codes from any web address, plain text, email address, phone number, or contact card.",
        icon: "link",
      },
      {
        title: "Custom size & colors",
        desc: "Choose any size from 64px to 1024px and customise foreground and background colors to match your brand.",
        icon: "palette",
      },
      {
        title: "Download as PNG or SVG",
        desc: "Get a pixel-perfect PNG for digital use or a scalable SVG for print — both at any size, no watermark.",
        icon: "download",
      },
      {
        title: "Works offline",
        desc: "QR codes are generated client-side using the qrcode.js library. No internet connection required after first load.",
        icon: "offline",
      },
    ],
    howItWorks: [
      {
        title: "Enter your content",
        description:
          "Type or paste any URL, text, email, or phone number into the input field. The QR code updates instantly as you type.",
        icon: "type",
      },
      {
        title: "Customise appearance",
        description:
          "Adjust the size, foreground colour, and background colour to match your branding or use case.",
        icon: "palette",
      },
      {
        title: "Download your QR code",
        description:
          "Click 'Download PNG' or 'Download SVG' to save your QR code. Print it, embed it, or share it anywhere.",
        icon: "download",
      },
    ],
    useCases: [
      {
        title: "Restaurant menus",
        scenario: "Restaurant Owner",
        description:
          "Generate a QR code linking to your online menu. Place it on tables and let customers browse without physical menus.",
      },
      {
        title: "Business cards",
        scenario: "Freelancer",
        description:
          "Embed a QR code linking to your portfolio or LinkedIn profile. One scan gives a new contact everything they need.",
      },
      {
        title: "Event check-in",
        scenario: "Event Organiser",
        description:
          "Create unique QR codes for each ticket. Download as SVG for sharp printing at any size, even large-format banners.",
      },
    ],
    faq: [
      {
        question: "Is there a limit to how many QR codes I can generate?",
        answer:
          "No limit at all. Generate as many as you need — completely free, no account, no daily quota.",
      },
      {
        question: "Can I use the QR codes commercially?",
        answer:
          "Yes. There are no watermarks, no licensing restrictions, and no attribution required. Use them for anything.",
      },
      {
        question: "What's the difference between PNG and SVG export?",
        answer:
          "PNG is a raster format — ideal for digital use on screens. SVG is a vector format — ideal for print since it scales to any size without pixelation.",
      },
      {
        question: "Do my QR codes expire?",
        answer:
          "No. A QR code is just encoded data. Since we don't use a redirect URL, there's nothing to expire. The code links directly to whatever you entered.",
      },
      {
        question: "How much data can I encode in a QR code?",
        answer:
          "Standard QR codes can store up to 4,296 characters. URLs and short text work best. Very long strings may produce dense, harder-to-scan QR codes.",
      },
    ],
    relatedTools: ["image-compressor", "image-resizer", "password-generator"],
    metaTitle: "Free QR Code Generator Online — PNG & SVG Download | The Innovations",
    metaDesc:
      "Generate QR codes instantly from any URL, text, or contact info. Download as PNG or SVG. Free, no watermark, no sign-up. Works entirely in your browser.",
    keywords: [
      "qr code generator",
      "generate qr code free",
      "qr code maker",
      "url to qr",
      "custom qr code",
      "free qr generator",
    ],
  },

  "password-generator": {
    slug: "password-generator",
    name: "Password Generator",
    tagline: "Unbreakable.",
    taglineAccent: "Unforgettable.",
    description:
      "Generate cryptographically secure passwords using your browser's built-in crypto API. Strength indicator, bulk mode, and one-click copy. Your passwords never touch a server.",
    category: "Security",
    accentColor: ACCENT,
    accentLight: ACCENT_LIGHT,
    accentDark: ACCENT_DARK,
    heroPattern:
      "repeating-linear-gradient(0deg, transparent, transparent 11px, #F5F5F5 12px), repeating-linear-gradient(90deg, transparent, transparent 11px, #F5F5F5 12px)",
    icon: "🔐",
    stats: [
      { value: "Crypto API", label: "true randomness" },
      { value: "Bulk mode", label: "generate many at once" },
      { value: "0", label: "passwords stored" },
    ],
    features: [
      {
        title: "Cryptographically secure",
        desc: "Uses window.crypto.getRandomValues() — the same source of randomness used by security professionals and operating systems.",
        icon: "shield",
      },
      {
        title: "Fully customisable",
        desc: "Choose length, include/exclude uppercase, lowercase, numbers, symbols. Build exactly the password format you need.",
        icon: "settings",
      },
      {
        title: "Real-time strength meter",
        desc: "See your password strength rated from Weak to Very Strong as you adjust settings, with entropy bits displayed.",
        icon: "bar",
      },
      {
        title: "Bulk password generation",
        desc: "Generate and copy up to 50 unique passwords at once — perfect for seeding a new team or batch-updating accounts.",
        icon: "batch",
      },
    ],
    howItWorks: [
      {
        title: "Set your requirements",
        description:
          "Choose password length and which character types to include: uppercase, lowercase, numbers, and special symbols.",
        icon: "settings",
      },
      {
        title: "Generate",
        description:
          "Click 'Generate' to produce a cryptographically random password. It refreshes instantly with each click.",
        icon: "refresh",
      },
      {
        title: "Copy and use",
        description:
          "Click the copy icon to copy your password to the clipboard. Paste it directly into your password manager or account.",
        icon: "copy",
      },
    ],
    useCases: [
      {
        title: "Setting up a new account",
        scenario: "Everyday User",
        description:
          "Never reuse passwords. Generate a unique, strong password for every account in seconds and save it to your password manager.",
      },
      {
        title: "IT onboarding",
        scenario: "IT Administrator",
        description:
          "Use bulk mode to generate temporary credentials for new employees. Copy all at once and distribute securely.",
      },
      {
        title: "API keys and secrets",
        scenario: "Developer",
        description:
          "Generate long, high-entropy random strings for use as API keys, secret tokens, or encryption salts in your application.",
      },
    ],
    faq: [
      {
        question: "Are these passwords truly random?",
        answer:
          "Yes. We use window.crypto.getRandomValues(), the browser's cryptographically secure pseudorandom number generator (CSPRNG). This is the same method used by security software and is mathematically impossible to predict.",
      },
      {
        question: "Do you store or log any generated passwords?",
        answer:
          "No. Password generation happens entirely in your browser using JavaScript. No data is sent to any server — not even anonymised analytics.",
      },
      {
        question: "What length should my password be?",
        answer:
          "Security experts recommend at least 16 characters for general accounts and 20+ for financial or critical accounts. Our default is 16 characters.",
      },
      {
        question: "Can I exclude ambiguous characters?",
        answer:
          "Yes — you can exclude characters like O, 0, l, 1, and I that can be confused visually. Useful when you need to read or type the password manually.",
      },
      {
        question: "What does 'entropy' mean in the strength meter?",
        answer:
          "Entropy measures how many bits of randomness a password contains. A 128-bit entropy password would take longer than the age of the universe to brute-force, even with supercomputers.",
      },
    ],
    relatedTools: ["qr-generator", "word-counter", "image-compressor"],
    metaTitle:
      "Free Password Generator Online — Cryptographically Secure | The Innovations",
    metaDesc:
      "Generate cryptographically secure passwords for free. Custom length, character types, strength meter, and bulk mode. Runs in-browser — passwords never sent to any server.",
    keywords: [
      "password generator",
      "strong password generator",
      "secure random password",
      "crypto password",
      "bulk password generator",
      "password strength",
    ],
  },

  "color-palette": {
    slug: "color-palette",
    name: "Color Palette Generator",
    tagline: "Beautiful colors.",
    taglineAccent: "Instantly yours.",
    description:
      "Generate harmonious 5-colour palettes from any base colour. Analogous, complementary, triadic, and split-complementary modes. Export as CSS variables or Tailwind config.",
    category: "Design",
    accentColor: ACCENT,
    accentLight: ACCENT_LIGHT,
    accentDark: ACCENT_DARK,
    heroPattern:
      "radial-gradient(circle at 1px 1px, #F0F0F0 1px, transparent 0)",
    icon: "🎨",
    stats: [
      { value: "4 modes", label: "harmony algorithms" },
      { value: "CSS + Tailwind", label: "export formats" },
      { value: "Infinite", label: "color combinations" },
    ],
    features: [
      {
        title: "4 colour harmony modes",
        desc: "Analogous, complementary, triadic, and split-complementary — all based on colour theory principles used by professional designers.",
        icon: "palette",
      },
      {
        title: "One-click CSS export",
        desc: "Export your palette as CSS custom properties (--color-primary, etc.) ready to paste into your stylesheet.",
        icon: "code",
      },
      {
        title: "Tailwind config export",
        desc: "Copy a Tailwind CSS colors object to drop directly into tailwind.config.js with properly named shades.",
        icon: "tailwind",
      },
      {
        title: "Click to copy HEX",
        desc: "Click any colour swatch to copy its hex value to clipboard. Build, iterate, and export your palette in seconds.",
        icon: "copy",
      },
    ],
    howItWorks: [
      {
        title: "Pick a base colour",
        description:
          "Use the colour picker or type a hex value to set your starting colour. This becomes the foundation of your palette.",
        icon: "picker",
      },
      {
        title: "Choose a harmony mode",
        description:
          "Select analogous for soft, cohesive palettes; complementary for contrast; triadic or split-complementary for vibrant variety.",
        icon: "harmony",
      },
      {
        title: "Export your palette",
        description:
          "Click on any swatch to copy its hex. Use the export button to copy your full palette as CSS variables or Tailwind config.",
        icon: "export",
      },
    ],
    useCases: [
      {
        title: "Brand identity design",
        scenario: "Brand Designer",
        description:
          "Build a cohesive colour system for a new brand in minutes. Start from the primary brand colour and generate a full palette instantly.",
      },
      {
        title: "UI component theming",
        scenario: "Frontend Developer",
        description:
          "Export directly to Tailwind or CSS variables. Drop your palette into your design system and have consistent colours everywhere.",
      },
      {
        title: "Marketing materials",
        scenario: "Marketing Designer",
        description:
          "Quickly generate on-brand colour options for social posts, ads, and presentations without needing a full design software licence.",
      },
    ],
    faq: [
      {
        question: "What is colour harmony?",
        answer:
          "Colour harmony refers to the pleasing arrangement of colours based on their positions on the colour wheel. Analogous colours sit next to each other; complementary colours are opposite; triadic colours are evenly spaced.",
      },
      {
        question: "Can I start from a specific hex code?",
        answer:
          "Yes — type any valid hex code into the input field and the palette generates instantly. You can also use the visual colour picker.",
      },
      {
        question: "What does the CSS export look like?",
        answer:
          "The CSS export produces a :root block with custom properties: --color-1 through --color-5, ready to paste into any stylesheet or CSS module.",
      },
      {
        question: "Is this suitable for accessible design?",
        answer:
          "We display contrast ratios for each colour against white and black so you can verify WCAG accessibility compliance before committing to a palette.",
      },
      {
        question: "How many palettes can I generate?",
        answer:
          "Unlimited — generate as many as you like. Each palette can be exported separately as CSS or Tailwind config.",
      },
    ],
    relatedTools: ["image-compressor", "resume-builder", "word-counter"],
    metaTitle:
      "Free Color Palette Generator — CSS & Tailwind Export | The Innovations",
    metaDesc:
      "Generate beautiful colour palettes online for free. Analogous, complementary, triadic modes. Export as CSS variables or Tailwind config. No account needed.",
    keywords: [
      "color palette generator",
      "color scheme generator",
      "complementary colors",
      "hex color palette",
      "css variables export",
      "tailwind color generator",
    ],
  },

  "word-counter": {
    slug: "word-counter",
    name: "Word Counter",
    tagline: "Count words.",
    taglineAccent: "Craft better.",
    description:
      "Count words, characters, sentences, and paragraphs in real time. Get reading and speaking time estimates, keyword density analysis, and stop-word filtering.",
    category: "Writing",
    accentColor: ACCENT,
    accentLight: ACCENT_LIGHT,
    accentDark: ACCENT_DARK,
    heroPattern:
      "repeating-linear-gradient(transparent, transparent 19px, #F5F5F5 20px)",
    icon: "📝",
    stats: [
      { value: "Real-time", label: "live analysis" },
      { value: "6 metrics", label: "words, chars, sentences…" },
      { value: "0", label: "characters uploaded" },
    ],
    features: [
      {
        title: "6 live text metrics",
        desc: "Words, characters (with and without spaces), sentences, paragraphs, reading time, and speaking time — all updating as you type.",
        icon: "stats",
      },
      {
        title: "Keyword density analysis",
        desc: "See which words appear most frequently. Stop-word filtering removes common words like 'the', 'a', and 'is' to surface meaningful terms.",
        icon: "keyword",
      },
      {
        title: "Reading & speaking time",
        desc: "Estimated at the standard 238 words/min reading speed and 130 words/min speaking speed — useful for blog posts, speeches, and presentations.",
        icon: "clock",
      },
      {
        title: "Zero data collection",
        desc: "Your text is analysed entirely in your browser. Nothing is sent anywhere — safe for confidential documents.",
        icon: "shield",
      },
    ],
    howItWorks: [
      {
        title: "Paste your text",
        description:
          "Type or paste any text into the editor — emails, blog posts, essays, scripts, or any content you want to analyse.",
        icon: "paste",
      },
      {
        title: "See metrics instantly",
        description:
          "Word count, character count, sentences, and paragraphs update in real time as you type. Reading and speaking times calculate automatically.",
        icon: "stats",
      },
      {
        title: "Analyse keywords",
        description:
          "Scroll to the keyword frequency table to see which words appear most. Toggle stop-word filtering to focus on meaningful terms.",
        icon: "search",
      },
    ],
    useCases: [
      {
        title: "Blog posts and articles",
        scenario: "Content Writer",
        description:
          "Hit your target word count precisely. Check reading time to ensure your article matches the estimated read time you published in the meta description.",
      },
      {
        title: "Academic essays",
        scenario: "Student",
        description:
          "Stay within word limits for assignments, dissertations, and theses. See both words-with-spaces and characters for different submission requirements.",
      },
      {
        title: "Presentations and speeches",
        scenario: "Public Speaker",
        description:
          "Use the speaking-time estimate to know if your speech fits a 5-minute, 15-minute, or 30-minute slot before you step on stage.",
      },
    ],
    faq: [
      {
        question: "How is word count calculated?",
        answer:
          "Words are counted by splitting on whitespace and punctuation. Hyphenated words (e.g., 'well-known') count as one word. Numbers count as words.",
      },
      {
        question: "Is my text stored anywhere?",
        answer:
          "No. All analysis happens in your browser using JavaScript. Your text never leaves your device and is not stored or transmitted anywhere.",
      },
      {
        question: "How accurate is the reading time estimate?",
        answer:
          "We use 238 words per minute, the average adult silent reading speed from research. Actual reading speed varies by text complexity and individual reader.",
      },
      {
        question: "What are stop words?",
        answer:
          "Stop words are common words (the, a, an, is, are, was, etc.) that don't carry meaningful content. Filtering them out in the keyword table reveals which substantive words you use most.",
      },
      {
        question: "Can I count characters for Twitter or SMS limits?",
        answer:
          "Yes — the characters-without-spaces metric is useful for Twitter (280 chars) and the total character count works for SMS (160 chars per segment).",
      },
    ],
    relatedTools: ["resume-builder", "pdf-toolkit", "password-generator"],
    metaTitle:
      "Free Word Counter Online — Character, Sentence & Reading Time | The Innovations",
    metaDesc:
      "Count words, characters, sentences, and paragraphs in real time. Get reading and speaking time estimates. Free, no signup, works offline.",
    keywords: [
      "word counter online",
      "character counter",
      "reading time calculator",
      "word frequency analyzer",
      "text statistics",
      "sentence counter",
    ],
  },

  "image-resizer": {
    slug: "image-resizer",
    name: "Image Resizer",
    tagline: "Perfect dimensions.",
    taglineAccent: "Every platform.",
    description:
      "Resize images to exact pixel dimensions, social media presets, or a percentage scale — all in your browser. Export as PNG or JPEG with quality control.",
    category: "Images",
    accentColor: ACCENT,
    accentLight: ACCENT_LIGHT,
    accentDark: ACCENT_DARK,
    heroPattern:
      "linear-gradient(#F5F5F5 1px, transparent 1px), linear-gradient(90deg, #F5F5F5 1px, transparent 1px)",
    icon: "✂️",
    stats: [
      { value: "20+", label: "social media presets" },
      { value: "PNG & JPEG", label: "export formats" },
      { value: "100%", label: "browser-based" },
    ],
    features: [
      {
        title: "Social media presets",
        desc: "One-click resize to Instagram square (1080×1080), Twitter header (1500×500), LinkedIn banner, YouTube thumbnail, and 15+ more.",
        icon: "social",
      },
      {
        title: "Exact pixel dimensions",
        desc: "Enter any width and height in pixels. Optionally lock the aspect ratio to prevent distortion.",
        icon: "pixel",
      },
      {
        title: "Percentage scale",
        desc: "Resize to 50%, 75%, or any percentage of the original dimensions while maintaining perfect aspect ratio.",
        icon: "percent",
      },
      {
        title: "PNG or JPEG export",
        desc: "Choose your export format and adjust JPEG quality for the ideal balance of file size and image sharpness.",
        icon: "format",
      },
    ],
    howItWorks: [
      {
        title: "Upload your image",
        description:
          "Drag and drop or click to upload any JPG, PNG, or WebP image. A preview appears immediately.",
        icon: "upload",
      },
      {
        title: "Set dimensions",
        description:
          "Pick a social media preset or enter custom pixel dimensions. Toggle aspect ratio lock to resize freely or proportionally.",
        icon: "dimensions",
      },
      {
        title: "Download",
        description:
          "Choose PNG or JPEG export format, set quality if needed, and click download. Your resized image saves instantly.",
        icon: "download",
      },
    ],
    useCases: [
      {
        title: "Social media content creation",
        scenario: "Social Media Manager",
        description:
          "Resize one image to multiple platform-specific dimensions in seconds. Instagram, Twitter, LinkedIn, Facebook — all from one file.",
      },
      {
        title: "Web development",
        scenario: "Developer",
        description:
          "Create correctly-sized thumbnails, hero images, and avatar placeholders without leaving the browser or opening image editing software.",
      },
      {
        title: "Email marketing",
        scenario: "Email Marketer",
        description:
          "Email clients render images at specific pixel widths. Resize to exactly 600px wide to ensure your campaign renders correctly everywhere.",
      },
    ],
    faq: [
      {
        question: "Will resizing reduce image quality?",
        answer:
          "Making an image smaller typically maintains quality well. Enlarging an image beyond its original dimensions will cause some pixelation — we show a warning when you try to upscale significantly.",
      },
      {
        question: "Can I resize animated GIFs?",
        answer:
          "Currently only static images (JPG, PNG, WebP) are supported. GIF animation support is on our roadmap.",
      },
      {
        question: "What's the difference between PNG and JPEG export?",
        answer:
          "PNG is lossless and supports transparency. JPEG is smaller but uses lossy compression (no transparency). For photos, use JPEG. For logos or images with transparent backgrounds, use PNG.",
      },
      {
        question: "Is there a maximum image size?",
        answer:
          "No server-side limit. Very large images (over 50MP) may be slow to process on older devices due to browser memory constraints.",
      },
      {
        question: "Can I batch resize multiple images?",
        answer:
          "Currently the resizer processes one image at a time. Batch resizing is on our roadmap — follow us on GitHub for updates.",
      },
    ],
    relatedTools: ["image-compressor", "bg-remover", "qr-generator"],
    metaTitle:
      "Free Image Resizer Online — Social Media Presets & Custom Dimensions | The Innovations",
    metaDesc:
      "Resize images online for free. 20+ social media presets, exact pixel dimensions, or percentage scale. Export as PNG or JPEG. No upload, runs in your browser.",
    keywords: [
      "image resizer online",
      "resize image free",
      "social media image resizer",
      "resize png online",
      "photo resizer",
      "image dimensions",
    ],
  },

  "bg-remover": {
    slug: "bg-remover",
    name: "Background Remover",
    tagline: "Remove the background.",
    taglineAccent: "Keep the magic.",
    description:
      "Remove image backgrounds with an AI model that runs entirely in your browser via WebAssembly. No data leaves your device. Replace with solid colour or keep transparent.",
    category: "Images",
    accentColor: ACCENT,
    accentLight: ACCENT_LIGHT,
    accentDark: ACCENT_DARK,
    heroPattern:
      "radial-gradient(circle at 50% 50%, #F5F5F5 1px, transparent 1px)",
    icon: "🪄",
    stats: [
      { value: "AI-powered", label: "WebAssembly model" },
      { value: "0 bytes", label: "sent to any server" },
      { value: "PNG", label: "transparent export" },
    ],
    features: [
      {
        title: "AI background removal",
        desc: "Powered by the @imgly/background-removal model running fully client-side via WebAssembly — no API key, no cloud processing.",
        icon: "ai",
      },
      {
        title: "Replace or keep transparent",
        desc: "Keep the transparent background (PNG) or replace it with any solid colour — perfect for product shots on white or on brand colours.",
        icon: "transparent",
      },
      {
        title: "Private by design",
        desc: "Your photos never leave your browser. The AI model downloads once and runs locally, even for sensitive personal or business images.",
        icon: "shield",
      },
      {
        title: "High-quality edges",
        desc: "The model handles hair, fur, and complex edges significantly better than simple chroma-key methods, delivering professional results.",
        icon: "quality",
      },
    ],
    howItWorks: [
      {
        title: "Upload your image",
        description:
          "Drop a JPG or PNG image containing the subject you want to isolate. Product photos, portraits, and objects all work well.",
        icon: "upload",
      },
      {
        title: "AI removes the background",
        description:
          "The AI model analyses your image and separates the subject from the background. This may take 5-30 seconds on first use while the model loads.",
        icon: "ai",
      },
      {
        title: "Download your result",
        description:
          "Download your image as a transparent PNG, or choose a background colour first. Paste it into Canva, Figma, or anywhere else.",
        icon: "download",
      },
    ],
    useCases: [
      {
        title: "E-commerce product photography",
        scenario: "Online Seller",
        description:
          "Create clean white-background product images for Amazon, Shopify, or Etsy listings without hiring a photographer or paying for editing software.",
      },
      {
        title: "Profile photos",
        scenario: "Professional",
        description:
          "Remove a cluttered home office background from a selfie and replace it with a clean, professional neutral colour for LinkedIn or Zoom.",
      },
      {
        title: "Marketing assets",
        scenario: "Designer",
        description:
          "Isolate product images to use on different campaign backgrounds. Transparent PNGs drop into any layout — Canva, Figma, PowerPoint.",
      },
    ],
    faq: [
      {
        question: "How long does background removal take?",
        answer:
          "After the initial model load (5-15 seconds on first use, cached after that), background removal typically takes 3-10 seconds depending on image size and your device speed.",
      },
      {
        question: "Is my photo sent to any server?",
        answer:
          "No. The AI model runs entirely in your browser via WebAssembly. Your image data never leaves your device at any point in the process.",
      },
      {
        question: "What types of images work best?",
        answer:
          "The tool works best on images with a clear subject and distinct background — product photos, portraits, and animals. Busy or textured backgrounds with similar colours to the subject may produce less precise edges.",
      },
      {
        question: "What format is the output?",
        answer:
          "Output is always a PNG file, which supports transparency. If you choose a background colour, the PNG includes that colour. If you keep it transparent, the checkerboard pattern you see in the preview means the background is empty.",
      },
      {
        question: "Can I batch process multiple images?",
        answer:
          "Currently the tool processes one image at a time to prevent memory issues with the WASM model. Batch processing is on our roadmap.",
      },
    ],
    relatedTools: ["image-compressor", "image-resizer", "color-palette"],
    metaTitle:
      "Free Background Remover Online — AI-Powered, Private | The Innovations",
    metaDesc:
      "Remove image backgrounds for free using AI that runs in your browser. No upload, no server, completely private. Download transparent PNG. No account required.",
    keywords: [
      "background remover free",
      "remove background online",
      "transparent background",
      "ai background removal",
      "background eraser",
      "cut out image",
    ],
  },

  "age-calculator": {
    slug: "age-calculator",
    name: "Age Calculator",
    tagline: "Every day counts.",
    taglineAccent: "We'll prove it.",
    description:
      "Find your exact age in years, months, and days. See total days, hours, and minutes lived, your next birthday countdown, and your zodiac sign.",
    category: "Utilities",
    accentColor: ACCENT,
    accentLight: ACCENT_LIGHT,
    accentDark: ACCENT_DARK,
    heroPattern:
      "radial-gradient(circle, #F0F0F0 1.5px, transparent 1.5px)",
    icon: "📅",
    stats: [
      { value: "Exact", label: "years, months, days" },
      { value: "Live", label: "birthday countdown" },
      { value: "Zodiac", label: "sign included" },
    ],
    features: [
      {
        title: "Exact age breakdown",
        desc: "Get your precise age in years, months, and days — not just a rounded number. Accurate to the current day.",
        icon: "calendar",
      },
      {
        title: "Total time lived",
        desc: "See the grand total: days, hours, minutes, and even seconds you've been alive. A surprisingly humbling and motivating number.",
        icon: "clock",
      },
      {
        title: "Birthday countdown",
        desc: "See exactly how many days, hours, minutes, and seconds until your next birthday — updating live in real time.",
        icon: "countdown",
      },
      {
        title: "Zodiac sign & day of birth",
        desc: "Find out which day of the week you were born on and your Western zodiac sign — useful trivia and a great conversation starter.",
        icon: "star",
      },
    ],
    howItWorks: [
      {
        title: "Enter your birthday",
        description:
          "Select your date of birth using the date picker. You can enter any date in the past.",
        icon: "calendar",
      },
      {
        title: "See your results instantly",
        description:
          "Your exact age, total days lived, zodiac sign, and birthday countdown all appear immediately after selecting your birthdate.",
        icon: "stats",
      },
      {
        title: "Watch the countdown tick",
        description:
          "The birthday countdown updates live every second so you can see exactly when your next birthday arrives.",
        icon: "clock",
      },
    ],
    useCases: [
      {
        title: "Personal milestone tracking",
        scenario: "Everyday User",
        description:
          "Find out your exact age for official documents, or calculate how many days until you turn a milestone age like 30, 40, or 50.",
      },
      {
        title: "Legal and official purposes",
        scenario: "Legal Professional",
        description:
          "Calculate exact ages to the day for legal documents, contracts, insurance forms, or eligibility verification.",
      },
      {
        title: "Birthday party planning",
        scenario: "Party Planner",
        description:
          "Calculate exact ages for birthday banners or speeches. Find the countdown to the big day and plan with precision.",
      },
    ],
    faq: [
      {
        question: "How does the calculator handle leap years?",
        answer:
          "Our calculator correctly accounts for leap years (Feb 29 birthdays). If your birthday falls on Feb 29, it celebrates on Feb 28 in non-leap years.",
      },
      {
        question: "Is the result accurate to today's date?",
        answer:
          "Yes — the calculation uses your device's current date and time, so the result is accurate to the current day and the countdown ticks in real time.",
      },
      {
        question: "Can I calculate the age of someone else?",
        answer:
          "Yes — just enter any date of birth. It doesn't have to be your own. Use it to calculate ages for family members, historical figures, or any date.",
      },
      {
        question: "How is the zodiac sign determined?",
        answer:
          "We use Western astrology sun sign dates. Your zodiac sign is determined by your month and day of birth, not the year.",
      },
      {
        question: "Can I calculate the difference between two dates?",
        answer:
          "The age calculator computes from a birth date to today. For a custom date range calculator, we're exploring adding a 'date difference' mode in a future update.",
      },
    ],
    relatedTools: ["unit-converter", "currency-converter", "word-counter"],
    metaTitle:
      "Free Age Calculator Online — Exact Age, Birthday Countdown & Zodiac | The Innovations",
    metaDesc:
      "Calculate your exact age in years, months, and days. See total days lived, your next birthday countdown (live), day of birth, and zodiac sign. Free, no signup.",
    keywords: [
      "age calculator",
      "calculate age from birthday",
      "birthday countdown",
      "days lived calculator",
      "zodiac sign calculator",
      "how old am i",
    ],
  },

  "currency-converter": {
    slug: "currency-converter",
    name: "Currency Converter",
    tagline: "Live rates.",
    taglineAccent: "Zero delays.",
    description:
      "Convert between 150+ world currencies with live exchange rates. Rates cached hourly from open.er-api.com. Multi-currency comparison table included.",
    category: "Finance",
    accentColor: ACCENT,
    accentLight: ACCENT_LIGHT,
    accentDark: ACCENT_DARK,
    heroPattern:
      "linear-gradient(60deg, #F7F7F7 25%, transparent 25%), linear-gradient(-60deg, #F7F7F7 25%, transparent 25%), linear-gradient(60deg, transparent 75%, #F7F7F7 75%), linear-gradient(-60deg, transparent 75%, #F7F7F7 75%)",
    icon: "💱",
    stats: [
      { value: "150+", label: "currencies supported" },
      { value: "Hourly", label: "rate updates" },
      { value: "Live API", label: "open.er-api.com" },
    ],
    features: [
      {
        title: "150+ currencies",
        desc: "Convert between all major world currencies plus dozens of regional ones. From USD to Vietnamese Dong and everything in between.",
        icon: "globe",
      },
      {
        title: "Live exchange rates",
        desc: "Rates are fetched from open.er-api.com and cached hourly. Always within 60 minutes of the true mid-market rate.",
        icon: "live",
      },
      {
        title: "Multi-currency comparison",
        desc: "Enter an amount once and see its value in 10+ currencies simultaneously — great for travel planning or international pricing.",
        icon: "table",
      },
      {
        title: "Works offline after first load",
        desc: "Exchange rates are cached in your browser. If you lose internet, your last-loaded rates are still available for conversion.",
        icon: "offline",
      },
    ],
    howItWorks: [
      {
        title: "Enter your amount",
        description:
          "Type the amount you want to convert in the 'From' field. Any number of decimal places is supported.",
        icon: "input",
      },
      {
        title: "Select currencies",
        description:
          "Choose your source and target currencies from the dropdown lists. Over 150 currencies are available.",
        icon: "select",
      },
      {
        title: "Get the result instantly",
        description:
          "The converted amount appears immediately. Scroll to the comparison table to see your amount in multiple currencies at once.",
        icon: "result",
      },
    ],
    useCases: [
      {
        title: "International travel planning",
        scenario: "Traveller",
        description:
          "Check how far your holiday budget goes in your destination currency. Compare across multiple currencies if you're visiting several countries.",
      },
      {
        title: "International invoicing",
        scenario: "Freelancer",
        description:
          "Quote international clients in their local currency. Check the current rate before invoicing to set the right price.",
      },
      {
        title: "Forex monitoring",
        scenario: "Investor",
        description:
          "Quickly check mid-market rates for currency pairs you're tracking without needing a broker account or dedicated forex platform.",
      },
    ],
    faq: [
      {
        question: "How current are the exchange rates?",
        answer:
          "Rates are fetched from open.er-api.com and updated hourly. They reflect mid-market rates and are within 60 minutes of real-time exchange rates.",
      },
      {
        question: "Are these the rates I'll get at a bank?",
        answer:
          "These are mid-market rates — the midpoint between buy and sell rates. Banks and exchange bureaux add a margin (typically 1-4%), so the rate you receive in practice will differ.",
      },
      {
        question: "How many currencies are supported?",
        answer:
          "We support 150+ currencies including all major world currencies, most regional currencies, and some cryptocurrencies. The full list appears in the currency dropdown.",
      },
      {
        question: "Does the converter work offline?",
        answer:
          "Once rates have been fetched, they are cached in your browser for up to 1 hour. If you lose internet during that window, conversions still work using cached rates.",
      },
      {
        question: "What is the multi-currency comparison table?",
        answer:
          "After converting, a table shows your entered amount converted to 10+ popular currencies simultaneously — useful for travellers or anyone dealing with multiple currencies.",
      },
    ],
    relatedTools: ["unit-converter", "age-calculator", "word-counter"],
    metaTitle:
      "Free Currency Converter Online — Live Exchange Rates, 150+ Currencies | The Innovations",
    metaDesc:
      "Convert currencies with live exchange rates. 150+ currencies, hourly updates from open.er-api.com, multi-currency comparison table. Free, no signup.",
    keywords: [
      "currency converter",
      "live exchange rates",
      "usd to eur converter",
      "forex converter",
      "real time currency",
      "money converter online",
    ],
  },

  "unit-converter": {
    slug: "unit-converter",
    name: "Unit Converter",
    tagline: "Any unit.",
    taglineAccent: "Any answer.",
    description:
      "Convert between units of Length, Weight, Temperature, Speed, Area, and Volume instantly. Special formulas for Celsius, Fahrenheit, Kelvin, and Rankine.",
    category: "Utilities",
    accentColor: ACCENT,
    accentLight: ACCENT_LIGHT,
    accentDark: ACCENT_DARK,
    heroPattern:
      "repeating-linear-gradient(45deg, #F5F5F5, #F5F5F5 1px, transparent 0, transparent 50%)",
    icon: "📐",
    stats: [
      { value: "6 categories", label: "length, weight, temp…" },
      { value: "50+", label: "unit types" },
      { value: "Instant", label: "bi-directional conversion" },
    ],
    features: [
      {
        title: "6 measurement categories",
        desc: "Length, Weight/Mass, Temperature, Speed, Area, and Volume — all the everyday conversions you need in one place.",
        icon: "categories",
      },
      {
        title: "Precise temperature formulas",
        desc: "Celsius, Fahrenheit, Kelvin, and Rankine use exact formulae (not linear factors) for 100% accurate temperature conversion.",
        icon: "temp",
      },
      {
        title: "Bi-directional input",
        desc: "Type in either field and the other updates instantly. Change the unit dropdowns and both values recalculate immediately.",
        icon: "bidirectional",
      },
      {
        title: "Metric and imperial",
        desc: "Covers both metric (SI) and imperial units. Convert km to miles, kg to lbs, litres to gallons, and more with one click.",
        icon: "metric",
      },
    ],
    howItWorks: [
      {
        title: "Select a category",
        description:
          "Choose Length, Weight, Temperature, Speed, Area, or Volume from the category tabs at the top.",
        icon: "select",
      },
      {
        title: "Choose your units",
        description:
          "Pick the source unit (e.g., kilometres) and target unit (e.g., miles) from the dropdowns on each side.",
        icon: "units",
      },
      {
        title: "Enter a value",
        description:
          "Type a number in either input field. The converted value appears instantly in the other field. No 'convert' button needed.",
        icon: "input",
      },
    ],
    useCases: [
      {
        title: "International recipes",
        scenario: "Home Cook",
        description:
          "Convert American recipes from cups and ounces to grams and millilitres. Convert Fahrenheit oven temperatures to Celsius instantly.",
      },
      {
        title: "Travel and navigation",
        scenario: "Traveller",
        description:
          "Convert between mph and km/h for speed limits, miles and kilometres for distances, and Fahrenheit and Celsius for weather.",
      },
      {
        title: "Engineering and science",
        scenario: "Engineer",
        description:
          "Convert between imperial and metric units for engineering calculations, material quantities, and cross-standard specifications.",
      },
    ],
    faq: [
      {
        question: "How accurate are the conversions?",
        answer:
          "All conversions use standard conversion factors with full floating-point precision. Temperature uses the exact formulae (°F = °C × 9/5 + 32), not approximations.",
      },
      {
        question: "What units are available for length?",
        answer:
          "Millimetres, centimetres, metres, kilometres, inches, feet, yards, miles, nautical miles, and light-years — covering everyday and specialised use cases.",
      },
      {
        question: "Can I convert temperature between all four scales?",
        answer:
          "Yes — Celsius, Fahrenheit, Kelvin, and Rankine are all supported with proper formulae for each pair-wise conversion.",
      },
      {
        question: "Why does my converted value show many decimal places?",
        answer:
          "We show full precision by default to avoid rounding errors. Most practical applications only need 2-4 decimal places, which you can round manually.",
      },
      {
        question: "Are more unit categories planned?",
        answer:
          "Yes — we're planning to add Energy (joules, calories, BTU), Pressure (pascal, bar, psi), and Data (bytes, KB, MB, GB). Star us on GitHub to follow progress.",
      },
    ],
    relatedTools: ["currency-converter", "age-calculator", "word-counter"],
    metaTitle:
      "Free Unit Converter Online — Length, Weight, Temperature & More | The Innovations",
    metaDesc:
      "Convert between units of length, weight, temperature, speed, area, and volume instantly. Metric and imperial. Free, no signup, works offline.",
    keywords: [
      "unit converter",
      "length converter",
      "weight converter",
      "temperature converter",
      "metric to imperial",
      "measurement unit calculator",
    ],
  },
};

export function getToolConfig(slug: string): ToolConfig | undefined {
  return toolConfigs[slug];
}

export function getAllToolConfigs(): ToolConfig[] {
  return Object.values(toolConfigs);
}
