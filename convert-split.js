const fs = require('fs');

const inputFile = process.argv[2];
const outputDir = process.argv[3] || `${inputFile}-parts`;
const maxPartSize = (process.argv[4] || 1024 * 1024) * 1; // ขนาดไฟล์สูงสุดต่อไฟล์ (default 1MB)

// อ่านไฟล์อินพุตเป็นบัฟเฟอร์
const fileData = fs.readFileSync(inputFile);

// แปลงบัฟเฟอร์เป็น Base64 
const base64Data = fileData.toString('base64');

// สร้างโฟลเดอร์สำหรับไฟล์ .txt ที่ถูกแยก
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// แบ่ง Base64 string เป็นส่วนๆ
const partSize = Math.ceil(base64Data.length / maxPartSize);
for (let i = 0; i < partSize; i++) {
  const start = i * maxPartSize;
  const end = (i + 1) * maxPartSize;
  const partData = base64Data.substring(start, end);
  const partFilename = `${outputDir}/part-${i}.txt`;
  fs.writeFileSync(partFilename, partData);
}

console.log(`แปลงและแยกไฟล์ ${inputFile} เป็น ${partSize} ไฟล์ในโฟลเดอร์ ${outputDir}`);