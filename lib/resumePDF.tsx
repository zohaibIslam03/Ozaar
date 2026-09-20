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
import { getResumeTemplate, type ResumeTemplate } from "@/lib/resumeTemplates";

function buildStyles(t: ResumeTemplate) {
  const { pdf } = t;
  const align = pdf.nameAlign;
  const contactJustify = pdf.contactAlign === "center" ? "center" : "flex-start";
  const edgeToEdge = pdf.headerVariant === "band" || pdf.headerVariant === "top-bar";

  return StyleSheet.create({
    page: {
      paddingTop: edgeToEdge ? 0 : pdf.pagePad,
      paddingBottom: pdf.pagePad,
      paddingHorizontal: edgeToEdge ? 0 : pdf.pagePad,
      fontFamily: pdf.bodyFont,
      fontSize: 11,
      lineHeight: 1.4,
      color: "#000000",
      backgroundColor: "#ffffff",
    },
    content: {
      paddingHorizontal: edgeToEdge ? pdf.pagePad : 0,
      paddingTop: pdf.headerVariant === "top-bar" ? 16 : edgeToEdge && pdf.headerVariant === "band" ? 0 : 0,
      paddingBottom: 0,
    },
    topBar: {
      height: pdf.topBarHeight || 8,
      backgroundColor: pdf.accent,
      width: "100%",
      marginBottom: 0,
    },
    headerBand: {
      backgroundColor: pdf.headerBg || pdf.accent,
      paddingTop: pdf.headerPad || 28,
      paddingBottom: 20,
      paddingHorizontal: pdf.pagePad,
      marginBottom: 8,
      width: "100%",
    },
    headerBlock: { width: "100%", marginBottom: 4 },
    name: {
      fontSize: pdf.nameSize,
      fontFamily: pdf.boldFont,
      textAlign: align,
      color: pdf.nameColor,
      lineHeight: 1.25,
      marginBottom: 4,
      letterSpacing: pdf.nameLetterSpacing || 0,
    },
    jobTitle: {
      fontSize: 11,
      textAlign: align,
      color: pdf.jobTitleColor,
      fontStyle: pdf.jobTitleItalic ? "italic" : "normal",
      fontFamily: pdf.jobTitleItalic ? pdf.bodyFont : pdf.boldFont,
      textTransform: pdf.jobTitleUppercase ? "uppercase" : "none",
      letterSpacing: pdf.jobTitleUppercase ? 1.5 : 0,
      marginBottom: 8,
      lineHeight: 1.4,
    },
    contactLine: {
      width: "100%",
      fontSize: 10,
      textAlign: pdf.contactAlign,
      marginTop: 2,
      marginBottom: pdf.headerVariant === "double-rule" ? 0 : 12,
      color: pdf.contactColor,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: contactJustify,
      alignItems: "center",
      alignContent: "center",
      lineHeight: 1.5,
    },
    contactPipe: { fontSize: 10, color: pdf.contactColor, lineHeight: 1.5 },
    doubleRuleOuter: { marginTop: 10, marginBottom: 14 },
    doubleRuleThick: { height: 2.5, backgroundColor: pdf.accent, width: "100%" },
    doubleRuleThin: { height: 1, backgroundColor: pdf.accent, width: "100%", marginTop: 3 },
    sectionTitle: {
      fontSize: 11,
      fontFamily: pdf.boldFont,
      textTransform: "uppercase",
      letterSpacing: pdf.sectionVariant === "subtle" ? 2.2 : 1.2,
      marginTop: pdf.sectionVariant === "subtle" ? 18 : 14,
      marginBottom: 2,
      color: pdf.sectionBandColor && pdf.sectionVariant === "band" ? pdf.sectionBandColor : pdf.accent,
      textAlign: align === "center" && pdf.sectionVariant === "rule" ? "center" : "left",
    },
    sectionBand: {
      backgroundColor: pdf.sectionBandBg || pdf.accent,
      paddingVertical: 5,
      paddingHorizontal: 8,
      marginTop: 14,
      marginBottom: 8,
    },
    sectionBandText: {
      fontSize: 10,
      fontFamily: pdf.boldFont,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      color: pdf.sectionBandColor || "#FFFFFF",
    },
    sectionLeftRow: {
      flexDirection: "row",
      alignItems: "stretch",
      marginTop: 14,
      marginBottom: 8,
    },
    sectionLeftBar: {
      width: pdf.sectionLeftBarWidth || 4,
      backgroundColor: pdf.accent,
      marginRight: 8,
    },
    sectionLeftInner: { flex: 1 },
    sectionRule: {
      borderBottomWidth: pdf.ruleWidth,
      borderBottomColor:
        pdf.sectionVariant === "subtle" ? "#E2E8F0" : pdf.accent,
      marginBottom: 8,
      marginTop: 3,
    },
    bodyText: { fontSize: 10.5, lineHeight: 1.5, color: "#111111", fontFamily: pdf.bodyFont },
    bold: { fontFamily: pdf.boldFont },
    row: { flexDirection: "row", justifyContent: "space-between" },
    bullet: { fontSize: 10.5, lineHeight: 1.5, marginBottom: 2, fontFamily: pdf.bodyFont },
    link: { color: "#0000EE", textDecoration: "underline", fontSize: 10, lineHeight: 1.5 },
    bandLink: { color: pdf.contactColor, textDecoration: "underline", fontSize: 10, lineHeight: 1.5 },
    entryMargin: { marginBottom: 10 },
  });
}

