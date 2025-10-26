// Custom Cypress commands

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login with mock user
       * @example cy.login()
       */
      login(): Chainable<void>;

      /**
       * Custom command to create a portfolio
       * @example cy.createPortfolio('My Portfolio', 'Description')
       */
      createPortfolio(title: string, description: string): Chainable<void>;

      /**
       * Custom command to wait for API response
       * @example cy.waitForAPI('POST', '/api/portfolios')
       */
      waitForAPI(method: string, url: string): Chainable<void>;

      /**
       * Custom command to check accessibility
       * @example cy.checkA11y()
       */
      checkA11y(): Chainable<void>;

      /**
       * Custom command to measure performance
       * @example cy.measurePerformance()
       */
      measurePerformance(): Chainable<void>;

      /**
       * Custom command to mock API responses
       * @example cy.mockAPI('GET', '/api/portfolios', { fixture: 'portfolios.json' })
       */
      mockAPI(method: string, url: string, response: any): Chainable<void>;

      /**
       * Custom command to clear all mocks
       * @example cy.clearMocks()
       */
      clearMocks(): Chainable<void>;

      /**
       * Custom command to take screenshot with custom name
       * @example cy.takeScreenshot('portfolio-editor')
       */
      takeScreenshot(name: string): Chainable<void>;

      /**
       * Custom command to wait for element to be visible and stable
       * @example cy.waitForStable('[data-testid="preview-container"]')
       */
      waitForStable(selector: string): Chainable<void>;

      /**
       * Custom command to fill form with data
       * @example cy.fillForm({ title: 'Test', description: 'Test Description' })
       */
      fillForm(data: Record<string, string>): Chainable<void>;

      /**
       * Custom command to verify API call was made
       * @example cy.verifyAPICall('POST', '/api/portfolios')
       */
      verifyAPICall(method: string, url: string): Chainable<void>;
    }
  }
}

// Login command
Cypress.Commands.add("login", () => {
  cy.window().then((win) => {
    win.localStorage.setItem("auth-token", "mock-jwt-token");
    win.localStorage.setItem(
      "user",
      JSON.stringify({
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        role: "user",
      }),
    );
  });
});

// Create portfolio command
Cypress.Commands.add(
  "createPortfolio",
  (title: string, description: string) => {
    cy.get('[data-testid="create-portfolio-btn"]').click();
    cy.get('[data-testid="portfolio-title"]').type(title);
    cy.get('[data-testid="portfolio-description"]').type(description);
    cy.get('[data-testid="portfolio-template"]').select("modern");
    cy.get('[data-testid="create-portfolio-submit"]').click();
  },
);

// Wait for API response command
Cypress.Commands.add("waitForAPI", (method: string, url: string) => {
  cy.intercept(method, url).as("apiCall");
  cy.wait("@apiCall");
});

// Accessibility check command
Cypress.Commands.add("checkA11y", () => {
  cy.injectAxe();
  cy.checkA11y(null, null, null, true);
});

// Performance measurement command
Cypress.Commands.add("measurePerformance", () => {
  cy.window().then((win) => {
    const performance = win.performance;
    const navigation = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;

    const metrics = {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded:
        navigation.domContentLoadedEventEnd -
        navigation.domContentLoadedEventStart,
      firstPaint:
        performance.getEntriesByName("first-paint")[0]?.startTime || 0,
      firstContentfulPaint:
        performance.getEntriesByName("first-contentful-paint")[0]?.startTime ||
        0,
      largestContentfulPaint:
        performance.getEntriesByName("largest-contentful-paint")[0]
          ?.startTime || 0,
      cumulativeLayoutShift:
        performance.getEntriesByName("cumulative-layout-shift")[0]?.value || 0,
      firstInputDelay:
        performance.getEntriesByName("first-input")[0]?.processingStart -
          performance.getEntriesByName("first-input")[0]?.startTime || 0,
    };

    cy.task("log", "Performance Metrics:");
    cy.task("table", metrics);

    // Assert performance budgets
    expect(metrics.loadTime).to.be.lessThan(3000); // 3 seconds
    expect(metrics.firstContentfulPaint).to.be.lessThan(2000); // 2 seconds
    expect(metrics.largestContentfulPaint).to.be.lessThan(2500); // 2.5 seconds
    expect(metrics.cumulativeLayoutShift).to.be.lessThan(0.1); // CLS < 0.1
    expect(metrics.firstInputDelay).to.be.lessThan(100); // FID < 100ms
  });
});

// Mock API command
Cypress.Commands.add(
  "mockAPI",
  (method: string, url: string, response: any) => {
    if (response.fixture) {
      cy.fixture(response.fixture).then((fixtureData) => {
        cy.intercept(method, url, fixtureData).as(
          `${method.toLowerCase()}_${url.replace(/\//g, "_")}`,
        );
      });
    } else {
      cy.intercept(method, url, response).as(
        `${method.toLowerCase()}_${url.replace(/\//g, "_")}`,
      );
    }
  },
);

