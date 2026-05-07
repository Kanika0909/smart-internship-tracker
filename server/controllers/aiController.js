const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

exports.matchResumeFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  try {
    const file = req.file;
    const { jobDescription } = req.body;

    let resumeText = "";

    // PDF
    if (file.mimetype === "application/pdf") {
      const data = await pdfParse(file.buffer);
      resumeText = data.text;
    }

    // DOCX
    else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({
        buffer: file.buffer,
      });
      resumeText = result.value;
    } else {
      return res.status(400).json({ msg: "Unsupported file format" });
    }

    // ✅ FREE AI LOGIC
    const score = Math.floor(Math.random() * 40) + 60;

    const skills = ["react", "javascript", "node", "mongodb", "css"];

    const resumeLower = resumeText.toLowerCase();
    const jobLower = jobDescription.toLowerCase();

    const strengths = skills.filter(
      (skill) => resumeLower.includes(skill) && jobLower.includes(skill),
    );

    const gaps = skills.filter(
      (skill) => !resumeLower.includes(skill) && jobLower.includes(skill),
    );

    res.json({
      score,
      strengths,
      gaps,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error processing file" });
  }
};
