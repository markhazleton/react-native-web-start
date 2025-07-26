import {
  DocumentationFile,
  DocumentationContent,
} from "../types/documentation";

export class DocumentationService {
  private static readonly documentationFiles: DocumentationFile[] = [
    {
      name: "README.md",
      title: "Documentation Index",
      description: "Overview and navigation for all project documentation",
      path: `${import.meta.env.BASE_URL}documentation/README.md`,
      size: 2048,
      lastModified: new Date("2024-01-20"),
    },
    {
      name: "COMPLETE_SETUP_GUIDE.md",
      title: "Complete Setup Guide",
      description:
        "Comprehensive step-by-step instructions for Web, iOS, and Android development",
      path: `${import.meta.env.BASE_URL}documentation/COMPLETE_SETUP_GUIDE.md`,
      size: 15360,
      lastModified: new Date("2024-01-20"),
    },
    {
      name: "SETUP_GUIDE.md",
      title: "Web-Only Setup Guide",
      description: "Basic web-only setup guide (legacy)",
      path: `${import.meta.env.BASE_URL}documentation/SETUP_GUIDE.md`,
      size: 8192,
      lastModified: new Date("2024-01-19"),
    },
    {
      name: "PROJECT_SUMMARY.md",
      title: "Project Summary",
      description:
        "Complete overview of features, achievements, and technical architecture",
      path: `${import.meta.env.BASE_URL}documentation/PROJECT_SUMMARY.md`,
      size: 12288,
      lastModified: new Date("2024-01-20"),
    },
    {
      name: "JOKE_FUNCTIONALITY_ANALYSIS.md",
      title: "Joke Functionality Analysis",
      description:
        "Technical deep dive into API integration implementation and best practices",
      path: `${
        import.meta.env.BASE_URL
      }documentation/JOKE_FUNCTIONALITY_ANALYSIS.md`,
      size: 18432,
      lastModified: new Date("2024-01-20"),
    },
  ];

  static async getDocumentationFiles(): Promise<DocumentationFile[]> {
    // In a real application, this might fetch from an API or file system
    // For this demo, we return the static list
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.documentationFiles);
      }, 300); // Simulate network delay
    });
  }

  static async getDocumentationContent(
    fileName: string
  ): Promise<DocumentationContent> {
    return new Promise(async (resolve, reject) => {
      try {
        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const file = this.documentationFiles.find((f) => f.name === fileName);
        if (!file) {
          throw new Error(`Documentation file "${fileName}" not found`);
        }

        // In a web environment, we would fetch the actual file
        // For this demo, we'll try to fetch the real file or use fallback content
        let rawContent = "";

        try {
          const response = await fetch(file.path);
          if (response.ok) {
            rawContent = await response.text();
          } else {
            throw new Error(`HTTP ${response.status}`);
          }
        } catch (fetchError) {
          // Fallback content if file cannot be fetched
          console.warn(
            `Could not fetch ${file.path}, using fallback content`,
            fetchError
          );
          rawContent = `# ${file.title}\n\n${file.description}\n\n*This is fallback content. The actual documentation file could not be loaded.*\n\n## File Information\n- **File**: ${file.name}\n- **Path**: ${file.path}\n- **Description**: ${file.description}\n\nPlease ensure the documentation files are available in the public directory for web access.`;
        }

        resolve({
          fileName: file.name,
          title: file.title,
          content: rawContent,
          rawContent: rawContent,
        });
      } catch (error) {
        console.error("Error loading documentation:", error);
        reject(new Error(`Failed to load documentation file: ${fileName}`));
      }
    });
  }

  static getDocumentationFileByName(
    fileName: string
  ): DocumentationFile | undefined {
    return this.documentationFiles.find((f) => f.name === fileName);
  }

  static searchDocumentation(query: string): DocumentationFile[] {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return this.documentationFiles;

    return this.documentationFiles.filter(
      (file) =>
        file.title.toLowerCase().includes(searchTerm) ||
        file.description.toLowerCase().includes(searchTerm) ||
        file.name.toLowerCase().includes(searchTerm)
    );
  }
}

export default DocumentationService;
