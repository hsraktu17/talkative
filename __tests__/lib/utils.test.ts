import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('merges class names and ignores falsy values', () => {
    expect(cn('p-4', null, false && 'hidden', 'text-center')).toBe('p-4 text-center')
  })
})
