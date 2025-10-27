// /lib/postGenerator.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const PLATFORM_RULES = {
  linkedin: { maxLen: 3000, tone: "professional", hashtags: true },
  twitter: { maxLen: 260, tone: "concise", hashtags: true },
  reddit: { maxLen: 3000, tone: "conversational", hashtags: false },
  facebook: { maxLen: 2000, tone: "casual", hashtags: false },
  instagram: { maxLen: 2200, tone: "visual", hashtags: true },
};

function shortSummary(project) {
  const title = project.title || "";
  const desc = (project.description || "").slice(0, 220);
  return `${title}${desc ? " — " + desc : ""}`;
}

function basicTemplate(project, platform) {
  const rule = PLATFORM_RULES[platform] || PLATFORM_RULES.linkedin;
  const tags = (project.tags || [])
    .slice(0, 6)
    .map((t) => `#${t.replace(/\s+/g, "")}`)
    .join(" ");
  let base = shortSummary(project);
  if (rule.hashtags && tags) base += `\n\n${tags}`;
  // add CTA for portfolio or demo link if present
  if (project.demoUrl) base += `\n\nDemo: ${project.demoUrl}`;
  return base.slice(0, rule.maxLen);
}

/**
 * generateMessages(project, platforms, useAI)
 * returns { messageByPlatform: { linkedin: "...", twitter: "..." }, preview: "..." }
 */
export async function generateMessages(
  project,
  platforms = ["linkedin"],
  useAI = false,
) {
  const messageByPlatform = {};
  // If OPENAI configured and useAI true, call LLM once to produce variations
  if (useAI && process.env.OPENAI_API_KEY) {
    try {
      const prompt = buildPromptFromProject(project, platforms);
      const res = await callOpenAI(prompt);
      // Expect res to be JSON with platform keys; otherwise fallback
      if (res && typeof res === "object") {
        for (const p of platforms) {
          messageByPlatform[p] =
            (res[p] && res[p].slice(0, PLATFORM_RULES[p]?.maxLen || 1000)) ||
            basicTemplate(project, p);
        }
        return { messageByPlatform, preview: messageByPlatform[platforms[0]] };
      }
    } catch (err) {
      console.warn(
        "OpenAI failure, falling back to basic templates",
        err.message,
      );
    }
  }

  // fallback simple templates
  for (const p of platforms) {
    messageByPlatform[p] = basicTemplate(project, p);
  }
  return { messageByPlatform, preview: messageByPlatform[platforms[0]] };
}

function buildPromptFromProject(project, platforms) {
  // build a single prompt asking to produce JSON keyed by platform
  const projectText = `Title: ${project.title}\nDescription: ${project.description || ""}\nTags: ${(project.tags || []).join(", ")}\nDemo: ${project.demoUrl || ""}\nMedia: ${(project.media || []).join(", ")}\n\nGenerate JSON with keys ${platforms.join(", ")} where each value is a platform-optimized post.`;
  return projectText;
}

async function callOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");
  const url = "https://api.openai.com/v1/chat/completions";
  const res = await axios.post(
    url,
    {
      model: "gpt-4o-mini", // use model you have access to
      messages: [
        {
          role: "system",
          content: "You are a helpful social media copywriter.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 400,
    },
    { headers: { Authorization: `Bearer ${apiKey}` } },
  );
  const content = res.data.choices?.[0]?.message?.content;
  // attempt to parse JSON out of content, if possible
  try {
    return JSON.parse(content);
  } catch (e) {
    // not JSON: return raw content mapped to first platform
    return { [Object.keys(PLATFORM_RULES)[0]]: content };
  }
}

export default { generateMessages };


