import PDFDocument from "pdfkit";

/**
 * Generates a resume PDF and streams it directly to the response.
 * @param {object} resumeData
 * @param {import('express').Response} res
 */
export const generateResumePDF = (resumeData, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${resumeData.fullName || "resume"}.pdf"`
  );

  doc.pipe(res);

  // Header
  doc.fontSize(22).text(resumeData.fullName || "Your Name", { align: "center" });
  doc
    .fontSize(10)
    .text(`${resumeData.email || ""}  |  ${resumeData.phone || ""}`, {
      align: "center",
    });
  doc.moveDown(1.5);

  // Summary
  if (resumeData.summary) {
    doc.fontSize(14).text("Summary", { underline: true });
    doc.fontSize(10).text(resumeData.summary);
    doc.moveDown();
  }

  // Skills
  if (resumeData.skills?.length) {
    doc.fontSize(14).text("Skills", { underline: true });
    doc.fontSize(10).text(resumeData.skills.join(", "));
    doc.moveDown();
  }

  // Education
  if (resumeData.education?.length) {
    doc.fontSize(14).text("Education", { underline: true });
    resumeData.education.forEach((edu) => {
      doc
        .fontSize(10)
        .text(`${edu.degree} — ${edu.institution} (${edu.year}) | Score: ${edu.score}`);
    });
    doc.moveDown();
  }

  // Experience
  if (resumeData.experience?.length) {
    doc.fontSize(14).text("Experience", { underline: true });
    resumeData.experience.forEach((exp) => {
      doc.fontSize(11).text(`${exp.role} — ${exp.company} (${exp.duration})`);
      doc.fontSize(10).text(exp.description || "");
      doc.moveDown(0.5);
    });
    doc.moveDown();
  }

  // Projects
  if (resumeData.projects?.length) {
    doc.fontSize(14).text("Projects", { underline: true });
    resumeData.projects.forEach((proj) => {
      doc.fontSize(11).text(proj.title);
      doc.fontSize(10).text(proj.description || "");
      if (proj.techStack?.length) {
        doc.fontSize(9).text(`Tech: ${proj.techStack.join(", ")}`);
      }
      doc.moveDown(0.5);
    });
  }

  doc.end();
};
