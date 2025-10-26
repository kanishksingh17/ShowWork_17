import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Download, 
  Share, 
  Edit, 
  Eye, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Globe,
  ExternalLink,
  Code,
  Briefcase,
  Award,
  Users
} from 'lucide-react';
import { UserPortfolio, Project } from '../../types/portfolio';

interface PortfolioPreviewProps {
  portfolio: UserPortfolio;
  projects: Project[];
  onEdit: () => void;
  onShare: (url: string) => void;
}

export const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({
  portfolio,
  projects,
  onEdit,
  onShare
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    // Generate share URL
    const url = `${window.location.origin}/portfolio/${portfolio.id}`;
    setShareUrl(url);
  }, [portfolio.id]);

  const getSocialIcon = (platform: string) => {
    const icons = {
      github: Github,
      linkedin: Linkedin,
      twitter: Twitter,
      email: Mail,
      website: Globe
    };
    return icons[platform as keyof typeof icons] || Globe;
  };

  const renderSection = (section: any) => {
    switch (section.type) {
      case 'hero':
        return (
          <section className="hero-section py-20 px-6 text-center" 
                   style={{ 
                     backgroundColor: portfolio.customizations.colors.background,
                     color: portfolio.customizations.colors.text 
                   }}>
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold mb-6" 
                  style={{ 
                    fontFamily: portfolio.customizations.fonts.heading,
                    color: portfolio.customizations.colors.primary 
                  }}>
                {section.content || 'Your Name'}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {portfolio.jobRole?.description || 'Professional Developer'}
              </p>
              <div className="flex justify-center gap-4">
                {portfolio.customizations.socialLinks
                  .filter(link => link.isVisible)
                  .map(link => {
                    const IconComponent = getSocialIcon(link.platform);
                    return (
                      <Button
                        key={link.platform}
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          <IconComponent className="h-4 w-4 mr-2" />
                          {link.platform}
                        </a>
                      </Button>
                    );
                  })}
              </div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section className="about-section py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6" 
                  style={{ 
                    fontFamily: portfolio.customizations.fonts.heading,
                    color: portfolio.customizations.colors.primary 
                  }}>
                About Me
              </h2>
              <div className="prose prose-lg max-w-none" 
                   style={{ fontFamily: portfolio.customizations.fonts.body }}>
                {section.content ? (
                  <div dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br>') }} />
                ) : (
                  <p>Tell your story here...</p>
                )}
              </div>
            </div>
          </section>
        );

      case 'projects':
        return (
          <section className="projects-section py-16 px-6" 
                   style={{ backgroundColor: portfolio.customizations.colors.background }}>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center" 
                  style={{ 
                    fontFamily: portfolio.customizations.fonts.heading,
                    color: portfolio.customizations.colors.primary 
                  }}>
                Featured Projects
              </h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {projects.slice(0, 6).map((project, index) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <Badge variant="secondary">
                          {project.technologies[0]}
                        </Badge>
                      </div>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map(tech => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4 mr-1" />
                              Code
                            </a>
                          </Button>
                        )}
                        {project.liveUrl && (
                          <Button size="sm" asChild>
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Live Demo
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        );

      case 'skills':
        return (
          <section className="skills-section py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center" 
                  style={{ 
                    fontFamily: portfolio.customizations.fonts.heading,
                    color: portfolio.customizations.colors.primary 
                  }}>
                Skills & Technologies
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {portfolio.jobRole?.skills.map(skill => (
                  <Badge 
                    key={skill} 
                    className="px-4 py-2 text-sm"
                    style={{ 
                      backgroundColor: portfolio.customizations.colors.accent,
                      color: 'white'
                    }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </section>
        );

      case 'experience':
        return (
          <section className="experience-section py-16 px-6" 
                   style={{ backgroundColor: portfolio.customizations.colors.background }}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center" 
                  style={{ 
                    fontFamily: portfolio.customizations.fonts.heading,
                    color: portfolio.customizations.colors.primary 
                  }}>
                Professional Experience
              </h2>
              <div className="space-y-6">
                {section.content ? (
                  <div className="prose prose-lg max-w-none" 
                       style={{ fontFamily: portfolio.customizations.fonts.body }}>
                    <div dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br>') }} />
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your professional experience will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section className="contact-section py-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8" 
                  style={{ 
                    fontFamily: portfolio.customizations.fonts.heading,
                    color: portfolio.customizations.colors.primary 
                  }}>
                Get In Touch
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {section.content || 'Ready to work together? Let\'s connect!'}
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                {portfolio.customizations.socialLinks
                  .filter(link => link.isVisible)
                  .map(link => {
                    const IconComponent = getSocialIcon(link.platform);
                    return (
                      <Button
                        key={link.platform}
                        size="lg"
                        asChild
                      >
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          <IconComponent className="h-5 w-5 mr-2" />
                          {link.platform}
                        </a>
                      </Button>
                    );
                  })}
              </div>
            </div>
          </section>
        );

      default:
        return (
          <section className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6" 
                  style={{ 
                    fontFamily: portfolio.customizations.fonts.heading,
                    color: portfolio.customizations.colors.primary 
                  }}>
                {section.title}
              </h2>
              <div className="prose prose-lg max-w-none" 
                   style={{ fontFamily: portfolio.customizations.fonts.body }}>
                {section.content ? (
                  <div dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br>') }} />
                ) : (
                  <p>Content for this section will appear here.</p>
                )}
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="portfolio-preview">
      {/* Preview Controls */}
      <div className="sticky top-0 z-50 bg-white border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Portfolio Preview</h3>
            <Badge variant="outline">
              {portfolio.templateId}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare(shareUrl)}
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Portfolio Content */}
      <div className={`portfolio-content ${isFullscreen ? 'fixed inset-0 z-40 bg-white overflow-auto' : ''}`}
           style={{ 
             fontFamily: portfolio.customizations.fonts.body,
             color: portfolio.customizations.colors.text 
           }}>
        {portfolio.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <div key={section.id}>
              {renderSection(section)}
            </div>
          ))}
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t text-center text-muted-foreground">
        <p>Generated with AI-powered portfolio builder</p>
      </footer>
    </div>
  );
};

