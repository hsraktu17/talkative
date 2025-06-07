import { render, screen } from '@testing-library/react'
import { Avatar } from '@/components/Avatar'

describe('Avatar', () => {
  it('shows initial when no avatarUrl', () => {
    render(<Avatar name="Alice" />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })
})
