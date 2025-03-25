const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new discount
const createDiscount = async (req, res) => {
  try {
    const { 
      name, 
      discountValue, 
      startDate, 
      endDate, 
      status, 
      discountAvailability
    } = req.body;

    const discount = await prisma.discount.create({
      data: {
        name,
        discountValue,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        discountAvailability
      }
    });

    res.status(200).json({
      status: 200,
      success: true,
      data: discount
    });
  } catch (error) {
    console.error('Error creating discount:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all discounts
const getDiscounts = async (req, res) => {
  try {
    const discounts = await prisma.discount.findMany({
      include: {
        products: true
      }
    });

    res.status(200).json({
      status: 200,
      success: true,
      data: discounts
    });
  } catch (error) {
    console.error('Error fetching discounts:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get a single discount by ID
const getDiscountById = async (req, res) => {
  try {
    const { discountId } = req.params;
    
    const discount = await prisma.discount.findUnique({
      where: { id : discountId },
      include: {
        products: true
      }
    });

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      data: discount
    });
  } catch (error) {
    console.error('Error fetching discount:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update a discount
const updateDiscount = async (req, res) => {
  try {
    const { discountId } = req.params;
    const { 
      name, 
      discountValue, 
      startDate, 
      endDate, 
      discountAvailability
    } = req.body;

    // Validate input
    if (!discountId) {
      return res.status(400).json({
        success: false,
        message: 'Discount ID is required'
      });
    }

    // Check if discount exists
    const existingDiscount = await prisma.discount.findUnique({
      where: { id: discountId }
    });

    if (!existingDiscount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    // Prepare update data (explicitly exclude status)
    const updateData = {
      name,
      discountValue,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      discountAvailability,
    };

    // Filter out undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Update discount (without allowing status change)
    const updatedDiscount = await prisma.discount.update({
      where: { id: discountId },
      data: updateData
    });

    res.status(200).json({
      status : 200,
      success: true,
      data: updatedDiscount
    });
  } catch (error) {
    console.error('Error updating discount:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a discount
const InactiveDiscount = async (req, res) => {
  try {
    const { discountId } = req.params;

    // Check if discount exists
    const existingDiscount = await prisma.discount.findUnique({
      where: { id: discountId }
    });

    if (!existingDiscount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    // Update discount status to INACTIVE
    const updatedDiscount = await prisma.discount.update({
      where: { id: discountId },
      data: { 
        status: 'INACTIVE' 
      }
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Discount marked as INACTIVE',
      data: updatedDiscount
    });
  } catch (error) {
    console.error('Error updating discount status:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createDiscount,
  getDiscounts,
  getDiscountById,
  updateDiscount,
  InactiveDiscount
}