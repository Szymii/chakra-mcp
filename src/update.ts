import { writeFileSync, mkdirSync, rmSync, existsSync } from "fs";
import { join } from "path";
import ora from "ora";
import chalk from "chalk";

interface DocumentationLink {
  name: string;
  url: string;
}

async function cleanTmpDirectory(tmpDir: string): Promise<void> {
  if (existsSync(tmpDir)) {
    const cleanSpinner = ora("Cleaning tmp directory...").start();
    rmSync(tmpDir, { recursive: true, force: true });
    cleanSpinner.succeed("Tmp directory cleaned");
  }
}

async function fetchMainFile(url: string): Promise<string> {
  const mainSpinner = ora("Fetching main llms.txt file...").start();
  const response = await fetch(url);

  if (!response.ok) {
    mainSpinner.fail(`HTTP error: ${response.status}`);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.text();
  mainSpinner.succeed("Main file fetched successfully");
  return data;
}

function extractDocumentationLinks(content: string): DocumentationLink[] {
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  const links: DocumentationLink[] = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const [, name, relativeUrl] = match;
    // Check if it's a .txt file link and skip "Complete documentation"
    if (
      relativeUrl.endsWith(".txt") &&
      !name.toLowerCase().includes("complete documentation")
    ) {
      const fullUrl = `https://${relativeUrl}`;
      links.push({ name, url: fullUrl });
    }
  }

  return links;
}

function displayFoundLinks(links: DocumentationLink[]): void {
  console.log(chalk.blue(`\n🔗 Found ${links.length} documentation links:`));
  links.forEach((link) =>
    console.log(chalk.gray(`  • ${link.name}: `) + chalk.underline(link.url))
  );
}

function createFileName(linkName: string): string {
  return (
    linkName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") + ".txt"
  );
}

async function downloadDocumentationFiles(
  links: DocumentationLink[],
  tmpDir: string
): Promise<void> {
  console.log(
    chalk.yellow(`\n📥 Starting download of ${links.length} files...`)
  );

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const progress = `${i + 1}/${links.length}`;
    const spinner = ora(`[${progress}] Downloading: ${link.name}...`).start();

    try {
      const docResponse = await fetch(link.url);

      if (!docResponse.ok) {
        spinner.fail(
          `[${progress}] Download error for ${link.name}: HTTP ${docResponse.status}`
        );
        continue;
      }

      const docContent = await docResponse.text();
      const fileName = createFileName(link.name);
      const filePath = join(tmpDir, fileName);

      writeFileSync(filePath, docContent, "utf-8");

      const sizeInfo = `${(docContent.length / 1024).toFixed(1)} KB`;
      spinner.succeed(`[${progress}] ${fileName} (${sizeInfo})`);
    } catch (error) {
      spinner.fail(
        `[${progress}] Download error for ${link.name}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

export async function update(): Promise<void> {
  const url = "https://chakra-ui.com/llms.txt";
  const tmpDir = join(process.cwd(), "src", "tmp");

  try {
    await cleanTmpDirectory(tmpDir);

    const mainContent = await fetchMainFile(url);

    const links = extractDocumentationLinks(mainContent);

    displayFoundLinks(links);

    mkdirSync(tmpDir, { recursive: true });
    await downloadDocumentationFiles(links, tmpDir);

    console.log(chalk.green("\n✅ Download completed successfully!"));
    console.log(chalk.gray(`📁 Files saved to: ${tmpDir}`));
  } catch (error) {
    console.error(
      chalk.red("\n❌ Error during download:"),
      error instanceof Error ? error.message : String(error)
    );
  }
}

update().catch(console.error);
