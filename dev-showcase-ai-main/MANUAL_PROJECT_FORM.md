# Manual Project Form

A gamified, step-by-step project creation form that replicates the design and functionality from the provided HTML mockup.

## Features

### 🎮 Gamification

- **Particle Effects**: Animated particles burst when completing sections
- **Progress Animations**: Smooth transitions between steps with visual feedback
- **Auto-Advance**: Smart form completion that automatically moves to the next section
- **Visual Feedback**: Icons change from static to animated (sparkles) to completed (checkmarks)

### 📋 Form Sections

1. **Project Info**
   - Project name with floating labels
   - Markdown-supported description
   - GitHub URL with scrape functionality
   - Auto-advance on completion

2. **Media & Demo**
   - Drag & drop file upload
   - Progress indicators for uploads
   - Auto-generated thumbnails and GIFs
   - Auto-advance after media upload

3. **Tech Stack**
   - Code editor with syntax highlighting
   - Support for JSON/YAML formats
   - Auto-advance on content entry

4. **Features**
   - Dynamic feature addition
   - Checkbox management
   - Auto-advance after first feature

5. **Team**
   - Email-based team member addition
   - Avatar generation
   - Auto-advance after first member

6. **SEO & Settings**
   - Custom URL configuration
   - Toggle switches for comments and visibility
   - Auto-advance to publish modal

### 🎨 UI Components

- **Stepper Navigation**: Visual progress indicator with animated states
- **Live Preview**: Real-time preview with desktop/mobile toggle
- **Command Palette**: Keyboard shortcuts for common actions
- **Glassmorphism Effects**: Modern backdrop blur styling
- **Responsive Design**: Works on all screen sizes

### ⌨️ Keyboard Shortcuts

- `⌘K` - Open command palette
- `⌘P` - Publish project
- `⌘U` - Upload media
- `⌘L` - Open version history
- `⌘M` - Toggle preview mode
- `⌘G` - Scrape GitHub URL
- `⌘S` - Save draft
- `⌘Z` - Undo
- `⌘⇧Z` - Redo
- `⌘F` - Add new feature
- `⌘T` - Add team member

## Usage

### Access the Form

Navigate to `/showcase/manual-add` to access the manual project form.

### Demo Page

Visit `/showcase/manual-demo` to see the feature showcase and documentation.

## Technical Implementation

### State Management

- React hooks for local state management
- Auto-save functionality with localStorage
- Draft restoration on page reload

### Animations

- CSS transitions for smooth interactions
- React-based particle effects
- Tailwind CSS animation utilities

### Form Validation

- Real-time validation with visual feedback
- Auto-advance logic based on completion
- Error handling and user guidance

## File Structure

```
src/
├── components/
│   └── ManualProjectForm.tsx     # Main form component
├── pages/
│   └── ManualProjectShowcase.tsx # Demo and documentation page
└── App.tsx                       # Route definitions
```

## Routes

- `/showcase/manual-add` - Manual project form
- `/showcase/manual-demo` - Feature showcase and documentation

## Dependencies

- React 18+
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- React Router DOM

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Optimized animations with CSS transforms
- Efficient particle effect management
- Minimal re-renders with React.memo patterns
- Lazy loading for heavy components

## Accessibility

- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Focus management for form fields

## Future Enhancements

- [ ] Real-time collaboration
- [ ] Advanced media processing
- [ ] Integration with external APIs
- [ ] Offline support with service workers
- [ ] Advanced analytics and tracking
