/* ═══════════════════════════════════════════════════════════════
   lib/words.ts  —  word bank & text data for PixelType
   Style: 10fastfingers — top common words (normal) + natural sentences (hard)
   ═══════════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────────────────────────────
   NORMAL MODE — top 200 most commonly used words
   (mirrors 10fastfingers "Top 200 Words" lists)
──────────────────────────────────────────────────────────────── */
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

/* ────────────────────────────────────────────────────────────────
   HARD MODE — natural short sentences joined together
   (mirrors 10fastfingers "Advanced" / text practice mode)
──────────────────────────────────────────────────────────────── */
export const HARD_TEXT: Record<string, string> = {
  en: [
    "the sun sets slowly behind the mountains casting long shadows across the valley",
    "she opened the window and felt the cool breeze brush against her face",
    "he walked into the room and noticed the lights were already on",
    "the dog ran across the field chasing the ball that had rolled away",
    "they sat together by the fire talking about the events of the day",
    "the book was left open on the table its pages turning in the wind",
    "a cup of coffee sat on the desk growing cold beside the keyboard",
    "the train arrived two minutes early and the platform was already crowded",
    "she typed quickly her fingers moving across the keys without hesitation",
    "the city lights reflected off the wet pavement after the evening rain",
    "he picked up the phone looked at the screen and put it back down",
    "the children ran out of the classroom as soon as the bell rang",
    "a single cloud drifted slowly across an otherwise perfectly blue sky",
    "the market was busy with people buying vegetables fruit and fresh bread",
    "she had always wanted to visit the place her grandmother used to talk about",
    "the project took three months to finish but the result was worth the effort",
    "he closed the laptop stood up and stretched after hours of work",
    "the rain began softly at first then grew heavier as the night went on",
    "she smiled when she saw the message waiting for her in the morning",
    "the old clock on the wall ticked steadily through the quiet afternoon",
  ].join(" "),

  th: [
    "แสงแดดส่องผ่านหน้าต่างในยามเช้าทำให้ห้องสว่างขึ้นอย่างช้าๆ",
    "เขาหยิบแก้วกาแฟขึ้นมาจิบแล้วมองออกไปนอกหน้าต่าง",
    "เธอเปิดสมุดบันทึกและเริ่มเขียนความคิดที่ค้างอยู่ในใจมานาน",
    "เด็กๆ วิ่งออกมาจากห้องเรียนทันทีที่กระดิ่งดังขึ้น",
    "ฝนเริ่มตกเบาๆ ก่อนจะค่อยๆ แรงขึ้นในช่วงดึก",
    "เขาปิดคอมพิวเตอร์แล้วลุกขึ้นยืดเส้นยืดสายหลังจากทำงานมาหลายชั่วโมง",
    "เธอยิ้มเมื่อเห็นข้อความที่รอเธออยู่ในยามเช้า",
    "รถไฟมาถึงก่อนเวลาสองนาทีและชานชาลาเริ่มคึกคักขึ้นแล้ว",
    "แสงไฟของเมืองสะท้อนอยู่บนพื้นถนนที่เปียกหลังฝนตก",
    "หมาตัวน้อยวิ่งข้ามทุ่งไล่ตามลูกบอลที่กลิ้งออกไป",
    "เธอพิมพ์ได้รวดเร็วมากโดยที่นิ้วแทบไม่หยุดพัก",
    "ตลาดยามเช้าเต็มไปด้วยผู้คนที่มาเลือกซื้อผักและผลไม้สด",
    "นาฬิกาเก่าบนผนังเดินติกต็อกอย่างสม่ำเสมอตลอดบ่าย",
    "เขาหยิบโทรศัพท์ขึ้นมามองหน้าจอแล้วก็วางลงตามเดิม",
    "เธออยากไปยังสถานที่ที่คุณยายเคยเล่าให้ฟังมาตลอดชีวิต",
    "งานโครงการใช้เวลาสามเดือนจึงเสร็จสมบูรณ์แต่ผลที่ได้คุ้มค่า",
    "ก้อนเมฆก้อนเดียวลอยช้าๆ ผ่านท้องฟ้าสีฟ้าที่แจ่มใส",
    "เธอเปิดหน้าต่างและรู้สึกถึงลมเย็นที่พัดผ่านแก้มมา",
    "หนังสือถูกทิ้งไว้เปิดอยู่บนโต๊ะและหน้ากระดาษพลิ้วไหวตามลม",
    "พวกเขานั่งรอบกองไฟและคุยกันเรื่องที่เกิดขึ้นตลอดทั้งวัน",
  ].join(" "),
};

/* ────────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */

/** Generate 300 words for hard mode from natural sentence pool */
export function getHardWords(lang: string): string[] {
  const base = (HARD_TEXT[lang] ?? HARD_TEXT["en"]).trim().split(/\s+/);
  const arr: string[] = [];
  while (arr.length < 300) arr.push(...base);
  return arr.slice(0, 300);
}

/** Generate 300 random words for normal mode */
export function getRandomWords(lang: string): string[] {
  const src = SAMPLE_WORDS[lang] ?? SAMPLE_WORDS["en"];
  return Array.from({ length: 300 }, () => src[Math.floor(Math.random() * src.length)]);
}

/** Generate words based on difficulty — main entry point */
export function generateWordList(lang: string, difficulty: string): string[] {
  return difficulty === "hard" ? getHardWords(lang) : getRandomWords(lang);
}