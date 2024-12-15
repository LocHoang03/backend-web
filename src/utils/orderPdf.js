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
    const fontPath = path.join(__dirname, '../', 'fonts', 'Arial.ttf');
    const invoicePath = 'invoice.pdf';
    pdfDoc.pipe(fs.createWriteStream(invoicePath));

    // Bắt đầu ghi PDF
    pdfDoc.font(fontPath).fontSize(14).text('SHOWHUB', {
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
      .text('Hoá đơn mua hàng', pdfDoc.page.margins.left, 100, {
        align: 'center',
      });
    pdfDoc.moveDown();
    pdfDoc.fontSize(14).text('ID hóa đơn: ' + orderPdf._id);
    pdfDoc.moveDown();
    pdfDoc
      .fontSize(14)
      .text(
        'Khách hàng: ' +
          orderPdf.userId.firstName +
          ' ' +
          orderPdf.userId.lastName,
      );
    pdfDoc.moveDown();
    pdfDoc
      .fontSize(14)
      .text(
        'Số điện thoại: ' +
          (orderPdf.userId.phoneNumber
            ? orderPdf.userId.phoneNumber
            : 'Chưa cập nhật'),
      );
    pdfDoc.moveDown();
    pdfDoc.fontSize(14).text('Email: ' + orderPdf.userId.email);
    pdfDoc.moveDown();
    pdfDoc
      .fontSize(14)
      .text(
        'Giới tính: ' +
          (orderPdf.userId.sex ? orderPdf.userId.sex : 'Chưa cập nhật'),
      );
    pdfDoc.moveDown();
    pdfDoc.fontSize(14).text('Ngày mua hàng: ' + `${day}/${month}/${year}`);

    const yPosition = pdfDoc.y + 30;
    pdfDoc
      .fontSize(15)
      .fillColor('#24a99f')
      .text('Tên gói', pdfDoc.page.margins.left, yPosition);
    pdfDoc
      .fillColor('#24a99f')
      .text('Giá', pdfDoc.page.margins.left + 150, yPosition);
    pdfDoc
      .fillColor('#24a99f')
      .text('Tổng', pdfDoc.page.margins.left + 350, yPosition);

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
      `${orderPdf.packageId.monthlyPrice.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })} VND`,
      pdfDoc.page.margins.left + 150,
      y,
      { width: 100, align: 'left' },
    );
    pdfDoc.text(
      `${orderPdf.packageId.monthlyPrice.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })} VND`,
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

    pdfDoc.text('Tổng ', pdfDoc.page.margins.left, y + 30);

    pdfDoc.text(
      '' +
        orderPdf.packageId.monthlyPrice.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }) +
        ' VND',
      pdfDoc.page.margins.left + 350,
      y + 30,
    );

    const yPositionTerms = pdfDoc.y + 50;
    pdfDoc.moveDown();
    pdfDoc
      .fontSize(16)
      .text('Điều khoản & Điều kiện', pdfDoc.page.margins.left, yPositionTerms);
    pdfDoc.moveDown();
    pdfDoc
      .fontSize(15)
      .text(
        '1. Các mức giá trong biểu mẫu này không có bất kỳ thay đổi nào và sẽ là mức giá áp dụng khi thanh toán.',
        pdfDoc.page.margins.left,
        yPositionTerms + 22,
      );
    pdfDoc.moveDown();
    pdfDoc
      .fontSize(15)
      .text(
        '2. Lệnh giao hàng này sẽ không có hiệu lực trừ khi người nhận xuất trình bản gốc hóa đơn mua hàng.',
        pdfDoc.page.margins.left,
        yPositionTerms + 62,
      );

    // Kết thúc ghi PDF
    pdfDoc.end();

    // Trả về đường dẫn của tệp PDF khi hoàn thành
    resolve(invoicePath);
  });
};

module.exports = createOrderPdf;
