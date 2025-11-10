"use client"

export function ConfirmDialog({ title, description, onConfirm, onCancel }: any) {
  return (
    <div className="p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="mt-2 flex gap-2">
        <button onClick={onConfirm} className="btn btn-primary">Confirm</button>
        <button onClick={onCancel} className="btn">Cancel</button>
      </div>
    </div>
  )
}
