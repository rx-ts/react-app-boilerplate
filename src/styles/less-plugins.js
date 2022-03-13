/**
 * @see https://lesscss.org/features/#plugin-atrules-feature
 */
module.exports = {
  install(_less, _pluginManager, functions) {
    functions.add('charAt', ({ value: str }, { value: index = 0 } = {}) =>
      str.charAt(index),
    )
    functions.add('varColor', ({ value: name }, { value: alpha } = {}) =>
      typeof alpha === 'number'
        ? `rgba(var(--color-${name}),${alpha})`
        : `rgb(var(--color-${name}))`,
    )
  },
}
