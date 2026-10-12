// Generated from the dev repo (nuaav/Mars-demo): Database/ POs and OCR output JSON.
// Regenerate rather than hand-edit; scenario details live in scenario.ts.

import type { PurchaseOrder, OcrInvoice } from "./types"

export const purchaseOrders: PurchaseOrder[] = [
  {
    "id": "po_30011_northstar",
    "vendor": "Northstar Office Supplies",
    "vendorAddress": "12, Market Street, Seattle, WA, 98101",
    "date": "2026-08-20",
    "poNumber": "PO-30011",
    "subtotal": 3167.0,
    "tax": 261.28,
    "discount": null,
    "total": 3428.28,
    "lines": [
      {
        "description": "USB-C docking station, 12-port",
        "quantity": 3.0,
        "unit": "ea",
        "unitPrice": 189.0,
        "lineTotal": 567.0
      },
      {
        "description": "27-inch QHD business monitor",
        "quantity": 4.0,
        "unit": "ea",
        "unitPrice": 309.0,
        "lineTotal": 1236.0
      },
      {
        "description": "Noise-cancelling office headset",
        "quantity": 5.0,
        "unit": "ea",
        "unitPrice": 116.0,
        "lineTotal": 580.0
      },
      {
        "description": "Adjustable aluminium laptop stand",
        "quantity": 6.0,
        "unit": "ea",
        "unitPrice": 54.0,
        "lineTotal": 324.0
      },
      {
        "description": "Full-HD conference webcam",
        "quantity": 5.0,
        "unit": "ea",
        "unitPrice": 92.0,
        "lineTotal": 460.0
      }
    ],
    "notes": "Match for NS-TEST-3001 (CU-003 upload). Three lines agree. Two deliberately do not: the monitor was agreed at 309.00 and billed at 329.00 (price variance, 80.00), and 5 webcams were ordered against 7 billed (quantity variance, 184.00). Total variance 264.00 on the subtotal."
  },
  {
    "id": "po_30020_northstar_cu003",
    "vendor": "Northstar Office Supplies",
    "vendorAddress": "12 Market Street, Seattle, WA 98101",
    "date": "2026-09-02",
    "poNumber": "PO-30020",
    "subtotal": 5605.5,
    "tax": 462.45,
    "discount": null,
    "total": 6067.95,
    "lines": [
      {
        "description": "Full-HD conference webcam",
        "quantity": 7.0,
        "unit": "ea",
        "unitPrice": 92.0,
        "lineTotal": 644.0
      },
      {
        "description": "Secure document shredder",
        "quantity": 8.0,
        "unit": "ea",
        "unitPrice": 250.0,
        "lineTotal": 2000.0
      },
      {
        "description": "A4 recycled copier paper, case",
        "quantity": 9.0,
        "unit": "ea",
        "unitPrice": 41.5,
        "lineTotal": 373.5
      },
      {
        "description": "Black toner cartridge, high yield",
        "quantity": 10.0,
        "unit": "ea",
        "unitPrice": 137.0,
        "lineTotal": 1370.0
      },
      {
        "description": "Mesh-back task chair",
        "quantity": 2.0,
        "unit": "ea",
        "unitPrice": 288.0,
        "lineTotal": 576.0
      },
      {
        "description": "Mobile pedestal, three drawer",
        "quantity": 3.0,
        "unit": "ea",
        "unitPrice": 214.0,
        "lineTotal": 642.0
      }
    ],
    "notes": "Close suggestion for NS-TEST-3002 (invoice PO-30029). PO-30020 is one digit off. Same lines with small unit-price deltas on shredder (250 vs 248) and chair (288 vs 286)."
  },
  {
    "id": "po_30028_northstar_cu003",
    "vendor": "Northstar Office Supplies",
    "vendorAddress": "12, Market Street, Seattle, WA, 98101",
    "date": "2026-09-01",
    "poNumber": "PO-30028",
    "subtotal": 5493.5,
    "tax": 453.21,
    "discount": null,
    "total": 5946.71,
    "lines": [
      {
        "description": "Full-HD conference webcam",
        "quantity": 6.0,
        "unit": "ea",
        "unitPrice": 92.0,
        "lineTotal": 552.0
      },
      {
        "description": "Secure document shredder",
        "quantity": 8.0,
        "unit": "ea",
        "unitPrice": 248.0,
        "lineTotal": 1984.0
      },
      {
        "description": "A4 recycled copier paper, case",
        "quantity": 9.0,
        "unit": "ea",
        "unitPrice": 41.5,
        "lineTotal": 373.5
      },
      {
        "description": "Black toner cartridge, high yield",
        "quantity": 10.0,
        "unit": "ea",
        "unitPrice": 137.0,
        "lineTotal": 1370.0
      },
      {
        "description": "Mesh-back task chair",
        "quantity": 2.0,
        "unit": "ea",
        "unitPrice": 286.0,
        "lineTotal": 572.0
      },
      {
        "description": "Mobile pedestal, three drawer",
        "quantity": 3.0,
        "unit": "ea",
        "unitPrice": 214.0,
        "lineTotal": 642.0
      }
    ],
    "notes": "Close suggestion for NS-TEST-3002 (invoice PO-30029). PO-30028 is one digit off. Lines nearly match the invoice except webcam qty 6 vs billed 7."
  },
  {
    "id": "po_30229_northstar_cu003",
    "vendor": "Northstar Office Supplies",
    "vendorAddress": "12, Market Street, Seattle, WA, 98101",
    "date": "2026-09-03",
    "poNumber": "PO-30229",
    "subtotal": 5551.5,
    "tax": 458.0,
    "discount": null,
    "total": 6009.5,
    "lines": [
      {
        "description": "Full-HD conference webcam",
        "quantity": 7.0,
        "unit": "ea",
        "unitPrice": 92.0,
        "lineTotal": 644.0
      },
      {
        "description": "Secure document shredder",
        "quantity": 8.0,
        "unit": "ea",
        "unitPrice": 248.0,
        "lineTotal": 1984.0
      },
      {
        "description": "A4 recycled copier paper, case",
        "quantity": 10.0,
        "unit": "ea",
        "unitPrice": 41.5,
        "lineTotal": 415.0
      },
      {
        "description": "Black toner cartridge, high yield",
        "quantity": 9.0,
        "unit": "ea",
        "unitPrice": 137.0,
        "lineTotal": 1233.0
      },
      {
        "description": "Mesh-back task chair",
        "quantity": 2.0,
        "unit": "ea",
        "unitPrice": 286.0,
        "lineTotal": 572.0
      },
      {
        "description": "Mobile pedestal, three drawer",
        "quantity": 3.0,
        "unit": "ea",
        "unitPrice": 214.0,
        "lineTotal": 642.0
      }
    ],
    "notes": "Close suggestion for NS-TEST-3002 (invoice PO-30029). PO-30229 is one character off. Paper qty 10 vs 9 and toner qty 9 vs 10 \u2014 swapped near-miss."
  },
  {
    "id": "po_33902_voss_tanner",
    "vendor": "Voss & Tanner GmbH",
    "vendorAddress": "14, Lindenstra\u00dfe, Berlin, 10969, Germany",
    "date": "2026-03-20",
    "poNumber": "33902",
    "subtotal": 2242.5,
    "tax": 408.5,
    "discount": null,
    "total": 2657.48,
    "lines": [
      {
        "description": "Konsultationsdienstleistung (Consulting)",
        "quantity": 10.0,
        "unit": "Std.",
        "unitPrice": 95.0,
        "lineTotal": 950.0
      },
      {
        "description": "Software-Lizenz (Software license)",
        "quantity": 1.0,
        "unit": null,
        "unitPrice": 1200.0,
        "lineTotal": 1200.0
      },
      {
        "description": "Fachliteratur (Reference books)",
        "quantity": 5.0,
        "unit": null,
        "unitPrice": 18.5,
        "lineTotal": 92.5
      }
    ],
    "notes": "Intended best match for invoice_07. Same vendor; PO 33902 is a digit transposition of OCR 33920."
  },
  {
    "id": "po_33928_voss_and_tanner",
    "vendor": "Voss and Tanner GmbH",
    "vendorAddress": "14, Lindenstrasse, Berlin, 10969, Germany",
    "date": "2026-03-18",
    "poNumber": "33928",
    "subtotal": 2192.5,
    "tax": 0.0,
    "discount": null,
    "total": 2192.5,
    "lines": [
      {
        "description": "Konsultationsdienstleistung (Consulting)",
        "quantity": 10.0,
        "unit": "Std.",
        "unitPrice": 95.0,
        "lineTotal": 950.0
      },
      {
        "description": "Software-Lizenz (Software license)",
        "quantity": 1.0,
        "unit": null,
        "unitPrice": 1150.0,
        "lineTotal": 1150.0
      },
      {
        "description": "Fachliteratur (Reference books)",
        "quantity": 5.0,
        "unit": null,
        "unitPrice": 18.5,
        "lineTotal": 92.5
      }
    ],
    "notes": "Near miss for invoice_07. Vendor name spelled 'and' instead of '&'; PO 33928 is one digit off."
  },
  {
    "id": "po_34019_tanner_voss",
    "vendor": "Tanner & Voss GmbH",
    "vendorAddress": "22, Friedrichstrasse, Hamburg, 20095, Germany",
    "date": "2026-02-04",
    "poNumber": "34019",
    "subtotal": 1960.0,
    "tax": 372.4,
    "discount": null,
    "total": 2332.4,
    "lines": [
      {
        "description": "Konsultationsdienstleistung (Consulting)",
        "quantity": 8.0,
        "unit": "Std.",
        "unitPrice": 95.0,
        "lineTotal": 760.0
      },
      {
        "description": "Software-Lizenz (Software license)",
        "quantity": 1.0,
        "unit": null,
        "unitPrice": 1200.0,
        "lineTotal": 1200.0
      }
    ],
    "notes": "Weaker near miss for invoice_07. Vendor name reversed; different PO and city; overlapping but not identical lines."
  },
  {
    "id": "po_40141_northstar_cu003",
    "vendor": "Northstar Office Supplies",
    "vendorAddress": "12, Market Street, Seattle, WA, 98101",
    "date": "2026-09-05",
    "poNumber": "40141",
    "subtotal": 2458.5,
    "tax": 202.83,
    "discount": null,
    "total": 2661.33,
    "lines": [
      {
        "description": "Mobile pedestal, three drawer",
        "quantity": 3.0,
        "unit": "ea",
        "unitPrice": 214.0,
        "lineTotal": 642.0
      },
      {
        "description": "Height-adjustable desk converter",
        "quantity": 4.0,
        "unit": "ea",
        "unitPrice": 318.0,
        "lineTotal": 1272.0
      },
      {
        "description": "Surge-protected power strip",
        "quantity": 5.0,
        "unit": "ea",
        "unitPrice": 28.5,
        "lineTotal": 142.5
      },
      {
        "description": "Encrypted USB drive, 128 GB",
        "quantity": 6.0,
        "unit": "ea",
        "unitPrice": 67.0,
        "lineTotal": 402.0
      }
    ],
    "notes": "Search-match target for NS-TEST-3003 (invoice shows PO-30037). Number 40141 is far from PO-30037 so it does not appear in header suggestions; use PO search to find and Start match."
  },
  {
    "id": "po_44100_solstice_alpha",
    "vendor": "Solstice Industrial Supply",
    "vendorAddress": "4820 Foundry Row, Suite 200, Columbus, OH 43215",
    "date": "2026-01-05",
    "poNumber": "PO-44100",
    "subtotal": 24090.0,
    "tax": 1806.75,
    "discount": null,
    "total": 25896.75,
    "lines": [
      {
        "description": "Steel mesh panel, 2400x1200mm",
        "quantity": 100.0,
        "unit": "ea",
        "unitPrice": 127.5,
        "lineTotal": 12750.0
      },
      {
        "description": "Structural angle iron, 50x50x6mm",
        "quantity": 60.0,
        "unit": "ea",
        "unitPrice": 189.0,
        "lineTotal": 11340.0
      }
    ],
    "notes": "Alpha (standing) PO. Line quantities are ordered totals drawn down by invoices INV-100731, INV-100892 and INV-101044. Prices are fixed for the term. value_cap is net of tax.",
    "standing": {
      "valueCap": 30000.0,
      "validFrom": "2026-01-01",
      "validTo": "2026-12-31"
    }
  },
  {
    "id": "po_55104_northstar",
    "vendor": "Northstar Office Supplies",
    "vendorAddress": "12, Market Street, Seattle, WA, 98101",
    "date": "2026-08-28",
    "poNumber": "PO-55104",
    "subtotal": 12219.5,
    "tax": 1008.11,
    "discount": null,
    "total": 13227.61,
    "lines": [
      {
        "description": "27-inch QHD business monitor",
        "quantity": 4.0,
        "unit": "ea",
        "unitPrice": 329.0,
        "lineTotal": 1316.0
      },
      {
        "description": "Noise-cancelling office headset",
        "quantity": 5.0,
        "unit": "ea",
        "unitPrice": 116.0,
        "lineTotal": 580.0
      },
      {
        "description": "Adjustable aluminium laptop stand",
        "quantity": 6.0,
        "unit": "ea",
        "unitPrice": 54.0,
        "lineTotal": 324.0
      },
      {
        "description": "Full-HD conference webcam",
        "quantity": 7.0,
        "unit": "ea",
        "unitPrice": 92.0,
        "lineTotal": 644.0
      },
      {
        "description": "Secure document shredder",
        "quantity": 8.0,
        "unit": "ea",
        "unitPrice": 232.0,
        "lineTotal": 1856.0
      },
      {
        "description": "A4 recycled copier paper, case",
        "quantity": 9.0,
        "unit": "case",
        "unitPrice": 41.5,
        "lineTotal": 373.5
      },
      {
        "description": "Black toner cartridge, high yield",
        "quantity": 2.0,
        "unit": "ea",
        "unitPrice": 137.0,
        "lineTotal": 274.0
      },
      {
        "description": "Mesh-back task chair",
        "quantity": 3.0,
        "unit": "ea",
        "unitPrice": 298.0,
        "lineTotal": 894.0
      },
      {
        "description": "Mobile pedestal, three drawer",
        "quantity": 4.0,
        "unit": "ea",
        "unitPrice": 214.0,
        "lineTotal": 856.0
      },
      {
        "description": "Height-adjustable desk converter",
        "quantity": 7.0,
        "unit": "ea",
        "unitPrice": 318.0,
        "lineTotal": 2226.0
      },
      {
        "description": "Surge-protected power strip",
        "quantity": 6.0,
        "unit": "ea",
        "unitPrice": 28.5,
        "lineTotal": 171.0
      },
      {
        "description": "Encrypted USB drive, 128 GB",
        "quantity": 7.0,
        "unit": "ea",
        "unitPrice": 67.0,
        "lineTotal": 469.0
      },
      {
        "description": "Thermal shipping-label roll",
        "quantity": 8.0,
        "unit": "roll",
        "unitPrice": 36.0,
        "lineTotal": 288.0
      },
      {
        "description": "Inventory barcode scanner",
        "quantity": 8.0,
        "unit": "ea",
        "unitPrice": 154.0,
        "lineTotal": 1232.0
      },
      {
        "description": "Whiteboard starter kit",
        "quantity": 2.0,
        "unit": "kit",
        "unitPrice": 63.0,
        "lineTotal": 126.0
      },
      {
        "description": "Visitor badge supplies, carton",
        "quantity": 3.0,
        "unit": "carton",
        "unitPrice": 74.0,
        "lineTotal": 222.0
      },
      {
        "description": "Desktop cable-management tray",
        "quantity": 4.0,
        "unit": "ea",
        "unitPrice": 32.0,
        "lineTotal": 128.0
      },
      {
        "description": "Executive notebook, pack of 12",
        "quantity": 5.0,
        "unit": "pack",
        "unitPrice": 48.0,
        "lineTotal": 240.0
      }
    ],
    "notes": "Match for NS-TEST-5001 (CU-005 upload). Fourteen of eighteen lines agree. Four do not, one of each kind: the shredder was agreed at 232.00 and billed at 248.00 (over on price, +128.00); eight barcode scanners were ordered against ten billed (over on quantity, +308.00); seven desk converters were ordered against five billed (short delivery, -636.00); and the task chair was agreed at 298.00 but billed at 286.00 (under on price, -36.00). The invoice therefore bills 236.00 LESS than the PO ordered, while still over-billing two lines - a total-only check would pass it."
  },
  {
    "id": "invoice_01_baseline_clean",
    "vendor": "Solstice Industrial Supply",
    "vendorAddress": "4820, Foundry Row, Columbus, OH, 43215",
    "date": "2026-06-12",
    "poNumber": "PO-55321",
    "subtotal": 1237.5,
    "tax": 90.84,
    "discount": 26.31,
    "total": 1302.03,
    "lines": [
      {
        "description": "Steel brackets, 20mm",
        "quantity": 150.0,
        "unit": null,
        "unitPrice": 4.25,
        "lineTotal": 637.5
      },
      {
        "description": "Hex bolts M8 (box of 100)",
        "quantity": 10.0,
        "unit": null,
        "unitPrice": 18.9,
        "lineTotal": 189.0
      },
      {
        "description": "Industrial gasket set",
        "quantity": 40.0,
        "unit": null,
        "unitPrice": 9.15,
        "lineTotal": 366.0
      },
      {
        "description": "Freight surcharge",
        "quantity": 1.0,
        "unit": null,
        "unitPrice": 45.0,
        "lineTotal": 45.0
      }
    ],
    "notes": "Hardcoded expected PO line values for OCR comparison"
  },
  {
    "id": "invoice_03_multipage_split_totals",
    "vendor": "Cascade Materials Co.",
    "vendorAddress": "700, Riverside Pkwy, Portland, OR, 97201",
    "date": "2026-05-18",
    "poNumber": "PO-90071",
    "subtotal": 12910.07,
    "tax": 0.0,
    "discount": null,
    "total": 12910.07,
    "lines": [
      {
        "description": "Aluminum sheet 4x8 Grade 5052",
        "quantity": 10.0,
        "unit": null,
        "unitPrice": 5.04,
        "lineTotal": 50.4
      },
      {
        "description": "Steel rebar #4 (20ft)",
        "quantity": 15.0,
        "unit": null,
        "unitPrice": 18.56,
        "lineTotal": 278.4
      },
      {
        "description": "Plywood, marine grade 3/4in",
        "quantity": 10.0,
        "unit": null,
        "unitPrice": 48.79,
        "lineTotal": 487.9
      },
      {
        "description": "PVC conduit 2in (10ft)",
        "quantity": 40.0,
        "unit": null,
        "unitPrice": 8.85,
        "lineTotal": 354.0
      },
      {
        "description": "Copper wire THHN 10AWG (ft)",
        "quantity": 25.0,
        "unit": null,
        "unitPrice": 5.45,
        "lineTotal": 136.25
      },
      {
        "description": "Concrete mix, 80lb bag",
        "quantity": 8.0,
        "unit": null,
        "unitPrice": 16.95,
        "lineTotal": 135.6
      },
      {
        "description": "Galvanized pipe 1.5in (10ft)",
        "quantity": 40.0,
        "unit": null,
        "unitPrice": 40.52,
        "lineTotal": 1620.8
      },
      {
        "description": "Insulation batt R-13 (roll)",
        "quantity": 40.0,
        "unit": null,
        "unitPrice": 15.73,
        "lineTotal": 629.2
      },
      {
        "description": "Drywall sheet 4x8 5/8in",
        "quantity": 40.0,
        "unit": null,
        "unitPrice": 29.3,
        "lineTotal": 1172.0
      },
      {
        "description": "Roofing felt 15lb (roll)",
        "quantity": 30.0,
        "unit": null,
        "unitPrice": 39.74,
        "lineTotal": 1192.2
      },
      {
        "description": "Structural angle iron 2x2",
        "quantity": 5.0,
        "unit": null,
        "unitPrice": 50.17,
        "lineTotal": 250.85
      },
      {
        "description": "Rubber gasket sheet 1/8in",
        "quantity": 10.0,
        "unit": null,
        "unitPrice": 46.44,
        "lineTotal": 464.4
      },
      {
        "description": "Threaded rod 1/2in (6ft)",
        "quantity": 20.0,
        "unit": null,
        "unitPrice": 20.59,
        "lineTotal": 411.8
      },
      {
        "description": "Weld wire ER70S-6 (spool)",
        "quantity": 12.0,
        "unit": null,
        "unitPrice": 62.37,
        "lineTotal": 748.44
      },
      {
        "description": "Sheet metal screws (box 250)",
        "quantity": 20.0,
        "unit": null,
        "unitPrice": 9.79,
        "lineTotal": 195.8
      },
      {
        "description": "Fiberglass mesh tape (roll)",
        "quantity": 25.0,
        "unit": null,
        "unitPrice": 9.45,
        "lineTotal": 236.25
      },
      {
        "description": "Expansion joint filler",
        "quantity": 20.0,
        "unit": null,
        "unitPrice": 40.63,
        "lineTotal": 812.6
      },
      {
        "description": "Anchor bolts 3/4x8in (box 20)",
        "quantity": 5.0,
        "unit": null,
        "unitPrice": 48.38,
        "lineTotal": 241.9
      },
      {
        "description": "Vapor barrier 6mil (roll)",
        "quantity": 40.0,
        "unit": null,
        "unitPrice": 11.18,
        "lineTotal": 447.2
      },
      {
        "description": "Cedar plank 1x6x8",
        "quantity": 25.0,
        "unit": null,
        "unitPrice": 8.35,
        "lineTotal": 208.75
      },
      {
        "description": "Grating panel, steel 2x3ft",
        "quantity": 15.0,
        "unit": null,
        "unitPrice": 54.51,
        "lineTotal": 817.65
      },
      {
        "description": "Silicone sealant (tube)",
        "quantity": 50.0,
        "unit": null,
        "unitPrice": 12.5,
        "lineTotal": 625.0
      },
      {
        "description": "Deck screws 3in (box 350)",
        "quantity": 20.0,
        "unit": null,
        "unitPrice": 39.01,
        "lineTotal": 780.2
      },
      {
        "description": "Safety mesh fencing (roll)",
        "quantity": 12.0,
        "unit": null,
        "unitPrice": 51.04,
        "lineTotal": 612.48
      }
    ],
    "notes": "Hardcoded expected PO line values for OCR comparison"
  }
]

