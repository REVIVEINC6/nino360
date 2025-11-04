// Temporary augmentation to expose common react-hook-form exports used by the UI components
declare module 'react-hook-form' {
  export function useForm<T = any>(opts?: any): any
  export function Controller(props: any): any
  export const FormProvider: any
  export function useFormContext<T = any>(): any
  export function useFormState<T = any>(): any
  export type ControllerProps = any
  export type FieldPath<T> = any
  export type FieldValues = any
}
