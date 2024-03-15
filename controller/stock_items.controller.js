import getStockCategoryModel from "../models/stock_categories.model.js";
import getStockItemsModel from "../models/stock_items.model.js";


export async function registerStockItem(req, res, next) {
  try {
    let companyId = req.user.companyId;
    let stockCategoryModel = await getStockCategoryModel(companyId);
    let stockItemsModel = await getStockItemsModel(companyId);
    const { categoryId, name, price, mrp, description, hsn, igst, cess, cutCostPiece, stichCostPiece, ironCostPiece, threadCostPiece, packCostPiece, washCostPiece, totalCostJob, cutCostJob, stichCostJob, finishCostJob, washCostJob, blend, barCode, productCode, styleNo } = req.body;
    const existingCategory = await stockCategoryModel.findById({_id: categoryId });

    if (existingCategory) {
      const formattedName = name.charAt(0).toUpperCase() +
        name.slice(1).toLowerCase();
      const existingItem = await stockItemsModel.findOne({ formattedName });
      if (existingItem) {
        res.json({ status: false, message: "Item already Exist" });
      } else {
        const addcategoryItem = new stockItemsModel({ categoryId: categoryId, name: formattedName, price: price, mrp: mrp, description: description, hsn: hsn, igst: igst, cess: cess, cutCostPiece: cutCostPiece, stichCostPiece: stichCostPiece, ironCostPiece: ironCostPiece, threadCostPiece: threadCostPiece, packCostPiece: packCostPiece, washCostPiece: washCostPiece, totalCostJob: totalCostJob, cutCostJob: cutCostJob, stichCostJob: stichCostJob, finishCostJob: finishCostJob, washCostJob: washCostJob, blend: blend, barCode: barCode, productCode: productCode, styleNo: styleNo });
        await addcategoryItem.save();
        res.json({ status: true, data: addcategoryItem, message: "Item added Succefully" });

      }
    } else {
      res.json({ status: false, message: "Selected category not found" });
    }
  } catch (error) {
    console.log(error)
    res.json({ status: false, message: error.message });

  }
}

export async function deleteStockItem(req, res, next) {
  try {
    let companyId = req.user.companyId;
    let stockItemsModel = await getStockItemsModel(companyId);
    const itemId = req.params.id;

    const existingItem = await stockItemsModel.findByIdAndDelete(itemId);

    if (!existingItem) {
      return res.json({ status: false, message: 'Item not found' });
    }

    res.json({ status: true, message: 'Stock Item deleted successfully' });

  } catch (error) {
    res.json({ status: false, message: error.message });
  }
}


export async function getStockItem(req, res) {
  try {
    let companyId = req.user.companyId;
    let stockItemsModel = await getStockItemsModel(companyId);
    let stockCategoryModel = await getStockCategoryModel(companyId);
    let data;
    if (req.params.id) {
      data = await stockItemsModel.findById(req.params.id).populate({ path: 'categoryId', model: stockCategoryModel });
    } else {
      data = await stockItemsModel.find().populate({ path: 'categoryId', model: stockCategoryModel });
    }     
  res.json({ message: 'Stock items loaded',data:data, status: true });

  } catch (error) {

    res.json({ status: false, message: error });
  }
}

export async function updateStockItem(req, res, next) {
  try {
    let companyId = req.user.companyId;
    let stockItemsModel = await getStockItemsModel(companyId);
    const { categoryId, name, price, mrp, description, hsn, igst, cess, cutCostPiece, stichCostPiece, ironCostPiece, threadCostPiece, packCostPiece, washCostPiece, totalCostJob, cutCostJob, stichCostJob, finishCostJob, washCostJob, blend, barCode, productCode, styleNo } = req.body.data;

    const formattedItemName = name.charAt(0).toUpperCase() +
    name.slice(1).toLowerCase();

    const result = await stockItemsModel.findByIdAndUpdate(
req.params.id,
    
      {
        $set: {
          categoryId: categoryId, name: formattedItemName, price: price, mrp: mrp, description: description, hsn: hsn, igst: igst, cess: cess, cutCostPiece: cutCostPiece, stichCostPiece: stichCostPiece, ironCostPiece: ironCostPiece, threadCostPiece: threadCostPiece, packCostPiece: packCostPiece, washCostPiece: washCostPiece, totalCostJob: totalCostJob, cutCostJob: cutCostJob, stichCostJob: stichCostJob, finishCostJob: finishCostJob, washCostJob: washCostJob, blend: blend, barCode: barCode, productCode: productCode, styleNo: styleNo
        }      },
        {new:true}
    );

    if (result.nModified === 0) {
      return res.json({ status: false, message: 'Item not updated' });
    }

    res.json({ status: true, data: result, message: "Stock item updated successfully" });

  } catch (error) {

    res.json({ status: false, message: error.message });
  }
}




