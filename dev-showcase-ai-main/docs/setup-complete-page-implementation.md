# Setup Complete Transition Page

A clean, animated transition page that appears after profile setup completion and automatically redirects users to their dashboard.

## Features

- **Automatic Redirection**: Redirects to `/dashboard` after 4 seconds
- **Staggered Animations**: Uses BlurFade component with carefully timed delays
- **Loading Indicator**: Displays spinning Loader2 icon from lucide-react
- **Responsive Design**: Centered layout that works on all screen sizes
- **Customizable**: Accepts userName prop for personalization
- **Dark Mode Support**: Follows Tailwind CSS dark mode conventions

## Component Props

```typescript
interface SetupCompletePageProps {
  userName?: string; // Default: "Developer"
}
```

## Usage Examples

### Basic Usage

```tsx
import SetupCompletePage from './pages/SetupCompletePage';

// Basic usage with default name
<SetupCompletePage />

// With custom user name
<SetupCompletePage userName="Alex" />
```

### Integration with React Router

```tsx
// In your routing setup
<Route
  path="/setup-complete"
  element={<SetupCompletePage userName={user?.name} />}
/>
```

### Programmatic Navigation

```tsx
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// After profile setup completion
const handleProfileComplete = () => {
  navigate("/setup-complete");
};
```

## Animation Timeline

- **0.25s**: Main heading "All Set, {userName}!" fades in
- **0.50s**: Subheading "We're personalizing your dashboard..." fades in
- **0.75s**: Loading spinner appears
- **4.0s**: Automatic redirect to dashboard

## Customization

The component uses standard Tailwind CSS classes and can be easily customized:

```tsx
// Custom styling example
<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
  {/* Your custom background */}
</div>
```

## Demo and Testing

Visit `/setup-complete-demo` to test the transition page with different user names and see the full animation sequence.

## Dependencies

- `react-router-dom` - For navigation
- `lucide-react` - For the Loader2 icon
- `framer-motion` - For BlurFade animations (via ui/blur-fade component)
- `tailwindcss` - For styling

## File Structure

```
src/
├── pages/
│   ├── SetupCompletePage.tsx      # Main transition page component
│   └── SetupCompleteDemo.tsx      # Demo page for testing
├── components/
│   └── ui/
│       └── blur-fade.tsx          # Animation component
└── App.tsx                        # Routing configuration
```
