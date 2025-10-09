import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ZoomControls } from '../preview/ZoomControls'

// Mock the context
const mockContextValue = {
  state: {
    zoom: 1
  },
  actions: {
    zoomIn: jest.fn(),
    zoomOut: jest.fn(),
    resetZoom: jest.fn(),
    fitToScreen: jest.fn(),
    setZoom: jest.fn()
  }
}

jest.mock('../../lib/preview/context', () => ({
  usePreview: () => mockContextValue
}))

describe('ZoomControls', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders zoom controls', () => {
    render(<ZoomControls />)
    
    expect(screen.getByTitle('Zoom Out')).toBeInTheDocument()
    expect(screen.getByTitle('Zoom In')).toBeInTheDocument()
    expect(screen.getByTitle('Reset Zoom (100%)')).toBeInTheDocument()
    expect(screen.getByTitle('Fit to Screen')).toBeInTheDocument()
  })

  it('displays current zoom level', () => {
    render(<ZoomControls />)
    
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('calls zoomIn when zoom in button is clicked', async () => {
    const user = userEvent.setup()
    render(<ZoomControls />)
    
    const zoomInButton = screen.getByTitle('Zoom In')
    await user.click(zoomInButton)
    
    expect(mockContextValue.actions.zoomIn).toHaveBeenCalled()
  })

  it('calls zoomOut when zoom out button is clicked', async () => {
    const user = userEvent.setup()
    render(<ZoomControls />)
    
    const zoomOutButton = screen.getByTitle('Zoom Out')
    await user.click(zoomOutButton)
    
    expect(mockContextValue.actions.zoomOut).toHaveBeenCalled()
  })

  it('calls resetZoom when reset button is clicked', async () => {
    const user = userEvent.setup()
    render(<ZoomControls />)
    
    const resetButton = screen.getByTitle('Reset Zoom (100%)')
    await user.click(resetButton)
    
    expect(mockContextValue.actions.resetZoom).toHaveBeenCalled()
  })

  it('calls fitToScreen when fit to screen button is clicked', async () => {
    const user = userEvent.setup()
    render(<ZoomControls />)
    
    const fitButton = screen.getByTitle('Fit to Screen')
    await user.click(fitButton)
    
    expect(mockContextValue.actions.fitToScreen).toHaveBeenCalled()
  })

  it('disables zoom out button when at minimum zoom', () => {
    const mockContextWithMinZoom = {
      ...mockContextValue,
      state: { zoom: 0.1 }
    }
    
    jest.mocked(require('../../lib/preview/context').usePreview).mockReturnValue(mockContextWithMinZoom)
    
    render(<ZoomControls />)
    
    const zoomOutButton = screen.getByTitle('Zoom Out')
    expect(zoomOutButton).toBeDisabled()
  })

  it('disables zoom in button when at maximum zoom', () => {
    const mockContextWithMaxZoom = {
      ...mockContextValue,
      state: { zoom: 3 }
    }
    
    jest.mocked(require('../../lib/preview/context').usePreview).mockReturnValue(mockContextWithMaxZoom)
    
    render(<ZoomControls />)
    
    const zoomInButton = screen.getByTitle('Zoom In')
    expect(zoomInButton).toBeDisabled()
  })

  it('updates zoom when slider is changed', async () => {
    const user = userEvent.setup()
    render(<ZoomControls />)
    
    const slider = screen.getByRole('slider')
    await user.type(slider, '1.5')
    
    expect(mockContextValue.actions.setZoom).toHaveBeenCalledWith(1.5)
  })

  it('shows zoom level temporarily after interaction', async () => {
    const user = userEvent.setup()
    render(<ZoomControls />)
    
    const zoomInButton = screen.getByTitle('Zoom In')
    await user.click(zoomInButton)
    
    // Should show zoom level temporarily
    expect(screen.getByText('120%')).toBeInTheDocument()
  })

  it('displays zoom presets in dropdown', async () => {
    const user = userEvent.setup()
    render(<ZoomControls />)
    
    const presetButton = screen.getByRole('button', { name: /search/i })
    await user.hover(presetButton)
    
    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('200%')).toBeInTheDocument()
  })

  it('sets zoom when preset is selected', async () => {
    const user = userEvent.setup()
    render(<ZoomControls />)
    
    const presetButton = screen.getByRole('button', { name: /search/i })
    await user.hover(presetButton)
    
    const preset50 = screen.getByText('50%')
    await user.click(preset50)
    
    expect(mockContextValue.actions.setZoom).toHaveBeenCalledWith(0.5)
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<ZoomControls />)
    
    const zoomInButton = screen.getByTitle('Zoom In')
    zoomInButton.focus()
    
    await user.keyboard('{Enter}')
    expect(mockContextValue.actions.zoomIn).toHaveBeenCalled()
    
    await user.keyboard('{Space}')
    expect(mockContextValue.actions.zoomIn).toHaveBeenCalledTimes(2)
  })

  it('shows correct zoom level for different zoom values', () => {
    const mockContextWithCustomZoom = {
      ...mockContextValue,
      state: { zoom: 1.25 }
    }
    
    jest.mocked(require('../../lib/preview/context').usePreview).mockReturnValue(mockContextWithCustomZoom)
    
    render(<ZoomControls />)
    
    expect(screen.getByText('125%')).toBeInTheDocument()
  })

  it('handles slider mouse events', async () => {
    const user = userEvent.setup()
    render(<ZoomControls />)
    
    const slider = screen.getByRole('slider')
    
    // Test mouse down
    fireEvent.mouseDown(slider)
    expect(slider).toHaveAttribute('data-dragging', 'true')
    
    // Test mouse up
    fireEvent.mouseUp(slider)
    expect(slider).toHaveAttribute('data-dragging', 'false')
  })

  it('applies correct slider styling based on zoom level', () => {
    render(<ZoomControls />)
    
    const slider = screen.getByRole('slider')
    const sliderContainer = slider.parentElement
    
    // Check that the slider has the correct background gradient
    expect(sliderContainer).toHaveStyle({
      background: expect.stringContaining('linear-gradient')
    })
  })
})
