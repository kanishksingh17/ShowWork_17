import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeviceSelector } from '../preview/DeviceSelector'
import { PreviewProvider } from '../../lib/preview/context'

// Mock the context
const mockContextValue = {
  state: {
    deviceViewport: {
      type: 'desktop',
      width: 1200,
      height: 800,
      name: 'Desktop 1200x800',
      orientation: 'landscape',
      pixelRatio: 1
    }
  },
  actions: {
    setDeviceViewport: jest.fn(),
    addCustomViewport: jest.fn(),
    removeCustomViewport: jest.fn()
  },
  config: {
    defaultDevice: {
      type: 'desktop',
      width: 1200,
      height: 800,
      name: 'Desktop',
      orientation: 'landscape',
      pixelRatio: 1
    }
  }
}

jest.mock('../../lib/preview/context', () => ({
  usePreview: () => mockContextValue,
  useDevicePresets: () => [
    {
      id: 'desktop-1920',
      name: 'Desktop 1920x1080',
      width: 1920,
      height: 1080,
      type: 'desktop',
      orientation: 'landscape',
      pixelRatio: 1,
      category: 'popular'
    },
    {
      id: 'ipad-pro',
      name: 'iPad Pro',
      width: 1024,
      height: 1366,
      type: 'tablet',
      orientation: 'portrait',
      pixelRatio: 2,
      category: 'popular'
    },
    {
      id: 'iphone-14-pro',
      name: 'iPhone 14 Pro',
      width: 393,
      height: 852,
      type: 'mobile',
      orientation: 'portrait',
      pixelRatio: 3,
      category: 'popular'
    }
  ]
}))

describe('DeviceSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the current device viewport', () => {
    render(<DeviceSelector />)
    
    expect(screen.getByText('Desktop 1200x800')).toBeInTheDocument()
    expect(screen.getByText('1200×800')).toBeInTheDocument()
  })

  it('opens dropdown when clicked', async () => {
    const user = userEvent.setup()
    render(<DeviceSelector />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(screen.getByText('Device Viewport')).toBeInTheDocument()
    expect(screen.getByText('Desktop')).toBeInTheDocument()
    expect(screen.getByText('Tablet')).toBeInTheDocument()
    expect(screen.getByText('Mobile')).toBeInTheDocument()
  })

  it('selects a device when clicked', async () => {
    const user = userEvent.setup()
    render(<DeviceSelector />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    const ipadButton = screen.getByText('iPad Pro')
    await user.click(ipadButton)
    
    expect(mockContextValue.actions.setDeviceViewport).toHaveBeenCalledWith({
      type: 'tablet',
      width: 1024,
      height: 1366,
      name: 'iPad Pro',
      orientation: 'portrait',
      pixelRatio: 2
    })
  })

  it('shows custom viewport form when custom button is clicked', async () => {
    const user = userEvent.setup()
    render(<DeviceSelector />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    const customButton = screen.getByText('Custom')
    await user.click(customButton)
    
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Width')).toBeInTheDocument()
    expect(screen.getByLabelText('Height')).toBeInTheDocument()
  })

  it('submits custom viewport form', async () => {
    const user = userEvent.setup()
    render(<DeviceSelector />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    const customButton = screen.getByText('Custom')
    await user.click(customButton)
    
    const nameInput = screen.getByLabelText('Name')
    const widthInput = screen.getByLabelText('Width')
    const heightInput = screen.getByLabelText('Height')
    const saveButton = screen.getByText('Save')
    
    await user.type(nameInput, 'Custom Device')
    await user.type(widthInput, '1600')
    await user.type(heightInput, '900')
    await user.click(saveButton)
    
    expect(mockContextValue.actions.addCustomViewport).toHaveBeenCalledWith({
      name: 'Custom Device',
      width: 1600,
      height: 900,
      orientation: 'landscape',
      pixelRatio: 1
    })
  })

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <DeviceSelector />
        <div data-testid="outside">Outside</div>
      </div>
    )
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(screen.getByText('Device Viewport')).toBeInTheDocument()
    
    const outsideElement = screen.getByTestId('outside')
    await user.click(outsideElement)
    
    await waitFor(() => {
      expect(screen.queryByText('Device Viewport')).not.toBeInTheDocument()
    })
  })

  it('displays current viewport info', async () => {
    const user = userEvent.setup()
    render(<DeviceSelector />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(screen.getByText('Current Viewport')).toBeInTheDocument()
    expect(screen.getByText('1200×800')).toBeInTheDocument()
    expect(screen.getByText('1x')).toBeInTheDocument()
    expect(screen.getByText('landscape')).toBeInTheDocument()
  })

  it('shows checkmark for selected device', async () => {
    const user = userEvent.setup()
    render(<DeviceSelector />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    // Find the selected device button (should have checkmark)
    const selectedDevice = screen.getByText('Desktop 1200x800').closest('button')
    expect(selectedDevice).toHaveClass('bg-blue-50')
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<DeviceSelector />)
    
    const button = screen.getByRole('button')
    button.focus()
    
    await user.keyboard('{Enter}')
    expect(screen.getByText('Device Viewport')).toBeInTheDocument()
    
    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByText('Device Viewport')).not.toBeInTheDocument()
    })
  })

  it('displays device icons correctly', () => {
    render(<DeviceSelector />)
    
    // Check that the current device icon is displayed
    const deviceIcon = screen.getByRole('button').querySelector('svg')
    expect(deviceIcon).toBeInTheDocument()
  })

  it('handles form validation', async () => {
    const user = userEvent.setup()
    render(<DeviceSelector />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    const customButton = screen.getByText('Custom')
    await user.click(customButton)
    
    const saveButton = screen.getByText('Save')
    await user.click(saveButton)
    
    // Form should not submit without required fields
    expect(mockContextValue.actions.addCustomViewport).not.toHaveBeenCalled()
  })
})
