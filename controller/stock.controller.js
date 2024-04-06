
import getStockModel from "../models/stock.model.js";
import getCounterModel from "../models/counter.model.js";
import getStockCategoryModel from "../models/stock_categories.model.js";
import getStockItemsModel from "../models/stock_items.model.js";
import getGodownModel from "../models/godown.model.js";

export async function registerStock(req, res, next) {
  try {
    let companyId = req.user.companyId;
    let stockModel = await getStockModel(companyId);
    let counterModel = await getCounterModel(companyId);
    const { categoryId, itemId, godowns } = req.body;
    const item = await stockModel.findOne({ itemId });

    if (item) {
      const id = item._id;
      let existingGodown;

      const providedGodownId = godowns[0].godownId.toString();
      existingGodown = item.godowns.find((g) => g.godownId.toString() === providedGodownId);

      let message;
      if (existingGodown) {
        let existingColor = existingGodown.colors.find((color) => color.color === godowns[0].colors[0].color);
  
        if (existingColor) {
          const existingSize = existingColor.sizes.find((size) => size.size === godowns[0].colors[0].sizes[0].size);

          if (existingSize) {
            try {
              existingSize.quantity += godowns[0].colors[0].sizes[0].quantity;
              message = 'New quantity updated';
            } catch (error) {
              message = 'Error updating size quantity';
            }
          } else {
            existingColor.sizes.push(godowns[0].colors[0].sizes[0]);
            message = 'New size added';
          }
        } else {

          existingGodown.colors.push(godowns[0].colors[0]);
          message = 'New color and quantities added';
        }
      } else {
        item.godowns.push(godowns[0]);
        message = 'New godown, color, and quantities added';
      }

      try {
        await item.save();
        const data = await stockModel.findByIdAndUpdate(id, item, { new: true });
        res.json({ status: true, data: data, message: message });
      } catch (error) {
        console.log(error.message);
        res.json({ status: false, message: error });
      }
    } else {
      let counter = await counterModel.findOne({ id: "itemCode" });
      let seqId;

      if (!counter) {
        const newCounter = new counterModel({ id: "itemCode", seq: 1 });
        await newCounter.save();
        seqId = "S" + newCounter.seq.toString().padStart(2, "0");
      } else {
        counter.seq += 1;
        await counter.save();
        seqId = "S" + counter.seq.toString().padStart(2, "0");
      }

      let addStock;
      if (Array.isArray(godowns)) {

        addStock = new stockModel({ categoryId: categoryId, itemId: itemId, itemCode: seqId, godowns: godowns });
      } else {

        addStock = new stockModel({ categoryId: categoryId, itemId: itemId, itemCode: seqId, godowns: godowns });
      }

      const successRes = await addStock.save();

      res.json({ status: true, data: successRes, message: 'New stock added successfully' });
    }
  } catch (error) {
    if (error.code === 11000) {
      res.json({ status: false, message: 'Stock already exists' });
    } else {
      console.log(error);
      res.json({ status: false, message: 'Error Occurred' });
    }
  }
}

export async function getStock(req, res) {
  try {
    let companyId = req.user.companyId;
    let stockModel = await getStockModel(companyId);
    let data;
    let godownmode = await getGodownModel(companyId);
    let catmodel = await getStockCategoryModel(companyId);
    let stockItemsModel = await getStockItemsModel(companyId);

    data = await stockModel.find()
      .populate({ path: 'categoryId', model: catmodel }).populate({ path: 'itemId', model: stockItemsModel })
      .populate({ path: 'godowns.godownId', model: godownmode });
    res.json({ status: true, data: data, message: 'Stock Loaded successfully' });
  } catch (error) {
    console.log(error)
    res.json({ status: false, message: error.message });
  }
}

export async function updateStockQuantity(req, res) {
  try {
    let companyId = req.user.companyId;
    let stockModel = await getStockModel(companyId);
    const { stockID, assignedQuantity } = req.body;
    const item = await stockModel.findById(stockID);
    if (item) {
      const id = item._id;
      let message;
      for (const assign of assignedQuantity) {
        const providedGodownId = assign.godownId.toString();
        const existingGodown = item.godowns.find(g => g.godownId.toString() === providedGodownId);

        if (existingGodown) {
          const existingColor = existingGodown.colors.find(color => color.color === assign.color);

          if (existingColor) {
            const existingSize = existingColor.sizes.find(size => size.size === 'default');

            if (existingSize) {
              try {
                existingSize.quantity -= assign.quantity;
                message = 'Stock quantity updated';
              } catch (error) {
                message = 'Error updating size quantity';
              }
            } else {
              message = 'Size not found';
            }
          } else {
            message = 'Color not found';
          }
        } else {
          message = 'Godown not found';
        }
      }

      try {
        await item.save();
        const data = await stockModel.findByIdAndUpdate(id, item, { new: true });
        res.json({ status: true, data: data, message: message });
      } catch (error) {
        res.json({ status: false, message: error });
      }
    } else {
      res.json({ status: false, message: 'No stock item found' });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: false, message: 'Error Occurred' });
  }
}

