/**
 * Hook for automatic domain extraction when projects are created/updated
 */

import {
  domainExtractionService,
  ProjectData,
} from "@/services/domainExtractionService";

export interface ProjectUpdateData {
  name: string;
  description: string;
  technologies: string[];
  tags: string[];
  category?: string;
}

/**
 * Extract domain for a project and return the domain string
 */
export async function extractProjectDomain(
  projectData: ProjectUpdateData,
): Promise<string> {
  try {
    const result = await domainExtractionService.extractDomain(projectData);
    console.log(
      `Domain extracted for project "${projectData.name}": ${result.domain} (confidence: ${result.confidence}, method: ${result.method})`,
    );
    return result.domain;
  } catch (error) {
    console.error("Domain extraction failed:", error);
    return "general"; // Fallback domain
  }
}

/**
 * Hook to automatically extract domain when project data changes
 */
export function useProjectDomainExtraction() {
  const extractDomain = async (
    projectData: ProjectUpdateData,
  ): Promise<string> => {
    return extractProjectDomain(projectData);
  };

  return { extractDomain };
}
