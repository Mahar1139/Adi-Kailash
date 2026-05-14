import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const DB_FILE = path.join(process.cwd(), "packages_db.json");

// Define a basic default package if file doesn't exist
const DEFAULT_PACKAGES = [
  {
    id: "adi-kailash-yatra-7d",
    title: "Adi Kailash Yatra",
    description: "A divine 7-day journey to the spiritual heart of the Himalayas.",
    duration: "7 Days",
    price: 28999,
    image: "https://images.unsplash.com/photo-1544735038-735b023f613e?q=80&w=1200",
    category: "Pilgrimage",
    includes: ["Accommodation", "Meals", "Transport", "Guide", "Permits"]
  }
];

function readPackages() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_PACKAGES, null, 2));
    return DEFAULT_PACKAGES;
  }
  const data = fs.readFileSync(DB_FILE, "utf-8");
  try {
    return JSON.parse(data);
  } catch(e) {
    return [];
  }
}

function writePackages(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Adi Kailash Tour & Travel API reached" });
  });

  app.post("/api/enquire", async (req, res) => {
    try {
      const { name, mobile, message, destination } = req.body;
      console.log("Enquiry received on server:", { name, mobile, message, destination });
      res.json({ success: true, message: "Enquiry received" });
    } catch (error) {
      res.status(500).json({ error: "Failed to process enquiry" });
    }
  });

  // Database endpoints for packages
  app.get("/api/packages", (req, res) => {
    const packages = readPackages();
    res.json(packages);
  });

  app.get("/api/packages/:id", (req, res) => {
    const packages = readPackages();
    const pkg = packages.find((p: any) => p.id === req.params.id);
    if (pkg) res.json(pkg);
    else res.status(404).json({ error: "Not found" });
  });

  app.post("/api/packages", (req, res) => {
    const packages = readPackages();
    const newPkg = { ...req.body, id: req.body.id || Date.now().toString() };
    packages.push(newPkg);
    writePackages(packages);
    res.json(newPkg);
  });

  app.put("/api/packages/:id", (req, res) => {
    let packages = readPackages();
    const idx = packages.findIndex((p: any) => p.id === req.params.id);
    if (idx !== -1) {
      packages[idx] = { ...packages[idx], ...req.body, id: req.params.id };
      writePackages(packages);
      res.json(packages[idx]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.delete("/api/packages/:id", (req, res) => {
    let packages = readPackages();
    packages = packages.filter((p: any) => p.id !== req.params.id);
    writePackages(packages);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
