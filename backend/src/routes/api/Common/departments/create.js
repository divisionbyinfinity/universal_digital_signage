const mongoose = require('mongoose');
const responseHandler=require("@helpers/responseHandler")
const Department = mongoose.model('Departments');
const Users = mongoose.model('Users');
const Devices = mongoose.model('Devices');
const Channels = mongoose.model('Channels');
const {storeImage} =require('@helpers/utils')
const fs = require('fs');
/**
 * @swagger
 * /api/common/departments/create:
 *   post:
 *     summary: Create a new department
 *     description: Creates a new department with optional profile image.
 *     tags:
 *       - Common
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Department created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Department already exists or unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/common/departments/{id}:
 *   post:
 *     summary: Update a department
 *     description: Updates department name, description, and optionally profile image.
 *     tags:
 *       - Common
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Department ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       403:
 *         description: Unauthorized action
 *       404:
 *         description: Department not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/common/departments/{id}:
 *   delete:
 *     summary: Delete a department
 *     description: Deletes a department if it is not associated with users, hosts, or channels.
 *     tags:
 *       - Common
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Department ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *       403:
 *         description: Cannot delete department due to associations or unauthorized
 *       404:
 *         description: Department not found
 *       500:
 *         description: Internal server error
 */


// POST route to create a department
exports.create=async (req, res) => {
  try {
    const { name, description } = req.body;
    const user=req.user;


    const newDepartment={
      name,
      description,
      createdBy:user.id
    }
    if (user.role!=="admin") return responseHandler.handleErrorResponse(res, 403, "You are not authorized to perform this action.");
    const departmentExists=await Department.findOne({name:name})
    if (departmentExists) return responseHandler.handleErrorResponse(res,403,"Department Already Exists.")
     // Validate request data
    if (!name) {
      return responseHandler.handleErrorResponse(res,400,"Name is required.")
    }

    if(req.file){
        const imageURL=await storeImage(`${process.env.CDN_PATH}uploads/departments/`,'uploads/departments/',req.file)
        newDepartment['profileImg']=imageURL
      }

    // Save the new department to the database
    const savedDepartment = await Department(newDepartment).save();
      return responseHandler.handleSuccessResponse(res,"succesfully Created Department")
  } catch (error) {
    console.error(error);
    return responseHandler.handleErrorResponse(res,500,error.message)
  }
}


// PUT route to update a department
exports.update = async (req, res) => {
  console.log(req.body,req.file)
  try {
    const { id } = req.params; // Assuming you are passing the department ID in the URL
    const user=req?.user;
    // Validate request data
    const { name, description } = req.body;
    if (user.role!=="admin") return responseHandler.handleErrorResponse(res, 403, "You are not authorized to perform this action.");
    
    // Check if the department exists
    const existingDepartment = await Department.findById(id);
    if (!existingDepartment) {
      return responseHandler.handleErrorResponse(res, 404, "Department not found.");
    }

    // Check if the department name is already taken by another department
    if (name && name !== existingDepartment.name) {
      const departmentExists = await Department.findOne({ name });
      if (departmentExists) {
        return responseHandler.handleErrorResponse(res, 403, "Department name is already taken.");
      }
      existingDepartment.name = name;
    }
    if(description){
    // Update the department data
    existingDepartment.description = description;
    }


    // Update profile image if a new file is provided
    if (req.file) {
      const imageURL = await storeImage(`${process.env.CDN_PATH}uploads/departments/`, 'uploads/departments/',req.file);
      existingDepartment.profileImg = imageURL;
    }

    // Save the updated department to the database
    const updatedDepartment = await existingDepartment.save();

    return responseHandler.handleSuccessResponse(res, "Successfully updated department", updatedDepartment);
  } catch (error) {
    console.error(error);
    return responseHandler.handleErrorResponse(res, 500, error.message);
  }
};

exports.delete=async (req,res)=>{
  try{
    const user=req.user;
const id=req.params.id;
if (user?.role!=="admin") {
  return responseHandler.handleErrorResponse(res, 403, "You are not authorized to perform this action.");
}
const users=await Users.findOne({departmentId:id})
if(users) return responseHandler.handleErrorResponse(res,403,"Cannot delete department as it is associated with users.")
const hosts=await Devices.findOne({department:id})
if(hosts) return responseHandler.handleErrorResponse(res,403,"Cannot delete department as it is associated with hosts.")
const channels=await Channels.findOne({department:id})
if(channels) return responseHandler.handleErrorResponse(res,403,"Cannot delete department as it is associated with channels.")
const data=await Department.findByIdAndDelete(id);
if (fs.existsSync(data.profileImg)) {
  fs.rmSync(data.profileImg, { recursive: true });
}
if(data) return responseHandler.handleSuccessResponse(res,"Successfully Deleted Department")
   
return responseHandler.handleErrorResponse(res,403,"unable to find record")
  }
  catch (error) {
    console.error(error);
    return responseHandler.handleErrorResponse(res,500,error.message)
  }}
