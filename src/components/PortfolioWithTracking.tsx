import React from 'react';
import { usePortfolioTracking } from '@/hooks/usePortfolioTracking';

interface PortfolioWithTrackingProps {
  portfolioId: string;
  userId?: string;
  children: React.ReactNode;
}

export function PortfolioWithTracking({ 
  portfolioId, 
  userId, 
  children 
}: PortfolioWithTrackingProps) {
  const { trackCustomEvent, trackGoal, trackConversion } = usePortfolioTracking({
    portfolioId,
    userId,
  });

  const handleProjectClick = (projectId: string, projectName: string) => {
    trackCustomEvent('project_view', {
      projectId,
      projectName,
      source: 'portfolio_page',
    });
  };

  const handleCVDownload = (cvType: string, format: string) => {
    trackCustomEvent('cv_download', {
      cvType,
      format,
      source: 'portfolio_page',
    });
    
    // Track as a goal completion
    trackGoal('cv_download', 1);
  };

  const handleContactSubmit = (formType: string) => {
    trackCustomEvent('contact_submission', {
      formType,
      source: 'portfolio_page',
    });
    
    // Track as a conversion
    trackConversion('contact_form', 1);
  };

  const handleSocialMediaClick = (platform: string, linkType: string) => {
    trackCustomEvent('social_media_click', {
      platform,
      linkType,
      source: 'portfolio_page',
    });
  };

  return (
    <div className="portfolio-container">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            onProjectClick: handleProjectClick,
            onCVDownload: handleCVDownload,
            onContactSubmit: handleContactSubmit,
            onSocialMediaClick: handleSocialMediaClick,
          });
        }
        return child;
      })}
    </div>
  );
}

// Example usage component
export function ExamplePortfolioProject({ 
  projectId, 
  projectName, 
  onProjectClick 
}: { 
  projectId: string; 
  projectName: string; 
  onProjectClick: (projectId: string, projectName: string) => void;
}) {
  return (
    <div 
      className="project-card cursor-pointer"
      onClick={() => onProjectClick(projectId, projectName)}
      data-project-id={projectId}
      data-interaction-type="click"
    >
      <h3>{projectName}</h3>
      <p>Click to view project details</p>
    </div>
  );
}

export function ExampleCVDownloadButton({ 
  onCVDownload 
}: { 
  onCVDownload: (cvType: string, format: string) => void;
}) {
  return (
    <button
      onClick={() => onCVDownload('professional', 'pdf')}
      data-cv-download
      data-cv-type="professional"
      data-cv-format="pdf"
      className="cv-download-button"
    >
      Download CV (PDF)
    </button>
  );
}

export function ExampleContactForm({ 
  onContactSubmit 
}: { 
  onContactSubmit: (formType: string) => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContactSubmit('contact');
  };

  return (
    <form 
      onSubmit={handleSubmit}
      data-contact-form
      data-form-type="contact"
      className="contact-form"
    >
      <input type="text" placeholder="Name" required />
      <input type="email" placeholder="Email" required />
      <textarea placeholder="Message" required />
      <button type="submit">Send Message</button>
    </form>
  );
}

export function ExampleSocialMediaLinks({ 
  onSocialMediaClick 
}: { 
  onSocialMediaClick: (platform: string, linkType: string) => void;
}) {
  return (
    <div className="social-media-links">
      <a
        href="https://linkedin.com/in/yourprofile"
        onClick={() => onSocialMediaClick('linkedin', 'profile')}
        data-social-link
        data-social-platform="linkedin"
        data-link-type="profile"
      >
        LinkedIn
      </a>
      <a
        href="https://github.com/yourusername"
        onClick={() => onSocialMediaClick('github', 'profile')}
        data-social-link
        data-social-platform="github"
        data-link-type="profile"
      >
        GitHub
      </a>
      <a
        href="https://twitter.com/yourusername"
        onClick={() => onSocialMediaClick('twitter', 'profile')}
        data-social-link
        data-social-platform="twitter"
        data-link-type="profile"
      >
        Twitter
      </a>
    </div>
  );
}
