import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

export default async function handler(req, res) {
  // Get file path from URL
  const filePath = Array.isArray(req.query.path)
    ? req.query.path.join("/")
    : req.query.path;

  // Construct full path (prevent directory traversal)
  const fullPath = path.join(process.cwd(), "content", filePath);
  const contentDir = path.join(process.cwd(), "content");

  // Verify path is within content directory
  if (!fullPath.startsWith(contentDir)) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    // GET: Retrieve file content
    if (req.method === "GET") {
      const content = await fs.readFile(fullPath, "utf8");
      return res.status(200).json({ content });
    }

    // POST: Update file content
    if (req.method === "POST") {
      const { content } = req.body;

      // Validate content
      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      // Validate frontmatter
      try {
        const { data: frontmatter } = matter(content);

        // Basic frontmatter validation
        if (typeof frontmatter !== "object") {
          throw new Error("Invalid frontmatter structure");
        }
      } catch (error) {
        return res.status(400).json({
          error: "Invalid frontmatter format",
          details: error.message,
        });
      }

      // Write file
      await fs.writeFile(fullPath, content, "utf8");
      return res.status(200).json({ message: "File updated successfully" });
    }

    // Other methods not allowed
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Content API error:", error);

    if (error.code === "ENOENT") {
      return res.status(404).json({ error: "File not found" });
    }

    return res.status(500).json({
      error: "Server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
