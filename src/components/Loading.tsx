import { LoadingOutlined } from '@ant-design/icons'
import type { SpinProps } from 'antd'
import { Spin } from 'antd'
import cls from 'classnames'
import type { FC, ReactElement } from 'react'

import { useTranslate } from 'plugins'

export interface LoadingProps
  extends Omit<SpinProps, 'spinning' | 'wrapperClassName'> {
  children?: ReactElement
  loading?: boolean
}

export const Loading: FC<LoadingProps> = ({
  children,
  className,
  loading = true,
  ...props
}) => {
  const { t } = useTranslate()

  const spin = (
    <Spin
      wrapperClassName={className}
      className={cls({ 'fx-center cover-size': children })}
      spinning={loading}
      indicator={
        <>
          <LoadingOutlined />
          <span className="ml-8 text-help">{t('loading')}</span>
        </>
      }
      {...props}
    >
      {children}
    </Spin>
  )

  return children ? spin : <div className="fx-center cover-size">{spin}</div>
}
