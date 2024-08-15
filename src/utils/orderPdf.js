const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const createOrderPdf = (orderPdf) => {
  return new Promise((resolve, reject) => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const pdfDoc = new PDFDocument({
      margins: {
        top: 30,
        bottom: 50,
        left: 72,
        right: 72,
      },
    });
    let fontPath = path.join(__dirname, '../', 'fonts', 'Arial.ttf');
    const invoicePath = 'invoice.pdf';
    pdfDoc.pipe(fs.createWriteStream(invoicePath));

    // Bắt đầu ghi PDF
    pdfDoc.font('Times-Bold').fontSize(14).text('SHOWHUB', {
      align: 'center',
    });
    const yPos = pdfDoc.y;
    pdfDoc
      .fontSize(14)
      .text(
        'hoangphuocloc.phurieng@gmail.com, +84967936728',
        pdfDoc.page.margins.left,
        yPos,
        {
          align: 'center',
        },
      );
    pdfDoc.moveDown();

    pdfDoc
      .fontSize(30)
      .text('Purchase Invoice', pdfDoc.page.margins.left, 100, {
        align: 'center',
      });
    pdfDoc.moveDown();
    pdfDoc.fontSize(14).text('Invoice id: ' + orderPdf._id);
    pdfDoc.moveDown();
    pdfDoc
      .fontSize(14)
      .text(
        'Customer: ' +
          orderPdf.userId.firstName +
          ' ' +
          orderPdf.userId.lastName,
      );
    pdfDoc.moveDown();
    pdfDoc.fontSize(14).text('Phone number: ' + orderPdf.userId.phoneNumber);
    pdfDoc.moveDown();
    pdfDoc.fontSize(14).text('Email: ' + orderPdf.userId.email);
    pdfDoc.moveDown();
    pdfDoc.fontSize(14).text('Gender: ' + orderPdf.userId.sex);
    pdfDoc.moveDown();
    pdfDoc.fontSize(14).text('Date: ' + `${day}/${month}/${year}`);

    const yPosition = pdfDoc.y + 30;
    pdfDoc
      .fontSize(15)
      .fillColor('#24a99f')
      .text('Package name', pdfDoc.page.margins.left, yPosition);
    pdfDoc
      .fillColor('#24a99f')
      .text('Price', pdfDoc.page.margins.left + 150, yPosition);
    pdfDoc
      .fillColor('#24a99f')
      .text('Total', pdfDoc.page.margins.left + 350, yPosition);

    pdfDoc
      .strokeColor('#24a99f')
      .moveTo(pdfDoc.page.margins.left, yPosition + 20)
      .lineTo(pdfDoc.page.width - pdfDoc.page.margins.right, yPosition + 20)
      .stroke();

    // Thông tin đơn hàng
    const y = yPosition + 30;
    pdfDoc
      .fillColor('#000')
      .text(orderPdf.packageId.typePack, pdfDoc.page.margins.left, y);
    pdfDoc.text(
      `${orderPdf.packageId.monthlyPrice} USD`,
      pdfDoc.page.margins.left + 150,
      y,
      { width: 100, align: 'left' },
    );
    pdfDoc.text(
      `${orderPdf.packageId.monthlyPrice} USD`,
      pdfDoc.page.margins.left + 350,
      y,
      { width: 100, align: 'left' },
    );

    // Vẽ đường ngang dưới dữ liệu đơn hàng
    pdfDoc
      .strokeColor('#ccc')
      .lineWidth(1)
      .moveTo(pdfDoc.page.margins.left, y + 22)
      .lineTo(pdfDoc.page.width - pdfDoc.page.margins.right, y + 20)
      .stroke();

    pdfDoc.text(
      'Total: ' + orderPdf.packageId.monthlyPrice + ' USD',
      pdfDoc.page.margins.left + 350,
      y + 30,
      { width: 100, align: 'right' },
    );

    const yPositionTerms = pdfDoc.y + 50;
    pdfDoc.moveDown();
    pdfDoc
      .fontSize(16)
      .text('Terms & Conditions', pdfDoc.page.margins.left, yPositionTerms);
    pdfDoc.moveDown();
    pdfDoc
      .font('Times-Roman')
      .fontSize(15)
      .text(
        '1. The rates in this form are not subject to any changes and will be the applicable rates upon payment.',
        pdfDoc.page.margins.left,
        yPositionTerms + 20,
      );
    pdfDoc.moveDown();
    pdfDoc
      .fontSize(15)
      .text(
        '2. This delivery order will not take effect unless the recipient presents an original copy of the purchase invoice.',
        pdfDoc.page.margins.left,
        yPositionTerms + 60,
      );

    // Kết thúc ghi PDF
    pdfDoc.end();

    // Trả về đường dẫn của tệp PDF khi hoàn thành
    resolve(invoicePath);
  });
};

module.exports = createOrderPdf;
