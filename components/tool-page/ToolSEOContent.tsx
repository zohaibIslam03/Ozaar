import type { ToolConfig } from "@/lib/toolConfig";
import Link from "next/link";

const SEO_CONTENT: Record<
  string,
  {
    what: string[];
    how: string[];
    why: string[];
    relatedLinks: { slug: string; name: string; phrase: string }[];
  }
> = {
  "image-compressor": {
    what: [
      "An image compressor is a tool that reduces the file size of digital images — such as PNG, JPG, and GIF files — to make them faster to load and easier to share. The process works by removing redundant or imperceptible image data, resulting in a smaller file that looks nearly identical to the original at normal viewing sizes.",
      "Image compression is essential for any website, application, or workflow that handles visual content. Large, unoptimised images are the single most common cause of slow page load times. Search engines like Google factor page speed into rankings, meaning that uncompressed images can directly harm your SEO performance and organic traffic.",
      "Ozaar Image Compressor converts your PNG, JPG, and GIF images to the modern WebP format, which delivers 25–35% better compression than JPEG at equivalent visual quality. The result is dramatically smaller files with no perceptible quality difference — exactly what fast, high-performing websites need.",
    ],
    how: [
      "Our image compressor uses the browser's native Canvas API to re-encode your images at your chosen quality level. When you drop an image onto the tool, it is loaded into an invisible HTML canvas element. The canvas then exports the image data as a WebP blob at your selected quality setting.",
      "Because the entire process happens inside your browser, there is no server-side processing involved. Your image data never leaves your device. This makes the tool faster than cloud-based compressors (no upload/download latency) and completely private.",
    ],
    why: [
      "Browser-based image compression has several significant advantages over traditional cloud tools. First, it is genuinely instantaneous — there is no upload wait time, no queue, and no processing delay. Second, it is completely private — your images never touch an external server, making it safe for confidential business assets or personal photos.",
      "The tool also has no file size limits, no daily quotas, and no account requirements. You can compress a single hero image or an entire batch of product photos, and the tool will handle them identically. Close the tab and open it again tomorrow — it will work exactly the same, with no saved data and no cookies.",
    ],
    relatedLinks: [
      { slug: "image-resizer", name: "Image Resizer", phrase: "resize your images" },
      { slug: "bg-remover", name: "Background Remover", phrase: "remove image backgrounds" },
    ],
  },

  "resume-builder": {
    what: [
      "A resume builder is an online tool that guides you through creating a professional resume or CV without needing design software or prior formatting experience. Rather than starting from a blank document, you fill in structured fields for your work history, education, skills, and contact information, and the tool formats everything into a polished, print-ready layout.",
      "The most critical feature of any modern resume builder is ATS compatibility. Applicant Tracking Systems are software tools used by over 98% of Fortune 500 companies to automatically scan and filter incoming resumes before a human ever reads them. An ATS-friendly resume uses clean, standard formatting that these systems can parse correctly — avoiding tables, graphics, unusual fonts, or multi-column layouts that confuse the parser.",
      "Ozaar Resume Builder produces ATS-optimized resumes with live preview, automatic local saving, and one-click PDF export — all completely free and without any account requirement.",
    ],
    how: [
      "Our resume builder uses @react-pdf/renderer to generate PDF documents directly in the browser. As you fill in the form fields, the right-side preview updates in real time using the same rendering engine. When you click 'Download PDF', the PDF is generated client-side and downloaded directly to your device.",
      "Your resume data is automatically saved to your browser's localStorage after every change. This means you can close the tab, restart your computer, or come back days later and your progress will be preserved — as long as you use the same browser and haven't cleared site data.",
    ],
    why: [
      "Browser-based resume building eliminates the frustrating upload-wait-download cycle of cloud services, and unlike Google Docs or Word templates, our tool produces a PDF from a purpose-built resume renderer designed for clean parsing by ATS software.",
      "Since nothing is stored on our servers, your personal information — name, address, employment history — stays entirely on your device. There is nothing to delete, no data breach risk, and no company holding your career information.",
    ],
    relatedLinks: [
      { slug: "word-counter", name: "Word Counter", phrase: "count the words in your resume" },
      { slug: "pdf-toolkit", name: "PDF Toolkit", phrase: "work with your exported PDF" },
    ],
  },

  "pdf-toolkit": {
    what: [
      "A PDF toolkit is a collection of utilities for working with PDF (Portable Document Format) files. The three most commonly needed operations are merging (combining multiple PDFs into one), splitting (dividing a single PDF into multiple files by page range), and compressing (reducing the file size of a PDF for easier sharing or storage).",
      "PDFs are the universal standard for sharing documents that must retain their formatting across devices and operating systems. They are used for contracts, reports, invoices, presentations, academic papers, and countless other document types. Being able to merge, split, and compress PDFs without specialist software is a fundamental productivity need for individuals and businesses alike.",
      "Ozaar PDF Toolkit provides all three operations in a single, free, browser-based tool. No software installation, no monthly subscription, and no file uploads to external servers.",
    ],
    how: [
      "Our PDF Toolkit is powered by pdf-lib, a comprehensive JavaScript library for creating and modifying PDF files that runs entirely in the browser. When you merge PDFs, pdf-lib reads each file's page tree and combines them into a new PDF document. When splitting, it copies the specified page ranges into new documents. All operations are performed in memory and downloaded directly to your device.",
      "The tool uses the File API to read your selected PDF files as ArrayBuffers, passes them to pdf-lib for processing, and then converts the result back into a downloadable Blob. Nothing is transmitted to any server at any point.",
    ],
    why: [
      "The primary advantage of browser-based PDF tools is privacy. PDF files often contain sensitive information — legal contracts, financial documents, medical records, or confidential business data. Uploading these to cloud services (even reputable ones) introduces data handling risks that many professionals and organisations cannot accept.",
      "Our tool requires no account, no payment, and no installation. It works on any device with a modern browser — Windows, Mac, Linux, iOS, or Android — and produces standard-compliant PDF output that is compatible with all PDF readers.",
    ],
    relatedLinks: [
      { slug: "image-compressor", name: "Image Compressor", phrase: "compress images embedded in your documents" },
      { slug: "resume-builder", name: "Resume Builder", phrase: "build a resume and export it as PDF" },
    ],
  },

  "qr-generator": {
    what: [
      "A QR code (Quick Response code) is a two-dimensional barcode that can be scanned by smartphone cameras to instantly open a URL, display text, share contact information, or trigger other actions. QR codes were invented in 1994 and have seen explosive adoption since smartphones made scanning them trivially easy.",
      "A QR code generator is a tool that takes any input — a web address, plain text, an email, a phone number — and encodes it into a scannable QR image. The output can then be printed, embedded in digital content, or displayed on screens for others to scan. The QR code contains no expiry date and works permanently as long as the destination URL or content remains valid.",
      "Ozaar QR Code Generator produces fully customisable, watermark-free QR codes that can be downloaded as PNG for digital use or SVG for high-quality print output — at any scale, at no cost.",
    ],
    how: [
      "QR codes are generated using the qrcode.js library, which implements the QR Code 2005 specification (ISO/IEC 18004) entirely in JavaScript. When you enter your content, the library encodes it using Reed-Solomon error correction, calculates the required version (size) of the QR matrix, and renders the pattern as an SVG or canvas element.",
      "Error correction means that QR codes can still be scanned even if up to 30% of the image is damaged or obscured. This makes them robust for printed materials where wear and tear is expected.",
    ],
    why: [
      "Browser-based QR generation is both faster and more private than cloud-based alternatives. There is no server round-trip — the QR code appears in milliseconds as you type. And since the generation happens locally, any sensitive content you encode (internal URLs, private contact details) never leaves your device.",
      "Unlike many QR code services, we do not create redirect URLs. The QR code links directly to whatever you entered, which means no tracking, no analytics on your scans, and no service dependency — your QR code works the same whether we are online or not.",
    ],
    relatedLinks: [
      { slug: "image-compressor", name: "Image Compressor", phrase: "compress your downloaded QR images" },
      { slug: "image-resizer", name: "Image Resizer", phrase: "resize the QR image for specific use cases" },
    ],
  },

  "password-generator": {
    what: [
      "A password generator is a tool that creates random, unpredictable passwords based on your specified requirements. Unlike manually chosen passwords (which tend to be predictable, reused, or too short), a properly generated password uses true randomness to produce a string that is computationally infeasible to guess or crack.",
      "Password security is one of the most consequential and most overlooked aspects of personal and business cybersecurity. The vast majority of account compromises occur because of weak, reused, or breached passwords — not because of sophisticated hacking. A strong, unique password for every account is the single most effective defence against credential-based attacks.",
      "Ozaar Password Generator uses the browser's built-in cryptographic random number generator to produce passwords that meet the highest security standards — with customisable length, character sets, and bulk generation.",
    ],
    how: [
      "Our generator uses window.crypto.getRandomValues() — the browser's implementation of a Cryptographically Secure Pseudorandom Number Generator (CSPRNG). This is the same source of randomness used in cryptographic applications, TLS certificates, and operating system entropy pools. It is mathematically impossible to predict the next value from previously observed values.",
      "Character selection uses a modulo-reduction technique with rejection sampling to ensure each character position has an exactly equal probability of being any character in your chosen set — avoiding the statistical biases that affect simpler random() implementations.",
    ],
    why: [
      "Running the password generator in the browser means your generated passwords are never transmitted anywhere. Many cloud-based password generators (including some high-traffic ones) generate passwords server-side, which creates a theoretical risk that generated passwords could be logged or intercepted. Our generator has no server component.",
      "There is also no account needed, no generated passwords saved, and no usage analytics. The only record of your generated password exists in your clipboard — and only until you replace it.",
    ],
    relatedLinks: [
      { slug: "qr-generator", name: "QR Code Generator", phrase: "generate a QR code linking to your account" },
      { slug: "word-counter", name: "Word Counter", phrase: "analyse the strength of passphrase words" },
    ],
  },

  "color-palette": {
    what: [
      "A colour palette generator is a design tool that creates sets of harmonious colours based on colour theory principles. Rather than choosing colours arbitrarily, these tools apply mathematical relationships between hues on the colour wheel to produce palettes that are visually pleasing, cohesive, and suitable for use in branding, UI design, and marketing materials.",
      "Colour harmony is a fundamental principle of design. When colours relate to each other through established geometric relationships on the colour wheel — such as being adjacent (analogous), opposite (complementary), or evenly distributed (triadic) — they tend to feel balanced and intentional rather than random or jarring.",
      "Ozaar Colour Palette Generator produces 5-colour palettes in four harmony modes — analogous, complementary, triadic, and split-complementary — with one-click export to CSS custom properties or Tailwind CSS configuration.",
    ],
    how: [
      "Palette generation uses HSL (Hue, Saturation, Lightness) colour space arithmetic. Given a base hex colour, the tool converts it to HSL and then calculates the hue angles of the other palette colours based on the selected harmony mode. Complementary colours are exactly 180° away on the hue wheel; triadic colours are 120° apart; analogous colours are 30° apart.",
      "The CSS and Tailwind exports are generated client-side by formatting the calculated hex values into the appropriate variable or object syntax. No server processing is needed.",
    ],
    why: [
      "Browser-based colour palette generation is instantaneous and requires no design software license. The tool is accessible to developers who need quick CSS colours, non-designers building their first brand, and experienced designers who want to prototype palette ideas quickly.",
      "Unlike some palette tools, our exports are immediately usable — the CSS output goes directly into a stylesheet, and the Tailwind output goes directly into tailwind.config.js. No copy-pasting and reformatting required.",
    ],
    relatedLinks: [
      { slug: "image-compressor", name: "Image Compressor", phrase: "compress brand assets" },
      { slug: "resume-builder", name: "Resume Builder", phrase: "apply your colour palette to a resume" },
    ],
  },

  "word-counter": {
    what: [
      "A word counter is a text analysis tool that counts the number of words in a piece of writing, along with other related statistics such as character count, sentence count, paragraph count, and estimated reading or speaking time. These metrics are useful for writers, students, content marketers, and anyone working with text content.",
      "Word counts matter in many contexts. Academic submissions have strict word limits. Blog posts have SEO-optimal length ranges. Job applications have character limits. Speeches must fit specific time slots. Marketing copy must fit within ad character limits. A word counter makes it trivially easy to verify all of these.",
      "Ozaar Word Counter provides all six key text metrics in real time as you type, along with keyword frequency analysis — making it one of the most complete free word counting tools available.",
    ],
    how: [
      "All text analysis in our word counter happens client-side using JavaScript string manipulation. Word counting splits the text on whitespace boundaries (spaces, tabs, newlines) and counts the resulting non-empty tokens. Sentence counting identifies sentence-ending punctuation (periods, exclamation marks, question marks). Paragraph counting splits on double-newline characters.",
      "Reading time is estimated using 238 words per minute (the widely cited adult silent reading speed). Speaking time uses 130 words per minute (average presentation pace). Both are updated instantly as your word count changes.",
    ],
    why: [
      "Since all analysis is in-browser, your text is completely private. Paste sensitive documents, draft emails, or confidential reports without any concern about data storage or transmission. The tool processes everything locally and never contacts a server.",
      "The keyword frequency table helps writers identify overused words and improve their writing by surfacing the vocabulary distribution of their text. Stop-word filtering removes grammatical filler words to focus on the substantive vocabulary of the content.",
    ],
    relatedLinks: [
      { slug: "resume-builder", name: "Resume Builder", phrase: "put those polished words into a resume" },
      { slug: "pdf-toolkit", name: "PDF Toolkit", phrase: "merge your documents into a PDF" },
    ],
  },

  "image-resizer": {
    what: [
      "An image resizer is a tool that changes the pixel dimensions of a digital image. Resizing can reduce an image to a smaller size (downscaling) or increase it to larger dimensions (upscaling). The former is far more common and preserves image quality well; the latter introduces some pixelation beyond the original resolution.",
      "Image sizing matters enormously for web performance and social media. Every major platform — Instagram, Twitter, LinkedIn, YouTube, Facebook — has specific pixel dimension requirements for different image types: profile photos, cover images, post images, and ad formats. Uploading incorrectly sized images results in unwanted cropping, compression artefacts, or padding.",
      "Ozaar Image Resizer provides 20+ social media presets alongside free-form custom dimensions, making it a complete solution for content creators, developers, and marketers.",
    ],
    how: [
      "Image resizing uses the browser's HTML Canvas API. Your image is loaded into an off-screen canvas element at the target dimensions. The canvas's drawImage() method handles the pixel interpolation (scaling), and the result is exported as a PNG or JPEG blob using toBlob() at your chosen quality level.",
      "Aspect ratio locking is implemented by calculating the proportional dimension when one side is changed — if you set a new width and ratio-lock is on, the height recalculates automatically to maintain the original proportions.",
    ],
    why: [
      "Browser-based resizing is faster than uploading to a cloud service, more private than sending images to a third-party server, and more accessible than opening an image editor like Photoshop or GIMP for a simple resize operation.",
      "Our social media presets are kept up to date with platform specifications. A single image can be resized to Instagram square, Twitter card, LinkedIn banner, and YouTube thumbnail dimensions in under a minute — all without leaving the browser tab.",
    ],
    relatedLinks: [
      { slug: "image-compressor", name: "Image Compressor", phrase: "compress the resized image" },
      { slug: "bg-remover", name: "Background Remover", phrase: "remove the background from your image" },
    ],
  },

  "bg-remover": {
    what: [
      "A background remover is an image editing tool that automatically separates the main subject of an image from its background, making the background transparent. This is used in product photography, profile photos, marketing design, and any situation where you need to isolate a subject from its surroundings.",
      "Traditional background removal required manual selection tools in software like Photoshop, which is time-consuming and requires skill. Modern AI-powered tools use machine learning models trained on millions of images to identify foreground subjects and separate them from backgrounds automatically and accurately.",
      "Ozaar Background Remover runs an AI model entirely in your browser using WebAssembly, delivering professional-quality background removal with complete privacy — your images never touch a server.",
    ],
    how: [
      "Our background remover uses the @imgly/background-removal library, which bundles a trained neural network (based on the RMBG-1.4 architecture) as a WebAssembly module. When you first load the tool, the WASM model (approximately 150MB) downloads and compiles in your browser. Subsequent uses are instant because the model is cached by the browser.",
      "The model processes your image by segmenting it into foreground and background regions using pixel classification. The result is an alpha mask that is applied to your image, making the background transparent. The masked image is then composited over your chosen replacement colour (or kept transparent) and exported as PNG.",
    ],
    why: [
      "The primary advantage of browser-based AI background removal is complete privacy. Cloud services that offer background removal as an API typically send your images to their servers for processing. For personal photos, product images with unreleased products, or any sensitive visual content, this is a significant concern.",
      "Running locally also means no API rate limits, no account requirements, and no per-image charges. Once the model has downloaded, you can remove backgrounds from unlimited images without any internet connection.",
    ],
    relatedLinks: [
      { slug: "image-compressor", name: "Image Compressor", phrase: "compress the resulting transparent PNG" },
      { slug: "image-resizer", name: "Image Resizer", phrase: "resize the image for your specific use case" },
    ],
  },

  "age-calculator": {
    what: [
      "An age calculator is a tool that computes the exact age of a person or entity given a birth date and compares it to the current date. Beyond a simple year count, a comprehensive age calculator provides the age in years, months, and days; the total count of days, hours, and minutes lived; and the countdown to the next birthday.",
      "Age calculations are more complex than they appear because of irregular month lengths (28, 29, 30, or 31 days) and leap years (February 29 occurs once every four years). A correct implementation must account for all these irregularities to produce accurate results across all possible birth dates.",
      "Ozaar Age Calculator provides a complete age breakdown including zodiac sign, day of the week you were born on, and a live ticking countdown to your next birthday — accurate to the current second.",
    ],
    how: [
      "Age calculation is performed using JavaScript's Date object, which represents time as milliseconds since the Unix epoch (January 1, 1970). The tool calculates the difference between the current Date and the birth date, then decomposes this into years, months, and days accounting for the varying lengths of months and the four-year leap year cycle.",
      "The birthday countdown updates every second using setInterval(), recalculating the remaining time and displaying it as days, hours, minutes, and seconds.",
    ],
    why: [
      "A browser-based age calculator requires no personal data to be stored anywhere. Your date of birth is processed locally in JavaScript and is never transmitted to any server. The calculation uses your device's local clock for maximum accuracy.",
      "The tool is also useful beyond personal age calculation — it can calculate the age of a business, project, or historical event from any starting date to today, with the same precision and live countdown functionality.",
    ],
    relatedLinks: [
      { slug: "unit-converter", name: "Unit Converter", phrase: "convert time units and measurements" },
      { slug: "currency-converter", name: "Currency Converter", phrase: "plan your birthday trip budget" },
    ],
  },

  "currency-converter": {
    what: [
      "A currency converter is a financial tool that translates a monetary amount from one currency to another using the current exchange rate between them. Exchange rates fluctuate constantly based on macroeconomic factors, interest rates, geopolitical events, and market supply and demand. A current exchange rate converter gives you the mid-market rate — the midpoint between buy and sell rates used by currency traders.",
      "Currency conversion is needed in many everyday contexts: international travel, cross-border e-commerce, sending money abroad, freelance invoicing for international clients, importing goods, and monitoring investment exposure to foreign currencies. Having access to live, accurate rates is essential for making informed financial decisions.",
      "Ozaar Currency Converter supports 150+ world currencies with hourly rate updates from open.er-api.com and a multi-currency comparison table that shows your amount in multiple currencies simultaneously.",
    ],
    how: [
      "Exchange rates are fetched from the open.er-api.com API on page load and then cached in your browser's localStorage for up to one hour. When you request a conversion, the tool looks up the rate from the cached data and performs the calculation instantly — no API call needed for each conversion.",
      "The base currency for rates is USD. Conversions between non-USD pairs use triangulation: amount × (rate to USD) ÷ (rate of target to USD). This is the standard method used by all currency APIs and ensures consistent results across all 150+ currency pairs.",
    ],
    why: [
      "Browser-based currency conversion with client-side caching is faster than most dedicated converter apps. After the initial rate fetch, all calculations are instantaneous — no network request per conversion. The hour-long cache also means the tool works reasonably well offline, using the last-fetched rates.",
      "Unlike bank or exchange-bureau converters, which show rates after their own markup, our converter shows mid-market rates — the true interbank rate without any spread. This is useful for reference and planning, even though the rates you actually receive at a bank or exchange will include a margin.",
    ],
    relatedLinks: [
      { slug: "unit-converter", name: "Unit Converter", phrase: "convert other types of measurements" },
      { slug: "age-calculator", name: "Age Calculator", phrase: "plan your travel timeline" },
    ],
  },

  "unit-converter": {
    what: [
      "A unit converter is a calculation tool that translates a quantity from one unit of measurement to another. Common conversions include length (metres to feet), weight (kilograms to pounds), temperature (Celsius to Fahrenheit), speed (km/h to mph), area (square metres to square feet), and volume (litres to gallons). These conversions are needed daily in cooking, travel, science, engineering, and everyday life.",
      "The world uses two major measurement systems — the metric system (SI units) and the imperial system (used primarily in the United States and informally in the UK). Converting between them requires precise conversion factors. Temperature is special: it requires a formula rather than a simple multiplication factor, because the scales have different zero points.",
      "Ozaar Unit Converter covers 6 measurement categories with 50+ unit types, bi-directional input, and exact temperature formulae — all in a clean, instant browser-based interface.",
    ],
    how: [
      "Most unit conversions use a multiplication factor: for example, 1 kilometre = 0.621371 miles, so multiplying kilometres by 0.621371 gives miles. Our converter stores these factors in a lookup table and applies them when you enter a value.",
      "Temperature is handled differently. Converting Celsius to Fahrenheit uses the formula °F = (°C × 9/5) + 32. Converting to Kelvin uses K = °C + 273.15. All four temperature scales (Celsius, Fahrenheit, Kelvin, Rankine) can be converted to any other by first converting to Celsius as an intermediate step.",
    ],
    why: [
      "A browser-based unit converter is always available without app installation, works on any device, and doesn't require an internet connection after first load. It is faster than searching 'convert X to Y' on Google and seeing the search engine's built-in converter, with clearer display and bi-directional input.",
      "Our converter shows full floating-point precision by default, which is useful for scientific or engineering applications where rounding matters. For everyday use, the values are rounded to a human-readable number of decimal places.",
    ],
    relatedLinks: [
      { slug: "currency-converter", name: "Currency Converter", phrase: "convert between world currencies" },
      { slug: "age-calculator", name: "Age Calculator", phrase: "calculate time-based values" },
    ],
  },
};

