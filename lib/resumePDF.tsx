"use client";

import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";

const S = StyleSheet.create({
  page: { padding: "40px 48px", fontFamily: "Times-Roman", fontSize: 11, lineHeight: 1.4, color: "#000000", backgroundColor: "#ffffff" },
  name: { fontSize: 26, fontFamily: "Times-Bold", textAlign: "center", marginBottom: 6 },
  contactLine: { fontSize: 10, textAlign: "center", marginBottom: 14, color: "#333333", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 0 },
  contactPipe: { fontSize: 10, color: "#333333" },
  sectionTitle: { fontSize: 11, fontFamily: "Times-Bold", textTransform: "uppercase", letterSpacing: 1, marginTop: 14, marginBottom: 2 },
  sectionRule: { borderBottomWidth: 1.5, borderBottomColor: "#000000", marginBottom: 8 },
  bodyText: { fontSize: 10.5, lineHeight: 1.5, color: "#111111" },
  bold: { fontFamily: "Times-Bold" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  bullet: { fontSize: 10.5, lineHeight: 1.5, marginBottom: 2 },
  link: { color: "#0000EE", textDecoration: "underline", fontSize: 10 },
  entryMargin: { marginBottom: 10 },
  certRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
});

function SectionHeading({ title }: { title: string }) {
  return (
    <View>
      <Text style={S.sectionTitle}>{title}</Text>
      <View style={S.sectionRule} />
    </View>
  );
}

export function ResumeDocument({ data }: { data: ResumeData }) {
  const contactParts: { label: string; href?: string }[] = [];
  if (data.phone) contactParts.push({ label: data.phone });
  if (data.email) contactParts.push({ label: data.email, href: `mailto:${data.email}` });
  if (data.linkedIn) contactParts.push({ label: "LinkedIn Profile", href: data.linkedIn });
  if (data.github) contactParts.push({ label: "GitHub Profile", href: data.github });
  if (data.location) contactParts.push({ label: data.location });

  const filledSkills = data.skills.filter((s) => s.category && s.skills);
  const filledProjects = data.projects.filter((p) => p.name);
  const filledEdu = data.education.filter((e) => e.institution);
  const filledCerts = data.certifications.filter((c) => c.provider && c.course);
  const filledExp = data.experience.filter((e) => e.company && e.role);

  return (
    <Document>
      <Page size="A4" style={S.page}>
        {/* Name */}
        {data.fullName && <Text style={S.name}>{data.fullName}</Text>}

        {/* Contact line */}
        {contactParts.length > 0 && (
          <View style={S.contactLine}>
            {contactParts.map((p, i) => (
              <View key={i} style={{ flexDirection: "row" }}>
                {i > 0 && <Text style={S.contactPipe}> | </Text>}
                {p.href ? (
                  <Link src={p.href} style={S.link}>{p.label}</Link>
                ) : (
                  <Text style={{ fontSize: 10, color: "#333333" }}>{p.label}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Summary */}
        {data.summary && (
          <View>
            <SectionHeading title="PROFESSIONAL SUMMARY" />
            <Text style={S.bodyText}>{data.summary}</Text>
          </View>
        )}

        {/* Skills */}
        {filledSkills.length > 0 && (
          <View>
            <SectionHeading title="TECHNICAL SKILLS" />
            {filledSkills.map((sk) => (
              <View key={sk.id} style={{ flexDirection: "row", marginBottom: 3 }}>
                <Text style={{ ...S.bodyText, fontFamily: "Times-Bold" }}>{"• "}{sk.category}: </Text>
                <Text style={S.bodyText}>{sk.skills}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {filledExp.length > 0 && (
          <View>
            <SectionHeading title="EXPERIENCE" />
            {filledExp.map((exp) => (
              <View key={exp.id} style={S.entryMargin}>
                <View style={S.row}>
                  <Text style={{ ...S.bodyText, fontFamily: "Times-Bold" }}>{exp.company} — <Text style={{ fontFamily: "Times-Roman" }}>{exp.role}</Text></Text>
                  <Text style={{ fontSize: 10.5, color: "#111111" }}>{exp.duration}</Text>
                </View>
                {exp.bullets.split("\n").filter(Boolean).map((b, i) => (
                  <Text key={i} style={S.bullet}>{"• "}{b}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {filledProjects.length > 0 && (
          <View>
            <SectionHeading title="PROJECTS" />
            {filledProjects.map((proj) => (
              <View key={proj.id} style={S.entryMargin}>
                <View style={S.row}>
                  <Text style={{ ...S.bodyText, fontFamily: "Times-Bold" }}>{proj.name}</Text>
                  {proj.url && <Link src={proj.url} style={S.link}>{proj.url}</Link>}
                </View>
                {proj.bullets.split("\n").filter(Boolean).map((b, i) => (
                  <Text key={i} style={S.bullet}>{"• "}{b}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {filledEdu.length > 0 && (
          <View>
            <SectionHeading title="EDUCATION" />
            {filledEdu.map((edu) => (
              <View key={edu.id} style={S.certRow}>
                <Text style={S.bodyText}>
                  <Text style={{ fontFamily: "Times-Bold" }}>{edu.institution}</Text>
                  {edu.degree ? ` — ${edu.degree}` : ""}
                </Text>
                <Text style={{ fontSize: 10.5, color: "#111111" }}>
                  {[edu.yearFrom, edu.yearTo].filter(Boolean).join(" – ")}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {filledCerts.length > 0 && (
          <View>
            <SectionHeading title="CERTIFICATIONS" />
            {filledCerts.map((cert) => (
              <View key={cert.id} style={S.certRow}>
                <Text style={S.bodyText}>
                  <Text style={{ fontFamily: "Times-Bold" }}>{cert.provider}</Text>
                  {cert.course ? ` · ${cert.course}` : ""}
                </Text>
                <Text style={{ fontSize: 10.5, color: "#111111" }}>{cert.year}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
