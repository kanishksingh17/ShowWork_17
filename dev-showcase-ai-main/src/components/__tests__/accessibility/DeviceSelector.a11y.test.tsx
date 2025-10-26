import React from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { DeviceSelector } from "../../preview/DeviceSelector";

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock the context
const mockContextValue = {
  state: {
    deviceViewport: {
      type: "desktop",
      width: 1200,
      height: 800,
      name: "Desktop 1200x800",
      orientation: "landscape",
      pixelRatio: 1,
    },
  },
  actions: {
    setDeviceViewport: jest.fn(),
    addCustomViewport: jest.fn(),
    removeCustomViewport: jest.fn(),
  },
  config: {
    defaultDevice: {
      type: "desktop",
      width: 1200,
      height: 800,
      name: "Desktop",
      orientation: "landscape",
      pixelRatio: 1,
    },
  },
};

jest.mock("../../../lib/preview/context", () => ({
  usePreview: () => mockContextValue,
  useDevicePresets: () => [
    {
      id: "desktop-1920",
      name: "Desktop 1920x1080",
      width: 1920,
      height: 1080,
      type: "desktop",
      orientation: "landscape",
      pixelRatio: 1,
      category: "popular",
    },
    {
      id: "ipad-pro",
      name: "iPad Pro",
      width: 1024,
      height: 1366,
      type: "tablet",
      orientation: "portrait",
      pixelRatio: 2,
      category: "popular",
    },
  ],
}));

describe("DeviceSelector Accessibility Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not have accessibility violations", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have proper ARIA labels", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        "aria-label": { enabled: true },
        "aria-labelledby": { enabled: true },
        "aria-describedby": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should be keyboard navigable", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        keyboard: { enabled: true },
        "focus-order-semantics": { enabled: true },
        "focusable-content": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper color contrast", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: true },
        "color-contrast-enhanced": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper heading structure", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        "heading-order": { enabled: true },
        "page-has-heading-one": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper form labels", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        label: { enabled: true },
        "form-field-multiple-labels": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper button roles", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        "button-name": { enabled: true },
        "aria-button-label": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper list structure", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        list: { enabled: true },
        listitem: { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper landmark roles", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        "landmark-one-main": { enabled: true },
        "landmark-unique": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper text alternatives", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        "image-alt": { enabled: true },
        "object-alt": { enabled: true },
        "svg-img-alt": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper link text", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        "link-name": { enabled: true },
        "link-in-text-block": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper table structure", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        "table-fake-caption": { enabled: true },
        "td-headers-attr": { enabled: true },
        "th-has-data-cells": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper form validation", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        "aria-required-attr": { enabled: true },
        "aria-valid-attr": { enabled: true },
        "aria-valid-attr-value": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper focus management", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        "focusable-no-name": { enabled: true },
        "interactive-control-has-label": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper semantic structure", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        "html-has-lang": { enabled: true },
        "html-lang-valid": { enabled: true },
        "html-xml-lang-mismatch": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper ARIA attributes", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        "aria-allowed-attr": { enabled: true },
        "aria-hidden-body": { enabled: true },
        "aria-hidden-focus": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper live regions", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        "aria-live-region": { enabled: true },
        "aria-live-region-has-atomic": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper document structure", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        "document-title": { enabled: true },
        "meta-refresh": { enabled: true },
        "meta-viewport": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper multimedia alternatives", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        "audio-caption": { enabled: true },
        "video-caption": { enabled: true },
        "video-description": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper timing and motion", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        "no-autoplay-audio": { enabled: true },
        "prefers-reduced-motion": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper language and direction", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        "html-lang-valid": { enabled: true },
        "html-xml-lang-mismatch": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper error handling", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        "aria-errormessage": { enabled: true },
        "error-message": { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it("should have proper navigation", async () => {
    const { container } = render(<DeviceSelector />);
    const results = await axe(container, {
      rules: {
        bypass: { enabled: true },
        "landmark-banner-is-top-level": { enabled: true },
        "landmark-contentinfo-is-top-level": { enabled: true },
        "landmark-main-is-top-level": { enabled: true },
        "landmark-navigation-is-top-level": { enabled: true },
        "landmark-no-duplicate-banner": { enabled: true },
        "landmark-no-duplicate-contentinfo": { enabled: true },
        "landmark-no-duplicate-main": { enabled: true },
        "landmark-one-main": { enabled: true },
        "landmark-unique": { enabled: true },
        "page-has-heading-one": { enabled: true },
        region: { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });
});
