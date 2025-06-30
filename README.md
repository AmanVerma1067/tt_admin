# Timetable Admin Panel

A modern, responsive web application for managing academic timetables. Built with React.js and TailwindCSS, designed to work with an Express/MongoDB backend.

## Features

- **Secure Authentication**: JWT-based login system for admin access
- **Batch Management**: View and select from all available batches
- **Interactive Timetable Editor**: Edit schedules with inline input fields
- **Real-time Changes**: Local state management with save confirmation
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, professional interface with TailwindCSS
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Accessibility**: ARIA labels and keyboard navigation support

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Express/MongoDB backend running on port 3000

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd timetable-admin-panel
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   \`\`\`env
   REACT_APP_API_BASE_URL=http://localhost:3000
   \`\`\`

   For production, update the URL to your deployed backend.

4. **Start the development server**
   \`\`\`bash
   npm start
   \`\`\`

   The application will open at `http://localhost:3001`

## Backend API Requirements

The application expects the following API endpoints:

### Authentication
- `POST /admin/login`
  - Body: `{ "username": "string", "password": "string" }`
  - Response: `{ "token": "jwt_token" }`

### Timetable Management
- `GET /admin/raw-timetable`
  - Headers: `Authorization: Bearer <token>`
  - Response: Array of batch objects with timetable data

- `POST /admin/update`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "token": "jwt_token", "data": [...] }`
  - Response: Success/error message

## Project Structure

\`\`\`
src/
├── components/
│   ├── Login.jsx          # Authentication form
│   ├── Dashboard.jsx      # Main dashboard layout
│   ├── Header.jsx         # Top navigation bar
│   ├── BatchList.jsx      # Left sidebar with batch selection
│   ├── TimetableEditor.jsx # Main editing interface
│   └── Toast.jsx          # Notification component
├── contexts/
│   └── AuthContext.jsx    # Authentication state management
├── api.js                 # API communication functions
├── App.jsx               # Main application component
├── index.jsx             # Application entry point
└── index.css             # Global styles and Tailwind imports
\`\`\`

## Usage

### Login
1. Navigate to `/login`
2. Enter admin credentials
3. On successful authentication, you'll be redirected to the dashboard

### Managing Timetables
1. **Select a Batch**: Click on any batch from the left sidebar
2. **Edit Sessions**: 
   - Click on input fields to edit time, subject, room, or teacher
   - Use "Add Session" to create new time slots
   - Use "Remove" to delete sessions
3. **Save Changes**: Click the "Save" button in the header
4. **Switch Batches**: Select different batches (with unsaved changes warning)

### Features
- **Auto-save Warning**: Prevents data loss when switching batches or logging out
- **Loading States**: Visual feedback during API operations
- **Error Handling**: Clear error messages for failed operations
- **Responsive Design**: Optimized for both desktop and mobile use

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm eject` - Eject from Create React App (irreversible)

### Customization

#### Styling
- Modify `tailwind.config.js` for theme customization
- Update color schemes in the config file
- Add custom CSS in `src/index.css`

#### API Integration
- Update `src/api.js` for different backend endpoints
- Modify authentication flow in `AuthContext.jsx`
- Adjust data structures in components as needed

## Deployment

### Build for Production
\`\`\`bash
npm run build
\`\`\`

### Environment Variables
Set the following environment variable for production:
\`\`\`env
REACT_APP_API_BASE_URL=https://your-backend-domain.com
\`\`\`

### Deployment Options
- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `build` folder
- **AWS S3**: Upload build files to S3 bucket with static hosting
- **Traditional Hosting**: Upload build files to your web server

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

**Note**: This application is designed to work with a specific Express/MongoDB backend. Ensure your backend implements the required API endpoints before deployment.
