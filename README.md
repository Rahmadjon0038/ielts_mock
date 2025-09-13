# 🎓 IELTS Mock Test Platform

Bu loyiha **IELTS Mock Test**larni onlayn tarzda topshirish va natijalarni kuzatish uchun yaratilgan.  
Platforma ikki qismdan iborat: **User (talaba)** va **Admin (o‘qituvchi)**.  

---

## 👤 User taraf

- **Profile**: Har bir foydalanuvchi shaxsiy kabinetga ega.  
- **Asosiy bo‘limlar**:  
  - Listening  
  - Writing  
  - Reading  
  - Speaking  

- **Test topshirish**:  
  - Foydalanuvchi biror bo‘limni tanlasa, **o‘sha oydagi test boshlanadi**.  
  - **Timer** faollashadi va backend orqali boshqariladi.  
  - Foydalanuvchi chiqib ketib qayta kirsa ham timer o‘sha joydan davom etadi.  
  - Vaqt tugasa — ekranda **modal** ochilib, javoblarni yuborishga majbur qiladi.  
  - Bir oydagi bitta bo‘limni foydalanuvchi qayta ishlay olmaydi.  

- **Natijalar**:  
  - **Listening va Writing** avtomatik tekshiriladi va natija profile’da ko‘rinadi.  
  - **Speaking va Reading** admin tekshirgandan so‘ng natijalar profile’da chiqadi.  

---

## 🛡️ Admin taraf

- **Oylarni boshqarish**:  
  - Admin yangi oy yaratadi.  
  - Har bir oy ichida to‘rtta bo‘lim (Listening, Writing, Reading, Speaking) uchun task qo‘shadi.  
  - Listening bo‘limiga **audio yuklaydi**.  
  - Oylarni o‘chirish (delete) imkoniyati mavjud.  
  - Har bir oyda **Active** tugmasi mavjud:  
    - Agar Active qilinsa → foydalanuvchilarda o‘sha oy testlari ko‘rinadi.  
    - Agar Active bo‘lmasa → foydalanuvchilar hech narsa ko‘rmaydi.  

- **User javoblarini ko‘rish**:  
  - Admin har bir oy ichida test topshirgan userlarni ko‘rishi mumkin.  
  - User’ning yuborgan javoblarini ko‘rib chiqadi.  
  - **Ball qo‘yadi** va **komment yozadi**.  
  - Ball va komment foydalanuvchi profile’da ko‘rinib turadi.  

- **Dashboard**:  
  - Admin yaratgan barcha oylarni ko‘radi.  
  - Yangi oy qo‘shishi yoki mavjud oylarni boshqarishi mumkin.  

---

## 🎯 Maqsad

- IELTS topshiruvchilar uchun **real mock test muhiti** yaratish  
- Vaqtni to‘liq boshqarish (backend timer)  
- Avtomatik va manual tekshiruv tizimi yaratish  
- Adminlarga testlarni **moslashuvchan** boshqarish imkonini berish  

---

## 🛠️ Texnologiyalar

**Frontend**:  
- Next.js  
- Tailwind CSS  

**Backend**:  
- Node.js  
- Express.js  
- Mysql  

**Qo‘shimcha**:  
- JWT Authentication  
- Timer backend orqali boshqariladi  
- File upload (audio va boshqa tasklar uchun)  

---

## 🚀 O‘rnatish

1. Reponi clone qiling:  
   ```bash
   git clone https://github.com/Rahmadjon0038/ielts-mock-test.git
   cd ielts-mock-test
