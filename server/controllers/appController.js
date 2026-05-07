const Application = require("../models/Application");

// CREATE APPLICATION
exports.createApp = async (req, res) => {
  try {
    const { role, company, status, appliedDate, interviewDate } = req.body;

    const app = await Application.create({
      role,
      company,
      status,

      appliedDate:
        status === "Applied" || status === "Interviewing"
          ? appliedDate
            ? new Date(appliedDate)
            : Date.now()
          : null,

      interviewDate:
        status === "Interviewing" && interviewDate
          ? new Date(interviewDate)
          : null,

      user: req.user.id,
    });

    req.app.get("io").emit("update");

    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Create failed" });
  }
};

// GET APPLICATIONS
exports.getApps = async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ msg: "Fetch failed" });
  }
};

// UPDATE APPLICATION
exports.updateApp = async (req, res) => {
  try {
    const { role, company, status, appliedDate, interviewDate } = req.body;

    const app = await Application.findByIdAndUpdate(
      req.params.id,
      {
        role,
        company,
        status,

        appliedDate:
          status === "Applied" || status === "Interviewing"
            ? appliedDate
              ? new Date(appliedDate)
              : Date.now()
            : null,

        interviewDate:
          status === "Interviewing" && interviewDate
            ? new Date(interviewDate)
            : null,
      },
      { new: true },
    );

    req.app.get("io").emit("update");

    res.json(app);
  } catch (err) {
    res.status(500).json({ msg: "Update failed" });
  }
};

// DELETE APPLICATION
exports.deleteApp = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);

    req.app.get("io").emit("update");

    res.json({ msg: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
};
