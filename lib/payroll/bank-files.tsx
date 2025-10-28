"use server"

import { logger } from "@/lib/logger"

/**
 * Bank File Generation Service
 * Generates ACH, SEPA, WIRE, and CSV files for payroll processing
 */

export type BankFileFormat = "ACH" | "SEPA" | "WIRE" | "CSV"

interface Payment {
  id: string
  employeeId: string
  employeeName: string
  amount: number
  currency: string
  accountNumber: string
  routingNumber: string
  bankName: string
  iban?: string
  swiftCode?: string
  reference: string
  effectiveDate: string
}

interface BankFileResult {
  content: string
  filename: string
  format: BankFileFormat
  recordCount: number
  totalAmount: number
}

/**
 * Generate bank file based on format
 */
export async function generateBankFile(
  format: BankFileFormat,
  payments: Payment[],
  metadata?: Record<string, any>,
): Promise<BankFileResult> {
  try {
    let content: string
    let filename: string

    switch (format) {
      case "ACH":
        content = generateACHFile(payments, metadata)
        filename = `ACH_${new Date().toISOString().split("T")[0]}.txt`
        break
      case "SEPA":
        content = generateSEPAFile(payments, metadata)
        filename = `SEPA_${new Date().toISOString().split("T")[0]}.xml`
        break
      case "WIRE":
        content = generateWireFile(payments, metadata)
        filename = `WIRE_${new Date().toISOString().split("T")[0]}.txt`
        break
      case "CSV":
        content = generateCSVFile(payments)
        filename = `PAYROLL_${new Date().toISOString().split("T")[0]}.csv`
        break
      default:
        throw new Error(`Unsupported bank file format: ${format}`)
    }

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)

    logger.info(`Generated ${format} bank file`, {
      recordCount: payments.length,
      totalAmount,
      filename,
    })

    return {
      content,
      filename,
      format,
      recordCount: payments.length,
      totalAmount,
    }
  } catch (error) {
    logger.error("Failed to generate bank file", error as Error, { format })
    throw error
  }
}

/**
 * Generate ACH (NACHA) file format
 */
