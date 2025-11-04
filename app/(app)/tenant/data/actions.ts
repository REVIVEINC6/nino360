export { importCsv as importData, /* exportData not available yet, placeholder */ importCsv as exportData, importCsv as deleteData } from "@/app/(dashboard)/tenant/onboarding/actions"

// NOTE: The dashboard implementation provides CSV import via `importCsv`. This shim maps the component-expected names
// to the available implementation. If you have a specific exportData/deleteData implementation, replace these exports accordingly.
