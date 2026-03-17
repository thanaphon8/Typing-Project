/* ═══════════════════════════════════════════════════════════════
   lib/words.ts  —  word bank & text data for PixelType
   ═══════════════════════════════════════════════════════════════ */

/* ── Normal mode: top 200 most common words ── */
export const SAMPLE_WORDS: Record<string, string[]> = {
  en: [
    "the","be","to","of","and","a","in","that","have","it",
    "for","not","on","with","he","as","you","do","at","this",
    "but","his","by","from","they","we","say","her","she","or",
    "an","will","my","one","all","would","there","their","what","so",
    "up","out","if","about","who","get","which","go","me","when",
    "make","can","like","time","no","just","him","know","take","people",
    "into","year","your","good","some","could","them","see","other","than",
    "then","now","look","only","come","its","over","think","also","back",
    "after","use","two","how","our","work","first","well","way","even",
    "new","want","because","any","these","give","day","most","us","between",
    "need","large","often","hand","high","place","hold","turn","move","live",
    "where","much","through","long","down","find","still","own","should","very",
    "great","same","those","while","never","off","ask","may","part","real",
    "before","point","world","big","put","end","why","again","few","next",
    "white","open","seem","together","begin","got","walk","example","ease","paper",
    "group","always","music","both","mark","book","letter","until","mile","river",
    "car","feet","care","second","enough","plain","girl","young","ready","above",
    "ever","red","list","though","feel","talk","bird","soon","body","dog",
    "family","direct","leave","song","keep","children","side","face","watch","far",
    "hard","light","near","stop","plan","fire","cut","draw","east","west",
  ],
  th: [
    "และ","ที่","เป็น","ใน","การ","มี","ได้","ให้","ไป","ของ",
    "จะ","ไม่","กับ","มา","ความ","ก็","ด้วย","นี้","ว่า","จาก",
    "ผู้","หรือ","อย่าง","คือ","แล้ว","อาจ","ต้อง","คน","ซึ่ง","เรา",
    "ท่าน","เพื่อ","นั้น","มาก","หนึ่ง","ส่วน","ขึ้น","เขา","ทำ","เมื่อ",
    "ถ้า","ใช้","แต่","ทั้ง","โดย","นำ","เอง","ยัง","พบ","เห็น",
    "รู้","บอก","ดู","ต่อ","ออก","แบบ","ทาง","ชีวิต","ประเทศ","สิ่ง",
    "เวลา","ปี","รับ","ใหม่","ดี","คิด","อีก","อยู่","หลาย","แรก",
    "ต่าง","เดิน","พูด","เข้า","แม้","ทุก","ตาม","เริ่ม","ลง","ระหว่าง",
    "ข้อ","สุด","ทีม","พัฒนา","เพียง","ราย","หลัก","ระบบ","งาน","ข้อมูล",
    "ช่วย","แผน","กล่าว","รวม","ตัว","สูง","ใหญ่","สร้าง","ผล","ข้าง",
    "กัน","หน้า","เดือน","สังคม","ปัญหา","จริง","ภายใน","ชาติ","ไทย","กลาง",
    "แนว","ดำเนิน","แสดง","ตลาด","ต่อไป","บาท","ทราบ","มือ","กฎ","วาง",
    "ยาว","เขต","เปลี่ยน","เกิด","กลับ","วิธี","กรณี","ถึง","หัว","ค่า",
    "พื้น","ฐาน","ชั้น","เจ้า","สอน","ชาย","หญิง","ลูก","เข้าใจ","จัด",
    "เอา","เปิด","เดียว","ร่วม","สวย","เพิ่ม","สำคัญ","กำลัง","เลย","วัน",
    "คุณ","สำเร็จ","กิน","นอน","เล่น","อ่าน","เขียน","วิ่ง","เรียน","สอบ",
    "ผ่าน","ทันที","เพราะ","แน่ใจ","ควร","มั่นใจ","พอ","น้อย","ต่ำ","เร็ว",
    "ช้า","ง่าย","ยาก","สั้น","ใกล้","ไกล","เช้า","เย็น","กลางวัน","เรื่อง",
    "แก้","พัก","ต้นทุน","นโยบาย","สิทธิ","มูลค่า","ความรู้","เกี่ยว","ตัดสิน","แจ้ง",
    "ใช้งาน","ศึกษา","ทดสอบ","ค้นหา","บันทึก","สรุป","ตรวจ","วัด","ประเมิน","แก้ไข",
  ],
};

/* ── Hard mode: natural sentences split into individual words
   BUG FIX: ภาษาไทยใช้ Array ของคำแยกกันแล้ว แทนที่จะ join ประโยค
   เพราะ join(" ") แล้ว split(" ") ทำให้ได้ chunk ยาวๆ ที่พิมพ์ไม่ได้ ── */