// Clear mocks command
Cypress.Commands.add("clearMocks", () => {
  cy.intercept("GET", "/api/**", { fixture: "empty.json" }).as("clearGet");
  cy.intercept("POST", "/api/**", { fixture: "empty.json" }).as("clearPost");
  cy.intercept("PUT", "/api/**", { fixture: "empty.json" }).as("clearPut");
  cy.intercept("DELETE", "/api/**", { fixture: "empty.json" }).as(
    "clearDelete",
  );
});

// Take screenshot command
Cypress.Commands.add("takeScreenshot", (name: string) => {
  cy.screenshot(name, { capture: "viewport" });
});

// Wait for stable element command
Cypress.Commands.add("waitForStable", (selector: string) => {
  cy.get(selector).should("be.visible");
  cy.get(selector).should("not.have.class", "loading");
  cy.get(selector).should("not.have.class", "animating");
});

// Fill form command
Cypress.Commands.add("fillForm", (data: Record<string, string>) => {
  Object.entries(data).forEach(([key, value]) => {
    cy.get(`[data-testid="${key}"]`).clear().type(value);
  });
});

// Verify API call command
Cypress.Commands.add("verifyAPICall", (method: string, url: string) => {
  cy.get(`@${method.toLowerCase()}_${url.replace(/\//g, "_")}`).should(
    "have.been.called",
  );
});

// Custom error handling
Cypress.on("uncaught:exception", (err, runnable) => {
  // Ignore specific errors that don't affect tests
  if (err.message.includes("ResizeObserver loop limit exceeded")) {
    return false;
  }
  if (err.message.includes("Non-Error promise rejection captured")) {
    return false;
  }
  if (err.message.includes("Loading chunk")) {
    return false;
  }

  // Let other errors fail the test
  return true;
});

// Custom command to handle flaky tests
Cypress.Commands.add("retry", (fn: () => void, maxRetries: number = 3) => {
  let retries = 0;

  const attempt = () => {
    try {
      fn();
    } catch (error) {
      retries++;
      if (retries < maxRetries) {
        cy.wait(1000);
        attempt();
      } else {
        throw error;
      }
    }
  };

  attempt();
});

// Custom command to wait for animations to complete
Cypress.Commands.add("waitForAnimations", () => {
  cy.get("body").should("not.have.class", "animating");
  cy.wait(500); // Additional wait for any remaining animations
});

// Custom command to check if element is in viewport
Cypress.Commands.add("isInViewport", (selector: string) => {
  cy.get(selector).then(($el) => {
    const rect = $el[0].getBoundingClientRect();
    expect(rect.top).to.be.greaterThan(0);
    expect(rect.left).to.be.greaterThan(0);
    expect(rect.bottom).to.be.lessThan(Cypress.config("viewportHeight"));
    expect(rect.right).to.be.lessThan(Cypress.config("viewportWidth"));
  });
});

// Custom command to scroll to element smoothly
Cypress.Commands.add("scrollToElement", (selector: string) => {
  cy.get(selector).scrollIntoView({ behavior: "smooth" });
  cy.wait(500); // Wait for scroll to complete
});

// Custom command to check console errors
Cypress.Commands.add("checkConsoleErrors", () => {
  cy.window().then((win) => {
    const errors: string[] = [];

    win.console.error = (message: string) => {
      errors.push(message);
    };

    cy.then(() => {
      if (errors.length > 0) {
        cy.task("log", "Console Errors:");
        cy.task("table", errors);
        expect(errors).to.have.length(0);
      }
    });
  });
});

// Custom command to measure memory usage
Cypress.Commands.add("measureMemory", () => {
  cy.window().then((win) => {
    if ("memory" in win.performance) {
      const memory = (win.performance as any).memory;
      const metrics = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };

      cy.task("log", "Memory Usage:");
      cy.task("table", metrics);

      // Assert memory usage is within limits
      expect(metrics.usedJSHeapSize).to.be.lessThan(50 * 1024 * 1024); // 50MB
    }
  });
});

// Custom command to check network requests
Cypress.Commands.add("checkNetworkRequests", () => {
  cy.window().then((win) => {
    const entries = win.performance.getEntriesByType("resource");
    const requests = entries.map((entry: any) => ({
      name: entry.name,
      duration: entry.duration,
      size: entry.transferSize || 0,
    }));

    cy.task("log", "Network Requests:");
    cy.task("table", requests);

    // Assert no slow requests
    const slowRequests = requests.filter((req: any) => req.duration > 1000);
    expect(slowRequests).to.have.length(0);
  });
});

export {};
