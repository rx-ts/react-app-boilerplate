import { getStorage } from 'utils'

export const THEME_STORAGE = '__THEME__'

export const DEFAULT_THEME = getStorage<'dark' | 'light'>(THEME_STORAGE)
