import getColorModel from "../models/color.model.js";

export async function registerColor(req, res, next) {
    try {
        let companyId = req.user.companyId;
        let colorModel = await getColorModel(companyId);
        const { color } = req.body;
 
        const formattedColor = color.charAt(0).toUpperCase() +
            color.slice(1).toLowerCase();
        const item = await colorModel.findOne({ formattedColor });
        if (item) {
            res.json({ status: false, message: "Color already exist" });
        } else {
            const addColor = new colorModel({color:formattedColor});
             await addColor.save();

            res.json({ status: true, data: addColor, message: "Color added Succefully" });
        }

    } catch (error) {
      
        res.json({ status: false, message: error.message });
    }
}


export async function update(req, res) {
    try {
        let companyId = req.user.companyId;
        let colorModel = await getColorModel(companyId);
        const { id, bData } = req.body;

        const {
            color,
        } = bData;

        const formattedColor = color.charAt(0).toUpperCase() +
            color.slice(1).toLowerCase();

        const existingColor = await colorModel. findByIdAndUpdate(
            id,
            {
                $set: {
                    color: formattedColor,
                },
            },
            { new: true }
        );

        if (!existingColor) {
            return res.json({ status: false, message: "Color not found" });
        } else {
            const item = await checkcolor(formattedColor);

            if (item) {
                return res.json({ status: false, message: "Color already exists" });
            }

            res.json({ status: true, data: existingColor, message: "Color updated successfully" });
        }

    } catch (error) {
        res.json({ status: false, message: error.message || "Error updating color" });
    }
}




export async function getColors(req, res) {
    try {
        let companyId = req.user.companyId;
        let colorModel = await getColorModel(companyId);
        let data = await colorModel. find();

        res.json({ status: true, data: data, message: "Color Loaded Succefully" });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
}


export async function deleteColor(req, res) {
    try {
        let companyId = req.user.companyId;
        let colorModel = await getColorModel(companyId);
        const existingColor = await colorModel. findByIdAndDelete(req.params.id);
        if (!existingColor) {
            return res.json({ status: false, message: "Color not found" });
        }

        res.json({ status: true, message: "Color deleted successfully" });

    } catch (error) {
        res.json({ status: false, message: error.message || "Error deleting color" });
    }
}

