import type { CSSProperties } from "react";

export type ResumeTemplateId =
  | "classic"
  | "modern"
  | "professional"
  | "minimal"
  | "executive";

/** How the name / contact block is framed (still single-column ATS-safe text). */
export type HeaderVariant = "plain" | "top-bar" | "band" | "double-rule";

/** How section headings are drawn. */
export type SectionVariant = "rule" | "thick-rule" | "band" | "left-bar" | "subtle";

export interface ResumeTemplate {
  id: ResumeTemplateId;
  name: string;
  tagline: string;
  /** Accent used in UI picker + resume accents */
  accent: string;
  preview: {
    fontFamily: string;
    nameAlign: "center" | "left";
    nameSize: string;
    nameWeight: CSSProperties["fontWeight"];
    nameColor: string;
    nameLetterSpacing?: string;
    jobTitleStyle: CSSProperties;
    contactAlign: "center" | "left";
    contactColor: string;
    contactSep: string;
    sectionTitle: CSSProperties;
    sectionRule: CSSProperties;
    body: CSSProperties;
    /** Inner content padding (header band uses edge-to-edge separately) */
    pagePad: string;
    headerVariant: HeaderVariant;
    sectionVariant: SectionVariant;
    /** Top accent strip (modern) */
    topBarHeight?: number;
    /** Full-bleed header band (professional) */
    headerBg?: string;
    headerTextColor?: string;
    headerPad?: string;
    /** Filled section title band (executive) */
    sectionBandBg?: string;
    sectionBandColor?: string;
    /** Left accent bar beside section title (modern alt / professional) */
    sectionLeftBarWidth?: number;
  };
  pdf: {
    bodyFont: "Times-Roman" | "Helvetica";
    boldFont: "Times-Bold" | "Helvetica-Bold";
    nameAlign: "center" | "left";
    nameSize: number;
    nameColor: string;
    nameLetterSpacing?: number;
    jobTitleItalic: boolean;
    jobTitleUppercase?: boolean;
    jobTitleColor: string;
    contactAlign: "center" | "left";
    contactColor: string;
    contactSep: string;
    accent: string;
    ruleWidth: number;
    pagePad: number;
    headerVariant: HeaderVariant;
    sectionVariant: SectionVariant;
    topBarHeight?: number;
    headerBg?: string;
    headerTextColor?: string;
    headerPad?: number;
    sectionBandBg?: string;
    sectionBandColor?: string;
    sectionLeftBarWidth?: number;
  };
}

/**
 * Five ATS-friendly single-column templates with clearly different visual systems
 * (inspired by common Harvard / VitaeKit Modern / corporate / minimal / executive layouts).
 * No tables, sidebars, or multi-column body — only typography + safe color accents.
 */
