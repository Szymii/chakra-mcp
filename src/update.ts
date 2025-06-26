import { writeFileSync, mkdirSync, rmSync, existsSync } from "fs";
import { join } from "path";

export async function update(): Promise<void> {
  const url = "https://chakra-ui.com/llms.txt";

  try {
    // Wyczyść katalog tmp przed rozpoczęciem
    const tmpDir = join(process.cwd(), "src", "tmp");
    if (existsSync(tmpDir)) {
      console.log("Czyszczenie katalogu tmp...");
      rmSync(tmpDir, { recursive: true, force: true });
      console.log("✓ Katalog tmp wyczyszczony");
    }

    // Pobierz główny plik z listą dokumentacji
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    console.log("Główny plik llms.txt:");
    console.log(data);
    console.log("\n" + "=".repeat(50) + "\n");

    // Wydobądź linki do dokumentacji
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const links: { name: string; url: string }[] = [];
    let match;

    while ((match = linkRegex.exec(data)) !== null) {
      const [, name, relativeUrl] = match;
      // Sprawdź czy to link do pliku .txt i pomiń "Complete documentation"
      if (
        relativeUrl.endsWith(".txt") &&
        !name.toLowerCase().includes("complete documentation")
      ) {
        const fullUrl = `https://${relativeUrl}`;
        links.push({ name, url: fullUrl });
      }
    }

    console.log(
      `Znaleziono ${links.length} linków do dokumentacji (pomijając complete documentation):`
    );
    links.forEach((link) => console.log(`- ${link.name}: ${link.url}`));
    console.log("\n" + "=".repeat(50) + "\n");

    // Utwórz folder tmp jeśli nie istnieje
    mkdirSync(tmpDir, { recursive: true });

    // Pobierz każdy plik dokumentacji
    for (const link of links) {
      try {
        console.log(`Pobieranie: ${link.name}...`);
        const docResponse = await fetch(link.url);

        if (!docResponse.ok) {
          console.error(
            `Błąd pobierania ${link.name}: HTTP ${docResponse.status}`
          );
          continue;
        }

        const docContent = await docResponse.text();

        // Utwórz nazwę pliku z nazwy linku
        const fileName =
          link.name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "") + ".txt";

        const filePath = join(tmpDir, fileName);
        writeFileSync(filePath, docContent, "utf-8");

        console.log(`✓ Zapisano: ${fileName} (${docContent.length} znaków)`);
      } catch (error) {
        console.error(
          `Błąd pobierania ${link.name}:`,
          error instanceof Error ? error.message : String(error)
        );
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("Pobieranie zakończone!");
  } catch (error) {
    console.error(
      "Błąd podczas pobierania pliku:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

// Uruchom funkcję jeśli plik jest wykonywany bezpośrednio
update().catch(console.error);
