"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Font,
} from "@react-pdf/renderer";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Experience {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  start: string;
  end: string;
}

interface ResumeData {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
    website: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
}

// ── PDF styles ────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  page:         { fontFamily: "Helvetica", fontSize: 10, padding: 40, color: "#111111", backgroundColor: "#ffffff" },
  name:         { fontSize: 22, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  title:        { fontSize: 12, color: "#555555", marginBottom: 6 },
  contactRow:   { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 16, fontSize: 9, color: "#666666" },
  section:      { marginBottom: 14 },
  sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", borderBottomWidth: 1, borderBottomColor: "#DF0A09", paddingBottom: 3, marginBottom: 8, color: "#DF0A09" },
  entryHeader:  { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  bold:         { fontFamily: "Helvetica-Bold" },
  dim:          { color: "#555555", fontSize: 9 },
  body:         { lineHeight: 1.5, color: "#333333", marginTop: 2 },
  skillRow:     { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  skill:        { backgroundColor: "#f3f3f3", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, fontSize: 9, color: "#333333" },
  summary:      { lineHeight: 1.5, color: "#333333", marginBottom: 14 },
});

// ── PDF Document ─────────────────────────────────────────────────────────────

function ResumeDocument({ data }: { data: ResumeData }) {
  const { personal, experience, education, skills } = data;
  const hasContact = personal.email || personal.phone || personal.location || personal.website;

  return (
    <Document>
      <Page size="A4" style={S.page}>
        {/* Header */}
        {personal.name && <Text style={S.name}>{personal.name}</Text>}
        {personal.title && <Text style={S.title}>{personal.title}</Text>}
        {hasContact && (
          <View style={S.contactRow}>
            {personal.email    && <Text>{personal.email}</Text>}
            {personal.phone    && <Text>{personal.phone}</Text>}
            {personal.location && <Text>{personal.location}</Text>}
            {personal.website  && <Text>{personal.website}</Text>}
          </View>
        )}

        {/* Summary */}
        {personal.summary && (
          <View style={S.section}>
            <Text style={S.sectionTitle}>SUMMARY</Text>
            <Text style={S.summary}>{personal.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View style={S.section}>
            <Text style={S.sectionTitle}>EXPERIENCE</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 10 }}>
                <View style={S.entryHeader}>
                  <Text style={S.bold}>{exp.role}</Text>
                  <Text style={S.dim}>{exp.start}{exp.start && (exp.current ? " - Present" : exp.end ? ` - ${exp.end}` : "")}</Text>
                </View>
                <Text style={S.dim}>{exp.company}</Text>
                {exp.description ? <Text style={S.body}>{exp.description}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={S.section}>
            <Text style={S.sectionTitle}>EDUCATION</Text>
            {education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 8 }}>
                <View style={S.entryHeader}>
                  <Text style={S.bold}>{edu.school}</Text>
                  <Text style={S.dim}>{edu.start}{edu.start && edu.end ? ` - ${edu.end}` : ""}</Text>
                </View>
                <Text style={S.dim}>{[edu.degree, edu.field].filter(Boolean).join(", ")}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={S.section}>
            <Text style={S.sectionTitle}>SKILLS</Text>
            <View style={S.skillRow}>
              {skills.map((skill) => (
                <View key={skill} style={S.skill}>
                  <Text>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}

// ── Export component ──────────────────────────────────────────────────────────

export default function ResumePdf({ data }: { data: ResumeData }) {
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      const blob = await pdf(<ResumeDocument data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const name = data.personal.name.trim().replace(/\s+/g, "_") || "resume";
      a.href = url;
      a.download = `${name}_resume.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  };

  const isEmpty = !data.personal.name && data.experience.length === 0 && data.education.length === 0 && data.skills.length === 0;

  return (
    <div className="flex flex-col gap-4">
      {isEmpty ? (
        <p className="text-sm text-[#555555]">Fill in at least your name to generate a PDF.</p>
      ) : (
        <>
          {/* Live preview */}
          <div className="bg-white rounded-xl p-6 flex flex-col gap-3 text-black shadow-lg">
            {data.personal.name  && <p className="text-2xl font-bold">{data.personal.name}</p>}
            {data.personal.title && <p className="text-sm text-gray-500">{data.personal.title}</p>}
            {(data.personal.email || data.personal.phone || data.personal.location) && (
              <p className="text-xs text-gray-400">
                {[data.personal.email, data.personal.phone, data.personal.location, data.personal.website].filter(Boolean).join(" · ")}
              </p>
            )}
            {data.personal.summary && (
              <div>
                <p className="text-[10px] font-bold text-[#DF0A09] uppercase tracking-widest mb-1">Summary</p>
                <p className="text-xs text-gray-600 leading-relaxed">{data.personal.summary}</p>
              </div>
            )}
            {data.experience.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-[#DF0A09] uppercase tracking-widest mb-2">Experience</p>
                {data.experience.map((exp) => (
                  <div key={exp.id} className="mb-2">
                    <div className="flex justify-between">
                      <p className="text-xs font-semibold">{exp.role}</p>
                      <p className="text-[10px] text-gray-400">{exp.start}{exp.current ? " - Present" : exp.end ? ` - ${exp.end}` : ""}</p>
                    </div>
                    <p className="text-[10px] text-gray-500">{exp.company}</p>
                    {exp.description && <p className="text-[10px] text-gray-600 mt-0.5">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}
            {data.education.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-[#DF0A09] uppercase tracking-widest mb-2">Education</p>
                {data.education.map((edu) => (
                  <div key={edu.id} className="mb-2">
                    <div className="flex justify-between">
                      <p className="text-xs font-semibold">{edu.school}</p>
                      <p className="text-[10px] text-gray-400">{edu.start}{edu.end ? ` - ${edu.end}` : ""}</p>
                    </div>
                    <p className="text-[10px] text-gray-500">{[edu.degree, edu.field].filter(Boolean).join(", ")}</p>
                  </div>
                ))}
              </div>
            )}
            {data.skills.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-[#DF0A09] uppercase tracking-widest mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={download}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg bg-brand-red text-white text-sm font-medium
              hover:bg-brand-red/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            {busy ? "Generating PDF…" : "Download PDF"}
          </button>
        </>
      )}
    </div>
  );
}