function generateACHFile(payments: Payment[], metadata?: Record<string, any>): string {
  const lines: string[] = []
  const now = new Date()
  const fileCreationDate = now.toISOString().split("T")[0].replace(/-/g, "").slice(2) // YYMMDD
  const fileCreationTime = now.toTimeString().slice(0, 4).replace(":", "") // HHMM

  // File Header Record (Type 1)
  const fileHeader = [
    "1", // Record Type Code
    "01", // Priority Code
    " ".repeat(10), // Immediate Destination (routing number)
    " ".repeat(10), // Immediate Origin (company ID)
    fileCreationDate,
    fileCreationTime,
    "A", // File ID Modifier
    "094", // Record Size
    "10", // Blocking Factor
    "1", // Format Code
    (metadata?.destinationName || "BANK").padEnd(23),
    (metadata?.originName || "COMPANY").padEnd(23),
    " ".repeat(8), // Reference Code
  ].join("")

  lines.push(fileHeader)

  // Batch Header Record (Type 5)
  const batchHeader = [
    "5", // Record Type Code
    "200", // Service Class Code (Mixed Debits and Credits)
    (metadata?.companyName || "COMPANY").padEnd(16),
    " ".repeat(20), // Company Discretionary Data
    (metadata?.companyId || "0000000000").padStart(10, "0"),
    "PPD", // Standard Entry Class Code
    (metadata?.batchDescription || "PAYROLL").padEnd(10),
    fileCreationDate,
    fileCreationDate, // Effective Entry Date
    " ".repeat(3), // Settlement Date
    "1", // Originator Status Code
    (metadata?.originatingDFI || "00000000").padStart(8, "0"),
    "0000001", // Batch Number
  ].join("")

  lines.push(batchHeader)

  // Entry Detail Records (Type 6)
  let entryHash = 0
  const totalDebits = 0
  let totalCredits = 0

  payments.forEach((payment, index) => {
    const routingNumber = payment.routingNumber.padStart(9, "0")
    const accountNumber = payment.accountNumber.padEnd(17)
    const amount = Math.round(payment.amount * 100)
      .toString()
      .padStart(10, "0")

    const entryDetail = [
      "6", // Record Type Code
      "22", // Transaction Code (Checking Credit)
      routingNumber.slice(0, 8), // Receiving DFI Identification
      routingNumber.slice(8, 9), // Check Digit
      accountNumber,
      amount,
      payment.employeeId.padEnd(15),
      payment.employeeName.slice(0, 22).padEnd(22),
      " ".repeat(2), // Discretionary Data
      "0", // Addenda Record Indicator
      (metadata?.traceNumber || "000000000000000").slice(0, 15),
    ].join("")

    lines.push(entryDetail)

    entryHash += Number.parseInt(routingNumber.slice(0, 8))
    totalCredits += amount
  })

  // Batch Control Record (Type 8)
  const batchControl = [
    "8", // Record Type Code
    "200", // Service Class Code
    payments.length
      .toString()
      .padStart(6, "0"), // Entry/Addenda Count
    entryHash
      .toString()
      .slice(-10)
      .padStart(10, "0"), // Entry Hash
    totalDebits
      .toString()
      .padStart(12, "0"), // Total Debit Entry Dollar Amount
    totalCredits
      .toString()
      .padStart(12, "0"), // Total Credit Entry Dollar Amount
    (metadata?.companyId || "0000000000").padStart(10, "0"),
    " ".repeat(19), // Message Authentication Code
    " ".repeat(6), // Reserved
    (metadata?.originatingDFI || "00000000").padStart(8, "0"),
    "0000001", // Batch Number
  ].join("")

  lines.push(batchControl)

  // File Control Record (Type 9)
  const fileControl = [
    "9", // Record Type Code
    "000001", // Batch Count
    "000001", // Block Count
    payments.length
      .toString()
      .padStart(8, "0"), // Entry/Addenda Count
    entryHash
      .toString()
      .slice(-10)
      .padStart(10, "0"), // Entry Hash
    totalDebits
      .toString()
      .padStart(12, "0"), // Total Debit Entry Dollar Amount
    totalCredits
      .toString()
      .padStart(12, "0"), // Total Credit Entry Dollar Amount
    " ".repeat(39), // Reserved
  ].join("")

  lines.push(fileControl)

  return lines.join("\n")
}

/**
 * Generate SEPA XML file format
 */
