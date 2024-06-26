import express from "express";

import { registerColor, update, deleteColor, getColors } from "../controller/color.controller.js";
import { assignFinisher, getAssignFinisher, updateFinisherDatas,updateFinisherStatus } from "../controller/finisher.controller.js";
import { assignTailer, getAssignTailer, updateTailerDatas,updateTailerStatus ,getFinishedTailer} from "../controller/tailer.controller.js";
import { registerStock, getStock,updateStockQuantity,addStockQuantity ,addFinalProductToStockQuantity} from "../controller/stock.controller.js";
import { registerStockCategory, updateStockCategory, deleteStockCategory,getStockCategory } from "../controller/stock_category.controller.js";
import { registerStockItem, getStockItem, updateStockItem, deleteStockItem } from "../controller/stock_items.controller.js";
import { registerSizes, getSizes, deleteSizes } from "../controller/size.controller.js";
import { registerPurchase, getPurchase } from "../controller/purchase.controller.js";
import { registerOrder, getOrder, updateStatus as ___updateStatus, deleteOrder } from "../controller/order.controller.js";
import { registerInventory, getInventories } from "../controller/inventory.controller.js";
import { registerGodowns, getGodowns, update as _update, deleteGodown } from "../controller/godown.controller.js";
import { registerSupplier, getSupplier, updateSupplier, deleteSupplier, updateStatus as ____updateStatus } from "../controller/supplier.controller.js";
import { registerUser, update as __update, getEmployee, updatePassword, getEmployeeById, updateStatus as _____updateStatus, deleteUser, updatePermissions, updateGodownAccess, checkToken } from "../controller/user.controller.js";
import { registerCutterAssign,getAssignCutter,updateStatusCutterAssign} from "../controller/cutter.assign.controller.js";
import { registerCutterFinish,getFinishCutter,getFinishCutterAggregate,updateStatusCutterFinish} from "../controller/cutter.finish.controller.js" ;
import { getCompany } from "../controller/company.controller.js";
import { getPolicy } from "../controller/policy.controller.js";

import { checkPermission } from "../middleware/authMiddleware.js";

const router=express()

router.get('/get_company',checkPermission({ resource: 'company-details', permission: 'READ' }), getCompany);
router.get('/get_company/:id',checkPermission({ resource: 'company-details', permission: 'READ' }), getCompany);

router.post('/createAccount',checkPermission({ resource: 'user', permission: 'WRITE' }), registerUser);
router.post('/updateAccount',checkPermission({ resource: 'user', permission: 'EDIT' }), __update);
router.get('/get_employee',checkPermission({ resource: 'user', permission: 'READ' }), getEmployee);
router.post('/update_password',checkPermission({ resource: 'user', permission: 'EDIT' }), updatePassword);
router.get('/get_employee_by_id/:id',checkPermission({ resource: 'user', permission: 'READ' }), getEmployeeById);
router.post('/update_employee_status/:id',checkPermission({ resource: 'user', permission: 'EDIT' }), _____updateStatus);
router.delete('/delete_user/:id',checkPermission({ resource: 'user', permission: 'DELETE' }), deleteUser);
router.put('/update_resource_permission/:id',checkPermission({resource:'user',permission:'EDIT'}),updatePermissions);
router.put('/update_godown_access/:id',checkPermission({resource:'user',permission:'EDIT'}),updateGodownAccess);
router.get('/check_token',checkToken);

router.post('/register_supplier',checkPermission({ resource: 'suppliers', permission: 'WRITE' }), registerSupplier);
router.get('/get_supplier',checkPermission({ resource: 'suppliers', permission: 'READ' }), getSupplier);
router.put('/update_supplier',checkPermission({ resource: 'suppliers', permission: 'EDIT' }),updateSupplier);
router.get('/get_supplier/:id',checkPermission({ resource: 'suppliers', permission: 'READ' }), getSupplier);
router.delete('/delete_supplier/:id',checkPermission({ resource: 'suppliers', permission: 'DELETE' }), deleteSupplier);
router.post('/update_supplier_status/:id',checkPermission({ resource: 'suppliers', permission: 'EDIT' }), ____updateStatus);

router.post('/add_color',checkPermission({ resource: 'colors', permission: 'WRITE' }), registerColor);
router.put('/update_color',checkPermission({ resource: 'colors', permission: 'EDIT' }), update);
router.delete('/delete_color/:id',checkPermission({ resource: 'colors', permission: 'DELETE' }), deleteColor);
router.get('/get_colors',checkPermission({ resource: 'colors', permission: 'READ' }), getColors);

router.post('/add_godown',checkPermission({ resource: 'godowns', permission: 'WRITE' }), registerGodowns);
router.get('/get_godown',checkPermission({ resource: 'godowns', permission: 'READ' }), getGodowns);
router.put('/update_godown',checkPermission({ resource: 'godowns', permission: 'EDIT' }), _update);
router.delete('/delete_godown/:id',checkPermission({ resource: 'godowns', permission: 'DELETE' }), deleteGodown);

