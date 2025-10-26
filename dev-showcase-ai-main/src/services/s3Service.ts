// AWS S3 API Integration - Stores all generated static assets
export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
}

export interface S3Object {
  Key: string;
  Body: Buffer | string;
  ContentType?: string;
  ContentEncoding?: string;
  CacheControl?: string;
  Metadata?: Record<string, string>;
}

export interface S3UploadResult {
  Location: string;
  ETag: string;
  Bucket: string;
  Key: string;
}

export interface S3WebsiteConfig {
  IndexDocument: {
    Suffix: string;
  };
  ErrorDocument?: {
    Key: string;
  };
}

// AWS S3 Client
export class S3Client {
  private config: S3Config;
  private baseUrl: string;

  constructor(config: S3Config) {
    this.config = config;
    this.baseUrl = `https://${config.bucketName}.s3.${config.region}.amazonaws.com`;
  }

  // Create Bucket
  async createBucket(): Promise<void> {
    const url = `https://s3.${this.config.region}.amazonaws.com/${this.config.bucketName}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: this.generateAuthHeader(
          "PUT",
          `/${this.config.bucketName}`,
          "",
        ),
        "Content-Type": "application/xml",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to create bucket: ${response.statusText}`);
    }
  }

  // Put Object - Upload file to S3
  async putObject(object: S3Object): Promise<S3UploadResult> {
    const url = `${this.baseUrl}/${object.Key}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: this.generateAuthHeader(
          "PUT",
          `/${object.Key}`,
          object.Body,
        ),
        "Content-Type": object.ContentType || "application/octet-stream",
        "Content-Length": object.Body.length.toString(),
        "Cache-Control": object.CacheControl || "public, max-age=31536000",
        ...(object.Metadata && {
          "x-amz-meta-": Object.entries(object.Metadata)
            .map(([key, value]) => `${key}=${value}`)
            .join(", "),
        }),
      },
      body: object.Body,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload object: ${response.statusText}`);
    }

    return {
      Location: url,
      ETag: response.headers.get("ETag") || "",
      Bucket: this.config.bucketName,
      Key: object.Key,
    };
  }

  // Put Bucket Website - Configure static website hosting
  async putBucketWebsite(config: S3WebsiteConfig): Promise<void> {
    const url = `https://s3.${this.config.region}.amazonaws.com/${this.config.bucketName}?website`;

    const websiteConfig = `
      <WebsiteConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
        <IndexDocument>
          <Suffix>${config.IndexDocument.Suffix}</Suffix>
        </IndexDocument>
        ${
          config.ErrorDocument
            ? `
        <ErrorDocument>
          <Key>${config.ErrorDocument.Key}</Key>
        </ErrorDocument>
        `
            : ""
        }
      </WebsiteConfiguration>
    `;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: this.generateAuthHeader(
          "PUT",
          `/${this.config.bucketName}?website`,
          websiteConfig,
        ),
        "Content-Type": "application/xml",
        "Content-Length": websiteConfig.length.toString(),
      },
      body: websiteConfig,
    });

    if (!response.ok) {
      throw new Error(`Failed to configure website: ${response.statusText}`);
    }
  }

  // Get Object - Download file from S3
  async getObject(key: string): Promise<Buffer> {
    const url = `${this.baseUrl}/${key}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: this.generateAuthHeader("GET", `/${key}`, ""),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get object: ${response.statusText}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  // Delete Object
  async deleteObject(key: string): Promise<void> {
    const url = `${this.baseUrl}/${key}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: this.generateAuthHeader("DELETE", `/${key}`, ""),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete object: ${response.statusText}`);
    }
  }

  // List Objects
  async listObjects(prefix?: string): Promise<string[]> {
    const url = `${this.baseUrl}/?${prefix ? `prefix=${encodeURIComponent(prefix)}&` : ""}list-type=2`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: this.generateAuthHeader(
          "GET",
          `/?${prefix ? `prefix=${encodeURIComponent(prefix)}&` : ""}list-type=2`,
          "",
        ),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list objects: ${response.statusText}`);
    }

    const xml = await response.text();
    const keys = xml.match(/<Key>(.*?)<\/Key>/g) || [];
    return keys.map((key) => key.replace(/<\/?Key>/g, ""));
  }

  // Generate AWS Signature V4 Authorization Header
  private generateAuthHeader(
    method: string,
    path: string,
    body: string | Buffer,
  ): string {
    // This is a simplified version - in production, use AWS SDK or proper signature generation
    const timestamp = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, "");
    const date = timestamp.substr(0, 8);

    return `AWS4-HMAC-SHA256 Credential=${this.config.accessKeyId}/${date}/${this.config.region}/s3/aws4_request, SignedHeaders=host;x-amz-date, Signature=placeholder`;
  }
}

