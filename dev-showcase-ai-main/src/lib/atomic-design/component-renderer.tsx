"use client";

import React from "react";
import {
  AtomComponent,
  MoleculeComponent,
  OrganismComponent,
  TemplateComponent,
  ComponentProps,
  ResponsiveConfig,
  AccessibilityConfig,
} from "./types";

// Base component props
interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  "data-testid"?: string;
}

// Atom component renderer
interface AtomRendererProps extends BaseComponentProps {
  atom: AtomComponent;
  props: ComponentProps;
  variant?: string;
}

export const AtomRenderer: React.FC<AtomRendererProps> = ({
  atom,
  props,
  variant = "default",
  className,
  style,
  children,
}) => {
  const variantData =
    atom.variants.find((v) => v.name === variant) || atom.variants[0];

  const atomStyles = {
    ...variantData.styles,
    ...style,
  };

  const atomProps = {
    ...variantData.props,
    ...props,
  };

  // Render based on atom element type
  switch (atom.element) {
    case "button":
      return (
        <motion.button
          className={`atom-button ${className || ""}`}
          style={atomStyles}
          {...atomProps}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {children || props.children}
        </motion.button>
      );

    case "input":
      return (
        <motion.input
          className={`atom-input ${className || ""}`}
          style={atomStyles}
          {...atomProps}
          whileFocus={{ scale: 1.02 }}
        />
      );

    case "text":
      return (
        <motion.span
          className={`atom-text ${className || ""}`}
          style={atomStyles}
          {...atomProps}
        >
          {children || props.children}
        </motion.span>
      );

    case "icon":
      return (
        <motion.div
          className={`atom-icon ${className || ""}`}
          style={atomStyles}
          {...atomProps}
          whileHover={{ rotate: 5 }}
        >
          {children}
        </motion.div>
      );

    case "image":
      return (
        <motion.img
          className={`atom-image ${className || ""}`}
          style={atomStyles}
          {...atomProps}
          whileHover={{ scale: 1.05 }}
        />
      );

    case "link":
      return (
        <motion.a
          className={`atom-link ${className || ""}`}
          style={atomStyles}
          {...atomProps}
          whileHover={{ scale: 1.05 }}
        >
          {children || props.children}
        </motion.a>
      );

    default:
      return (
        <motion.div
          className={`atom-${atom.element} ${className || ""}`}
          style={atomStyles}
          {...atomProps}
        >
          {children}
        </motion.div>
      );
  }
};

// Molecule component renderer
interface MoleculeRendererProps extends BaseComponentProps {
  molecule: MoleculeComponent;
  props: ComponentProps;
  atoms: Map<string, AtomComponent>;
}

export const MoleculeRenderer: React.FC<MoleculeRendererProps> = ({
  molecule,
  props,
  atoms,
  className,
  style,
}) => {
  const moleculeStyles = {
    display: molecule.layout.type === "flex" ? "flex" : "grid",
    flexDirection: molecule.layout.direction,
    gap: `${molecule.layout.gap || 0.5}rem`,
    alignItems: molecule.layout.alignment,
    flexWrap: molecule.layout.wrap ? "wrap" : "nowrap",
    ...style,
  };

  const renderAtoms = () => {
    return molecule.atoms
      .map((atomId) => {
        const atom = atoms.get(atomId);
        if (!atom) return null;

        return (
          <AtomRenderer key={atomId} atom={atom} props={props[atomId] || {}} />
        );
      })
      .filter(Boolean);
  };

  return (
    <motion.div
      className={`molecule-${molecule.id} ${className || ""}`}
      style={moleculeStyles}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {renderAtoms()}
    </motion.div>
  );
};

// Organism component renderer
interface OrganismRendererProps extends BaseComponentProps {
  organism: OrganismComponent;
  props: ComponentProps;
  molecules: Map<string, MoleculeComponent>;
  atoms: Map<string, AtomComponent>;
}

export const OrganismRenderer: React.FC<OrganismRendererProps> = ({
  organism,
  props,
  molecules,
  atoms,
  className,
  style,
}) => {
  const organismStyles = {
    display: "grid",
    gridTemplateColumns: `repeat(${organism.layout.columns || 1}, 1fr)`,
    gap: `${organism.layout.spacing || 1}rem`,
    textAlign: organism.layout.alignment,
    ...style,
  };

  const renderSections = () => {
    return organism.sections.map((section) => {
      const sectionMolecules = section.molecules
        .map((moleculeId) => {
          const molecule = molecules.get(moleculeId);
          if (!molecule) return null;

          return (
            <MoleculeRenderer
              key={moleculeId}
              molecule={molecule}
              props={props[moleculeId] || {}}
              atoms={atoms}
            />
          );
        })
        .filter(Boolean);

      const sectionStyles = {
        display: section.layout.type === "flex" ? "flex" : "grid",
        flexDirection: section.layout.direction,
        gap: `${section.layout.gap || 0.5}rem`,
        gridTemplateColumns: `repeat(${section.layout.columns || 1}, 1fr)`,
      };

      return (
        <motion.section
          key={section.id}
          className={`organism-section-${section.id}`}
          style={sectionStyles}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {sectionMolecules}
        </motion.section>
      );
    });
  };

  return (
    <motion.div
      className={`organism-${organism.id} ${className || ""}`}
      style={organismStyles}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {renderSections()}
    </motion.div>
  );
};

