describe("Portfolio Builder E2E Tests", () => {
  beforeEach(() => {
    // Mock authentication
    cy.window().then((win) => {
      win.localStorage.setItem("auth-token", "mock-jwt-token");
    });
  });

  describe("Portfolio Creation Flow", () => {
    it("should create a new portfolio", () => {
      cy.visit("/portfolio");

      // Click create portfolio button
      cy.get('[data-testid="create-portfolio-btn"]').click();

      // Fill in portfolio details
      cy.get('[data-testid="portfolio-title"]').type("My Test Portfolio");
      cy.get('[data-testid="portfolio-description"]').type(
        "A test portfolio for E2E testing",
      );
      cy.get('[data-testid="portfolio-template"]').select("modern");

      // Submit form
      cy.get('[data-testid="create-portfolio-submit"]').click();

      // Verify portfolio was created
      cy.url().should("include", "/portfolio/editor/");
      cy.get('[data-testid="portfolio-title-display"]').should(
        "contain",
        "My Test Portfolio",
      );
    });

    it("should validate required fields", () => {
      cy.visit("/portfolio");

      cy.get('[data-testid="create-portfolio-btn"]').click();

      // Try to submit without filling required fields
      cy.get('[data-testid="create-portfolio-submit"]').click();

      // Verify validation errors
      cy.get('[data-testid="title-error"]').should("be.visible");
      cy.get('[data-testid="description-error"]').should("be.visible");
    });

    it("should preview portfolio in different devices", () => {
      cy.visit("/portfolio/editor/1");

      // Test desktop preview
      cy.get('[data-testid="device-selector"]').click();
      cy.get('[data-testid="device-desktop"]').click();
      cy.get('[data-testid="preview-container"]').should(
        "have.css",
        "width",
        "1200px",
      );

      // Test tablet preview
      cy.get('[data-testid="device-selector"]').click();
      cy.get('[data-testid="device-tablet"]').click();
      cy.get('[data-testid="preview-container"]').should(
        "have.css",
        "width",
        "768px",
      );

      // Test mobile preview
      cy.get('[data-testid="device-selector"]').click();
      cy.get('[data-testid="device-mobile"]').click();
      cy.get('[data-testid="preview-container"]').should(
        "have.css",
        "width",
        "375px",
      );
    });
  });

  describe("Portfolio Editor", () => {
    beforeEach(() => {
      cy.visit("/portfolio/editor/1");
    });

    it("should edit portfolio content", () => {
      // Edit hero section
      cy.get('[data-testid="hero-title"]').clear().type("Updated Hero Title");
      cy.get('[data-testid="hero-subtitle"]')
        .clear()
        .type("Updated Hero Subtitle");

      // Save changes
      cy.get('[data-testid="save-portfolio"]').click();

      // Verify changes were saved
      cy.get('[data-testid="save-success"]').should("be.visible");
      cy.get('[data-testid="hero-title"]').should(
        "have.value",
        "Updated Hero Title",
      );
    });

    it("should add and remove sections", () => {
      // Add new section
      cy.get('[data-testid="add-section"]').click();
      cy.get('[data-testid="section-testimonials"]').click();

      // Verify section was added
      cy.get('[data-testid="section-testimonials"]').should("be.visible");

      // Remove section
      cy.get('[data-testid="section-testimonials"]')
        .find('[data-testid="remove-section"]')
        .click();
      cy.get('[data-testid="confirm-remove"]').click();

      // Verify section was removed
      cy.get('[data-testid="section-testimonials"]').should("not.exist");
    });

    it("should change portfolio theme", () => {
      // Open theme settings
      cy.get('[data-testid="theme-settings"]').click();

      // Change to dark theme
      cy.get('[data-testid="theme-dark"]').click();

      // Verify theme changed
      cy.get('[data-testid="preview-container"]').should(
        "have.class",
        "dark-theme",
      );

      // Change colors
      cy.get('[data-testid="primary-color"]').click();
      cy.get('[data-testid="color-picker"]').should("be.visible");
      cy.get('[data-testid="color-blue"]').click();

      // Verify color changed
      cy.get('[data-testid="preview-container"]').should(
        "have.css",
        "--primary-color",
        "rgb(59, 130, 246)",
      );
    });

    it("should use AI content generation", () => {
      // Open AI content generator
      cy.get('[data-testid="ai-generate"]').click();

      // Fill in user profile
      cy.get('[data-testid="ai-name"]').type("John Doe");
      cy.get('[data-testid="ai-role"]').type("Full Stack Developer");
      cy.get('[data-testid="ai-industry"]').type("Technology");
      cy.get('[data-testid="ai-experience"]').type("5");

      // Generate hero content
      cy.get('[data-testid="generate-hero"]').click();

      // Wait for generation to complete
      cy.get('[data-testid="generation-progress"]').should("be.visible");
      cy.get('[data-testid="generation-complete"]', { timeout: 30000 }).should(
        "be.visible",
      );

      // Apply generated content
      cy.get('[data-testid="apply-content"]').click();

      // Verify content was applied
      cy.get('[data-testid="hero-title"]').should("not.have.value", "");
      cy.get('[data-testid="hero-description"]').should("not.have.value", "");
    });
  });

  describe("Portfolio Preview", () => {
    it("should preview portfolio in fullscreen", () => {
      cy.visit("/portfolio/preview/1");

      // Enter fullscreen
      cy.get('[data-testid="fullscreen-toggle"]').click();

      // Verify fullscreen mode
      cy.get('[data-testid="fullscreen-container"]').should("be.visible");
      cy.get('[data-testid="fullscreen-controls"]').should("be.visible");

      // Exit fullscreen
      cy.get('[data-testid="exit-fullscreen"]').click();

      // Verify normal mode
      cy.get('[data-testid="fullscreen-container"]').should("not.exist");
    });

    it("should export portfolio", () => {
      cy.visit("/portfolio/preview/1");

      // Open export panel
      cy.get('[data-testid="export-portfolio"]').click();

      // Select export format
      cy.get('[data-testid="export-html"]').click();

      // Configure export options
      cy.get('[data-testid="export-quality"]').select("high");
      cy.get('[data-testid="export-seo"]').check();
      cy.get('[data-testid="export-responsive"]').check();

      // Start export
      cy.get('[data-testid="start-export"]').click();

      // Wait for export to complete
      cy.get('[data-testid="export-progress"]').should("be.visible");
      cy.get('[data-testid="export-complete"]', { timeout: 60000 }).should(
        "be.visible",
      );

      // Verify download link
      cy.get('[data-testid="download-link"]').should("be.visible");
    });
  });

  describe("Portfolio Analytics", () => {
    it("should view portfolio analytics", () => {
      cy.visit("/portfolio/analytics/1");

      // Verify analytics dashboard
      cy.get('[data-testid="analytics-dashboard"]').should("be.visible");
      cy.get('[data-testid="views-chart"]').should("be.visible");
      cy.get('[data-testid="traffic-chart"]').should("be.visible");

      // Check metrics
      cy.get('[data-testid="total-views"]').should("contain", "Views");
      cy.get('[data-testid="unique-visitors"]').should(
        "contain",
        "Unique Visitors",
      );
      cy.get('[data-testid="bounce-rate"]').should("contain", "Bounce Rate");
    });

    it("should filter analytics by date range", () => {
      cy.visit("/portfolio/analytics/1");

      // Select date range
      cy.get('[data-testid="date-range"]').click();
      cy.get('[data-testid="last-7-days"]').click();

      // Verify data updated
      cy.get('[data-testid="analytics-loading"]').should("be.visible");
      cy.get('[data-testid="analytics-data"]', { timeout: 10000 }).should(
        "be.visible",
      );
    });
  });

  describe("Portfolio Sharing", () => {
    it("should share portfolio via link", () => {
      cy.visit("/portfolio/preview/1");

      // Open share modal
      cy.get('[data-testid="share-portfolio"]').click();

      // Copy share link
      cy.get('[data-testid="copy-link"]').click();

      // Verify link copied
      cy.get('[data-testid="link-copied"]').should("be.visible");
    });

    it("should share portfolio on social media", () => {
      cy.visit("/portfolio/preview/1");

      // Open share modal
      cy.get('[data-testid="share-portfolio"]').click();

      // Share on Twitter
      cy.get('[data-testid="share-twitter"]').click();

      // Verify Twitter window opened (in real test, would check for new window)
      cy.window().then((win) => {
        // Mock the window.open call
        cy.stub(win, "open").as("windowOpen");
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors gracefully", () => {
      // Intercept API calls and return error
      cy.intercept("POST", "/api/portfolios", { statusCode: 500 }).as(
        "createPortfolioError",
      );

      cy.visit("/portfolio");
      cy.get('[data-testid="create-portfolio-btn"]').click();

      cy.get('[data-testid="portfolio-title"]').type("Test Portfolio");
      cy.get('[data-testid="portfolio-description"]').type("Test Description");
      cy.get('[data-testid="portfolio-template"]').select("modern");

      cy.get('[data-testid="create-portfolio-submit"]').click();

      // Verify error message
      cy.get('[data-testid="error-message"]').should("be.visible");
      cy.get('[data-testid="error-message"]').should(
        "contain",
        "Failed to create portfolio",
      );
    });

    it("should handle validation errors", () => {
      cy.visit("/portfolio");
      cy.get('[data-testid="create-portfolio-btn"]').click();

      // Try to submit with invalid data
      cy.get('[data-testid="portfolio-title"]').type("a"); // Too short
      cy.get('[data-testid="create-portfolio-submit"]').click();

      // Verify validation errors
      cy.get('[data-testid="title-error"]').should("be.visible");
      cy.get('[data-testid="title-error"]').should(
        "contain",
        "Title must be at least 2 characters",
      );
    });
  });

  describe("Performance Tests", () => {
    it("should load portfolio editor within performance budget", () => {
      cy.visit("/portfolio/editor/1");

      // Measure page load time
      cy.window().then((win) => {
        const loadTime =
          win.performance.timing.loadEventEnd -
          win.performance.timing.navigationStart;
        expect(loadTime).to.be.lessThan(3000); // 3 seconds
      });
    });

    it("should handle large portfolios without performance issues", () => {
      cy.visit("/portfolio/editor/1");

      // Add multiple sections to test performance
      for (let i = 0; i < 10; i++) {
        cy.get('[data-testid="add-section"]').click();
        cy.get('[data-testid="section-projects"]').click();
      }

      // Verify page is still responsive
      cy.get('[data-testid="preview-container"]').should("be.visible");
      cy.get('[data-testid="save-portfolio"]').should("be.enabled");
    });
  });

  describe("Accessibility Tests", () => {
    it("should be keyboard navigable", () => {
      cy.visit("/portfolio");

      // Test keyboard navigation
      cy.get("body").tab();
      cy.focused().should("have.attr", "data-testid", "create-portfolio-btn");

      cy.focused().type("{enter}");
      cy.get('[data-testid="portfolio-title"]').should("be.focused");
    });

    it("should have proper ARIA labels", () => {
      cy.visit("/portfolio/editor/1");

      // Check for ARIA labels
      cy.get('[data-testid="device-selector"]').should(
        "have.attr",
        "aria-label",
      );
      cy.get('[data-testid="zoom-controls"]').should("have.attr", "aria-label");
      cy.get('[data-testid="save-portfolio"]').should(
        "have.attr",
        "aria-label",
      );
    });

    it("should support screen readers", () => {
      cy.visit("/portfolio/editor/1");

      // Check for screen reader text
      cy.get('[data-testid="sr-only"]').should("be.visible");
      cy.get('[data-testid="sr-only"]').should("contain", "Portfolio editor");
    });
  });
});
