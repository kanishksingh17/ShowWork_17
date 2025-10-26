import React, { useState, useEffect } from "react";
import {
  Github,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GitHubData {
  name: string;
  description: string;
  readme: string;
  languages: Record<string, number>;
  topics: string[];
  stars: number;
  forks: number;
  lastUpdated: string;
  demoUrl?: string;
  homepage?: string;
  license?: string;
}

interface GitHubScraperProps {
  url: string;
  onDataScraped: (data: GitHubData) => void;
  className?: string;
}

const GitHubScraper: React.FC<GitHubScraperProps> = ({
  url,
  onDataScraped,
  className = "",
}) => {
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedData, setScrapedData] = useState<GitHubData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValidUrl, setIsValidUrl] = useState(false);

  useEffect(() => {
    if (url && url.includes("github.com")) {
      setIsValidUrl(true);
      setError(null);
    } else {
      setIsValidUrl(false);
      setError("Please enter a valid GitHub URL");
    }
  }, [url]);

  const extractRepoInfo = (url: string) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, ""),
      };
    }
    return null;
  };

  const scrapeRepository = async () => {
    if (!isValidUrl) return;

    setIsScraping(true);
    setError(null);

    try {
      const repoInfo = extractRepoInfo(url);
      if (!repoInfo) {
        throw new Error("Invalid GitHub URL format");
      }

      // Simulate API calls to GitHub
      const [repoData, readmeData, languagesData] = await Promise.all([
        // Repository basic info
        fetch(
          `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`,
        ).then((res) => res.json()),

        // README content
        fetch(
          `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/readme`,
        )
          .then((res) => res.json())
          .then((data) => atob(data.content))
          .catch(() => ""),

        // Languages
        fetch(
          `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/languages`,
        )
          .then((res) => res.json())
          .catch(() => ({})),
      ]);

      // Process the scraped data
      const processedData: GitHubData = {
        name: repoData.name || repoInfo.repo,
        description: repoData.description || "",
        readme: readmeData,
        languages: languagesData,
        topics: repoData.topics || [],
        stars: repoData.stargazers_count || 0,
        forks: repoData.forks_count || 0,
        lastUpdated: repoData.updated_at || "",
        demoUrl: repoData.homepage,
        homepage: repoData.homepage,
        license: repoData.license?.name,
      };

      setScrapedData(processedData);
      onDataScraped(processedData);
    } catch (err) {
      console.error("GitHub scraping failed:", err);
      setError(
        "Failed to scrape repository. Please check the URL and try again.",
      );
    } finally {
      setIsScraping(false);
    }
  };

  const getTopLanguages = (
    languages: Record<string, number>,
    limit: number = 5,
  ) => {
    return Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([lang]) => lang);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: "bg-yellow-500",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      Java: "bg-red-500",
      Go: "bg-cyan-500",
      Rust: "bg-orange-500",
      "C++": "bg-blue-600",
      "C#": "bg-purple-500",
      PHP: "bg-indigo-500",
      Ruby: "bg-red-600",
      Swift: "bg-orange-600",
      Kotlin: "bg-purple-600",
      HTML: "bg-orange-500",
      CSS: "bg-blue-400",
      SCSS: "bg-pink-500",
      Vue: "bg-green-400",
      React: "bg-blue-400",
      Angular: "bg-red-500",
      Svelte: "bg-orange-500",
    };
    return colors[language] || "bg-gray-500";
  };

  if (!url) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Scrape Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Github className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Auto-fill from GitHub
          </span>
        </div>
        <Button
          onClick={scrapeRepository}
          disabled={!isValidUrl || isScraping}
          size="sm"
          variant="outline"
        >
          {isScraping ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Scraping...
            </>
          ) : (
            <>
              <Github className="w-4 h-4 mr-2" />
              Scrape Repo
            </>
          )}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      {/* Scraped Data Preview */}
      {scrapedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Repository Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Repository Info */}
            <div>
              <h4 className="font-semibold text-lg">{scrapedData.name}</h4>
              {scrapedData.description && (
                <p className="text-gray-600 text-sm mt-1">
                  {scrapedData.description}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>⭐ {scrapedData.stars.toLocaleString()}</span>
              <span>🍴 {scrapedData.forks.toLocaleString()}</span>
              {scrapedData.license && <span>📄 {scrapedData.license}</span>}
              <span>Updated {formatDate(scrapedData.lastUpdated)}</span>
            </div>

            {/* Languages */}
            {Object.keys(scrapedData.languages).length > 0 && (
              <div>
                <h5 className="font-medium text-sm text-gray-700 mb-2">
                  Languages
                </h5>
                <div className="flex flex-wrap gap-2">
                  {getTopLanguages(scrapedData.languages).map((language) => (
                    <Badge
                      key={language}
                      variant="outline"
                      className="flex items-center space-x-1"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${getLanguageColor(language)}`}
                      />
                      <span>{language}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Topics */}
            {scrapedData.topics.length > 0 && (
              <div>
                <h5 className="font-medium text-sm text-gray-700 mb-2">
                  Topics
                </h5>
                <div className="flex flex-wrap gap-1">
                  {scrapedData.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex items-center space-x-4">
              {scrapedData.homepage && (
                <a
                  href={scrapedData.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Homepage</span>
                </a>
              )}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-sm"
              >
                <Github className="w-3 h-3" />
                <span>View on GitHub</span>
              </a>
            </div>

            {/* README Preview */}
            {scrapedData.readme && (
              <div>
                <h5 className="font-medium text-sm text-gray-700 mb-2">
                  README Preview
                </h5>
                <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                    {scrapedData.readme.substring(0, 500)}
                    {scrapedData.readme.length > 500 && "..."}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GitHubScraper;