function SectionHeading({
  title,
  styles,
  template,
}: {
  title: string;
  styles: ReturnType<typeof buildStyles>;
  template: ResumeTemplate;
}) {
  const v = template.pdf.sectionVariant;

  if (v === "band") {
    return (
      <View style={styles.sectionBand}>
        <Text style={styles.sectionBandText}>{title}</Text>
      </View>
    );
  }

  if (v === "left-bar") {
    return (
      <View style={styles.sectionLeftRow}>
        <View style={styles.sectionLeftBar} />
        <View style={styles.sectionLeftInner}>
          <Text style={{ ...styles.sectionTitle, marginTop: 0 }}>{title}</Text>
          <View style={styles.sectionRule} />
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionRule} />
    </View>
  );
}

export function ResumeDocument({ data }: { data: ResumeData }) {
  const template = getResumeTemplate(data.templateId);
  const S = buildStyles(template);
  const pdf = template.pdf;
  const isBand = pdf.headerVariant === "band";

  const contactParts: { label: string; href?: string }[] = [];
  if (data.phone) contactParts.push({ label: data.phone });
  if (data.email) contactParts.push({ label: data.email, href: `mailto:${data.email}` });
  if (data.linkedIn) contactParts.push({ label: "LinkedIn Profile", href: data.linkedIn });
  if (data.website) contactParts.push({ label: "Website", href: data.website });
  if (data.location) contactParts.push({ label: data.location });

  const filledSkills = data.skills.filter((s) => s.category && s.skills);
  const filledProjects = data.projects.filter((p) => p.name);
  const filledEdu = data.education.filter((e) => e.institution);
  const filledCerts = data.certifications.filter((c) => c.provider && c.course);
  const filledExp = data.experience.filter((e) => e.company && e.role);

  const headerInner = (
    <>
      {data.fullName ? <Text style={S.name}>{data.fullName}</Text> : null}
      {data.jobTitle ? <Text style={S.jobTitle}>{data.jobTitle}</Text> : null}
      {contactParts.length > 0 ? (
        <View style={S.contactLine}>
          {contactParts.map((p, i) => (
            <View key={`${p.label}-${i}`} style={{ flexDirection: "row", alignItems: "center" }}>
              {i > 0 ? <Text style={S.contactPipe}>{pdf.contactSep}</Text> : null}
              {p.href ? (
                <Link src={p.href} style={isBand ? S.bandLink : S.link}>
                  {p.label}
                </Link>
              ) : (
                <Text style={{ fontSize: 10, color: pdf.contactColor, lineHeight: 1.5 }}>{p.label}</Text>
              )}
            </View>
          ))}
        </View>
      ) : null}
      {pdf.headerVariant === "double-rule" ? (
        <View style={S.doubleRuleOuter}>
          <View style={S.doubleRuleThick} />
          <View style={S.doubleRuleThin} />
        </View>
      ) : null}
    </>
  );

  return (
    <Document>
      <Page size="A4" style={S.page}>
        {pdf.headerVariant === "top-bar" ? <View style={S.topBar} /> : null}

        {isBand ? <View style={S.headerBand}>{headerInner}</View> : null}

        <View style={S.content}>
          {!isBand ? <View style={S.headerBlock}>{headerInner}</View> : null}

          {data.summary && (
            <View>
              <SectionHeading title="PROFESSIONAL SUMMARY" styles={S} template={template} />
              <Text style={S.bodyText}>{data.summary}</Text>
            </View>
          )}

          {filledSkills.length > 0 && (
            <View>
              <SectionHeading title="SKILLS" styles={S} template={template} />
              {filledSkills.map((sk) => (
                <View key={sk.id} style={{ flexDirection: "row", marginBottom: 3 }}>
                  <Text style={{ ...S.bodyText, fontFamily: template.pdf.boldFont }}>
                    {"• "}
                    {sk.category}:{" "}
                  </Text>
                  <Text style={S.bodyText}>{sk.skills}</Text>
                </View>
              ))}
            </View>
          )}

          {filledExp.length > 0 && (
            <View>
              <SectionHeading title="EXPERIENCE" styles={S} template={template} />
              {filledExp.map((exp) => (
                <View key={exp.id} style={S.entryMargin}>
                  <View style={S.row}>
                    <Text style={{ ...S.bodyText, fontFamily: template.pdf.boldFont }}>
                      {exp.company}, <Text style={{ fontFamily: template.pdf.bodyFont }}>{exp.role}</Text>
                    </Text>
                    <Text style={{ fontSize: 10.5, color: "#111111" }}>{exp.duration}</Text>
                  </View>
                  {exp.bullets
                    .split("\n")
                    .filter(Boolean)
                    .map((b, i) => (
                      <Text key={i} style={S.bullet}>
                        {"• "}
                        {b}
                      </Text>
                    ))}
                </View>
              ))}
            </View>
          )}

          {filledProjects.length > 0 && (
            <View>
              <SectionHeading title="PROJECTS" styles={S} template={template} />
              {filledProjects.map((proj) => (
                <View key={proj.id} style={S.entryMargin}>
                  <View style={S.row}>
                    <Text style={{ ...S.bodyText, fontFamily: template.pdf.boldFont }}>{proj.name}</Text>
                    {proj.url && (
                      <Link src={proj.url} style={S.link}>
                        {proj.url}
                      </Link>
                    )}
                  </View>
                  {proj.bullets
                    .split("\n")
                    .filter(Boolean)
                    .map((b, i) => (
                      <Text key={i} style={S.bullet}>
                        {"• "}
                        {b}
                      </Text>
                    ))}
                </View>
              ))}
            </View>
          )}

          {filledEdu.length > 0 && (
            <View>
              <SectionHeading title="EDUCATION" styles={S} template={template} />
              {filledEdu.map((edu) => (
                <View key={edu.id} style={{ ...S.row, marginBottom: 6 }}>
                  <Text style={S.bodyText}>
                    <Text style={{ fontFamily: template.pdf.boldFont }}>{edu.institution}</Text>
                    {edu.degree ? `, ${edu.degree}` : ""}
                  </Text>
                  <Text style={{ fontSize: 10, color: "#444444" }}>
                    {[edu.yearFrom, edu.yearTo].filter(Boolean).join(" - ")}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {filledCerts.length > 0 && (
            <View>
              <SectionHeading title="CERTIFICATIONS" styles={S} template={template} />
              {filledCerts.map((cert) => (
                <View key={cert.id} style={{ ...S.row, marginBottom: 6 }}>
                  <Text style={S.bodyText}>
                    <Text style={{ fontFamily: template.pdf.boldFont }}>{cert.provider}</Text>
                    {cert.course ? ` · ${cert.course}` : ""}
                  </Text>
                  <Text style={{ fontSize: 10, color: "#444444" }}>{cert.year}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
