import HelpRequest from "../../models/HelpRequest.js";

const updateRequest = async (req, res) => {
  try {
    const { title, description, category, tags, urgency, status } = req.body;
    let request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Check ownership
    if (request.requester.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const updatedFields = {
      title: title || request.title,
      description: description || request.description,
      category: category || request.category,
      tags: tags || request.tags,
      urgency: urgency || request.urgency,
      status: status || request.status,
    };

    request = await HelpRequest.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export default updateRequest;
