export interface Tool {
  slug: string;
  name: string;
  desc: string;
  icon: string;
  category: string;
}

export const tools: Tool[] = [
  { slug: "pdf-toolkit", name: "PDF Toolkit", desc: "Merge, split & compress PDFs in your browser", icon: "📄", category: "Files" },
  { slug: "image-compressor", name: "Image Compressor", desc: "Compress PNG/JPG to WebP, fully offline", icon: "🖼️", category: "Images" },
  { slug: "qr-generator", name: "QR Code Generator", desc: "Instant QR from any URL, text or contact", icon: "⬛", category: "Utilities" },
  { slug: "password-generator", name: "Password Generator", desc: "Cryptographically secure custom passwords", icon: "🔐", category: "Security" },
  { slug: "color-palette", name: "Color Palette Generator", desc: "Generate, explore & export HEX/CSS palettes", icon: "🎨", category: "Design" },
  { slug: "word-counter", name: "Word Counter", desc: "Count words, chars, sentences & reading time", icon: "📝", category: "Writing" },
  { slug: "image-resizer", name: "Image Resizer", desc: "Resize to exact px or social media presets", icon: "✂️", category: "Images" },
  { slug: "bg-remover", name: "Background Remover", desc: "AI-powered background removal in-browser", icon: "🪄", category: "Images" },
  { slug: "resume-builder", name: "Resume Builder", desc: "ATS-friendly templates, PDF export, no account", icon: "📋", category: "Career" },
  { slug: "age-calculator", name: "Age Calculator", desc: "Calculate age, date differences & countdowns", icon: "📅", category: "Utilities" },
  { slug: "currency-converter", name: "Currency Converter", desc: "Live rates, 150+ currencies", icon: "💱", category: "Finance" },
  { slug: "unit-converter", name: "Unit Converter", desc: "Length, weight, temp, speed, all in one", icon: "📐", category: "Utilities" },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}