function generateSEPAFile(payments: Payment[], metadata?: Record<string, any>): string {
  const now = new Date().toISOString()
  const msgId = `SEPA-${Date.now()}`
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>${msgId}</MsgId>
      <CreDtTm>${now}</CreDtTm>
      <NbOfTxs>${payments.length}</NbOfTxs>
      <CtrlSum>${totalAmount}</CtrlSum>
      <InitgPty>
        <Nm>${metadata?.companyName || "COMPANY"}</Nm>
      </InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>PMT-${Date.now()}</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <BtchBookg>true</BtchBookg>
      <NbOfTxs>${payments.length}</NbOfTxs>
      <CtrlSum>${totalAmount}</CtrlSum>
      <ReqdExctnDt>${payments[0]?.effectiveDate || now.split("T")[0]}</ReqdExctnDt>
      <Dbtr>
        <Nm>${metadata?.companyName || "COMPANY"}</Nm>
      </Dbtr>
      <DbtrAcct>
        <Id>
          <IBAN>${metadata?.companyIBAN || "DE89370400440532013000"}</IBAN>
        </Id>
      </DbtrAcct>
      <DbtrAgt>
        <FinInstnId>
          <BIC>${metadata?.companyBIC || "COBADEFFXXX"}</BIC>
        </FinInstnId>
      </DbtrAgt>
      ${payments
        .map(
          (payment, index) => `
      <CdtTrfTxInf>
        <PmtId>
          <EndToEndId>${payment.id}</EndToEndId>
        </PmtId>
        <Amt>
          <InstdAmt Ccy="${payment.currency || "EUR"}">${payment.amount.toFixed(2)}</InstdAmt>
        </Amt>
        <CdtrAgt>
          <FinInstnId>
            <BIC>${payment.swiftCode || "COBADEFFXXX"}</BIC>
          </FinInstnId>
        </CdtrAgt>
        <Cdtr>
          <Nm>${payment.employeeName}</Nm>
        </Cdtr>
        <CdtrAcct>
          <Id>
            <IBAN>${payment.iban || payment.accountNumber}</IBAN>
          </Id>
        </CdtrAcct>
        <RmtInf>
          <Ustrd>${payment.reference}</Ustrd>
        </RmtInf>
      </CdtTrfTxInf>`,
        )
        .join("")}
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`

  return xml
}

/**
 * Generate Wire Transfer file format
 */
function generateWireFile(payments: Payment[], metadata?: Record<string, any>): string {
  const lines: string[] = []

  // Header
  lines.push(`WIRE TRANSFER FILE - ${new Date().toISOString()}`)
  lines.push(`COMPANY: ${metadata?.companyName || "COMPANY"}`)
  lines.push(`TOTAL PAYMENTS: ${payments.length}`)
  lines.push(`TOTAL AMOUNT: ${payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}`)
  lines.push("")

  // Payment details
  payments.forEach((payment, index) => {
    lines.push(`PAYMENT ${index + 1}`)
    lines.push(`  Beneficiary: ${payment.employeeName}`)
    lines.push(`  Account: ${payment.accountNumber}`)
    lines.push(`  Bank: ${payment.bankName}`)
    lines.push(`  Routing/SWIFT: ${payment.swiftCode || payment.routingNumber}`)
    lines.push(`  Amount: ${payment.amount.toFixed(2)} ${payment.currency}`)
    lines.push(`  Reference: ${payment.reference}`)
    lines.push(`  Effective Date: ${payment.effectiveDate}`)
    lines.push("")
  })

  return lines.join("\n")
}

/**
 * Generate CSV file format
 */
function generateCSVFile(payments: Payment[]): string {
  const headers = [
    "Employee ID",
    "Employee Name",
    "Amount",
    "Currency",
    "Account Number",
    "Routing Number",
    "Bank Name",
    "IBAN",
    "SWIFT Code",
    "Reference",
    "Effective Date",
  ]

  const rows = payments.map((payment) => [
    payment.employeeId,
    payment.employeeName,
    payment.amount.toFixed(2),
    payment.currency,
    payment.accountNumber,
    payment.routingNumber,
    payment.bankName,
    payment.iban || "",
    payment.swiftCode || "",
    payment.reference,
    payment.effectiveDate,
  ])

  const csvLines = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))]

  return csvLines.join("\n")
}

/**
 * Encrypt sensitive bank account data
 */
export async function encryptBankData(data: string): Promise<string> {
  // Use Web Crypto API for encryption
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.ENCRYPTION_KEY || "default-key-change-me"),
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  )

  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, dataBuffer)

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(encrypted), iv.length)

  // Convert to base64
  return Buffer.from(combined).toString("base64")
}

/**
 * Decrypt sensitive bank account data
 */
export async function decryptBankData(encryptedData: string): Promise<string> {
  const encoder = new TextEncoder()
  const combined = Buffer.from(encryptedData, "base64")

  const iv = combined.slice(0, 12)
  const encrypted = combined.slice(12)

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.ENCRYPTION_KEY || "default-key-change-me"),
    { name: "AES-GCM" },
    false,
    ["decrypt"],
  )

  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted)

  const decoder = new TextDecoder()
  return decoder.decode(decrypted)
}
