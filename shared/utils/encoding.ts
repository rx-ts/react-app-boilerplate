const HEX = 16

const CUT = 4

export const base64Encode = (value: string) =>
  __SERVER__
    ? Buffer.from(value).toString('base64')
    : window.btoa(
        encodeURIComponent(value).replace(/%([\dA-F]{2})/g, (_, $1: string) =>
          String.fromCodePoint(Number.parseInt($1, HEX)),
        ),
      )

// 中文乱码：https://developer.mozilla.org/en-US/docs/Glossary/Base64#solution_1_%E2%80%93_escaping_the_string_before_encoding_it
// https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings/30106551#30106551

export const base64Decode = (value: string) =>
  __SERVER__
    ? Buffer.from(value, 'base64').toString()
    : decodeURIComponent(
        [...window.atob(value)]
          .map(
            char =>
              '%' + ('00' + char.codePointAt(0)!.toString(HEX)).slice(-1 * 2),
          )
          .join(''),
      )

// COPY: https://github.com/auth0/jwt-decode/blob/222db61fbaeea8ffd412a306039fea769ce43093/lib/base64_url_decode.js

export function base64UrlDecode(str: string) {
  let output = str.replace(/-/g, '+').replace(/_/g, '/')
  switch (output.length % CUT) {
    case 0:
      break
    case 2:
      output += '=='
      break
    case 3:
      output += '='
      break
    default:
      break
  }
  try {
    return base64Decode(output)
  } catch {
    return window.atob(output)
  }
}
