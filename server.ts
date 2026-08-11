import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 PDF / image uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Route: Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // API Route: Parse PDF or Excel Document via Gemini AI
  app.post('/api/parse-document', async (req, res) => {
    try {
      let { files, pdfTexts, fileBase64, mimeType, fileName } = req.body;

      if (!files && fileBase64) {
        files = [{ fileBase64, mimeType, fileName }];
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured on the server.'
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const promptText = `
คุณคือผู้เชี่ยวชาญด้านการวิเคราะห์เอกสารรายงานการล้างไส้กรองเมมเบรน RO (Reverse Osmosis Membrane Cleaning Service Report)
โปรดอ่านเอกสาร PDF / รูปภาพ / รายงานบริการลูกค้าที่ผู้ใช้อัปโหลดทั้งหมด (รวมถึงข้อความที่สกัดจาก PDF หากมี)
สกัดและประมวลผลข้อมูลร่วมกันทั้งหมดออกมาเป็นโครงสร้าง JSON ต่อไปนี้อย่างละเอียดและถูกต้อง 100%:

ข้อกำหนดสำคัญ:
1. companyName: ชื่อบริษัทลูกค้า เช่น "Lion Corporation (Thailand) Limited"
2. roName: ชื่อระบบ RO หรือ Ref. JOB เช่น "RO2", "RO4 Pass 1" หรือ "RO2 (12 ท่อน)"
3. membranes: รายการข้อมูลของไส้กรองเมมเบรนทุกท่อนที่อยู่ในเอกสาร (เช่น 1 ถึง 12 ท่อน หรือ 1 ถึง 30 ท่อน)
   แต่ละท่อนให้สกัดข้อมูลดังนี้:
   - membraneNo: ลำดับที่ท่อน เช่น 1, 2, 3 ... (ตัวเลข integer เรียงลำดับจาก Quantity 1 of N ถึง N of N)
   - serialNumber: หมายเลข Serial Number เช่น "T2652026", "T2652009", "J1389356", "J1389357" หากระบุ "No Serial" ให้ระบุ "No Serial"
   - brandModel: ยี่ห้อ/รุ่น เช่น "Filmtec / BW30X FR-400 34i" หรือ "Filmtec / BW30 PRO-400"
   - status: ผลลัพธ์ "PASS" หรือ "REMARK" (หากมีหมายเหตุเตือน เช่น รอยแตกร้าว รอยชำรุด Rejection ต่ำ หรือมี Remark ให้เป็น "REMARK" มิฉะนั้นเป็น "PASS")
   - note: หมายเหตุ เช่น "Membrane ที่ทำ Remark ไว้ ตรวจสอบพบว่ามีรอยแตกร้าวบริเวณหัว" หรือ "ผ่านการตรวจสอบตามรายงาน"
   - location: { vessel: เลข Vessel เช่น 1, 2, 3, position: ตำแหน่งใน Vessel เช่น 1, 2, 3, 4 } (หากมีผังจัดเรียงในเอกสาร ให้ดึงเลข vessel และ position มาใส่)
   - cycles: อาร์เรย์ของรอบการทดสอบย้อนหลังทั้งหมด (สำคัญมาก!! สกัดให้ครบทุกวันที่/ทุกรอบ เช่น สกัดครบทั้ง 3 วันคือ "11 February 2026", "11 May 2026", "4 August 2026")
     แต่ละรอบประกอบด้วย:
     - date: วันที่ เช่น "11 February 2026", "11 May 2026", "4 August 2026"
     - before: { inletPressure, concentratePressure, inletFlow, concentrateFlow, recovery, permeateConductivity, rawWaterConductivity, rejection }
     - after: { inletPressure, concentratePressure, inletFlow, concentrateFlow, recovery, permeateConductivity, rawWaterConductivity, rejection }

${pdfTexts && pdfTexts.length > 0 ? `\n--- ข้อความสกัดจากเอกสาร PDF ---\n${pdfTexts.join('\n\n')}\n` : ''}
โปรดส่งคืนเฉพาะ JSON ตาม Schema เท่านั้น
`;

      const contents: any[] = [];

      // Include base64 inlineData if provided
      if (files && Array.isArray(files) && files.length > 0) {
        for (const f of files) {
          if (f.fileBase64) {
            contents.push({
              inlineData: {
                mimeType: f.mimeType || 'application/pdf',
                data: f.fileBase64.replace(/^data:[^;]+;base64,/, '')
              }
            });
          }
        }
      }

      contents.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              companyName: { type: Type.STRING },
              roName: { type: Type.STRING },
              membranes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    membraneNo: { type: Type.INTEGER },
                    serialNumber: { type: Type.STRING },
                    brandModel: { type: Type.STRING },
                    status: { type: Type.STRING },
                    note: { type: Type.STRING },
                    location: {
                      type: Type.OBJECT,
                      properties: {
                        vessel: { type: Type.INTEGER },
                        position: { type: Type.INTEGER }
                      }
                    },
                    cycles: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          date: { type: Type.STRING },
                          before: {
                            type: Type.OBJECT,
                            properties: {
                              inletPressure: { type: Type.NUMBER },
                              concentratePressure: { type: Type.NUMBER },
                              inletFlow: { type: Type.NUMBER },
                              concentrateFlow: { type: Type.NUMBER },
                              recovery: { type: Type.NUMBER },
                              permeateConductivity: { type: Type.NUMBER },
                              rawWaterConductivity: { type: Type.NUMBER },
                              rejection: { type: Type.NUMBER }
                            }
                          },
                          after: {
                            type: Type.OBJECT,
                            properties: {
                              inletPressure: { type: Type.NUMBER },
                              concentratePressure: { type: Type.NUMBER },
                              inletFlow: { type: Type.NUMBER },
                              concentrateFlow: { type: Type.NUMBER },
                              recovery: { type: Type.NUMBER },
                              permeateConductivity: { type: Type.NUMBER },
                              rawWaterConductivity: { type: Type.NUMBER },
                              rejection: { type: Type.NUMBER }
                            }
                          }
                        }
                      }
                    }
                  },
                  required: ['membraneNo', 'serialNumber']
                }
              }
            },
            required: ['companyName', 'roName', 'membranes']
          }
        }
      });

      const jsonText = response.text || '{}';
      const parsedData = JSON.parse(jsonText);
      res.json({ success: true, data: parsedData });
    } catch (err: any) {
      console.error('Error parsing document with Gemini:', err);
      res.status(500).json({
        error: err.message || 'Failed to parse document'
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