// Portfolio Asset Manager
export class PortfolioAssetManager {
  private s3: S3Client;
  private bucketName: string;

  constructor(config: S3Config) {
    this.s3 = new S3Client(config);
    this.bucketName = config.bucketName;
  }

  // Upload portfolio assets
  async uploadPortfolioAssets(
    portfolioId: string,
    assets: {
      html: string;
      css: string;
      js: string;
      images: Array<{ name: string; data: Buffer; type: string }>;
      fonts: Array<{ name: string; data: Buffer; type: string }>;
    },
  ): Promise<{
    htmlUrl: string;
    cssUrl: string;
    jsUrl: string;
    imageUrls: string[];
    fontUrls: string[];
  }> {
    const prefix = `portfolios/${portfolioId}/`;

    // Upload HTML
    const htmlResult = await this.s3.putObject({
      Key: `${prefix}index.html`,
      Body: assets.html,
      ContentType: "text/html",
      CacheControl: "public, max-age=3600",
    });

    // Upload CSS
    const cssResult = await this.s3.putObject({
      Key: `${prefix}styles.css`,
      Body: assets.css,
      ContentType: "text/css",
      CacheControl: "public, max-age=31536000",
    });

    // Upload JavaScript
    const jsResult = await this.s3.putObject({
      Key: `${prefix}script.js`,
      Body: assets.js,
      ContentType: "application/javascript",
      CacheControl: "public, max-age=31536000",
    });

    // Upload images
    const imageUrls: string[] = [];
    for (const image of assets.images) {
      const result = await this.s3.putObject({
        Key: `${prefix}images/${image.name}`,
        Body: image.data,
        ContentType: image.type,
        CacheControl: "public, max-age=31536000",
      });
      imageUrls.push(result.Location);
    }

    // Upload fonts
    const fontUrls: string[] = [];
    for (const font of assets.fonts) {
      const result = await this.s3.putObject({
        Key: `${prefix}fonts/${font.name}`,
        Body: font.data,
        ContentType: font.type,
        CacheControl: "public, max-age=31536000",
      });
      fontUrls.push(result.Location);
    }

    return {
      htmlUrl: htmlResult.Location,
      cssUrl: cssResult.Location,
      jsUrl: jsResult.Location,
      imageUrls,
      fontUrls,
    };
  }

  // Configure static website hosting
  async configureStaticWebsite(): Promise<string> {
    await this.s3.putBucketWebsite({
      IndexDocument: {
        Suffix: "index.html",
      },
      ErrorDocument: {
        Key: "404.html",
      },
    });

    return `http://${this.bucketName}.s3-website-${this.s3["config"].region}.amazonaws.com`;
  }

  // Upload optimized assets
  async uploadOptimizedAssets(
    portfolioId: string,
    optimizedAssets: {
      html: string;
      css: string;
      js: string;
      images: Array<{ name: string; data: Buffer; type: string; size: number }>;
    },
  ): Promise<{
    totalSize: number;
    urls: {
      html: string;
      css: string;
      js: string;
      images: string[];
    };
  }> {
    const prefix = `portfolios/${portfolioId}/optimized/`;
    let totalSize = 0;

    // Upload optimized HTML
    const htmlBuffer = Buffer.from(optimizedAssets.html);
    const htmlResult = await this.s3.putObject({
      Key: `${prefix}index.html`,
      Body: htmlBuffer,
      ContentType: "text/html",
      CacheControl: "public, max-age=3600",
      Metadata: {
        optimized: "true",
        size: htmlBuffer.length.toString(),
      },
    });
    totalSize += htmlBuffer.length;

    // Upload optimized CSS
    const cssBuffer = Buffer.from(optimizedAssets.css);
    const cssResult = await this.s3.putObject({
      Key: `${prefix}styles.css`,
      Body: cssBuffer,
      ContentType: "text/css",
      CacheControl: "public, max-age=31536000",
      Metadata: {
        optimized: "true",
        size: cssBuffer.length.toString(),
      },
    });
    totalSize += cssBuffer.length;

    // Upload optimized JavaScript
    const jsBuffer = Buffer.from(optimizedAssets.js);
    const jsResult = await this.s3.putObject({
      Key: `${prefix}script.js`,
      Body: jsBuffer,
      ContentType: "application/javascript",
      CacheControl: "public, max-age=31536000",
      Metadata: {
        optimized: "true",
        size: jsBuffer.length.toString(),
      },
    });
    totalSize += jsBuffer.length;

    // Upload optimized images
    const imageUrls: string[] = [];
    for (const image of optimizedAssets.images) {
      const result = await this.s3.putObject({
        Key: `${prefix}images/${image.name}`,
        Body: image.data,
        ContentType: image.type,
        CacheControl: "public, max-age=31536000",
        Metadata: {
          optimized: "true",
          size: image.size.toString(),
          "original-size": image.size.toString(),
        },
      });
      imageUrls.push(result.Location);
      totalSize += image.size;
    }

    return {
      totalSize,
      urls: {
        html: htmlResult.Location,
        css: cssResult.Location,
        js: jsResult.Location,
        images: imageUrls,
      },
    };
  }

