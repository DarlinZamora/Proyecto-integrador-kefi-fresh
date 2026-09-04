const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const filesToCopy = ["index.html", "nosotros.html", "productos.html", "playground.html", "robots.txt", "sitemap.xml"];
const dirsToCopy = ["css", "js", "img"];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of filesToCopy) {
  const src = path.join(root, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(dist, file));
  }
}

for (const dir of dirsToCopy) {
  const src = path.join(root, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(dist, dir), { recursive: true });
  }
}

console.log(`Build listo en ${dist}`);
