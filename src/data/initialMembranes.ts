import { MembraneData } from '../types';

export const initialMembranes: MembraneData[] = [
  {
    membraneNo: 1,
    serialNumber: "T9992297",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "REMARK",
    note: "พบรอยแตกร้าวบริเวณหัว (ตามหมายเหตุในรายงาน)",
    location: { vessel: 5, position: 5 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 28, rawWaterConductivity: 248, rejection: 88.70967741935483 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 13, rawWaterConductivity: 248, rejection: 94.75806451612904 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 22, rawWaterConductivity: 245, rejection: 91.02040816326532 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 10, rawWaterConductivity: 245, rejection: 95.91836734693877 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 25, rawWaterConductivity: 256, rejection: 90.234375 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 13, rawWaterConductivity: 256, rejection: 94.921875 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-01-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-01/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-01/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-01/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-01/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-01/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-01/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-01/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-01/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-01/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-01/after-5.jpeg"]
    }
  },
  {
    membraneNo: 2,
    serialNumber: "T9992309",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "PASS",
    note: "ผ่านการตรวจสอบตามรายงาน",
    location: { vessel: 2, position: 5 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 26, rawWaterConductivity: 259, rejection: 89.96138996138995 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 17, rawWaterConductivity: 259, rejection: 93.43629343629344 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 19, rawWaterConductivity: 241, rejection: 92.11618257261411 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 11, rawWaterConductivity: 241, rejection: 95.4356846473029 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 155, recovery: 11.428571428571429, permeateConductivity: 31, rawWaterConductivity: 263, rejection: 88.212927756654 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 18, rawWaterConductivity: 263, rejection: 93.15589353612167 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-02-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-02/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-02/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-02/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-02/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-02/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-02/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-02/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-02/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-02/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-02/after-5.jpeg"]
    }
  },
  {
    membraneNo: 3,
    serialNumber: "T9992299",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "PASS",
    note: "ผ่านการตรวจสอบตามรายงาน",
    location: { vessel: 2, position: 3 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 25, rawWaterConductivity: 245, rejection: 89.79591836734694 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 16, rawWaterConductivity: 245, rejection: 93.46938775510203 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 32, rawWaterConductivity: 252, rejection: 87.3015873015873 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 23, rawWaterConductivity: 252, rejection: 90.87301587301587 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 175, concentrateFlow: 155, recovery: 11.428571428571429, permeateConductivity: 52, rawWaterConductivity: 257, rejection: 79.76653696498055 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 25, rawWaterConductivity: 257, rejection: 90.27237354085604 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-03-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-03/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-03/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-03/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-03/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-03/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-03/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-03/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-03/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-03/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-03/after-5.jpeg"]
    }
  },
  {
    membraneNo: 4,
    serialNumber: "T9992250",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "REMARK",
    note: "พบรอยแตกร้าวบริเวณหัว (ตามหมายเหตุในรายงาน)",
    location: { vessel: 4, position: 6 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 18, rawWaterConductivity: 239, rejection: 92.46861924686193 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 7, rawWaterConductivity: 239, rejection: 97.07112970711297 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 23, rawWaterConductivity: 241, rejection: 90.45643153526972 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 10, rawWaterConductivity: 241, rejection: 95.850622406639 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 95, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 15, rawWaterConductivity: 256, rejection: 94.140625 },
        after: { inletPressure: 100, concentratePressure: 95, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 8, rawWaterConductivity: 256, rejection: 96.875 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-04-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-04/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-04/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-04/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-04/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-04/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-04/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-04/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-04/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-04/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-04/after-5.jpeg"]
    }
  },
  {
    membraneNo: 5,
    serialNumber: "T9992244",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "PASS",
    note: "ผ่านการตรวจสอบตามรายงาน",
    location: { vessel: 2, position: 6 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 27, rawWaterConductivity: 246, rejection: 89.02439024390245 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 20, rawWaterConductivity: 246, rejection: 91.869918699187 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 24, rawWaterConductivity: 247, rejection: 90.2834008097166 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 10, rawWaterConductivity: 247, rejection: 95.95141700404858 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 24, rawWaterConductivity: 248, rejection: 90.32258064516128 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 175, concentrateFlow: 140, recovery: 20, permeateConductivity: 11, rawWaterConductivity: 248, rejection: 95.56451612903226 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-05-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-05/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-05/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-05/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-05/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-05/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-05/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-05/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-05/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-05/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-05/after-5.jpeg"]
    }
  },
  {
    membraneNo: 6,
    serialNumber: "T9992241",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "REMARK",
    note: "พบรอยแตกร้าวบริเวณหัว (ตามหมายเหตุในรายงาน)",
    location: { vessel: 5, position: 1 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 26, rawWaterConductivity: 248, rejection: 89.51612903225806 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 17, rawWaterConductivity: 248, rejection: 93.14516129032258 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 20, rawWaterConductivity: 243, rejection: 91.76954732510289 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 10, rawWaterConductivity: 243, rejection: 95.88477366255144 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 155, recovery: 11.428571428571429, permeateConductivity: 12, rawWaterConductivity: 252, rejection: 95.23809523809523 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 7, rawWaterConductivity: 252, rejection: 97.22222222222221 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-06-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-06/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-06/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-06/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-06/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-06/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-06/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-06/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-06/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-06/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-06/after-5.jpeg"]
    }
  },
  {
    membraneNo: 7,
    serialNumber: "T9992257",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "REMARK",
    note: "พบรอยแตกร้าวบริเวณหัว (ตามหมายเหตุในรายงาน)",
    location: { vessel: 3, position: 3 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 24, rawWaterConductivity: 246, rejection: 90.2439024390244 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 10, rawWaterConductivity: 246, rejection: 95.9349593495935 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 24, rawWaterConductivity: 245, rejection: 90.20408163265307 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 12, rawWaterConductivity: 245, rejection: 95.10204081632652 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 95, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 23, rawWaterConductivity: 256, rejection: 91.015625 },
        after: { inletPressure: 100, concentratePressure: 95, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 14, rawWaterConductivity: 256, rejection: 94.53125 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-07-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-07/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-07/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-07/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-07/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-07/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-07/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-07/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-07/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-07/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-07/after-5.jpeg"]
    }
  },
  {
    membraneNo: 8,
    serialNumber: "T9992249",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "REMARK",
    note: "พบรอยแตกร้าวบริเวณหัว (ตามหมายเหตุในรายงาน)",
    location: { vessel: 1, position: 6 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 21, rawWaterConductivity: 248, rejection: 91.53225806451613 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 18, rawWaterConductivity: 248, rejection: 92.74193548387096 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 19, rawWaterConductivity: 241, rejection: 92.11618257261411 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 10, rawWaterConductivity: 241, rejection: 95.850622406639 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 95, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 17, rawWaterConductivity: 263, rejection: 93.5361216730038 },
        after: { inletPressure: 100, concentratePressure: 95, inletFlow: 175, concentrateFlow: 140, recovery: 20, permeateConductivity: 10, rawWaterConductivity: 263, rejection: 96.1977186311787 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-08-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-08/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-08/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-08/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-08/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-08/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-08/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-08/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-08/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-08/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-08/after-5.jpeg"]
    }
  },
  {
    membraneNo: 9,
    serialNumber: "T9992313",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "PASS",
    note: "ผ่านการตรวจสอบตามรายงาน",
    location: { vessel: 5, position: 6 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 27, rawWaterConductivity: 246, rejection: 89.02439024390245 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 17, rawWaterConductivity: 246, rejection: 93.08943089430895 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 20, rawWaterConductivity: 241, rejection: 91.70124481327801 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 9, rawWaterConductivity: 241, rejection: 96.2655601659751 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 25, rawWaterConductivity: 254, rejection: 90.15748031496062 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 11, rawWaterConductivity: 254, rejection: 95.66929133858267 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-09-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-09/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-09/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-09/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-09/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-09/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-09/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-09/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-09/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-09/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-09/after-5.jpeg"]
    }
  },
  {
    membraneNo: 10,
    serialNumber: "T9992302",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "REMARK",
    note: "พบรอยแตกร้าวบริเวณหัว (ตามหมายเหตุในรายงาน)",
    location: { vessel: 2, position: 1 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 26, rawWaterConductivity: 248, rejection: 89.51612903225806 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 19, rawWaterConductivity: 248, rejection: 92.33870967741935 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 21, rawWaterConductivity: 247, rejection: 91.49797570850203 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 13, rawWaterConductivity: 247, rejection: 94.73684210526316 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 26, rawWaterConductivity: 265, rejection: 90.18867924528303 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 11, rawWaterConductivity: 265, rejection: 95.84905660377359 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-10-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-10/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-10/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-10/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-10/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-10/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-10/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-10/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-10/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-10/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-10/after-5.jpeg"]
    }
  },
  {
    membraneNo: 11,
    serialNumber: "T9992242",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "REMARK",
    note: "พบรอยแตกร้าวบริเวณหัว (ตามหมายเหตุในรายงาน)",
    location: { vessel: 1, position: 2 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 29, rawWaterConductivity: 248, rejection: 88.30645161290323 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 17, rawWaterConductivity: 248, rejection: 93.14516129032258 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 36, rawWaterConductivity: 243, rejection: 85.18518518518519 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 14, rawWaterConductivity: 243, rejection: 94.23868312757202 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 25, rawWaterConductivity: 252, rejection: 90.07936507936508 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 21, rawWaterConductivity: 252, rejection: 91.66666666666666 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-11-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-11/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-11/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-11/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-11/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-11/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-11/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-11/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-11/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-11/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-11/after-5.jpeg"]
    }
  },
  {
    membraneNo: 12,
    serialNumber: "T9992238",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "REMARK",
    note: "พบรอยแตกร้าวบริเวณหัว (ตามหมายเหตุในรายงาน)",
    location: { vessel: 2, position: 2 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 25, rawWaterConductivity: 245, rejection: 89.79591836734694 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 19, rawWaterConductivity: 245, rejection: 92.24489795918367 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 24, rawWaterConductivity: 249, rejection: 90.36144578313254 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 10, rawWaterConductivity: 249, rejection: 95.98393574297188 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 155, recovery: 11.428571428571429, permeateConductivity: 26, rawWaterConductivity: 263, rejection: 90.11406844106465 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 19, rawWaterConductivity: 263, rejection: 92.77566539923954 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-12-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-12/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-12/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-12/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-12/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-12/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-12/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-12/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-12/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-12/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-12/after-5.jpeg"]
    }
  },
  {
    membraneNo: 13,
    serialNumber: "T9992301",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "PASS",
    note: "ผ่านการตรวจสอบตามรายงาน",
    location: { vessel: 3, position: 2 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 19, rawWaterConductivity: 246, rejection: 92.27642276422763 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 8, rawWaterConductivity: 246, rejection: 96.7479674796748 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 24, rawWaterConductivity: 256, rejection: 90.625 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 11, rawWaterConductivity: 256, rejection: 95.703125 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 155, recovery: 11.428571428571429, permeateConductivity: 20, rawWaterConductivity: 265, rejection: 92.45283018867924 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 14, rawWaterConductivity: 265, rejection: 94.71698113207547 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-13-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-13/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-13/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-13/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-13/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-13/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-13/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-13/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-13/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-13/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-13/after-5.jpeg"]
    }
  },
  {
    membraneNo: 14,
    serialNumber: "T9992312",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "REMARK",
    note: "พบรอยแตกร้าวบริเวณหัว (ตามหมายเหตุในรายงาน)",
    location: { vessel: 4, position: 1 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 22, rawWaterConductivity: 239, rejection: 90.7949790794979 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 14, rawWaterConductivity: 239, rejection: 94.14225941422593 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 18, rawWaterConductivity: 256, rejection: 92.96875 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 10, rawWaterConductivity: 256, rejection: 96.09375 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 18, rawWaterConductivity: 250, rejection: 92.80000000000001 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 9, rawWaterConductivity: 250, rejection: 96.39999999999999 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-14-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-14/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-14/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-14/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-14/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-14/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-14/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-14/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-14/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-14/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-14/after-5.jpeg"]
    }
  },
  {
    membraneNo: 15,
    serialNumber: "T9992255",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "REMARK",
    note: "พบรอยแตกร้าวบริเวณหัว (ตามหมายเหตุในรายงาน)",
    location: { vessel: 5, position: 4 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 23, rawWaterConductivity: 246, rejection: 90.65040650406505 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 14, rawWaterConductivity: 246, rejection: 94.3089430894309 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 20, rawWaterConductivity: 256, rejection: 92.1875 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 10, rawWaterConductivity: 256, rejection: 96.09375 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 23, rawWaterConductivity: 249, rejection: 90.76305220883533 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 9, rawWaterConductivity: 249, rejection: 96.3855421686747 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-15-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-15/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-15/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-15/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-15/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-15/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-15/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-15/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-15/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-15/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-15/after-5.jpeg"]
    }
  },
  {
    membraneNo: 16,
    serialNumber: "T9992240",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "PASS",
    note: "ผ่านการตรวจสอบตามรายงาน",
    location: { vessel: 4, position: 4 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 27, rawWaterConductivity: 239, rejection: 88.70292887029288 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 19, rawWaterConductivity: 239, rejection: 92.05020920502092 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 24, rawWaterConductivity: 245, rejection: 90.20408163265307 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 9, rawWaterConductivity: 245, rejection: 96.3265306122449 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 19, rawWaterConductivity: 257, rejection: 92.60700389105058 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 7, rawWaterConductivity: 257, rejection: 97.27626459143968 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-16-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-16/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-16/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-16/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-16/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-16/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-16/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-16/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-16/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-16/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-16/after-5.jpeg"]
    }
  },
  {
    membraneNo: 17,
    serialNumber: "T9992247",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "REMARK",
    note: "พบรอยแตกร้าวบริเวณหัว (ตามหมายเหตุในรายงาน)",
    location: { vessel: 1, position: 4 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 175, recovery: 12.5, permeateConductivity: 27, rawWaterConductivity: 232, rejection: 88.36206896551724 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 18, rawWaterConductivity: 232, rejection: 92.24137931034483 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 23, rawWaterConductivity: 241, rejection: 90.45643153526972 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 19, rawWaterConductivity: 241, rejection: 92.11618257261411 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 35, rawWaterConductivity: 260, rejection: 86.53846153846155 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 22, rawWaterConductivity: 260, rejection: 91.53846153846153 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-17-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-17/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-17/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-17/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-17/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-17/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-17/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-17/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-17/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-17/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-17/after-5.jpeg"]
    }
  },
  {
    membraneNo: 18,
    serialNumber: "T9992251",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "REMARK",
    note: "พบรอยแตกร้าวบริเวณหัว (ตามหมายเหตุในรายงาน)",
    location: { vessel: 1, position: 3 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 25, rawWaterConductivity: 231, rejection: 89.17748917748918 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 13, rawWaterConductivity: 231, rejection: 94.37229437229438 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 19, rawWaterConductivity: 247, rejection: 92.3076923076923 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 10, rawWaterConductivity: 247, rejection: 95.95141700404858 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 13, rawWaterConductivity: 248, rejection: 94.75806451612904 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 8, rawWaterConductivity: 248, rejection: 96.7741935483871 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-18-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-18/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-18/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-18/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-18/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-18/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-18/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-18/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-18/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-18/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-18/after-5.jpeg"]
    }
  },
  {
    membraneNo: 19,
    serialNumber: "T9992243",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "PASS",
    note: "ผ่านการตรวจสอบตามรายงาน",
    location: { vessel: 5, position: 3 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 28, rawWaterConductivity: 231, rejection: 87.87878787878788 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 15, rawWaterConductivity: 231, rejection: 93.5064935064935 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 25, rawWaterConductivity: 257, rejection: 90.27237354085604 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 12, rawWaterConductivity: 257, rejection: 95.33073929961088 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 25, rawWaterConductivity: 250, rejection: 90 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 9, rawWaterConductivity: 250, rejection: 96.39999999999999 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-19-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-19/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-19/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-19/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-19/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-19/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-19/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-19/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-19/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-19/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-19/after-5.jpeg"]
    }
  },
  {
    membraneNo: 20,
    serialNumber: "T9992245",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "PASS",
    note: "ผ่านการตรวจสอบตามรายงาน",
    location: { vessel: 2, position: 4 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 24, rawWaterConductivity: 246, rejection: 90.2439024390244 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 15, rawWaterConductivity: 246, rejection: 93.90243902439023 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 36, rawWaterConductivity: 252, rejection: 85.71428571428572 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 19, rawWaterConductivity: 252, rejection: 92.46031746031747 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 43, rawWaterConductivity: 265, rejection: 83.77358490566039 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 140, recovery: 20, permeateConductivity: 26, rawWaterConductivity: 265, rejection: 90.18867924528303 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-20-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-20/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-20/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-20/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-20/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-20/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-20/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-20/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-20/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-20/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-20/after-5.jpeg"]
    }
  },
  {
    membraneNo: 21,
    serialNumber: "T9992303",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "PASS",
    note: "ผ่านการตรวจสอบตามรายงาน",
    location: { vessel: 3, position: 5 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 24, rawWaterConductivity: 259, rejection: 90.73359073359073 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 13, rawWaterConductivity: 259, rejection: 94.98069498069498 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 23, rawWaterConductivity: 254, rejection: 90.94488188976378 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 14, rawWaterConductivity: 254, rejection: 94.48818897637796 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 14, rawWaterConductivity: 252, rejection: 94.44444444444444 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 140, recovery: 20, permeateConductivity: 10, rawWaterConductivity: 252, rejection: 96.03174603174604 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-21-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-21/before-1.jpg", "lion-ro4-pass1-membrane-images/membrane-21/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-21/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-21/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-21/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-21/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-21/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-21/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-21/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-21/after-5.jpeg"]
    }
  },
  {
    membraneNo: 22,
    serialNumber: "T9992246",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "PASS",
    note: "ผ่านการตรวจสอบตามรายงาน",
    location: { vessel: 3, position: 6 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 22, rawWaterConductivity: 245, rejection: 91.02040816326532 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 13, rawWaterConductivity: 245, rejection: 94.6938775510204 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 20, rawWaterConductivity: 241, rejection: 91.70124481327801 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 12, rawWaterConductivity: 241, rejection: 95.0207468879668 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 175, concentrateFlow: 155, recovery: 11.428571428571429, permeateConductivity: 17, rawWaterConductivity: 254, rejection: 93.30708661417323 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 10, rawWaterConductivity: 254, rejection: 96.06299212598425 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-22-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-22/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-22/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-22/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-22/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-22/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-22/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-22/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-22/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-22/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-22/after-5.jpeg"]
    }
  },
  {
    membraneNo: 23,
    serialNumber: "T9992307",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "PASS",
    note: "ผ่านการตรวจสอบตามรายงาน",
    location: { vessel: 4, position: 3 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 24, rawWaterConductivity: 246, rejection: 90.2439024390244 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 13, rawWaterConductivity: 246, rejection: 94.71544715447155 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 18, rawWaterConductivity: 252, rejection: 92.85714285714286 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 10, rawWaterConductivity: 252, rejection: 96.03174603174604 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 19, rawWaterConductivity: 250, rejection: 92.4 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 8, rawWaterConductivity: 250, rejection: 96.8 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-23-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-23/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-23/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-23/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-23/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-23/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-23/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-23/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-23/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-23/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-23/after-5.jpeg"]
    }
  },
  {
    membraneNo: 24,
    serialNumber: "T9992311",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "REMARK",
    note: "พบรอยแตกร้าวบริเวณหัว (ตามหมายเหตุในรายงาน)",
    location: { vessel: 5, position: 2 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 175, recovery: 12.5, permeateConductivity: 33, rawWaterConductivity: 232, rejection: 85.77586206896551 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 17, rawWaterConductivity: 232, rejection: 92.67241379310344 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 20, rawWaterConductivity: 249, rejection: 91.96787148594377 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 9, rawWaterConductivity: 249, rejection: 96.3855421686747 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 24, rawWaterConductivity: 249, rejection: 90.36144578313254 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 140, recovery: 20, permeateConductivity: 12, rawWaterConductivity: 249, rejection: 95.18072289156626 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-24-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-24/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-24/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-24/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-24/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-24/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-24/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-24/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-24/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-24/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-24/after-5.jpeg"]
    }
  },
  {
    membraneNo: 25,
    serialNumber: "T9992248",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "REMARK",
    note: "พบรอยแตกร้าวบริเวณหัว (ตามหมายเหตุในรายงาน)",
    location: { vessel: 4, position: 2 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 27, rawWaterConductivity: 246, rejection: 89.02439024390245 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 15, rawWaterConductivity: 246, rejection: 93.90243902439023 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 24, rawWaterConductivity: 243, rejection: 90.12345679012346 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 11, rawWaterConductivity: 243, rejection: 95.47325102880659 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 155, recovery: 11.428571428571429, permeateConductivity: 20, rawWaterConductivity: 249, rejection: 91.96787148594377 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 12, rawWaterConductivity: 249, rejection: 95.18072289156626 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-25-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-25/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-25/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-25/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-25/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-25/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-25/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-25/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-25/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-25/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-25/after-5.jpeg"]
    }
  },
  {
    membraneNo: 26,
    serialNumber: "T9992314",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "REMARK",
    note: "พบรอยแตกร้าวบริเวณหัว (ตามหมายเหตุในรายงาน)",
    location: { vessel: 1, position: 5 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 19, rawWaterConductivity: 248, rejection: 92.33870967741935 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 10, rawWaterConductivity: 248, rejection: 95.96774193548387 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 25, rawWaterConductivity: 254, rejection: 90.15748031496062 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 12, rawWaterConductivity: 254, rejection: 95.2755905511811 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 21, rawWaterConductivity: 248, rejection: 91.53225806451613 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 140, recovery: 20, permeateConductivity: 12, rawWaterConductivity: 248, rejection: 95.16129032258065 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-26-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-26/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-26/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-26/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-26/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-26/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-26/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-26/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-26/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-26/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-26/after-5.jpeg"]
    }
  },
  {
    membraneNo: 27,
    serialNumber: "T9992305",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "PASS",
    note: "ผ่านการตรวจสอบตามรายงาน",
    location: { vessel: 3, position: 4 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 21, rawWaterConductivity: 231, rejection: 90.9090909090909 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 17, rawWaterConductivity: 231, rejection: 92.64069264069263 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 21, rawWaterConductivity: 257, rejection: 91.82879377431907 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 12, rawWaterConductivity: 257, rejection: 95.33073929961088 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 21, rawWaterConductivity: 260, rejection: 91.92307692307692 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 140, recovery: 20, permeateConductivity: 13, rawWaterConductivity: 260, rejection: 95 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-27-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-27/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-27/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-27/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-27/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-27/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-27/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-27/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-27/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-27/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-27/after-5.jpeg"]
    }
  },
  {
    membraneNo: 28,
    serialNumber: "J4014380",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "PASS",
    note: "ผ่านการตรวจสอบตามรายงาน",
    location: { vessel: 1, position: 1 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 175, recovery: 12.5, permeateConductivity: 29, rawWaterConductivity: 246, rejection: 88.21138211382113 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 21, rawWaterConductivity: 246, rejection: 91.46341463414635 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 18, rawWaterConductivity: 257, rejection: 92.99610894941634 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 14, rawWaterConductivity: 257, rejection: 94.55252918287937 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 155, recovery: 11.428571428571429, permeateConductivity: 28, rawWaterConductivity: 257, rejection: 89.10505836575875 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 21, rawWaterConductivity: 257, rejection: 91.82879377431907 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-28-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-28/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-28/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-28/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-28/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-28/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-28/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-28/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-28/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-28/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-28/after-5.jpeg"]
    }
  },
  {
    membraneNo: 29,
    serialNumber: "T9992252",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "REMARK",
    note: "พบรอยแตกร้าวบริเวณหัว (ตามหมายเหตุในรายงาน)",
    location: { vessel: 3, position: 1 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 20, rawWaterConductivity: 259, rejection: 92.27799227799228 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 15, rawWaterConductivity: 259, rejection: 94.20849420849422 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 24, rawWaterConductivity: 254, rejection: 90.5511811023622 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 11, rawWaterConductivity: 254, rejection: 95.66929133858267 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 17, rawWaterConductivity: 260, rejection: 93.46153846153847 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 12, rawWaterConductivity: 260, rejection: 95.38461538461537 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-29-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-29/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-29/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-29/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-29/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-29/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-29/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-29/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-29/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-29/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-29/after-5.jpeg"]
    }
  },
  {
    membraneNo: 30,
    serialNumber: "T9992308",
    brandModel: "Filmtec / BW30 PRO-400",
    status: "PASS",
    note: "ผ่านการตรวจสอบตามรายงาน",
    location: { vessel: 4, position: 5 },
    cycles: [
      {
        date: "3 December 2025",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 170, recovery: 15, permeateConductivity: 23, rawWaterConductivity: 232, rejection: 90.08620689655173 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 11, rawWaterConductivity: 232, rejection: 95.25862068965517 }
      },
      {
        date: "4 March 2026",
        before: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 165, recovery: 17.5, permeateConductivity: 22, rawWaterConductivity: 249, rejection: 91.16465863453816 },
        after: { inletPressure: 100, concentratePressure: 90, inletFlow: 200, concentrateFlow: 160, recovery: 20, permeateConductivity: 9, rawWaterConductivity: 249, rejection: 96.3855421686747 }
      },
      {
        date: "10 June 2026",
        before: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 150, recovery: 14.285714285714285, permeateConductivity: 25, rawWaterConductivity: 254, rejection: 90.15748031496062 },
        after: { inletPressure: 100, concentratePressure: 100, inletFlow: 175, concentrateFlow: 145, recovery: 17.142857142857142, permeateConductivity: 10, rawWaterConductivity: 254, rejection: 96.06299212598425 }
      }
    ],
    chartImage: "lion-ro4-pass1-chart-images/membrane-30-charts.png",
    images: {
      before: ["lion-ro4-pass1-membrane-images/membrane-30/before-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-30/before-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-30/before-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-30/before-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-30/before-5.jpeg"],
      after: ["lion-ro4-pass1-membrane-images/membrane-30/after-1.jpeg", "lion-ro4-pass1-membrane-images/membrane-30/after-2.jpeg", "lion-ro4-pass1-membrane-images/membrane-30/after-3.jpeg", "lion-ro4-pass1-membrane-images/membrane-30/after-4.jpeg", "lion-ro4-pass1-membrane-images/membrane-30/after-5.jpeg"]
    }
  }
];
