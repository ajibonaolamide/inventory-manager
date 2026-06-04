import express from "express";
import fs from "fs/promises";

const app = express();

const PORT = 3000;
const FILE_PATH = "./inventory.json";

app.use(express.json());

/*
    Helper Function
    Reads inventory file
*/
async function getInventory() {
  const data = await fs.readFile(
    FILE_PATH,
    "utf8"
  );

  return JSON.parse(data);
}

/*
    Helper Function
    Writes inventory file
*/
async function saveInventory(inventory) {
  await fs.writeFile(
    FILE_PATH,
    JSON.stringify(inventory, null, 2)
  );
}

/*
    Home Route
*/
app.get("/", (req, res) => {
  res.json({
    message:
      "Inventory Manager API Running"
  });
});

/*
    GET ALL INVENTORY
*/
app.get("/inventory", async (req, res) => {
  try {
    const inventory =
      await getInventory();

    res.status(200).json(inventory);

  } catch (error) {

    res.status(500).json({
      message:
        "Unable to read inventory",
      error: error.message
    });

  }
});

/*
    ADD NEW ITEM
*/
app.post("/inventory", async (req, res) => {
  try {

    const { name, quantity } =
      req.body;

    if (!name || quantity === undefined) {
      return res.status(400).json({
        message:
          "Name and quantity are required"
      });
    }

    const inventory =
      await getInventory();

    const newItem = {
      id: inventory.length + 1,
      name,
      quantity
    };

    inventory.push(newItem);

    await saveInventory(inventory);

    res.status(201).json({
      message:
        "Item added successfully",
      item: newItem
    });

  } catch (error) {

    res.status(500).json({
      message:
        "Unable to save inventory",
      error: error.message
    });

  }
});

/*
    404 Handler
*/
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
