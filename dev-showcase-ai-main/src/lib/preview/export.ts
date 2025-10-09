// Export functionality for portfolio previews

import { ExportOptions, ExportResult, DeviceViewport } from './types'

export class PortfolioExporter {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null

  constructor() {
    this.initializeCanvas()
  }

  private initializeCanvas() {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
  }

  // HTML Export
  async exportHTML(
    component: HTMLElement,
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const htmlContent = this.generateHTML(component, options)
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      
      return {
        success: true,
        downloadUrl: url,
        fileSize: blob.size,
        metadata: {
          components: this.countComponents(component),
          assets: this.countAssets(component),
          optimization: options.quality || 'medium',
          generatedAt: new Date()
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'HTML export failed'
      }
    }
  }

  // Next.js Export
  async exportNextJS(
    component: HTMLElement,
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const nextjsContent = this.generateNextJS(component, options)
      const blob = new Blob([nextjsContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      
      return {
        success: true,
        downloadUrl: url,
        fileSize: blob.size,
        metadata: {
          components: this.countComponents(component),
          assets: this.countAssets(component),
          optimization: options.quality || 'medium',
          generatedAt: new Date()
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Next.js export failed'
      }
    }
  }

  // PDF Export
  async exportPDF(
    component: HTMLElement,
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const pdfBlob = await this.generatePDF(component, options)
      const url = URL.createObjectURL(pdfBlob)
      
      return {
        success: true,
        downloadUrl: url,
        fileSize: pdfBlob.size,
        metadata: {
          components: this.countComponents(component),
          assets: this.countAssets(component),
          optimization: options.quality || 'medium',
          generatedAt: new Date()
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PDF export failed'
      }
    }
  }

  // Image Export
  async exportImage(
    component: HTMLElement,
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      const imageBlob = await this.generateImage(component, options)
      const url = URL.createObjectURL(imageBlob)
      
      return {
        success: true,
        downloadUrl: url,
        fileSize: imageBlob.size,
        metadata: {
          components: this.countComponents(component),
          assets: this.countAssets(component),
          optimization: options.quality || 'medium',
          generatedAt: new Date()
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Image export failed'
      }
    }
  }

  // Generate HTML content
  private generateHTML(component: HTMLElement, options: ExportOptions): string {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Export</title>
    <style>
        ${this.generateCSS(component, options)}
    </style>
    ${options.seoOptimized ? this.generateSEOTags() : ''}
    ${options.analytics ? this.generateAnalytics() : ''}
</head>
<body>
    ${this.serializeComponent(component)}
    ${options.responsive ? this.generateResponsiveScript() : ''}
    ${options.darkMode ? this.generateDarkModeScript() : ''}
</body>
</html>
    `.trim()

    return options.minifyCode ? this.minifyHTML(html) : html
  }

  // Generate Next.js content
  private generateNextJS(component: HTMLElement, options: ExportOptions): string {
    const componentName = 'PortfolioComponent'
    const jsx = this.serializeComponentToJSX(component)
    const styles = this.generateCSS(component, options)
    
    return `
import React from 'react'
import Head from 'next/head'

const ${componentName} = () => {
  return (
    <>
      <Head>
        <title>Portfolio</title>
        <meta name="description" content="Portfolio export" />
        ${options.seoOptimized ? this.generateNextJSSEOTags() : ''}
      </Head>
      <div className="portfolio-container">
        ${jsx}
      </div>
      <style jsx>{`
        ${styles}
      `}</style>
    </>
  )
}

export default ${componentName}
    `.trim()
  }

  // Generate PDF using html2canvas and jsPDF
  private async generatePDF(
    component: HTMLElement,
    options: ExportOptions
  ): Promise<Blob> {
    // This would require html2canvas and jsPDF libraries
    // For now, we'll simulate the PDF generation
    const canvas = await this.componentToCanvas(component, options)
    const pdfBlob = await this.canvasToPDF(canvas, options)
    return pdfBlob
  }

  // Generate image from component
  private async generateImage(
    component: HTMLElement,
    options: ExportOptions
  ): Promise<Blob> {
    const canvas = await this.componentToCanvas(component, options)
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!)
      }, `image/${options.format || 'png'}`, options.quality === 'high' ? 1 : 0.8)
    })
  }

  // Convert component to canvas
  private async componentToCanvas(
    component: HTMLElement,
    options: ExportOptions
  ): Promise<HTMLCanvasElement> {
    if (!this.canvas || !this.ctx) {
      throw new Error('Canvas not initialized')
    }

    // Set canvas size based on component dimensions
    const rect = component.getBoundingClientRect()
    this.canvas.width = rect.width
    this.canvas.height = rect.height

    // This would require html2canvas library
    // For now, we'll create a simple colored canvas
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
    this.ctx.fillStyle = '#000000'
    this.ctx.font = '16px Arial'
    this.ctx.fillText('Portfolio Preview', 20, 40)
    this.ctx.fillText(`Dimensions: ${rect.width}x${rect.height}`, 20, 70)
    this.ctx.fillText(`Components: ${this.countComponents(component)}`, 20, 100)

    return this.canvas
  }

  // Convert canvas to PDF
  private async canvasToPDF(
    canvas: HTMLCanvasElement,
    options: ExportOptions
  ): Promise<Blob> {
    // This would require jsPDF library
    // For now, we'll return a mock PDF blob
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Portfolio Export) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF`

    return new Blob([pdfContent], { type: 'application/pdf' })
  }

  // Generate CSS from component
  private generateCSS(component: HTMLElement, options: ExportOptions): string {
    const styles = this.extractStyles(component)
    return options.minifyCode ? this.minifyCSS(styles) : styles
  }

  // Extract styles from component
  private extractStyles(component: HTMLElement): string {
    const styles: string[] = []
    
    // Extract computed styles
    const computedStyle = window.getComputedStyle(component)
    const styleProps = [
      'width', 'height', 'margin', 'padding', 'border',
      'background', 'color', 'font', 'display', 'position'
    ]
    
    styleProps.forEach(prop => {
      const value = computedStyle.getPropertyValue(prop)
      if (value) {
        styles.push(`${prop}: ${value};`)
      }
    })

    return styles.join('\n')
  }

  // Serialize component to HTML
  private serializeComponent(component: HTMLElement): string {
    return component.outerHTML
  }

  // Serialize component to JSX
  private serializeComponentToJSX(component: HTMLElement): string {
    // Convert HTML to JSX (simplified)
    let jsx = component.outerHTML
    jsx = jsx.replace(/class=/g, 'className=')
    jsx = jsx.replace(/for=/g, 'htmlFor=')
    return jsx
  }

  // Count components
  private countComponents(component: HTMLElement): number {
    return component.querySelectorAll('[data-component]').length || 1
  }

  // Count assets
  private countAssets(component: HTMLElement): number {
    const images = component.querySelectorAll('img').length
    const videos = component.querySelectorAll('video').length
    const audios = component.querySelectorAll('audio').length
    return images + videos + audios
  }

  // Generate SEO tags
  private generateSEOTags(): string {
    return `
    <meta name="description" content="Portfolio showcase">
    <meta name="keywords" content="portfolio, showcase, work">
    <meta property="og:title" content="Portfolio">
    <meta property="og:description" content="Portfolio showcase">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Portfolio">
    <meta name="twitter:description" content="Portfolio showcase">
    `
  }

  // Generate Next.js SEO tags
  private generateNextJSSEOTags(): string {
    return `
        <meta name="keywords" content="portfolio, showcase, work" />
        <meta property="og:title" content="Portfolio" />
        <meta property="og:description" content="Portfolio showcase" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Portfolio" />
        <meta name="twitter:description" content="Portfolio showcase" />
    `
  }

  // Generate analytics
  private generateAnalytics(): string {
    return `
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    </script>
    `
  }

  // Generate responsive script
  private generateResponsiveScript(): string {
    return `
    <script>
      // Responsive viewport handling
      function setViewport() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
        }
      }
      setViewport();
    </script>
    `
  }

  // Generate dark mode script
  private generateDarkModeScript(): string {
    return `
    <script>
      // Dark mode toggle
      function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
      }
      
      // Load saved dark mode preference
      if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
      }
    </script>
    `
  }

  // Minify HTML
  private minifyHTML(html: string): string {
    return html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim()
  }

  // Minify CSS
  private minifyCSS(css: string): string {
    return css
      .replace(/\s+/g, ' ')
      .replace(/;\s*}/g, '}')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .trim()
  }
}

// Export utility functions
export const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const createDownloadUrl = (content: string, type: string): string => {
  const blob = new Blob([content], { type })
  return URL.createObjectURL(blob)
}

export const optimizeImage = async (
  file: File,
  quality: number = 0.8,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    
    img.onload = () => {
      const { width, height } = img
      const ratio = Math.min(maxWidth / width, maxHeight / height)
      
      canvas.width = width * ratio
      canvas.height = height * ratio
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(resolve, 'image/jpeg', quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export const generateSitemap = (pages: string[]): string => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`
  
  return sitemap
}

export const generateRobotsTxt = (): string => {
  return `User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml`
}

// Export presets
export const exportPresets = {
  html: {
    type: 'html' as const,
    quality: 'medium' as const,
    minifyCode: true,
    seoOptimized: true,
    responsive: true,
    analytics: false
  },
  nextjs: {
    type: 'nextjs' as const,
    quality: 'high' as const,
    minifyCode: true,
    seoOptimized: true,
    responsive: true,
    analytics: true
  },
  pdf: {
    type: 'pdf' as const,
    quality: 'high' as const,
    format: 'png' as const,
    includeAssets: true,
    optimizeImages: true
  },
  image: {
    type: 'image' as const,
    quality: 'high' as const,
    format: 'png' as const,
    optimizeImages: true
  }
}

export default PortfolioExporter
