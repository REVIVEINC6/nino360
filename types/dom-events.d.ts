// Centralized DOM event type aliases used across the project to reduce
// repetitive implicit-any errors in JSX event handlers.
import * as React from 'react'

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>
export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>
export type TextAreaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>
export type KeyboardEventInput = React.KeyboardEvent<HTMLInputElement>
export type MouseEventEl<T extends HTMLElement = HTMLElement> = React.MouseEvent<T>

// Re-export React types for quick inline imports in components that prefer them
export { React }