export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    tagline: "Traditional serif · centered · double rules",
    accent: "#111111",
    preview: {
      fontFamily: "'Times New Roman', Georgia, serif",
      nameAlign: "center",
      nameSize: "26pt",
      nameWeight: "bold",
      nameColor: "#000000",
      nameLetterSpacing: "0.04em",
      jobTitleStyle: {
        fontSize: "11pt",
        textAlign: "center",
        color: "#333333",
        marginBottom: 8,
        fontStyle: "italic",
      },
      contactAlign: "center",
      contactColor: "#333333",
      contactSep: "  ·  ",
      sectionTitle: {
        fontSize: "11pt",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: "#000000",
        marginTop: 16,
        marginBottom: 0,
        textAlign: "center",
      },
      sectionRule: {
        borderTop: "1px solid #000",
        marginTop: 4,
        marginBottom: 8,
      },
      body: { fontSize: "10.5pt", color: "#111", lineHeight: 1.5 },
      pagePad: "36px 48px 40px",
      headerVariant: "double-rule",
      sectionVariant: "rule",
    },
    pdf: {
      bodyFont: "Times-Roman",
      boldFont: "Times-Bold",
      nameAlign: "center",
      nameSize: 26,
      nameColor: "#000000",
      nameLetterSpacing: 1.2,
      jobTitleItalic: true,
      jobTitleColor: "#333333",
      contactAlign: "center",
      contactColor: "#333333",
      contactSep: "  ·  ",
      accent: "#000000",
      ruleWidth: 1,
      pagePad: 40,
      headerVariant: "double-rule",
      sectionVariant: "rule",
    },
  },
  {
    id: "modern",
    name: "Modern",
    tagline: "Teal accent bar · bold sans · left-aligned",
    accent: "#0D9488",
    preview: {
      fontFamily: "Arial, Helvetica, sans-serif",
      nameAlign: "left",
      nameSize: "24pt",
      nameWeight: 800,
      nameColor: "#0F172A",
      jobTitleStyle: {
        fontSize: "11pt",
        textAlign: "left",
        color: "#0D9488",
        marginBottom: 6,
        fontWeight: 600,
      },
      contactAlign: "left",
      contactColor: "#475569",
      contactSep: "  ·  ",
      sectionTitle: {
        fontSize: "10pt",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.16em",
        color: "#0D9488",
        marginTop: 18,
        marginBottom: 0,
      },
      sectionRule: {
        borderTop: "3px solid #0D9488",
        marginTop: 5,
        marginBottom: 10,
      },
      body: { fontSize: "10pt", color: "#1E293B", lineHeight: 1.55 },
      pagePad: "28px 40px 36px",
      headerVariant: "top-bar",
      sectionVariant: "thick-rule",
      topBarHeight: 8,
    },
    pdf: {
      bodyFont: "Helvetica",
      boldFont: "Helvetica-Bold",
      nameAlign: "left",
      nameSize: 24,
      nameColor: "#0F172A",
      jobTitleItalic: false,
      jobTitleColor: "#0D9488",
      contactAlign: "left",
      contactColor: "#475569",
      contactSep: "  ·  ",
      accent: "#0D9488",
      ruleWidth: 3,
      pagePad: 36,
      headerVariant: "top-bar",
      sectionVariant: "thick-rule",
      topBarHeight: 8,
    },
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Navy header band · corporate polish",
    accent: "#1B3A5F",
    preview: {
      fontFamily: "Georgia, 'Times New Roman', serif",
      nameAlign: "left",
      nameSize: "22pt",
      nameWeight: "bold",
      nameColor: "#FFFFFF",
      jobTitleStyle: {
        fontSize: "11pt",
        textAlign: "left",
        color: "#B8D4F0",
        marginBottom: 8,
        fontWeight: 600,
      },
      contactAlign: "left",
      contactColor: "#D6E6F5",
      contactSep: "  |  ",
      sectionTitle: {
        fontSize: "10.5pt",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "#1B3A5F",
        marginTop: 16,
        marginBottom: 0,
        paddingLeft: 10,
      },
      sectionRule: {
        borderTop: "1.5px solid #1B3A5F",
        marginTop: 4,
        marginBottom: 8,
      },
      body: { fontSize: "10pt", color: "#1a1a1a", lineHeight: 1.5 },
      pagePad: "28px 42px 40px",
      headerVariant: "band",
      sectionVariant: "left-bar",
      headerBg: "#1B3A5F",
      headerTextColor: "#FFFFFF",
      headerPad: "28px 42px 24px",
      sectionLeftBarWidth: 4,
    },
    pdf: {
      bodyFont: "Times-Roman",
      boldFont: "Times-Bold",
      nameAlign: "left",
      nameSize: 22,
      nameColor: "#FFFFFF",
      jobTitleItalic: false,
      jobTitleColor: "#B8D4F0",
      contactAlign: "left",
      contactColor: "#D6E6F5",
      contactSep: "  |  ",
      accent: "#1B3A5F",
      ruleWidth: 1.5,
      pagePad: 36,
      headerVariant: "band",
      sectionVariant: "left-bar",
      headerBg: "#1B3A5F",
      headerTextColor: "#FFFFFF",
      headerPad: 28,
      sectionLeftBarWidth: 4,
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    tagline: "Clean sans-serif · simple black accents",
    accent: "#111111",
    preview: {
      fontFamily: "Arial, Helvetica, sans-serif",
      nameAlign: "left",
      nameSize: "22pt",
      nameWeight: "bold",
      nameColor: "#111111",
      jobTitleStyle: {
        fontSize: "12pt",
        textAlign: "left",
        color: "#555555",
        marginBottom: 6,
        fontWeight: 400,
      },
      contactAlign: "left",
      contactColor: "#666666",
      contactSep: "  ·  ",
      sectionTitle: {
        fontSize: "11pt",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: "#111111",
        marginTop: 14,
        marginBottom: 0,
      },
      sectionRule: {
        borderTop: "1px solid #111111",
        marginTop: 3,
        marginBottom: 8,
      },
      body: { fontSize: "10pt", color: "#333333", lineHeight: 1.5 },
      pagePad: "40px 40px 40px",
      headerVariant: "plain",
      sectionVariant: "rule",
    },
    pdf: {
      bodyFont: "Helvetica",
      boldFont: "Helvetica-Bold",
      nameAlign: "left",
      nameSize: 22,
      nameColor: "#111111",
      jobTitleItalic: false,
      jobTitleColor: "#555555",
      contactAlign: "left",
      contactColor: "#666666",
      contactSep: "  ·  ",
      accent: "#111111",
      ruleWidth: 1,
      pagePad: 40,
      headerVariant: "plain",
      sectionVariant: "rule",
    },
  },
  {
    id: "executive",
    name: "Executive",
    tagline: "Bold banded headers · strong hierarchy",
    accent: "#111827",
    preview: {
      fontFamily: "Georgia, 'Times New Roman', serif",
      nameAlign: "left",
      nameSize: "28pt",
      nameWeight: "bold",
      nameColor: "#111827",
      nameLetterSpacing: "0.02em",
      jobTitleStyle: {
        fontSize: "10.5pt",
        textAlign: "left",
        color: "#374151",
        marginBottom: 10,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      },
      contactAlign: "left",
      contactColor: "#4B5563",
      contactSep: "  ·  ",
      sectionTitle: {
        fontSize: "10pt",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: "#FFFFFF",
        marginTop: 16,
        marginBottom: 0,
        background: "#111827",
        padding: "6px 10px",
      },
      sectionRule: {
        borderTop: "none",
        marginTop: 0,
        marginBottom: 10,
      },
      body: { fontSize: "10.5pt", color: "#111", lineHeight: 1.5 },
      pagePad: "32px 40px 36px",
      headerVariant: "double-rule",
      sectionVariant: "band",
      sectionBandBg: "#111827",
      sectionBandColor: "#FFFFFF",
    },
    pdf: {
      bodyFont: "Times-Roman",
      boldFont: "Times-Bold",
      nameAlign: "left",
      nameSize: 28,
      nameColor: "#111827",
      nameLetterSpacing: 0.6,
      jobTitleItalic: false,
      jobTitleUppercase: true,
      jobTitleColor: "#374151",
      contactAlign: "left",
      contactColor: "#4B5563",
      contactSep: "  ·  ",
      accent: "#111827",
      ruleWidth: 2,
      pagePad: 36,
      headerVariant: "double-rule",
      sectionVariant: "band",
      sectionBandBg: "#111827",
      sectionBandColor: "#FFFFFF",
    },
  },
];

export function getResumeTemplate(id: ResumeTemplateId | string | undefined): ResumeTemplate {
  return RESUME_TEMPLATES.find((t) => t.id === id) ?? RESUME_TEMPLATES[0];
}