// Template component renderer
interface TemplateRendererProps extends BaseComponentProps {
  template: TemplateComponent;
  props: ComponentProps;
  organisms: Map<string, OrganismComponent>;
  molecules: Map<string, MoleculeComponent>;
  atoms: Map<string, AtomComponent>;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  template,
  props,
  organisms,
  molecules,
  atoms,
  className,
  style,
}) => {
  const templateStyles = {
    maxWidth: template.layout.structure.main ? "1200px" : "100%",
    margin: "0 auto",
    padding: "2rem",
    ...style,
  };

  const renderOrganisms = () => {
    return template.organisms
      .map((organismId) => {
        const organism = organisms.get(organismId);
        if (!organism) return null;

        return (
          <OrganismRenderer
            key={organismId}
            organism={organism}
            props={props[organismId] || {}}
            molecules={molecules}
            atoms={atoms}
          />
        );
      })
      .filter(Boolean);
  };

  const renderLayoutStructure = () => {
    const { structure } = template.layout;

    return (
      <>
        {structure.header && (
          <motion.header
            className="template-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderOrganisms().find(
              (_, index) => template.organisms[index] === "header",
            )}
          </motion.header>
        )}

        {structure.hero && (
          <motion.section
            className="template-hero"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {renderOrganisms().find(
              (_, index) => template.organisms[index] === "hero",
            )}
          </motion.section>
        )}

        {structure.main && (
          <motion.main
            className="template-main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {renderOrganisms().filter(
              (_, index) =>
                !["header", "hero", "footer"].includes(
                  template.organisms[index],
                ),
            )}
          </motion.main>
        )}

        {structure.footer && (
          <motion.footer
            className="template-footer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            {renderOrganisms().find(
              (_, index) => template.organisms[index] === "footer",
            )}
          </motion.footer>
        )}
      </>
    );
  };

  return (
    <motion.div
      className={`template-${template.id} ${className || ""}`}
      style={templateStyles}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {renderLayoutStructure()}
    </motion.div>
  );
};

// Responsive wrapper component
interface ResponsiveWrapperProps {
  children: React.ReactNode;
  responsive: ResponsiveConfig;
  className?: string;
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  responsive,
  className,
}) => {
  const [currentBreakpoint, setCurrentBreakpoint] =
    React.useState<string>("desktop");

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < responsive.breakpoints.mobile) {
        setCurrentBreakpoint("mobile");
      } else if (width < responsive.breakpoints.tablet) {
        setCurrentBreakpoint("tablet");
      } else if (width < responsive.breakpoints.desktop) {
        setCurrentBreakpoint("desktop");
      } else {
        setCurrentBreakpoint("wide");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [responsive.breakpoints]);

  const responsiveStyles = {
    "--mobile-breakpoint": `${responsive.breakpoints.mobile}px`,
    "--tablet-breakpoint": `${responsive.breakpoints.tablet}px`,
    "--desktop-breakpoint": `${responsive.breakpoints.desktop}px`,
    "--wide-breakpoint": `${responsive.breakpoints.wide}px`,
  } as React.CSSProperties;

  return (
    <div
      className={`responsive-wrapper ${className || ""}`}
      style={responsiveStyles}
      data-breakpoint={currentBreakpoint}
    >
      {children}
    </div>
  );
};

// Accessibility wrapper component
interface AccessibilityWrapperProps {
  children: React.ReactNode;
  accessibility: AccessibilityConfig;
  className?: string;
}

export const AccessibilityWrapper: React.FC<AccessibilityWrapperProps> = ({
  children,
  accessibility,
  className,
}) => {
  React.useEffect(() => {
    // Apply accessibility enhancements
    if (accessibility.keyboardNavigation) {
      document.body.classList.add("keyboard-navigation");
    }

    if (accessibility.screenReaderSupport) {
      document.body.classList.add("screen-reader-support");
    }

    if (accessibility.focusManagement) {
      document.body.classList.add("focus-management");
    }

    if (accessibility.semanticHTML) {
      document.body.classList.add("semantic-html");
    }

    return () => {
      document.body.classList.remove(
        "keyboard-navigation",
        "screen-reader-support",
        "focus-management",
        "semantic-html",
      );
    };
  }, [accessibility]);

  return (
    <div
      className={`accessibility-wrapper ${className || ""}`}
      role="main"
      aria-label="Portfolio content"
    >
      {children}
    </div>
  );
};

// Main component renderer
interface ComponentRendererProps {
  component:
    | AtomComponent
    | MoleculeComponent
    | OrganismComponent
    | TemplateComponent;
  props: ComponentProps;
  atoms?: Map<string, AtomComponent>;
  molecules?: Map<string, MoleculeComponent>;
  organisms?: Map<string, OrganismComponent>;
  className?: string;
  style?: React.CSSProperties;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  props,
  atoms = new Map(),
  molecules = new Map(),
  organisms = new Map(),
  className,
  style,
}) => {
  const renderComponent = () => {
    switch (component.type) {
      case "atom":
        return (
          <AtomRenderer
            atom={component as AtomComponent}
            props={props}
            className={className}
            style={style}
          />
        );

      case "molecule":
        return (
          <MoleculeRenderer
            molecule={component as MoleculeComponent}
            props={props}
            atoms={atoms}
            className={className}
            style={style}
          />
        );

      case "organism":
        return (
          <OrganismRenderer
            organism={component as OrganismComponent}
            props={props}
            molecules={molecules}
            atoms={atoms}
            className={className}
            style={style}
          />
        );

      case "template":
        return (
          <TemplateRenderer
            template={component as TemplateComponent}
            props={props}
            organisms={organisms}
            molecules={molecules}
            atoms={atoms}
            className={className}
            style={style}
          />
        );

      default:
        return <div>Unknown component type</div>;
    }
  };

  return (
    <ResponsiveWrapper responsive={component.responsive}>
      <AccessibilityWrapper accessibility={component.accessibility}>
        {renderComponent()}
      </AccessibilityWrapper>
    </ResponsiveWrapper>
  );
};

export default ComponentRenderer;