interface ToolSEOContentProps {
  tool: ToolConfig;
}

export default function ToolSEOContent({ tool }: ToolSEOContentProps) {
  const content = SEO_CONTENT[tool.slug];
  if (!content) return null;

  return (
    <section className="w-full" style={{ background: "#FAFAFA", padding: "80px 0" }}>
      <div className="max-w-[760px] mx-auto px-6">
        {/* What is it */}
        <h2
          style={{
            fontFamily: "var(--font-jakarta)",
            fontSize: "24px",
            fontWeight: 800,
            color: "#111",
            letterSpacing: "-0.02em",
            marginBottom: "12px",
          }}
        >
          What is a {tool.name}?
        </h2>
        {content.what.map((p, i) => (
          <p key={i} style={{ fontSize: "16px", color: "#555", lineHeight: 1.75, marginBottom: "16px" }}>
            {p}
          </p>
        ))}

        {/* How does it work */}
        <h2
          style={{
            fontFamily: "var(--font-jakarta)",
            fontSize: "24px",
            fontWeight: 800,
            color: "#111",
            letterSpacing: "-0.02em",
            marginTop: "40px",
            marginBottom: "12px",
          }}
        >
          How does {tool.name} work?
        </h2>
        {content.how.map((p, i) => (
          <p key={i} style={{ fontSize: "16px", color: "#555", lineHeight: 1.75, marginBottom: "16px" }}>
            {p}
          </p>
        ))}

        {/* Why browser-based */}
        <h2
          style={{
            fontFamily: "var(--font-jakarta)",
            fontSize: "24px",
            fontWeight: 800,
            color: "#111",
            letterSpacing: "-0.02em",
            marginTop: "40px",
            marginBottom: "12px",
          }}
        >
          Why use a browser-based {tool.name}?
        </h2>
        {content.why.map((p, i) => (
          <p key={i} style={{ fontSize: "16px", color: "#555", lineHeight: 1.75, marginBottom: "16px" }}>
            {p}
          </p>
        ))}

        {/* Internal links */}
        {content.relatedLinks.length > 0 && (
          <p style={{ fontSize: "16px", color: "#555", lineHeight: 1.75, marginTop: "16px" }}>
            You might also want to{" "}
            {content.relatedLinks.map((l, i) => (
              <span key={l.slug}>
                <Link
                  href={`/tools/${l.slug}`}
                  style={{ color: tool.accentColor, fontWeight: 600, textDecoration: "underline" }}
                >
                  {l.phrase}
                </Link>
                {i < content.relatedLinks.length - 1 ? " or " : ""}
              </span>
            ))}{" "}
            using our free browser tools.
          </p>
        )}
      </div>
    </section>
  );
}
