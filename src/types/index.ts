// params for element2pdf
export interface Options {
  root: HTMLElement,
  pageBreak?: {
    className?: string,
    type?: 'before' | 'after'
  },
  filename?: string
}
