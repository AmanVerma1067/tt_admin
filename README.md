# Timetable Viewer & Admin Panel

A full-stack Next.js application for viewing and managing academic timetables with a modern, responsive interface.

## Features

### Public Timetable Viewer
- 📅 Clean, card-based timetable display
- 🔍 Real-time search functionality
- 📱 Fully responsive design
- 🌙 Dark/light mode support
- ♿ Accessibility-first approach

### Admin Panel
- 🔐 Secure JWT-based authentication
- ✏️ Inline editing of timetable sessions
- ➕ Add/remove sessions dynamically
- 💾 Real-time save functionality
- 📊 Batch management interface

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Authentication**: JWT with HttpOnly cookies
- **Deployment**: Vercel/Render ready

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd timetable-viewer-admin
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_API_URL=https://timetable-api-9xsz.onrender.com
   NEXT_PUBLIC_API_KEY=tt_api_key
   JWT_SECRET=your_jwt_secret_here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Integration

The application integrates with the following endpoints:

### Public Endpoints
- `GET /api/timetable` - Fetch public timetable data
  - Headers: `x-api-key: ${NEXT_PUBLIC_API_KEY}`

### Admin Endpoints
- `POST /admin/login` - Admin authentication
  - Body: `{ username: string, password: string }`
  - Returns: `{ token: string }`

- `POST /admin/raw-timetable` - Fetch editable timetable data
  - Body: `{ token: string }`
  - Returns: `Batch[]`

- `POST /admin/update` - Update timetable data
  - Body: `{ token: string, data: Batch[] }`

## Data Structure

\`\`\`typescript
interface Session {
  time: string      // e.g., "9:00-10:00"
  subject: string   // Subject name
  room: string      // Room number/name
  teacher: string   // Teacher name
}

interface Batch {
  batch: string     // Batch identifier
  Monday: Session[]
  Tuesday: Session[]
  Wednesday: Session[]
  Thursday: Session[]
  Friday: Session[]
  Saturday: Session[]
}
\`\`\`

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Render
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm run start`
4. Add environment variables
5. Deploy

### Manual Deployment
\`\`\`bash
npm run build
npm run start
\`\`\`

## Project Structure

\`\`\`
app/
├── layout.tsx              # Root layout with theme provider
├── page.tsx                # Public timetable viewer
├── globals.css             # Global styles and CSS variables
└── admin/
    ├── layout.tsx          # Admin layout with auth guard
    ├── page.tsx            # Admin dashboard
    └── login/
        └── page.tsx        # Admin login form

components/
├── ui/                     # shadcn/ui components
├── timetable-viewer.tsx    # Public timetable display
├── admin-dashboard.tsx     # Admin editing interface
├── admin-sidebar.tsx       # Admin navigation
├── admin-header.tsx        # Admin header with logout
├── theme-provider.tsx      # Theme context provider
└── theme-toggle.tsx        # Dark/light mode toggle

lib/
├── api.ts                  # API integration functions
├── types.ts                # TypeScript type definitions
└── utils.ts                # Utility functions
\`\`\`

## Features in Detail

### Authentication Flow
1. Admin visits `/admin` → redirected to `/admin/login`
2. Login form submits credentials to API
3. JWT token stored in HttpOnly cookie
4. Subsequent admin requests include token
5. Logout clears cookie and redirects

### Timetable Management
- **Batch Selection**: Sidebar navigation between batches
- **Day Tabs**: Organized by weekdays (Monday-Saturday)
- **Session Editing**: Inline forms for time, subject, room, teacher
- **Dynamic Operations**: Add/remove sessions with real-time UI updates
- **Bulk Save**: Single save operation for all changes

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for medium screens
- **Desktop Enhanced**: Full-featured experience on large screens
- **Touch-Friendly**: Appropriate touch targets and interactions

## Security Features

- **HttpOnly Cookies**: JWT tokens not accessible via JavaScript
- **CSRF Protection**: SameSite cookie attributes
- **Input Validation**: Client and server-side validation
- **Error Handling**: Graceful error states and user feedback
- **Route Protection**: Server-side authentication checks

## Performance Optimizations

- **Server Components**: Reduced client-side JavaScript
- **Static Generation**: Pre-rendered public pages
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Strategic API response caching

## Accessibility

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Visible focus indicators

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API integration guide

---

Built with ❤️ using Next.js, TypeScript, and TailwindCSS
