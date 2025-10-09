// E2E test support file

import './commands'
import 'cypress-axe'

// Global test configuration
beforeEach(() => {
  // Set up default intercepts
  cy.intercept('GET', '/api/auth/session', { fixture: 'session.json' }).as('getSession')
  cy.intercept('POST', '/api/auth/signin', { fixture: 'signin.json' }).as('signIn')
  cy.intercept('POST', '/api/auth/signout', { fixture: 'signout.json' }).as('signOut')
  
  // Mock API responses
  cy.intercept('GET', '/api/portfolios*', { fixture: 'portfolios.json' }).as('getPortfolios')
  cy.intercept('POST', '/api/portfolios', { fixture: 'portfolio.json' }).as('createPortfolio')
  cy.intercept('GET', '/api/portfolios/1', { fixture: 'portfolio.json' }).as('getPortfolio')
  cy.intercept('PUT', '/api/portfolios/1', { fixture: 'portfolio.json' }).as('updatePortfolio')
  cy.intercept('DELETE', '/api/portfolios/1', { statusCode: 200 }).as('deletePortfolio')
  cy.intercept('POST', '/api/generate', { fixture: 'generated-content.json' }).as('generateContent')
  cy.intercept('POST', '/api/preview', { fixture: 'preview.json' }).as('generatePreview')
  
  // Mock external services
  cy.intercept('POST', 'https://api.openai.com/v1/chat/completions', { fixture: 'openai-response.json' }).as('openai')
  cy.intercept('POST', 'https://api.vercel.com/v13/deployments', { fixture: 'vercel-deployment.json' }).as('vercel')
  
  // Set up localStorage
  cy.window().then((win) => {
    win.localStorage.setItem('theme', 'light')
    win.localStorage.setItem('language', 'en')
  })
})

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore specific errors that don't affect tests
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false
  }
  if (err.message.includes('Loading chunk')) {
    return false
  }
  if (err.message.includes('Network Error')) {
    return false
  }
  
  // Let other errors fail the test
  return true
})

// Global test cleanup
afterEach(() => {
  // Clear localStorage
  cy.window().then((win) => {
    win.localStorage.clear()
  })
  
  // Clear session storage
  cy.window().then((win) => {
    win.sessionStorage.clear()
  })
  
  // Clear cookies
  cy.clearCookies()
})

// Custom assertions
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom assertion to check if element has specific CSS class
       */
      shouldHaveClass(className: string): Chainable<void>
      
      /**
       * Custom assertion to check if element has specific attribute
       */
      shouldHaveAttribute(attr: string, value?: string): Chainable<void>
      
      /**
       * Custom assertion to check if element is visible and not disabled
       */
      shouldBeEnabled(): Chainable<void>
      
      /**
       * Custom assertion to check if element is disabled
       */
      shouldBeDisabled(): Chainable<void>
      
      /**
       * Custom assertion to check if element contains specific text
       */
      shouldContainText(text: string): Chainable<void>
      
      /**
       * Custom assertion to check if element has specific value
       */
      shouldHaveValue(value: string): Chainable<void>
    }
  }
}

// Custom assertion commands
Cypress.Commands.add('shouldHaveClass', (className: string) => {
  cy.get('@element').should('have.class', className)
})

Cypress.Commands.add('shouldHaveAttribute', (attr: string, value?: string) => {
  if (value) {
    cy.get('@element').should('have.attr', attr, value)
  } else {
    cy.get('@element').should('have.attr', attr)
  }
})

Cypress.Commands.add('shouldBeEnabled', () => {
  cy.get('@element').should('not.be.disabled')
  cy.get('@element').should('be.visible')
})

Cypress.Commands.add('shouldBeDisabled', () => {
  cy.get('@element').should('be.disabled')
})

Cypress.Commands.add('shouldContainText', (text: string) => {
  cy.get('@element').should('contain.text', text)
})

Cypress.Commands.add('shouldHaveValue', (value: string) => {
  cy.get('@element').should('have.value', value)
})

