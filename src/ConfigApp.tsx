import type { Locale } from '@react-enhanced/plugins'
import { useTranslate } from '@react-enhanced/plugins'
import { ConfigProvider } from 'antd'
import enUS from 'antd/es/locale/en_US'
import zhCN from 'antd/es/locale/zh_CN'
import type { Locale as AntLocale } from 'antd/es/locale-provider'
import { merge } from 'lodash'
import type { FC, PropsWithChildren } from 'react'

import { ANT_PREFIX } from 'styles'
import type { PartialDeep } from 'types'

const ANT_LOCALE_MAPPER: Record<Locale, AntLocale> = {
  en: merge<AntLocale, PartialDeep<AntLocale>>(enUS, {
    DatePicker: {
      lang: {
        rangePlaceholder: ['Start Time', 'End Time'],
      },
    },
    Modal: {
      okText: 'Confirm',
    },
  }),
  zh: merge(zhCN, {
    DatePicker: {
      lang: {
        rangePlaceholder: ['开始时间', '结束时间'],
      },
    },
    Pagination: {
      jump_to: '前往',
    },
  }),
}

ConfigProvider.config({
  prefixCls: ANT_PREFIX,
})

export const ConfigApp: FC<PropsWithChildren> = ({ children }) => {
  const { locale } = useTranslate()
  return (
    <ConfigProvider
      prefixCls={ANT_PREFIX}
      locale={ANT_LOCALE_MAPPER[locale]}
      autoInsertSpaceInButton={false}
    >
      {children}
    </ConfigProvider>
  )
}
