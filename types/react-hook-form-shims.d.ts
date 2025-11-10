// Temporary shim: allow FieldError to be used as ReactNode in UI code
// This avoids many small errors where react-hook-form's FieldError is directly rendered
declare module 'react-hook-form' {
  import * as React from 'react'
  export type FieldError = React.ReactNode & { message?: string }
}