// Performance monitoring
Cypress.Commands.add('monitorPerformance', () => {
  cy.window().then((win) => {
    const observer = new win.PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (entry.entryType === 'measure') {
          cy.task('log', `Performance: ${entry.name} - ${entry.duration}ms`)
        }
      })
    })
    
    observer.observe({ entryTypes: ['measure'] })
    
    // Mark start of test
    win.performance.mark('test-start')
    
    // Mark end of test in afterEach
    cy.then(() => {
      win.performance.mark('test-end')
      win.performance.measure('test-duration', 'test-start', 'test-end')
    })
  })
})

// Accessibility monitoring
Cypress.Commands.add('monitorAccessibility', () => {
  cy.injectAxe()
  
  // Check for accessibility violations
  cy.checkA11y(null, null, (violations) => {
    if (violations.length > 0) {
      cy.task('log', 'Accessibility Violations:')
      cy.task('table', violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.length
      })))
    }
  })
})

// Network monitoring
Cypress.Commands.add('monitorNetwork', () => {
  cy.window().then((win) => {
    const observer = new win.PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (entry.entryType === 'resource') {
          cy.task('log', `Network: ${entry.name} - ${entry.duration}ms`)
        }
      })
    })
    
    observer.observe({ entryTypes: ['resource'] })
  })
})

// Memory monitoring
Cypress.Commands.add('monitorMemory', () => {
  cy.window().then((win) => {
    if ('memory' in win.performance) {
      const memory = (win.performance as any).memory
      cy.task('log', `Memory: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`)
    }
  })
})

// Error monitoring
Cypress.Commands.add('monitorErrors', () => {
  cy.window().then((win) => {
    const errors: string[] = []
    
    win.addEventListener('error', (event) => {
      errors.push(event.message)
    })
    
    win.addEventListener('unhandledrejection', (event) => {
      errors.push(event.reason)
    })
    
    cy.then(() => {
      if (errors.length > 0) {
        cy.task('log', 'Errors:')
        cy.task('table', errors)
      }
    })
  })
})

// Global test hooks
before(() => {
  // Set up test environment
  cy.task('log', 'Starting E2E tests')
})

after(() => {
  // Clean up test environment
  cy.task('log', 'E2E tests completed')
})

// Custom test utilities
export const testUtils = {
  // Generate random test data
  generateTestData: () => ({
    title: `Test Portfolio ${Math.random().toString(36).substr(2, 9)}`,
    description: `Test description ${Math.random().toString(36).substr(2, 9)}`,
    email: `test${Math.random().toString(36).substr(2, 9)}@example.com`,
    name: `Test User ${Math.random().toString(36).substr(2, 9)}`
  }),
  
  // Wait for element to be stable
  waitForStable: (selector: string) => {
    cy.get(selector).should('be.visible')
    cy.get(selector).should('not.have.class', 'loading')
    cy.wait(100)
  },
  
  // Check if element is in viewport
  isInViewport: (selector: string) => {
    cy.get(selector).then(($el) => {
      const rect = $el[0].getBoundingClientRect()
      expect(rect.top).to.be.greaterThan(0)
      expect(rect.left).to.be.greaterThan(0)
      expect(rect.bottom).to.be.lessThan(Cypress.config('viewportHeight'))
      expect(rect.right).to.be.lessThan(Cypress.config('viewportWidth'))
    })
  },
  
  // Scroll to element
  scrollToElement: (selector: string) => {
    cy.get(selector).scrollIntoView({ behavior: 'smooth' })
    cy.wait(500)
  },
  
  // Check console for errors
  checkConsoleErrors: () => {
    cy.window().then((win) => {
      const errors: string[] = []
      
      win.console.error = (message: string) => {
        errors.push(message)
      }
      
      cy.then(() => {
        if (errors.length > 0) {
          cy.task('log', 'Console Errors:')
          cy.task('table', errors)
        }
      })
    })
  }
}

// Export test utilities
export default testUtils
