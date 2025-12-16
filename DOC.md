# คู่มือการใช้งานโปรเจค Income/Expense Tracker (Ruby on Rails)

## สิ่งที่คุณต้องรู้

### 1. โครงสร้างโปรเจค
โปรเจคนี้ถูกสร้างด้วย **Ruby on Rails** (Version 8) โดยมีโฟลเดอร์สำคัญดังนี้:
- **app/**: โค้ดหลักของโปรเจค
    - **models/**: จัดการข้อมูล (เช่น User, Transaction)
    - **views/**: หน้าจอการแสดงผล (HTML)
    - **controllers/**: ตัวควบคุมการทำงาน
- **db/**: ฐานข้อมูล (SQLite) และ Migration file
- **config/**: การตั้งค่าต่างๆ (เช่น routes.rb)

### 2. การสั่งงานพื้นฐาน (Terminal)

#### การเปิด Server (เพื่อให้เข้าเว็บได้)
พิมพ์คำสั่งนี้ใน Terminal เพื่อเริ่มการทำงาน:
```bash
source ~/.zshrc
bin/rails server
```
จากนั้นเปิด Browser ไปที่: `http://localhost:3000`

#### การหยุด Server
กด `Ctrl + C` ใน Terminal

### 3. คำสั่งอื่นๆ ที่ควรรู้
- **ดูเส้นทาง (Routes):** `bin/rails routes`
- **Console (ทดสอบโค้ด):** `bin/rails console`

---

## 4. เริ่มต้นใช้งาน (Quick Start)

### 1. รัน Server
```bash
bin/rails server
```

### 2. เข้าสู่ระบบ
เปิด Browser ไปที่ `http://localhost:3000` แล้วใช้บัญชีนี้:

*   **Email:** `admin@example.com`
*   **Password:** `password1234`

คุณสามารถสมัครสมาชิกใหม่ (Sign up) เพิ่มเองได้เช่นกันครับ

---
หากมีข้อสงสัยเพิ่มเติม สามารถถามผมได้ตลอดเวลาครับ!
