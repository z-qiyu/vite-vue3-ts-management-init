export type TableInputProps = {
  modelValue: Record<string, Record<string, string>>
  cols: {
    label: string
  }[]
  readonly?: boolean
}

export type TableInputEmits = {
  (e: 'update:modelValue', val: Record<string, Record<string, string>>): void
}
