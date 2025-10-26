export const config = {
  openai: {
    apiKey:
      import.meta.env.VITE_OPENAI_API_KEY ||
      "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",
  },
  aws: {
    accessKeyId:
      import.meta.env.VITE_AWS_ACCESS_KEY_ID || "AKIA32DYVQOPEUM466FG",
    secretAccessKey:
      import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ||
      "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",
    region: import.meta.env.VITE_AWS_REGION || "us-east-1",
    bucketName: import.meta.env.VITE_AWS_BUCKET_NAME || "showwork-portfolios",
  },
  vercel: {
    token: import.meta.env.VITE_VERCEL_TOKEN || "a5xLzfUEEfhRW3a006pg4ArT",
    baseUrl: "https://api.vercel.com",
  },
  app: {
    url: import.meta.env.VITE_APP_URL || "http://localhost:3000",
  },
};
