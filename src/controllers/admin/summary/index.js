const AsyncHandler = require('express-async-handler');
const ErrorResponse = require('../../../utils/errorResponse.js');
const Subscriber = require('../../../models/subscriber.js');
const Package = require('../../../models/package.js');
const Order = require('../../../models/order.js');

exports.getSummaryRegister = AsyncHandler(async (req, res, next) => {
  const subscriber = await Subscriber.find();
  let data = [];
  const currentDate = new Date();

  if (req.query.type === 'month') {
    for (let i = 6; i >= 0; i--) {
      let count = 0;
      let formattedMonth, monthDate;
      monthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      );
      subscriber.map((item, id) => {
        const time = new Date(item.createAt);
        if (
          monthDate.getFullYear() === time.getFullYear() &&
          monthDate.getMonth() === time.getMonth()
        ) {
          count += 1;
        }
      });
      formattedMonth = monthDate.toLocaleDateString('en-US', {
        month: 'long',
      });
      data.push({
        month: formattedMonth.slice(0, 3),
        year: monthDate.getFullYear(),
        quantity: count,
      });
    }
  } else if (req.query.type === 'year') {
    for (let i = 6; i >= 0; i--) {
      let count = 0;
      let formattedYear, monthDate;
      monthDate = new Date(currentDate.getFullYear() - i, 1, 1);
      subscriber.map((item, id) => {
        const time = new Date(item.createAt);
        if (monthDate.getFullYear() === time.getFullYear()) {
          count += 1;
        }
      });
      formattedYear = monthDate.toLocaleDateString('en-US', {
        year: 'numeric',
      });
      data.push({
        year: formattedYear,
        quantity: count,
      });
    }
  } else {
    for (let i = 6; i >= 0; i--) {
      let count = 0;
      let formattedDay, monthDate;
      monthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - i,
      );
      subscriber.map((item, id) => {
        const time = new Date(item.createAt);
        if (
          monthDate.getFullYear() === time.getFullYear() &&
          monthDate.getMonth() === time.getMonth() &&
          monthDate.getDate() === time.getDate()
        ) {
          count += 1;
        }
      });
      formattedDay = monthDate.toLocaleDateString('en-US', {
        weekday: 'long',
      });
      data.push({
        day: formattedDay,
        quantity: count,
      });
    }
  }
  res.status(200).json({
    data: data,
    success: true,
    version: 1.0,
  });
});

exports.getCountRegisterAndPurchasesCurrentYearAndMonth = AsyncHandler(
  async (req, res, next) => {
    const subscriber = await Subscriber.find();
    const order = await Order.find().populate('packageId');
    let data = [];
    const currentDate = new Date();
    let count = 0,
      countMonth = 0,
      total = 0,
      totalMonth = 0;
    subscriber.map((item, id) => {
      const time = new Date(item.createAt);
      if (currentDate.getFullYear() === time.getFullYear()) {
        count += 1;
        if (currentDate.getMonth() === time.getMonth()) {
          countMonth += 1;
        }
      }
    });
    order.map((item, id) => {
      const time = new Date(item.createAt);
      if (currentDate.getFullYear() === time.getFullYear()) {
        total += parseInt(item.packageId.monthlyPrice);
        if (currentDate.getMonth() === time.getMonth()) {
          totalMonth += parseInt(item.packageId.monthlyPrice);
        }
      }
    });
    const dataSummary = {
      countRes: count,
      countResMonth: countMonth,
      totalPur: total,
      totalPurMonth: totalMonth,
    };
    res.status(200).json({
      data: dataSummary,
      success: true,
      version: 1.0,
    });
  },
);

exports.getSummaryPurchases = AsyncHandler(async (req, res, next) => {
  const order = await Order.find().populate('packageId');
  let data = [];
  const currentDate = new Date();
  if (req.query.type === 'month') {
    let monthDate, time, formattedMonth;
    for (let i = 6; i >= 0; i--) {
      let total = 0;
      monthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      );
      order.map((item, id) => {
        time = new Date(item.createAt);
        if (
          monthDate.getFullYear() === time.getFullYear() &&
          monthDate.getMonth() === time.getMonth()
        ) {
          total += parseInt(item.packageId.monthlyPrice);
        }
      });
      formattedMonth = monthDate.toLocaleDateString('en-US', {
        month: 'long',
      });
      data.push({
        month: formattedMonth.slice(0, 3),
        year: monthDate.getFullYear(),
        total: total,
      });
    }
  } else if (req.query.type === 'year') {
    let monthDate, time, formattedYear;
    for (let i = 6; i >= 0; i--) {
      let total = 0;
      monthDate = new Date(currentDate.getFullYear() - i, 1, 1);
      order.map((item, id) => {
        time = new Date(item.createAt);
        if (monthDate.getFullYear() === time.getFullYear()) {
          total += parseInt(item.packageId.monthlyPrice);
        }
      });
      formattedYear = monthDate.toLocaleDateString('en-US', {
        year: 'numeric',
      });
      data.push({
        year: formattedYear,
        total: total,
      });
    }
  } else {
    let monthDate, time, formattedDay;
    for (let i = 6; i >= 0; i--) {
      let total = 0;
      monthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - i,
      );
      order.map((item, id) => {
        time = new Date(item.createAt);
        if (
          monthDate.getFullYear() === time.getFullYear() &&
          monthDate.getMonth() === time.getMonth() &&
          monthDate.getDate() === time.getDate()
        ) {
          total += parseInt(item.packageId.monthlyPrice);
        }
      });
      formattedDay = monthDate.toLocaleDateString('en-US', {
        weekday: 'long',
      });
      data.push({
        day: formattedDay,
        total: total,
      });
    }
  }

  res.status(200).json({
    data: data,
    success: true,
    version: 1.0,
  });
});

exports.getSummaryTotalAmountEachPackage = AsyncHandler(
  async (req, res, next) => {
    const currentDate = new Date();
    const order = await Order.find();
    const package = await Package.find();
    let packageData = [];
    for (let i = 0; i < package.length; i++) {
      packageData.push({
        packageId: package[i]._id,
        namePackage: package[i].typePack,
        amountPack: package[i].monthlyPrice,
        total: 0,
      });
    }
    for (let j = 0; j < order.length; j++) {
      let item = order[j];
      let time = new Date(item.createAt);
      if (currentDate.getFullYear() === time.getFullYear()) {
        for (let i = 0; i < packageData.length; i++) {
          if (
            packageData[i].packageId.toString() === item.packageId.toString()
          ) {
            packageData[i].total += packageData[i].amountPack;
          }
        }
      }
    }
    res.status(200).json({
      data: packageData,
      success: true,
      version: 1.0,
    });
  },
);
