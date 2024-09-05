const express = require('express');
const axios = require('axios'); // เพิ่ม axios สำหรับดึงข้อมูลจาก URL
const fs = require('fs');

const app = express();
const port = 3000;

app.get('/download', async (req, res) => {
  try {
    const urls = req.query.urls;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).send('ต้องระบุ URL ของไฟล์ใน query parameter `urls`');
    }

    let base64Data = '';
    for (const url of urls) {
      const response = await axios.get(url); // ดึงข้อมูลจาก URL
      base64Data += response.data; // รวมข้อมูล Base64
    }

    // ดึงชื่อไฟล์จาก URL แรก (สมมติว่าทุก URL มีชื่อไฟล์เดียวกัน)
    const originalFilename = new URL(urls[0]).pathname.split('/').pop();

    // แปลง Base64 กลับเป็นไฟล์ต้นฉบับ
    const fileData = Buffer.from(base64Data, 'base64');

    // ตั้งค่า header สำหรับการดาวน์โหลด
    res.setHeader('Content-Disposition', `attachment; filename="${originalFilename}"`);

    // ส่งไฟล์ให้ผู้ใช้ดาวน์โหลด
    res.send(fileData);

  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    res.status(500).send('เกิดข้อผิดพลาด');
  }
});

app.listen(port, () => {
  console.log(`เซิร์ฟเวอร์กำลังทำงานบนพอร์ต ${port}`);
});