router.post('/add_inventory',checkPermission({ resource: 'inventory-db', permission: 'WRITE' }), registerInventory);
router.get('/get_inventory',checkPermission({ resource: 'inventory-db', permission: 'READ' }), getInventories);

router.post('/place_order',checkPermission({ resource: 'orders', permission: 'WRITE' }), registerOrder);
router.get('/get_order',checkPermission({ resource: 'orders', permission: 'READ' }), getOrder);
router.post('/update_status/:id',checkPermission({ resource: 'orders', permission: 'EDIT' }), ___updateStatus);
router.delete('/delete_order/:id',checkPermission({ resource: 'orders', permission: 'DELETE' }),deleteOrder);

router.post('/add_purchase', checkPermission({ resource: 'purchases', permission: 'WRITE' }),registerPurchase);
router.get('/get_purchase',checkPermission({ resource: 'purchases', permission: 'READ' }), getPurchase);

router.post('/add_size',checkPermission({ resource: 'sizes', permission: 'WRITE' }),registerSizes);
router.get('/get_sizes',checkPermission({ resource: 'sizes', permission: 'READ' }), getSizes);
router.delete('/delete_sizes/:id',checkPermission({ resource: 'sizes', permission: 'DELETE' }),deleteSizes);

router.post('/add_stock_category', checkPermission({ resource: 'stock-categories', permission: 'WRITE' }),registerStockCategory);
router.put('/update_stock_category',checkPermission({ resource: 'stock-categories', permission: 'EDIT' }), updateStockCategory);
router.get('/get_stock_category',checkPermission({ resource: 'stock-categories', permission: 'READ' }), getStockCategory);
router.delete('/delete_stock_category/:id',checkPermission({ resource: 'stock-categories', permission: 'DELETE' }), deleteStockCategory);

router.delete('/delete_stock_category_item/:id',checkPermission({ resource: 'stock-categories', permission: 'DELETE' }), deleteStockItem);
router.post('/add_stock_category_items',checkPermission({ resource: 'stock-categories', permission: 'WRITE' }), registerStockItem);
router.put('/update_stock_category_item/:id',checkPermission({ resource: 'stock-categories', permission: 'EDIT' }), updateStockItem);
router.get('/get_stock_category_item/:id',checkPermission({ resource: 'stock-categories', permission: 'READ' }), getStockItem);
router.get('/get_stock_category_item',checkPermission({ resource: 'stock-categories', permission: 'READ' }), getStockItem);

router.post('/add_stock',checkPermission({ resource: 'stock', permission: 'WRITE' }),registerStock);
router.get('/get_stock/:id',checkPermission({ resource: 'stock', permission: 'READ' }), getStock);
router.get('/get_stock',checkPermission({ resource: 'stock', permission: 'READ' }), getStock);
router.put('/update_stock_quantity',checkPermission({ resource: 'stock', permission: 'EDIT' }), updateStockQuantity);
router.post('/add_final_product_to_stock_quantity/:id',checkPermission({ resource: 'stock', permission: 'EDIT' }), addFinalProductToStockQuantity,updateFinisherStatus);

router.post('/add_cutter_assign',checkPermission({ resource: 'assign-cutter', permission: 'WRITE' }), registerCutterAssign,updateStockQuantity);
router.get('/get_cutter_assign',checkPermission({ resource: 'assign-cutter', permission: 'READ' }),getAssignCutter);
router.post('/update_cutter_assign_status/:id',checkPermission({ resource: 'assign-cutter', permission: 'EDIT' }), updateStatusCutterAssign);
router.post('/add_cutter_finish',checkPermission({ resource: 'finish-cutter', permission: 'WRITE' }), registerCutterFinish,updateStatusCutterAssign,addStockQuantity);
router.get('/get_cutter_finish',checkPermission({ resource: 'finish-cutter', permission: 'READ' }), getFinishCutter);
router.get('/get_cutter_finish_all',checkPermission({ resource: 'finish-cutter', permission: 'READ' }), getFinishCutterAggregate);
router.post('/update_cutter_finish_status/:id',checkPermission({ resource: 'finish-cutter', permission: 'EDIT' }),updateStatusCutterFinish);

router.post('/add_tailer_assign',checkPermission({ resource: 'tailer-docs', permission: 'WRITE' }), assignTailer,updateStatusCutterFinish);
router.get('/get_tailer_assign',checkPermission({ resource: 'tailer-docs', permission: 'READ' }), getAssignTailer);
router.put('/add_tailer_finished/:id',checkPermission({ resource: 'tailer-docs', permission: 'EDIT' }), updateTailerDatas);
router.get('/get_tailer_finished',checkPermission({ resource: 'tailer-docs', permission: 'READ' }), getFinishedTailer);

router.post('/add_finisher_assign',checkPermission({ resource: 'finisher-docs', permission: 'WRITE' }), assignFinisher,updateTailerStatus);
router.get('/get_finisher_assign',checkPermission({ resource: 'finisher-docs', permission: 'READ' }), getAssignFinisher);
router.put('/add_finisher_finished/:id',checkPermission({ resource: 'finisher-docs', permission: 'EDIT' }), updateFinisherDatas);

router.get('/policy/get-policy', getPolicy);


export default router;