export const ocrInvoices: OcrInvoice[] = [
  {
    "id": "ns-3001",
    "vendor": "Northstar Office Supplies",
    "vendorAddress": "12, Market Street, Seattle, WA, 98101",
    "date": "2026-09-05",
    "poNumber": "PO-30011",
    "subtotal": 3431.0,
    "tax": 283.06,
    "discount": null,
    "total": 3714.06,
    "lines": [
      {
        "description": "USB-C docking station, 12-port",
        "quantity": 3.0,
        "unit": null,
        "unitPrice": 189.0,
        "lineTotal": 567.0
      },
      {
        "description": "27-inch QHD business monitor",
        "quantity": 4.0,
        "unit": null,
        "unitPrice": 329.0,
        "lineTotal": 1316.0
      },
      {
        "description": "Noise-cancelling office headset",
        "quantity": 5.0,
        "unit": null,
        "unitPrice": 116.0,
        "lineTotal": 580.0
      },
      {
        "description": "Adjustable aluminium laptop stand",
        "quantity": 6.0,
        "unit": null,
        "unitPrice": 54.0,
        "lineTotal": 324.0
      },
      {
        "description": "Full-HD conference webcam",
        "quantity": 7.0,
        "unit": null,
        "unitPrice": 92.0,
        "lineTotal": 644.0
      }
    ],
    "invoiceNumber": "NS-TEST-3001",
    "sourceFile": "CU-003_four_single_page_invoices.pdf",
    "sourcePages": "1-1",
    "confidence": {
      "vendor_name": 0.8,
      "vendor_address": 0.914,
      "invoice_number": 0.969,
      "invoice_date": 0.938,
      "po_number": 0.965,
      "subtotal": 0.976,
      "tax_amount": 0.975,
      "total_amount": 0.975
    }
  },
  {
    "id": "ns-3002",
    "vendor": "Northstar Office Supplies",
    "vendorAddress": "12, Market Street, Seattle, WA, 98101",
    "date": "2026-09-07",
    "poNumber": "PO-30029",
    "subtotal": 5585.5,
    "tax": 460.8,
    "discount": null,
    "total": 6046.3,
    "lines": [
      {
        "description": "Full-HD conference webcam",
        "quantity": 7.0,
        "unit": null,
        "unitPrice": 92.0,
        "lineTotal": 644.0
      },
      {
        "description": "Secure document shredder",
        "quantity": 8.0,
        "unit": null,
        "unitPrice": 248.0,
        "lineTotal": 1984.0
      },
      {
        "description": "A4 recycled copier paper, case",
        "quantity": 9.0,
        "unit": null,
        "unitPrice": 41.5,
        "lineTotal": 373.5
      },
      {
        "description": "Black toner cartridge, high yield",
        "quantity": 10.0,
        "unit": null,
        "unitPrice": 137.0,
        "lineTotal": 1370.0
      },
      {
        "description": "Mesh-back task chair",
        "quantity": 2.0,
        "unit": null,
        "unitPrice": 286.0,
        "lineTotal": 572.0
      },
      {
        "description": "Mobile pedestal, three drawer",
        "quantity": 3.0,
        "unit": null,
        "unitPrice": 214.0,
        "lineTotal": 642.0
      }
    ],
    "invoiceNumber": "NS-TEST-3002",
    "sourceFile": "CU-003_four_single_page_invoices.pdf",
    "sourcePages": "2-2",
    "confidence": {
      "vendor_name": 0.792,
      "vendor_address": 0.916,
      "invoice_number": 0.97,
      "invoice_date": 0.939,
      "po_number": 0.979,
      "subtotal": 0.982,
      "tax_amount": 0.982,
      "total_amount": 0.982
    }
  },
  {
    "id": "ns-3003",
    "vendor": "Northstar Office Supplies",
    "vendorAddress": "12, Market Street, Seattle, WA, 98101",
    "date": "2026-09-10",
    "poNumber": "PO-30037",
    "subtotal": 2458.5,
    "tax": 202.83,
    "discount": null,
    "total": 2661.33,
    "lines": [
      {
        "description": "Mobile pedestal, three drawer",
        "quantity": 3.0,
        "unit": null,
        "unitPrice": 214.0,
        "lineTotal": 642.0
      },
      {
        "description": "Height-adjustable desk converter",
        "quantity": 4.0,
        "unit": null,
        "unitPrice": 318.0,
        "lineTotal": 1272.0
      },
      {
        "description": "Surge-protected power strip",
        "quantity": 5.0,
        "unit": null,
        "unitPrice": 28.5,
        "lineTotal": 142.5
      },
      {
        "description": "Encrypted USB drive, 128 GB",
        "quantity": 6.0,
        "unit": null,
        "unitPrice": 67.0,
        "lineTotal": 402.0
      }
    ],
    "invoiceNumber": "NS-TEST-3003",
    "sourceFile": "CU-003_four_single_page_invoices.pdf",
    "sourcePages": "3-3",
    "confidence": {
      "vendor_name": 0.911,
      "vendor_address": 0.915,
      "invoice_number": 0.957,
      "invoice_date": 0.938,
      "po_number": 0.968,
      "subtotal": 0.973,
      "tax_amount": 0.971,
      "total_amount": 0.971
    }
  },
  {
    "id": "ns-3004",
    "vendor": "Northstar Office Supplies",
    "vendorAddress": "12, Market Street, Seattle, WA, 98101",
    "date": "2026-09-12",
    "poNumber": "PO-30048",
    "subtotal": 2855.0,
    "tax": 235.54,
    "discount": null,
    "total": 3090.54,
    "lines": [
      {
        "description": "Thermal shipping-label roll",
        "quantity": 7.0,
        "unit": null,
        "unitPrice": 36.0,
        "lineTotal": 252.0
      },
      {
        "description": "Inventory barcode scanner",
        "quantity": 8.0,
        "unit": null,
        "unitPrice": 154.0,
        "lineTotal": 1232.0
      },
      {
        "description": "Whiteboard starter kit",
        "quantity": 9.0,
        "unit": null,
        "unitPrice": 63.0,
        "lineTotal": 567.0
      },
      {
        "description": "Visitor badge supplies, carton",
        "quantity": 10.0,
        "unit": null,
        "unitPrice": 74.0,
        "lineTotal": 740.0
      },
      {
        "description": "Desktop cable-management tray",
        "quantity": 2.0,
        "unit": null,
        "unitPrice": 32.0,
        "lineTotal": 64.0
      }
    ],
    "invoiceNumber": "NS-TEST-3004",
    "sourceFile": "CU-003_four_single_page_invoices.pdf",
    "sourcePages": "4-4",
    "confidence": {
      "vendor_name": 0.793,
      "vendor_address": 0.913,
      "invoice_number": 0.969,
      "invoice_date": 0.938,
      "po_number": 0.969,
      "subtotal": 0.977,
      "tax_amount": 0.976,
      "total_amount": 0.975
    }
  },
  {
    "id": "vt-0745",
    "vendor": "Voss & Tanner GmbH",
    "vendorAddress": "14, Lindenstra\u00dfe, Berlin, 10969, Germany",
    "date": "2026-04-15",
    "poNumber": "33920",
    "subtotal": 2242.5,
    "tax": 408.5,
    "discount": null,
    "total": 2657.48,
    "lines": [
      {
        "description": "Konsultationsdienstleistung (Consulting)",
        "quantity": 10.0,
        "unit": "Std.",
        "unitPrice": 95.0,
        "lineTotal": 950.0
      },
      {
        "description": "Software-Lizenz (Software license)",
        "quantity": 1.0,
        "unit": null,
        "unitPrice": 1200.0,
        "lineTotal": 1200.0
      },
      {
        "description": "Fachliteratur (Reference books)",
        "quantity": 5.0,
        "unit": null,
        "unitPrice": 18.5,
        "lineTotal": 92.5
      }
    ],
    "invoiceNumber": "VT-2026-0745",
    "sourceFile": "invoice_07_international_vat_multirate.pdf",
    "sourcePages": null,
    "confidence": {
      "vendor_name": 0.918,
      "vendor_address": 0.915,
      "invoice_number": 0.984,
      "invoice_date": 0.984,
      "po_number": 0.785,
      "subtotal": 0.916,
      "tax_amount": 0.352,
      "total_amount": 0.49
    }
  },
  {
    "id": "ns-5001",
    "vendor": "Northstar Office Supplies",
    "vendorAddress": "12, Market Street, Seattle, WA, 98101",
    "date": "2026-09-14",
    "poNumber": "PO-55104",
    "subtotal": 11983.5,
    "tax": 988.64,
    "discount": null,
    "total": 12972.14,
    "lines": [
      {
        "description": "27-inch QHD business monitor",
        "quantity": 4.0,
        "unit": null,
        "unitPrice": 329.0,
        "lineTotal": 1316.0
      },
      {
        "description": "Noise-cancelling office headset",
        "quantity": 5.0,
        "unit": null,
        "unitPrice": 116.0,
        "lineTotal": 580.0
      },
      {
        "description": "Adjustable aluminium laptop stand",
        "quantity": 6.0,
        "unit": null,
        "unitPrice": 54.0,
        "lineTotal": 324.0
      },
      {
        "description": "Full-HD conference webcam",
        "quantity": 7.0,
        "unit": null,
        "unitPrice": 92.0,
        "lineTotal": 644.0
      },
      {
        "description": "Secure document shredder",
        "quantity": 8.0,
        "unit": null,
        "unitPrice": 248.0,
        "lineTotal": 1984.0
      },
      {
        "description": "A4 recycled copier paper, case",
        "quantity": 9.0,
        "unit": null,
        "unitPrice": 41.5,
        "lineTotal": 373.5
      },
      {
        "description": "Black toner cartridge, high yield",
        "quantity": 2.0,
        "unit": null,
        "unitPrice": 137.0,
        "lineTotal": 274.0
      },
      {
        "description": "Mesh-back task chair",
        "quantity": 3.0,
        "unit": null,
        "unitPrice": 286.0,
        "lineTotal": 858.0
      },
      {
        "description": "Mobile pedestal, three drawer",
        "quantity": 4.0,
        "unit": null,
        "unitPrice": 214.0,
        "lineTotal": 856.0
      },
      {
        "description": "Height-adjustable desk converter",
        "quantity": 5.0,
        "unit": null,
        "unitPrice": 318.0,
        "lineTotal": 1590.0
      },
      {
        "description": "Surge-protected power strip",
        "quantity": 6.0,
        "unit": null,
        "unitPrice": 28.5,
        "lineTotal": 171.0
      },
      {
        "description": "Encrypted USB drive, 128 GB",
        "quantity": 7.0,
        "unit": null,
        "unitPrice": 67.0,
        "lineTotal": 469.0
      },
      {
        "description": "Thermal shipping-label roll",
        "quantity": 8.0,
        "unit": null,
        "unitPrice": 36.0,
        "lineTotal": 288.0
      },
      {
        "description": "Inventory barcode scanner",
        "quantity": 10.0,
        "unit": null,
        "unitPrice": 154.0,
        "lineTotal": 1540.0
      },
      {
        "description": "Whiteboard starter kit",
        "quantity": 2.0,
        "unit": null,
        "unitPrice": 63.0,
        "lineTotal": 126.0
      },
      {
        "description": "Visitor badge supplies, carton",
        "quantity": 3.0,
        "unit": null,
        "unitPrice": 74.0,
        "lineTotal": 222.0
      },
      {
        "description": "Desktop cable-management tray",
        "quantity": 4.0,
        "unit": null,
        "unitPrice": 32.0,
        "lineTotal": 128.0
      },
      {
        "description": "Executive notebook, pack of 12",
        "quantity": 5.0,
        "unit": null,
        "unitPrice": 48.0,
        "lineTotal": 240.0
      }
    ],
    "invoiceNumber": "NS-TEST-5001",
    "sourceFile": "CU-005_noninvoice_sandwich.pdf",
    "sourcePages": "3-5",
    "confidence": {
      "vendor_name": 0.915,
      "vendor_address": 0.917,
      "invoice_number": 0.969,
      "invoice_date": 0.937,
      "po_number": 0.975,
      "subtotal": 0.976,
      "tax_amount": 0.973,
      "total_amount": 0.975
    }
  },
  {
    "id": "sol-100482",
    "vendor": "Solstice Industrial Supply",
    "vendorAddress": "4820, Foundry Row, Columbus, OH, 43215",
    "date": "2026-06-12",
    "poNumber": "PO-55321",
    "subtotal": 1315.3,
    "tax": 96.67,
    "discount": 26.31,
    "total": 1385.66,
    "lines": [
      {
        "description": "Steel brackets, 20mm",
        "quantity": 150.0,
        "unit": null,
        "unitPrice": 4.25,
        "lineTotal": 637.5
      },
      {
        "description": "Hex bolts M8 (box of 100)",
        "quantity": 12.0,
        "unit": null,
        "unitPrice": 18.9,
        "lineTotal": 226.8
      },
      {
        "description": "Industrial gasket set",
        "quantity": 40.0,
        "unit": null,
        "unitPrice": 9.15,
        "lineTotal": 366.0
      },
      {
        "description": "Freight surcharge",
        "quantity": 1.0,
        "unit": null,
        "unitPrice": 85.0,
        "lineTotal": 85.0
      }
    ],
    "invoiceNumber": "INV-100482",
    "sourceFile": "sample_single_page_invoice.pdf",
    "sourcePages": "1-1",
    "confidence": {
      "vendor_name": 0.94,
      "vendor_address": 0.891,
      "invoice_number": 0.986,
      "invoice_date": 0.986,
      "po_number": 0.985,
      "subtotal": 0.985,
      "tax_amount": 0.984,
      "discount_amount": 0.414,
      "total_amount": 0.65
    }
  },
  {
    "id": "cmc-88213",
    "vendor": "Cascade Materials Co.",
    "vendorAddress": "700, Riverside Pkwy, Portland, OR, 97201",
    "date": "2026-05-18",
    "poNumber": "PO-90071",
    "subtotal": 12910.07,
    "tax": 0.0,
    "discount": null,
    "total": 12910.07,
    "lines": [
      {
        "description": "Aluminum sheet 4x8 Grade 5052",
        "quantity": 10.0,
        "unit": null,
        "unitPrice": 5.04,
        "lineTotal": 50.4
      },
      {
        "description": "Steel rebar #4 (20ft)",
        "quantity": 15.0,
        "unit": null,
        "unitPrice": 18.56,
        "lineTotal": 278.4
      },
      {
        "description": "Plywood, marine grade 3/4in",
        "quantity": 10.0,
        "unit": null,
        "unitPrice": 48.79,
        "lineTotal": 487.9
      },
      {
        "description": "PVC conduit 2in (10ft)",
        "quantity": 40.0,
        "unit": null,
        "unitPrice": 8.85,
        "lineTotal": 354.0
      },
      {
        "description": "Copper wire THHN 10AWG (ft)",
        "quantity": 25.0,
        "unit": null,
        "unitPrice": 5.45,
        "lineTotal": 136.25
      },
      {
        "description": "Concrete mix, 80lb bag",
        "quantity": 8.0,
        "unit": null,
        "unitPrice": 16.95,
        "lineTotal": 135.6
      },
      {
        "description": "Galvanized pipe 1.5in (10ft)",
        "quantity": 40.0,
        "unit": null,
        "unitPrice": 40.52,
        "lineTotal": 1620.8
      },
      {
        "description": "Insulation batt R-13 (roll)",
        "quantity": 40.0,
        "unit": null,
        "unitPrice": 15.73,
        "lineTotal": 629.2
      },
      {
        "description": "Drywall sheet 4x8 5/8in",
        "quantity": 40.0,
        "unit": null,
        "unitPrice": 29.3,
        "lineTotal": 1172.0
      },
      {
        "description": "Roofing felt 15lb (roll)",
        "quantity": 30.0,
        "unit": null,
        "unitPrice": 39.74,
        "lineTotal": 1192.2
      },
      {
        "description": "Structural angle iron 2x2",
        "quantity": 5.0,
        "unit": null,
        "unitPrice": 50.17,
        "lineTotal": 250.85
      },
      {
        "description": "Rubber gasket sheet 1/8in",
        "quantity": 10.0,
        "unit": null,
        "unitPrice": 46.44,
        "lineTotal": 464.4
      },
      {
        "description": "Threaded rod 1/2in (6ft)",
        "quantity": 20.0,
        "unit": null,
        "unitPrice": 20.59,
        "lineTotal": 411.8
      },
      {
        "description": "Weld wire ER70S-6 (spool)",
        "quantity": 12.0,
        "unit": null,
        "unitPrice": 62.37,
        "lineTotal": 748.44
      },
      {
        "description": "Sheet metal screws (box 250)",
        "quantity": 20.0,
        "unit": null,
        "unitPrice": 9.79,
        "lineTotal": 195.8
      },
      {
        "description": "Fiberglass mesh tape (roll)",
        "quantity": 25.0,
        "unit": null,
        "unitPrice": 9.45,
        "lineTotal": 236.25
      },
      {
        "description": "Expansion joint filler",
        "quantity": 20.0,
        "unit": null,
        "unitPrice": 40.63,
        "lineTotal": 812.6
      },
      {
        "description": "Anchor bolts 3/4x8in (box 20)",
        "quantity": 5.0,
        "unit": null,
        "unitPrice": 48.38,
        "lineTotal": 241.9
      },
      {
        "description": "Vapor barrier 6mil (roll)",
        "quantity": 40.0,
        "unit": null,
        "unitPrice": 11.18,
        "lineTotal": 447.2
      },
      {
        "description": "Cedar plank 1x6x8",
        "quantity": 25.0,
        "unit": null,
        "unitPrice": 8.35,
        "lineTotal": 208.75
      },
      {
        "description": "Grating panel, steel 2x3ft",
        "quantity": 15.0,
        "unit": null,
        "unitPrice": 54.51,
        "lineTotal": 817.65
      },
      {
        "description": "Silicone sealant (tube)",
        "quantity": 50.0,
        "unit": null,
        "unitPrice": 12.5,
        "lineTotal": 625.0
      },
      {
        "description": "Deck screws 3in (box 350)",
        "quantity": 20.0,
        "unit": null,
        "unitPrice": 39.01,
        "lineTotal": 780.2
      },
      {
        "description": "Safety mesh fencing (roll)",
        "quantity": 12.0,
        "unit": null,
        "unitPrice": 51.04,
        "lineTotal": 612.48
      }
    ],
    "invoiceNumber": "CMC-88213",
    "sourceFile": "invoice_03_multipage_split_totals.pdf",
    "sourcePages": null,
    "confidence": {}
  },
  {
    "id": "sol-100731",
    "vendor": "Solstice Industrial Supply",
    "vendorAddress": "4820, Foundry Row, Columbus, OH, 43215",
    "date": "2026-04-17",
    "poNumber": "PO-44100",
    "subtotal": 6967.5,
    "tax": 522.56,
    "discount": null,
    "total": 7490.06,
    "lines": [
      {
        "description": "Steel mesh panel, 2400x1200mm",
        "quantity": 25.0,
        "unit": null,
        "unitPrice": 127.5,
        "lineTotal": 3187.5
      },
      {
        "description": "Structural angle iron, 50x50x6mm",
        "quantity": 60.0,
        "unit": null,
        "unitPrice": 189.0,
        "lineTotal": 11340.0
      }
    ],
    "invoiceNumber": "INV-100731",
    "sourceFile": "invoice_11_alpha_release_1.pdf",
    "sourcePages": null,
    "confidence": {
      "vendor_name": 0.94,
      "vendor_address": 0.892,
      "invoice_number": 0.982,
      "invoice_date": 0.982,
      "po_number": 0.982,
      "subtotal": 0.982,
      "tax_amount": 0.982,
      "total_amount": 0.496
    }
  },
  {
    "id": "sol-100892",
    "vendor": "Solstice Industrial Supply",
    "vendorAddress": "4820, Foundry Row, Columbus, OH, 43215",
    "date": "2026-05-29",
    "poNumber": "PO-44100",
    "subtotal": 6375.0,
    "tax": 478.13,
    "discount": null,
    "total": 6853.13,
    "lines": [
      {
        "description": "Steel mesh panel, 2400x1200mm",
        "quantity": 50.0,
        "unit": null,
        "unitPrice": 127.5,
        "lineTotal": 6375.0
      }
    ],
    "invoiceNumber": "INV-100892",
    "sourceFile": "invoice_12_alpha_release_2.pdf",
    "sourcePages": null,
    "confidence": {
      "vendor_name": 0.939,
      "vendor_address": 0.892,
      "invoice_number": 0.988,
      "invoice_date": 0.988,
      "po_number": 0.987,
      "subtotal": 0.988,
      "tax_amount": 0.987,
      "total_amount": 0.46
    }
  },
  {
    "id": "sol-101044",
    "vendor": "Solstice Industrial Supply",
    "vendorAddress": "4820, Foundry Row, Columbus, OH, 43215",
    "date": "2026-07-08",
    "poNumber": "PO-44100",
    "subtotal": 6022.5,
    "tax": 451.69,
    "discount": null,
    "total": 6474.19,
    "lines": [
      {
        "description": "Steel mesh panel, 2400x1200mm",
        "quantity": 25.0,
        "unit": null,
        "unitPrice": 127.5,
        "lineTotal": 3187.5
      },
      {
        "description": "Structural angle iron, 50x50x6mm",
        "quantity": 15.0,
        "unit": null,
        "unitPrice": 189.0,
        "lineTotal": 2835.0
      }
    ],
    "invoiceNumber": "INV-101044",
    "sourceFile": "invoice_13_alpha_release_3.pdf",
    "sourcePages": null,
    "confidence": {
      "vendor_name": 0.939,
      "vendor_address": 0.892,
      "invoice_number": 0.984,
      "invoice_date": 0.984,
      "po_number": 0.984,
      "subtotal": 0.984,
      "tax_amount": 0.983,
      "total_amount": 0.502
    }
  },
  {
    "id": "ns-4001",
    "vendor": "Northstar Office Supplies",
    "vendorAddress": "12, Market Street, Seattle, WA, 98101",
    "date": "2026-09-02",
    "poNumber": "PO-41001",
    "subtotal": 2945.0,
    "tax": 242.96,
    "discount": null,
    "total": 3187.96,
    "lines": [
      {
        "description": "Ergonomic wireless keyboard",
        "quantity": 2.0,
        "unit": null,
        "unitPrice": 79.0,
        "lineTotal": 158.0
      },
      {
        "description": "USB-C docking station, 12-port",
        "quantity": 3.0,
        "unit": null,
        "unitPrice": 189.0,
        "lineTotal": 567.0
      },
      {
        "description": "27-inch QHD business monitor",
        "quantity": 4.0,
        "unit": null,
        "unitPrice": 329.0,
        "lineTotal": 1316.0
      },
      {
        "description": "Noise-cancelling office headset",
        "quantity": 5.0,
        "unit": null,
        "unitPrice": 116.0,
        "lineTotal": 580.0
      },
      {
        "description": "Adjustable aluminium laptop stand",
        "quantity": 6.0,
        "unit": null,
        "unitPrice": 54.0,
        "lineTotal": 324.0
      }
    ],
    "invoiceNumber": "NS-TEST-4001",
    "sourceFile": "CU-004_all_invoices_mixed_lengths.pdf",
    "sourcePages": "1-1",
    "confidence": {
      "vendor_name": 0.803,
      "vendor_address": 0.917,
      "invoice_number": 0.975,
      "invoice_date": 0.94,
      "po_number": 0.972,
      "subtotal": 0.981,
      "tax_amount": 0.978,
      "total_amount": 0.977
    }
  },
  {
    "id": "ns-4002",
    "vendor": "Northstar Office Supplies",
    "vendorAddress": "12, Market Street, Seattle, WA, 98101",
    "date": "2026-09-06",
    "poNumber": "PO-41022",
    "subtotal": 12083.5,
    "tax": 996.89,
    "discount": null,
    "total": 13080.39,
    "lines": [
      {
        "description": "Noise-cancelling office headset",
        "quantity": 5.0,
        "unit": null,
        "unitPrice": 116.0,
        "lineTotal": 580.0
      },
      {
        "description": "Adjustable aluminium laptop stand",
        "quantity": 6.0,
        "unit": null,
        "unitPrice": 54.0,
        "lineTotal": 324.0
      },
      {
        "description": "Full-HD conference webcam",
        "quantity": 7.0,
        "unit": null,
        "unitPrice": 92.0,
        "lineTotal": 644.0
      },
      {
        "description": "Secure document shredder",
        "quantity": 8.0,
        "unit": null,
        "unitPrice": 248.0,
        "lineTotal": 1984.0
      },
      {
        "description": "A4 recycled copier paper, case",
        "quantity": 9.0,
        "unit": null,
        "unitPrice": 41.5,
        "lineTotal": 373.5
      },
      {
        "description": "Black toner cartridge, high yield",
        "quantity": 10.0,
        "unit": null,
        "unitPrice": 137.0,
        "lineTotal": 1370.0
      },
      {
        "description": "Mesh-back task chair",
        "quantity": 3.0,
        "unit": null,
        "unitPrice": 286.0,
        "lineTotal": 858.0
      },
      {
        "description": "Mobile pedestal, three drawer",
        "quantity": 4.0,
        "unit": null,
        "unitPrice": 214.0,
        "lineTotal": 856.0
      },
      {
        "description": "Height-adjustable desk converter",
        "quantity": 5.0,
        "unit": null,
        "unitPrice": 318.0,
        "lineTotal": 1590.0
      },
      {
        "description": "Surge-protected power strip",
        "quantity": 6.0,
        "unit": null,
        "unitPrice": 28.5,
        "lineTotal": 171.0
      },
      {
        "description": "Encrypted USB drive, 128 GB",
        "quantity": 7.0,
        "unit": null,
        "unitPrice": 67.0,
        "lineTotal": 469.0
      },
      {
        "description": "Thermal shipping-label roll",
        "quantity": 8.0,
        "unit": null,
        "unitPrice": 36.0,
        "lineTotal": 288.0
      },
      {
        "description": "Inventory barcode scanner",
        "quantity": 9.0,
        "unit": null,
        "unitPrice": 154.0,
        "lineTotal": 1386.0
      },
      {
        "description": "Whiteboard starter kit",
        "quantity": 2.0,
        "unit": null,
        "unitPrice": 63.0,
        "lineTotal": 126.0
      },
      {
        "description": "Visitor badge supplies, carton",
        "quantity": 3.0,
        "unit": null,
        "unitPrice": 74.0,
        "lineTotal": 222.0
      },
      {
        "description": "Desktop cable-management tray",
        "quantity": 4.0,
        "unit": null,
        "unitPrice": 32.0,
        "lineTotal": 128.0
      },
      {
        "description": "Executive notebook, pack of 12",
        "quantity": 5.0,
        "unit": null,
        "unitPrice": 48.0,
        "lineTotal": 240.0
      },
      {
        "description": "Ergonomic wireless keyboard",
        "quantity": 6.0,
        "unit": null,
        "unitPrice": 79.0,
        "lineTotal": 474.0
      }
    ],
    "invoiceNumber": "NS-TEST-4002",
    "sourceFile": "CU-004_all_invoices_mixed_lengths.pdf",
    "sourcePages": "2-4",
    "confidence": {
      "vendor_name": 0.917,
      "vendor_address": 0.917,
      "invoice_number": 0.969,
      "invoice_date": 0.939,
      "po_number": 0.971,
      "subtotal": 0.975,
      "tax_amount": 0.97,
      "total_amount": 0.973
    }
  },
  {
    "id": "ns-4003",
    "vendor": "Northstar Office Supplies",
    "vendorAddress": "12, Market Street, Seattle, WA, 98101",
    "date": "2026-09-11",
    "poNumber": "PO-41039",
    "subtotal": 5975.5,
    "tax": 492.98,
    "discount": null,
    "total": 6468.48,
    "lines": [
      {
        "description": "Mesh-back task chair",
        "quantity": 2.0,
        "unit": null,
        "unitPrice": 286.0,
        "lineTotal": 572.0
      },
      {
        "description": "Mobile pedestal, three drawer",
        "quantity": 3.0,
        "unit": null,
        "unitPrice": 214.0,
        "lineTotal": 642.0
      },
      {
        "description": "Height-adjustable desk converter",
        "quantity": 4.0,
        "unit": null,
        "unitPrice": 318.0,
        "lineTotal": 1272.0
      },
      {
        "description": "Surge-protected power strip",
        "quantity": 5.0,
        "unit": null,
        "unitPrice": 28.5,
        "lineTotal": 142.5
      },
      {
        "description": "Encrypted USB drive, 128 GB",
        "quantity": 6.0,
        "unit": null,
        "unitPrice": 67.0,
        "lineTotal": 402.0
      },
      {
        "description": "Thermal shipping-label roll",
        "quantity": 7.0,
        "unit": null,
        "unitPrice": 36.0,
        "lineTotal": 252.0
      },
      {
        "description": "Inventory barcode scanner",
        "quantity": 8.0,
        "unit": null,
        "unitPrice": 154.0,
        "lineTotal": 1232.0
      },
      {
        "description": "Whiteboard starter kit",
        "quantity": 10.0,
        "unit": null,
        "unitPrice": 63.0,
        "lineTotal": 630.0
      },
      {
        "description": "Visitor badge supplies, carton",
        "quantity": 2.0,
        "unit": null,
        "unitPrice": 74.0,
        "lineTotal": 148.0
      },
      {
        "description": "Desktop cable-management tray",
        "quantity": 3.0,
        "unit": null,
        "unitPrice": 32.0,
        "lineTotal": 96.0
      },
      {
        "description": "Executive notebook, pack of 12",
        "quantity": 4.0,
        "unit": null,
        "unitPrice": 48.0,
        "lineTotal": 192.0
      },
      {
        "description": "Ergonomic wireless keyboard",
        "quantity": 5.0,
        "unit": null,
        "unitPrice": 79.0,
        "lineTotal": 395.0
      }
    ],
    "invoiceNumber": "NS-TEST-4003",
    "sourceFile": "CU-004_all_invoices_mixed_lengths.pdf",
    "sourcePages": "5-6",
    "confidence": {
      "vendor_name": 0.519,
      "vendor_address": 0.903,
      "invoice_number": 0.974,
      "invoice_date": 0.939,
      "po_number": 0.975,
      "subtotal": 0.976,
      "tax_amount": 0.975,
      "total_amount": 0.975
    }
  },
  {
    "id": "ns-4004",
    "vendor": "Northstar Office Supplies",
    "vendorAddress": "12, Market Street, Seattle, WA, 98101",
    "date": "2026-09-16",
    "poNumber": "PO-41044",
    "subtotal": 2999.0,
    "tax": 247.42,
    "discount": null,
    "total": 3246.42,
    "lines": [
      {
        "description": "Thermal shipping-label roll",
        "quantity": 7.0,
        "unit": null,
        "unitPrice": 36.0,
        "lineTotal": 252.0
      },
      {
        "description": "Inventory barcode scanner",
        "quantity": 8.0,
        "unit": null,
        "unitPrice": 154.0,
        "lineTotal": 1232.0
      },
      {
        "description": "Whiteboard starter kit",
        "quantity": 9.0,
        "unit": null,
        "unitPrice": 63.0,
        "lineTotal": 567.0
      },
      {
        "description": "Visitor badge supplies, carton",
        "quantity": 10.0,
        "unit": null,
        "unitPrice": 74.0,
        "lineTotal": 740.0
      },
      {
        "description": "Desktop cable-management tray",
        "quantity": 2.0,
        "unit": null,
        "unitPrice": 32.0,
        "lineTotal": 64.0
      },
      {
        "description": "Executive notebook, pack of 12",
        "quantity": 3.0,
        "unit": null,
        "unitPrice": 48.0,
        "lineTotal": 144.0
      }
    ],
    "invoiceNumber": "NS-TEST-4004",
    "sourceFile": "CU-004_all_invoices_mixed_lengths.pdf",
    "sourcePages": "7-7",
    "confidence": {
      "vendor_name": 0.809,
      "vendor_address": 0.909,
      "invoice_number": 0.969,
      "invoice_date": 0.938,
      "po_number": 0.975,
      "subtotal": 0.977,
      "tax_amount": 0.975,
      "total_amount": 0.976
    }
  }
]
