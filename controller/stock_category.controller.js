import getStockCategoryModel from "../models/stock_categories.model.js";
import getCounterModel from "../models/counter.model.js";

export async function registerStockCategory(req, res, next) {
  try {
    let companyId = req.user.companyId;
    let stockCategoryModel = await getStockCategoryModel(companyId);
    let counterModel = await getCounterModel(companyId);
    const { categoryName, discription, isColorApplicable, isSizeApplicable, isProductionItem,isProductionAddon, isProduct } = req.body;
    const formattedCategoryName = categoryName.charAt(0).toUpperCase() +
      categoryName.slice(1).toLowerCase();
    const item = await stockCategoryModel.findOne({categoryName: formattedCategoryName });

    if (item) {
      res.json({ status: false, message: "Category already Exist" });
    } else {

      let counter = await counterModel.findOne({ id: "cCode" });

      let seqId;
      if (!counter) {
        const newCounter = new counterModel({ id: "cCode", seq: 1 });
        await newCounter.save();
        seqId = "C" + newCounter.seq.toString().padStart(2, "0");
      } else {
        counter.seq += 1;
        await counter.save();
        seqId = "C" + counter.seq.toString().padStart(2, "0");
      }

      const addcategory = new stockCategoryModel({ categoryName: formattedCategoryName, discription: discription, categoryNumber: seqId, isColorApplicable: isColorApplicable, isSizeApplicable: isSizeApplicable, isProductionItem: isProductionItem,isProductionAddon:isProductionAddon, isProduct: isProduct });
      await addcategory.save();
      res.json({ status: true, data: addcategory, message: "Category added Succefully" });
    }


  } catch (error) {
    if (error.code === 11000) {
      res.json({ message: 'Alredy Exist', status: false });
      console.log('already exist');
    } else {
      console.log(error);
      res.json({ status: false, message: error });
    }
  }
}

export async function deleteStockCategory(req, res) {
  try {
    let companyId = req.user.companyId;
    let stockCategoryModel = await getStockCategoryModel(companyId);
    const data = await stockCategoryModel.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.json({ status: false, message: "Category not found" });
    }

    res.json({ status: true, message: "Category deleted successfully" });

  } catch (error) {
    res.json({ status: false, message: error.message || "Error deleting category" });
  }
}


export async function updateStockCategory(req, res) {
  try {
    let companyId = req.user.companyId;
    let stockCategoryModel = await getStockCategoryModel(companyId);
    const { id, eModel } = req.body;

    const {
      categoryName,
      discription,
      isColorApplicable,
      isSizeApplicable,
      isProductionItem,
      isProduct,
      isProductionAddon
    } = eModel;

    const formattedCategoryName = categoryName.charAt(0).toUpperCase() +
      categoryName.slice(1).toLowerCase();

    const updatedCategoryResult = await stockCategoryModel.findByIdAndUpdate(
      id,
      {
        $set: {
          categoryName: formattedCategoryName,
          discription,
          isColorApplicable,
          isSizeApplicable,
          isProductionItem,
          isProduct,
          isProductionAddon
        }
      },
      { new: true }
    );

    if (!updatedCategoryResult) {
      return res.json({ status: false, message: "Category not found" });
    }

    res.json({ status: true, data: updatedCategoryResult, message: "Category updated successfully" });

  } catch (error) {
    res.json({ status: false, message: error.message || "Error updating category" });
  }
}


export async function getStockCategory(req, res) {
  try {
    let companyId = req.user.companyId;
    let stockCategoryModel = await getStockCategoryModel(companyId);
    let data;
    if (req.params.id) {
      data = await stockCategoryModel.findById(req.params.id);
    } else {
      data = await stockCategoryModel.find();
    }
    res.json({ status: true, data: data, message: "Category Loaded" });
  } catch (error) {
    res.json({ status: false, message: error });
  }
}





