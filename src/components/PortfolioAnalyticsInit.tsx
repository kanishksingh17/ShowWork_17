import React, { useEffect } from 'react';
import { useRealTimeTracking } from '@/hooks/useRealTimeTracking';

interface PortfolioAnalyticsInitProps {
  userId?: string;
  portfolioId: string;
  children: React.ReactNode;
}

export function PortfolioAnalyticsInit({ 
  userId, 
  portfolioId, 
  children 
}: PortfolioAnalyticsInitProps) {
  const { trackEvent } = useRealTimeTracking({ userId });

  useEffect(() => {
    // Track portfolio page view
    trackEvent('view', 'portfolio-page', {
      portfolioId,
      timestamp: new Date().toISOString(),
    });
  }, [portfolioId, trackEvent]);

  return <>{children}</>;
}

// Example usage in your portfolio components
export function ProjectCard({ 
  projectId, 
  projectName, 
  description, 
  technologies, 
  liveUrl, 
  githubUrl 
}: {
  projectId: string;
  projectName: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}) {
  const { trackProjectView, trackProjectClick, trackDemoClick } = useRealTimeTracking();

  const handleProjectClick = () => {
    trackProjectClick(projectId, projectName);
  };

  const handleDemoClick = () => {
    if (liveUrl) {
      trackDemoClick(projectId, liveUrl);
    }
  };

  return (
    <div 
      className="project-card cursor-pointer border rounded-lg p-4 hover:shadow-md transition-shadow"
      data-project-id={projectId}
      onClick={handleProjectClick}
    >
      <h3 className="font-semibold text-lg mb-2">{projectName}</h3>
      <p className="text-muted-foreground mb-3">{description}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {technologies.map((tech) => (
          <span 
            key={tech} 
            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
          >
            {tech}
          </span>
        ))}
      </div>
      
      <div className="flex gap-2">
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDemoClick}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
            data-demo
          >
            Live Demo
          </a>
        )}
        
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
            data-github-link
            data-project-id={projectId}
          >
            GitHub
          </a>
        )}
      </div>
    </div>
  );
}

export function CVDownloadButton({ 
  cvType = 'professional', 
  format = 'pdf' 
}: {
  cvType?: string;
  format?: string;
}) {
  const { trackCVDownload } = useRealTimeTracking();

  const handleDownload = () => {
    trackCVDownload(cvType, format);
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      data-cv-download
      data-cv-type={cvType}
      data-cv-format={format}
    >
      Download CV ({format.toUpperCase()})
    </button>
  );
}

export function ContactForm() {
  const { trackContactSubmission } = useRealTimeTracking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackContactSubmission('contact');
    // Your form submission logic here
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="space-y-4"
      data-contact-form
      data-form-type="contact"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={4}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Send Message
      </button>
    </form>
  );
}

export function SocialMediaLinks() {
  const { trackSocialClick } = useRealTimeTracking();

  const handleSocialClick = (platform: string, url: string) => {
    trackSocialClick(platform, url);
  };

  return (
    <div className="flex gap-4">
      <a
        href="https://linkedin.com/in/yourprofile"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleSocialClick('linkedin', 'https://linkedin.com/in/yourprofile')}
        className="text-blue-600 hover:text-blue-800"
        data-social-link
        data-social-platform="linkedin"
        data-link-type="profile"
      >
        LinkedIn
      </a>
      
      <a
        href="https://github.com/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleSocialClick('github', 'https://github.com/yourusername')}
        className="text-gray-600 hover:text-gray-800"
        data-social-link
        data-social-platform="github"
        data-link-type="profile"
      >
        GitHub
      </a>
      
      <a
        href="https://twitter.com/yourusername"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleSocialClick('twitter', 'https://twitter.com/yourusername')}
        className="text-blue-400 hover:text-blue-600"
        data-social-link
        data-social-platform="twitter"
        data-link-type="profile"
      >
        Twitter
      </a>
    </div>
  );
}