export async function addStockQuantity(req, res) {
  try {
    let companyId = req.user.companyId;
    let stockModel = await getStockModel(companyId);
    const    {id,materialId,items } = req.body;
    const item = await stockModel.findById(materialId);
    if (item) {
      const updateid = item._id;
      let message;
      const providedGodownId = id.toString();
        const existingGodown = item.godowns.find(g => g.godownId.toString() === providedGodownId);

        if (existingGodown) {
          const existingColor = existingGodown.colors.find(color => color.color === items[0].color);

          if (existingColor) {
          
            const existingSize = existingColor.sizes.find(size => size.size === 'default');

            if (existingSize) {
              try {
                existingSize.quantity += items[0].balance;
                message = 'Stock quantity updated';
              } catch (error) {
                message = 'Error updating size quantity';
              }
            } else {
              message = 'Size not found';
            }
          } else {
            message = 'Color not found';
          }
        } else {
          message = 'Godown not found';
        }
      

      try {
        await item.save();
        const data = await stockModel.findByIdAndUpdate(updateid, item, { new: true });
        res.json({ status: true, data: data, message: message });
      } catch (error) {
        res.json({ status: false, message: error });
      }
    } else {
      res.json({ status: false, message: 'No stock item found' });
    }
  } catch (error) {
    res.json({ status: false, message: 'Error Occurred' });
  }
}

export async function addFinalProductToStockQuantity(req, res, next) {
  try {
    let companyId = req.user.companyId;
    let stockModel = await getStockModel(companyId);
    let counterModel = await getCounterModel(companyId);
    const { categoryId, itemId, godowns } = req.body;
    const item = await stockModel.findOne({ itemId });

    if (item) {
      const id = item._id;
      let existingGodown;

      const providedGodownId = godowns[0].godownId.toString();
      existingGodown = item.godowns.find((g) => g.godownId.toString() === providedGodownId);

      let message;
      if (existingGodown) {
        let existingColor = existingGodown.colors.find((color) => color.color === godowns[0].colors[0].color);

        if (existingColor) {
          const existingSize = existingColor.sizes.find((size) => size.size === godowns[0].colors[0].sizes[0].size);

          if (existingSize) {
            try {
              existingSize.quantity += godowns[0].colors[0].sizes[0].quantity;
              message = 'New quantity updated';
            } catch (error) {
              message = 'Error updating size quantity';
            }
          } else {
            existingColor.sizes.push(godowns[0].colors[0].sizes[0]);
            message = 'New size added';
          }
        } else {

          existingGodown.colors.push(godowns[0].colors[0]);
          message = 'New color and quantities added';
        }
      } else {
        item.godowns.push(godowns[0]);
        message = 'New godown, color, and quantities added';
      }

      try {
        await item.save();
        const data = await stockModel.findByIdAndUpdate(id, item, { new: true });
       next();
      } catch (error) {
        console.log(error.message);
        res.json({ status: false, message: error });
      }
    } else {
      let counter = await counterModel.findOne({ id: "itemCode" });
      let seqId;

      if (!counter) {
        const newCounter = new counterModel({ id: "itemCode", seq: 1 });
        await newCounter.save();
        seqId = "S" + newCounter.seq.toString().padStart(2, "0");
      } else {
        counter.seq += 1;
        await counter.save();
        seqId = "S" + counter.seq.toString().padStart(2, "0");
      }

      let addStock;
      if (Array.isArray(godowns)) {

        addStock = new stockModel({ categoryId: categoryId, itemId: itemId, itemCode: seqId, godowns: godowns });
      } else {

        addStock = new stockModel({ categoryId: categoryId, itemId: itemId, itemCode: seqId, godowns: godowns });
      }

      const successRes = await addStock.save();

      next();
    }
  } catch (error) {
   
      console.log(error);
      res.json({ status: false, message: 'Error Occurred' });
    
  }
}