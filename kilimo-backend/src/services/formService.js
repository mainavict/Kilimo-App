// src/services/formService.js
const prisma = require('../models/prisma');

const submitForm = async (userId, formData) => {
  return await prisma.formSubmission.create({
    data: {
      userId,
      ...formData
    }
  });
};

const getSubmissions = async (userId) => {
  return await prisma.formSubmission.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      message: true,
      createdAt: true
    }
  });
};

module.exports = { submitForm, getSubmissions };