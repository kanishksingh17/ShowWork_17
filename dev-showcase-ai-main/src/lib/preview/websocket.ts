// WebSocket client for live preview updates

import { WebSocketMessage, PreviewUpdate, PerformanceMetrics } from './types'

export class PreviewWebSocket {
  private ws: WebSocket | null = null
  private url: string
  private reconnectInterval: number
  private maxReconnectAttempts: number
  private reconnectAttempts: number = 0
  private isConnecting: boolean = false
  private messageQueue: WebSocketMessage[] = []
  private heartbeatInterval: NodeJS.Timeout | null = null
  private reconnectTimeout: NodeJS.Timeout | null = null

  // Event handlers
  private onOpen: (() => void) | null = null
  private onClose: ((event: CloseEvent) => void) | null = null
  private onError: ((error: Event) => void) | null = null
  private onMessage: ((message: WebSocketMessage) => void) | null = null
  private onUpdate: ((update: PreviewUpdate) => void) | null = null
  private onPerformance: ((metrics: PerformanceMetrics) => void) | null = null
  private onExport: ((data: any) => void) | null = null

  constructor(
    url: string,
    options: {
      reconnectInterval?: number
      maxReconnectAttempts?: number
    } = {}
  ) {
    this.url = url
    this.reconnectInterval = options.reconnectInterval || 3000
    this.maxReconnectAttempts = options.maxReconnectAttempts || 10
  }

  // Connection management
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'))
        return
      }

      this.isConnecting = true
      this.reconnectAttempts = 0

      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = (event) => {
          console.log('WebSocket connected:', this.url)
          this.isConnecting = false
          this.reconnectAttempts = 0
          this.startHeartbeat()
          this.flushMessageQueue()
          this.onOpen?.()
          resolve()
        }

        this.ws.onclose = (event) => {
          console.log('WebSocket closed:', event.code, event.reason)
          this.isConnecting = false
          this.stopHeartbeat()
          this.onClose?.(event)
          this.handleReconnect()
        }

        this.ws.onerror = (event) => {
          console.error('WebSocket error:', event)
          this.isConnecting = false
          this.onError?.(event)
          reject(new Error('WebSocket connection failed'))
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }
      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  disconnect(): void {
    this.stopHeartbeat()
    this.clearReconnectTimeout()
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
  }

  // Message handling
  private handleMessage(message: WebSocketMessage): void {
    this.onMessage?.(message)

    switch (message.type) {
      case 'update':
        this.onUpdate?.(message.payload)
        break
      case 'performance':
        this.onPerformance?.(message.payload)
        break
      case 'export':
        this.onExport?.(message.payload)
        break
      case 'pong':
        // Heartbeat response
        break
      case 'error':
        console.error('WebSocket error message:', message.payload)
        break
    }
  }

  // Message sending
  send(message: Omit<WebSocketMessage, 'timestamp' | 'id'>): void {
    const fullMessage: WebSocketMessage = {
      ...message,
      timestamp: new Date(),
      id: this.generateMessageId()
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(fullMessage))
    } else {
      this.messageQueue.push(fullMessage)
    }
  }

  sendUpdate(update: PreviewUpdate): void {
    this.send({
      type: 'update',
      payload: update
    })
  }

  sendPerformanceMetrics(metrics: PerformanceMetrics): void {
    this.send({
      type: 'performance',
      payload: metrics
    })
  }

  sendExportRequest(options: any): void {
    this.send({
      type: 'export',
      payload: options
    })
  }

  // Heartbeat
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({
          type: 'ping',
          payload: { timestamp: Date.now() }
        })
      }
    }, 30000) // 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  // Reconnection
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1)

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch((error) => {
        console.error('Reconnection failed:', error)
      })
    }, delay)
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
  }

  // Message queue
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      if (message && this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message))
      }
    }
  }

  // Utility
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Getters
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED
  }

  get reconnectAttemptsCount(): number {
    return this.reconnectAttempts
  }

  // Event handler setters
  setOnOpen(handler: () => void): void {
    this.onOpen = handler
  }

  setOnClose(handler: (event: CloseEvent) => void): void {
    this.onClose = handler
  }

  setOnError(handler: (error: Event) => void): void {
    this.onError = handler
  }

  setOnMessage(handler: (message: WebSocketMessage) => void): void {
    this.onMessage = handler
  }

  setOnUpdate(handler: (update: PreviewUpdate) => void): void {
    this.onUpdate = handler
  }

  setOnPerformance(handler: (metrics: PerformanceMetrics) => void): void {
    this.onPerformance = handler
  }

  setOnExport(handler: (data: any) => void): void {
    this.onExport = handler
  }
}

// WebSocket manager for multiple connections
export class WebSocketManager {
  private connections: Map<string, PreviewWebSocket> = new Map()

  createConnection(
    id: string,
    url: string,
    options?: {
      reconnectInterval?: number
      maxReconnectAttempts?: number
    }
  ): PreviewWebSocket {
    const connection = new PreviewWebSocket(url, options)
    this.connections.set(id, connection)
    return connection
  }

  getConnection(id: string): PreviewWebSocket | undefined {
    return this.connections.get(id)
  }

  removeConnection(id: string): void {
    const connection = this.connections.get(id)
    if (connection) {
      connection.disconnect()
      this.connections.delete(id)
    }
  }

  disconnectAll(): void {
    for (const [id, connection] of this.connections) {
      connection.disconnect()
    }
    this.connections.clear()
  }

  getConnectionCount(): number {
    return this.connections.size
  }

  getConnectedCount(): number {
    let count = 0
    for (const connection of this.connections.values()) {
      if (connection.isConnected) {
        count++
      }
    }
    return count
  }
}

// Singleton instance
export const websocketManager = new WebSocketManager()

// Utility functions
export const createWebSocketUrl = (baseUrl: string, params?: Record<string, string>): string => {
  const url = new URL(baseUrl)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }
  return url.toString()
}

export const isWebSocketSupported = (): boolean => {
  return typeof WebSocket !== 'undefined'
}

export const getWebSocketReadyState = (readyState: number): string => {
  switch (readyState) {
    case WebSocket.CONNECTING:
      return 'Connecting'
    case WebSocket.OPEN:
      return 'Open'
    case WebSocket.CLOSING:
      return 'Closing'
    case WebSocket.CLOSED:
      return 'Closed'
    default:
      return 'Unknown'
  }
}
