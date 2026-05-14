import HelpRequest from "../../models/HelpRequest.js";

const deleteRequest = async (req, res) => {
  try {
    let request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Check ownership
    if (request.requester.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await HelpRequest.findByIdAndDelete(req.params.id);

    res.json({ message: "Request removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export default deleteRequest;
