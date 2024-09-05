const express = require('express');
const axios = require('axios'); // เพิ่ม axios สำหรับดึงข้อมูลจาก URL
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.get('/download', async (req, res) => {
  try {
    // 1. ดึง URL ของไฟล์ .txt จาก query parameters
    const urls = req.query.urls;

    // ตรวจสอบว่ามี URL ส่งมาหรือไม่
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).send('โปรดระบุ URL ของไฟล์ .txt ใน query parameter `urls`');
    }

    // 2. ดึงข้อมูลจาก URL ทั้งหมด
    const responses = await Promise.all(
      urls.map(url => axios.get(url, { responseType: 'arraybuffer' })) // ดึงข้อมูลเป็น arraybuffer
    );

    // 3. รวมเนื้อหาของไฟล์ทั้งหมด
    let combinedData = Buffer.from(''); // สร้าง Buffer ว่าง
    for (const response of responses) {
      const fileData = Buffer.from(response.data);
      combinedData = Buffer.concat([combinedData, fileData]);
    }

    // 4. ตั้งชื่อไฟล์สำหรับดาวน์โหลด
    const downloadFilename = `combined-${Date.now()}.txt`;

    // 5. ตั้งค่า header และส่งไฟล์
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
    res.setHeader('Content-Type', 'text/plain'); // ตั้งค่า content type เป็น text/plain

    res.send(combinedData);

  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    res.status(500).send('เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์');
  }
});

app.listen(port, () => {
  console.log(`เซิร์ฟเวอร์กำลังทำงานบนพอร์ต ${port}`);
});