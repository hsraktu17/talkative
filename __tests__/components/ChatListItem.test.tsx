import { render, screen, fireEvent } from '@testing-library/react'
import ChatListItem from '@/components/ChatListItem'
import type { ChatListItem as ChatItem } from '@/lib/types'

describe('ChatListItem', () => {
  const chat: ChatItem = {
    id: '1',
    display_name: 'John Doe',
    avatar_url: null,
    email: 'john@example.com',
    chat_id: 'c1',
    unread_count: 2,
  }

  it('renders unread badge when unread_count > 0', () => {
    const onClick = jest.fn()
    render(<ChatListItem chat={chat} selected={false} onClick={onClick} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()
    render(<ChatListItem chat={chat} selected={false} onClick={onClick} />)
    fireEvent.click(screen.getByRole('listitem'))
    expect(onClick).toHaveBeenCalled()
  })
})