  // Get portfolio assets
  async getPortfolioAssets(portfolioId: string): Promise<{
    html: string;
    css: string;
    js: string;
    images: Buffer[];
  }> {
    const prefix = `portfolios/${portfolioId}/`;

    const [html, css, js] = await Promise.all([
      this.s3.getObject(`${prefix}index.html`),
      this.s3.getObject(`${prefix}styles.css`),
      this.s3.getObject(`${prefix}script.js`),
    ]);

    // Get all images
    const imageKeys = await this.s3.listObjects(`${prefix}images/`);
    const images = await Promise.all(
      imageKeys.map((key) => this.s3.getObject(key)),
    );

    return {
      html: html.toString("utf-8"),
      css: css.toString("utf-8"),
      js: js.toString("utf-8"),
      images,
    };
  }

  // Delete portfolio assets
  async deletePortfolioAssets(portfolioId: string): Promise<void> {
    const prefix = `portfolios/${portfolioId}/`;
    const keys = await this.s3.listObjects(prefix);

    await Promise.all(keys.map((key) => this.s3.deleteObject(key)));
  }

  // Get asset URLs for CDN
  getAssetUrls(
    portfolioId: string,
    cdnDomain?: string,
  ): {
    html: string;
    css: string;
    js: string;
    images: string[];
  } {
    const baseUrl =
      cdnDomain ||
      `https://${this.bucketName}.s3.${this.s3["config"].region}.amazonaws.com`;
    const prefix = `portfolios/${portfolioId}/`;

    return {
      html: `${baseUrl}/${prefix}index.html`,
      css: `${baseUrl}/${prefix}styles.css`,
      js: `${baseUrl}/${prefix}script.js`,
      images: [
        `${baseUrl}/${prefix}images/avatar.jpg`,
        `${baseUrl}/${prefix}images/project-1.jpg`,
        `${baseUrl}/${prefix}images/project-2.jpg`,
      ],
    };
  }
}

// Export the main S3 functions
export const uploadPortfolioToS3 = async (
  portfolioId: string,
  assets: any,
  config: S3Config,
): Promise<string> => {
  const assetManager = new PortfolioAssetManager(config);

  // Upload assets
  await assetManager.uploadPortfolioAssets(portfolioId, assets);

  // Configure static website
  const websiteUrl = await assetManager.configureStaticWebsite();

  return websiteUrl;
};

export const optimizeAndUploadAssets = async (
  portfolioId: string,
  assets: any,
  config: S3Config,
): Promise<{ url: string; totalSize: number }> => {
  const assetManager = new PortfolioAssetManager(config);

  // Optimize assets (simplified - in production, use proper optimization)
  const optimizedAssets = {
    html: assets.html.replace(/\s+/g, " ").trim(),
    css: assets.css.replace(/\s+/g, " ").trim(),
    js: assets.js.replace(/\s+/g, " ").trim(),
    images: assets.images.map((img: any) => ({
      ...img,
      size: Math.floor(img.data.length * 0.7), // Simulate 30% compression
    })),
  };

  // Upload optimized assets
  const result = await assetManager.uploadOptimizedAssets(
    portfolioId,
    optimizedAssets,
  );

  // Configure static website
  const websiteUrl = await assetManager.configureStaticWebsite();

  return {
    url: websiteUrl,
    totalSize: result.totalSize,
  };
};
