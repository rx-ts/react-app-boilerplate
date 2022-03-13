import { Button, Result } from 'antd'
import { memoize } from 'lodash'
import type { ComponentType, FC, ReactElement } from 'react'
import { lazy, Suspense } from 'react'
import type { FallbackProps } from 'react-error-boundary'
import { ErrorBoundary } from 'react-error-boundary'

import { Loading } from 'components'
import { useTranslate } from 'plugins'
import { getPageFile } from 'utils'

export interface LazyPage {
  default: ComponentType
}

// we're not using `useMemo` because `lazy` will wrapper LazyComponent every time even for same page
export const lazyComponent = memoize(
  (page: string | (() => PromiseLike<LazyPage>), _cacheKey?: string) =>
    lazy(async () => {
      let loaded: LazyPage | undefined
      if (typeof page === 'function') {
        loaded = await page()
      } else {
        const pageFile = `${getPageFile(page)}`
        const parts = pageFile.split('/')
        switch (parts.length) {
          case 1: {
            loaded = (await import(
              `../pages/${pageFile}/index.tsx`
            )) as LazyPage
            break
          }
          case 2: {
            loaded = (await import(
              `../pages/${parts[0]}/${parts[1]}/index.tsx`
            )) as LazyPage
            break
          }
          default: {
            if (__DEV__) {
              throw new Error(
                "Invalid level of page Component, if you're sure about this, please add the level like above",
              )
            }
          }
        }

        if (!loaded?.default) {
          throw new Error(
            `No \`default\` component found in "pages/${pageFile}/index.tsx"`,
          )
        }
      }
      return loaded
    }),
  (page, cacheKey) => cacheKey || page,
)

export interface DynamicPageProps {
  cacheKey: string
  page: () => PromiseLike<LazyPage>
}

export interface StaticPageProps {
  page: string
}

export type PageProps = DynamicPageProps | StaticPageProps

const onReload = () => location.reload()

export const ErrorFallback: FC<FallbackProps> = ({ error }) => {
  const { t } = useTranslate()
  return (
    <Result
      status="warning"
      title={t('load_error')}
      extra={
        /**
         * Ideally, we should refetch the page, but we can't do that due to vite's caching.
         *
         * @see https://github.com/vitejs/vite/issues/5101
         */
        <Button type="primary" onClick={onReload}>
          {t('reload')}
        </Button>
      }
    >
      {__DEV__ && error.stack}
    </Result>
  )
}

export function Page(props: DynamicPageProps): ReactElement
// eslint-disable-next-line @typescript-eslint/unified-signatures
export function Page(props: StaticPageProps): ReactElement
export function Page({ cacheKey, page }: PageProps & { cacheKey?: string }) {
  const Component = lazyComponent(page, cacheKey)
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Component />
      </ErrorBoundary>
    </Suspense>
  )
}