export const HARD_WORDS: Record<string, string[]> = {
  en: (
    "the sun sets slowly behind the mountains casting long shadows across the valley " +
    "she opened the window and felt the cool breeze brush against her face " +
    "he walked into the room and noticed the lights were already on " +
    "the dog ran across the field chasing the ball that had rolled away " +
    "they sat together by the fire talking about the events of the day " +
    "the book was left open on the table its pages turning in the wind " +
    "a cup of coffee sat on the desk growing cold beside the keyboard " +
    "the train arrived two minutes early and the platform was already crowded " +
    "she typed quickly her fingers moving across the keys without hesitation " +
    "the city lights reflected off the wet pavement after the evening rain " +
    "he picked up the phone looked at the screen and put it back down " +
    "the children ran out of the classroom as soon as the bell rang " +
    "a single cloud drifted slowly across an otherwise perfectly blue sky " +
    "the market was busy with people buying vegetables fruit and fresh bread " +
    "she had always wanted to visit the place her grandmother used to talk about " +
    "the project took three months to finish but the result was worth the effort " +
    "he closed the laptop stood up and stretched after hours of work " +
    "the rain began softly at first then grew heavier as the night went on " +
    "she smiled when she saw the message waiting for her in the morning " +
    "the old clock on the wall ticked steadily through the quiet afternoon"
  ).split(" "),

  // BUG FIX: ภาษาไทย hard mode เปลี่ยนเป็น array ของคำแยกแต่ละคำ
  // แทน array ของประโยคยาว เพื่อให้แต่ละ "word" ที่แสดงในหน้าจอพิมพ์ได้จริง
  th: [
    "แสงแดด","ส่องผ่าน","หน้าต่าง","ยามเช้า","ทำให้","ห้อง","สว่าง","อย่างช้าๆ",
    "เขา","หยิบ","แก้วกาแฟ","จิบ","แล้ว","มอง","ออกไป","นอก","หน้าต่าง",
    "เธอ","เปิด","สมุด","บันทึก","เริ่ม","เขียน","ความคิด","ที่ค้าง","ในใจ","มานาน",
    "เด็กๆ","วิ่ง","ออกมา","จากห้องเรียน","ทันที","กระดิ่ง","ดังขึ้น",
    "ฝน","เริ่ม","ตก","เบาๆ","ก่อน","ค่อยๆ","แรงขึ้น","ช่วงดึก",
    "เขา","ปิด","คอมพิวเตอร์","ลุกขึ้น","ยืดเส้น","หลังจาก","ทำงาน","หลาย","ชั่วโมง",
    "เธอ","ยิ้ม","เมื่อเห็น","ข้อความ","รอ","อยู่","ยามเช้า",
    "รถไฟ","มาถึง","ก่อนเวลา","สองนาที","ชานชาลา","เริ่ม","คึกคัก",
    "แสงไฟ","เมือง","สะท้อน","พื้นถนน","เปียก","หลังฝน","ตก",
    "หมา","ตัวน้อย","วิ่ง","ข้ามทุ่ง","ไล่ตาม","ลูกบอล","กลิ้ง","ออกไป",
    "เธอ","พิมพ์","รวดเร็ว","นิ้ว","แทบ","ไม่","หยุด","พัก",
    "ตลาด","ยามเช้า","เต็ม","ผู้คน","เลือกซื้อ","ผัก","ผลไม้","สด",
    "นาฬิกา","เก่า","ผนัง","เดิน","สม่ำเสมอ","ตลอด","บ่าย",
    "เขา","หยิบ","โทรศัพท์","มอง","หน้าจอ","วาง","ลง","ตามเดิม",
    "เธอ","อยาก","ไป","สถานที่","คุณยาย","เคยเล่า","ตลอด","ชีวิต",
    "งาน","โครงการ","ใช้เวลา","สามเดือน","เสร็จ","สมบูรณ์","ผล","คุ้มค่า",
    "เมฆ","ก้อนเดียว","ลอย","ช้าๆ","ท้องฟ้า","สีฟ้า","แจ่มใส",
    "เธอ","เปิด","หน้าต่าง","รู้สึก","ลมเย็น","พัดผ่าน","แก้ม",
    "หนังสือ","เปิด","อยู่","บนโต๊ะ","หน้ากระดาษ","พลิ้วไหว","ตามลม",
    "พวกเขา","นั่ง","รอบกองไฟ","คุย","เรื่อง","ที่เกิดขึ้น","ทั้งวัน",
  ],
};

/* ── Helpers ── */

/** BUG FIX: ใช้ HARD_WORDS แทน HARD_TEXT เพื่อให้แต่ละ element เป็นคำเดียว */
export function getHardWords(lang: string): string[] {
  const src = HARD_WORDS[lang] ?? HARD_WORDS['en'];
  const arr: string[] = [];
  while (arr.length < 300) arr.push(...src);
  return arr.slice(0, 300);
}

/** Generate 300 random words for normal mode */
export function getRandomWords(lang: string): string[] {
  const src = SAMPLE_WORDS[lang] ?? SAMPLE_WORDS['en'];
  return Array.from({ length: 300 }, () => src[Math.floor(Math.random() * src.length)]);
}

/** Generate words based on difficulty — main entry point */
export function generateWordList(lang: string, difficulty: string): string[] {
  return difficulty === 'hard' ? getHardWords(lang) : getRandomWords(lang);
}