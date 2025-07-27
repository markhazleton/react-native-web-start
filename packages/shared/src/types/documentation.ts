export interface DocumentationFile {
  name: string;
  title: string;
  description: string;
  path: string;
  size?: number;
  lastModified?: Date;
}

export interface DocumentationContent {
  fileName: string;
  title: string;
  content: string;
  rawContent: string;
}
