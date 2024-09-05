const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.get('/download/:foldername', (req, res) => {
  const folderName = req.params.foldername;
  const folderPath = path.join(__dirname, folderName);

  // ตรวจสอบว่าโฟลเดอร์มีอยู่หรือไม่
  if (!fs.existsSync(folderPath)) {
    return res.status(404).send('ไม่พบโฟลเดอร์');
  }

  // อ่านชื่อไฟล์ทั้งหมดในโฟลเดอร์
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดขณะอ่านโฟลเดอร์:", err);
      return res.status(500).send('เกิดข้อผิดพลาด');
    }

    // เรียงลำดับชื่อไฟล์ (เรียงตาม prefix 'part-')
    files.sort((a, b) => {
      const numA = parseInt(a.replace('part-', '').replace('.txt', ''));
      const numB = parseInt(b.replace('part-', '').replace('.txt', ''));
      return numA - numB;
    });

    // ดึงชื่อไฟล์ต้นฉบับจากชื่อโฟลเดอร์
    const originalFilename = folderName.replace('-parts', '');

    // ตั้งค่า header สำหรับการดาวน์โหลด
    res.setHeader('Content-Disposition', `attachment; filename="${originalFilename}"`);

    // อ่านและส่งข้อมูลจากแต่ละไฟล์ในโฟลเดอร์
    let i = 0;
    const sendNextFile = () => {
      if (i >= files.length) {
        return res.end();
      }
      const file = files[i++];
      const filePath = path.join(folderPath, file);
      const readStream = fs.createReadStream(filePath);
      readStream.on('data', (chunk) => {
        const buffer = Buffer.from(chunk.toString(), 'base64');
        res.write(buffer);
      });
      readStream.on('end', sendNextFile);
    };
    sendNextFile();
  });
});

app.listen(port, () => {
  console.log(`เซิร์ฟเวอร์กำลังทำงานบนพอร์ต ${port}`);
});