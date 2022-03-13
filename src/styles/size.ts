import type { Color, Size } from 'types'

export interface SizeOptions {
  bgColor?: Color
  min?: boolean
}

export const size = (width: Size, height = width, min?: boolean) => ({
  [min ? 'minWidth' : 'width']: width,
  [min ? 'minHeight' : 'height']: height,
})

export const rectangle = (
  width: Size,
  height = width,
  options?: Color | SizeOptions,
) => {
  const { min, bgColor } =
    typeof options === 'object' ? options : { min: false, bgColor: options }
  return {
    ...size(width, height, min),
    backgroundColor: bgColor,
  }
}

export const square = (side: Size, options?: Color | SizeOptions) =>
  rectangle(side, side, options)

export const circle = (diameter: Size, options?: Color | SizeOptions) => ({
  ...square(diameter, options),
  borderRadius: '50%' as const,
})
