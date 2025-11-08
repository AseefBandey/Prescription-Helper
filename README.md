# 💊 Prescription Helper

A simple web app to manage your prescriptions, medications, and doctor appointments. Uses AI to extract info from prescription images.

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue) ![Vite](https://img.shields.io/badge/Vite-6.2-purple) ![License](https://img.shields.io/badge/License-MIT-green)

## What it does

- 📸 **Upload prescriptions** - Snap a photo, AI reads it
- 💊 **Medicine cabinet** - Keep track of what you have
- ⏰ **Med reminders** - Never forget a dose
- 🩺 **Appointments** - Track doctor visits

Everything runs in your browser. No backend needed.

## Quick Start

```bash
# Install
npm install

# Add your Gemini API key
echo "VITE_GEMINI_API_KEY=your_key_here" > .env

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Getting an API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in
3. Get your free API key
4. Add it to `.env`

That's it!

## Features

### Prescription Vault
Upload prescription images and let AI extract:
- Medication names
- Dosages
- Doctor info
- Instructions

### Medicine Cabinet
- Track your medicine inventory
- Expiry date warnings
- Get AI info about any medicine

### Medication Schedule
- Create daily schedules
- Mark doses as taken
- Track your progress

### Appointments
- Schedule doctor visits
- Set reminders
- Track upcoming/completed

## Tech Stack

- **React 19** + TypeScript
- **Vite** for fast dev
- **Tailwind CSS** for styling
- **Google Gemini AI** for OCR
- **LocalStorage** for data

## Deploy

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import to Vercel
3. Add `VITE_GEMINI_API_KEY` env variable
4. Deploy!

### Build for Production

```bash
npm run build
```

Output goes to `dist/`

## Project Structure

```
src/
├── components/          # React components
├── pages/              # Main pages
│   ├── DashboardPage.tsx
│   ├── PrescriptionVaultPage.tsx
│   ├── MedicineCabinetPage.tsx
│   ├── MedicationSchedulePage.tsx
│   └── AppointmentsPage.tsx
├── services/           # Gemini AI integration
├── contexts/           # React context
└── types/              # TypeScript types
```

## Configuration

Create `.env` in root:

```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_APP_NAME=Prescription Helper
VITE_APP_VERSION=1.0.0
```

## Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview build
npm run lint         # Check code
npm run lint:fix     # Fix linting issues
```

## Data Storage

All your data stays in your browser (localStorage):
- No backend required
- No database needed
- Private and secure
- Works offline

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser

## Screenshots

*Coming soon - add your own!*

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b cool-feature`)
3. Commit changes (`git commit -am 'Add cool feature'`)
4. Push to branch (`git push origin cool-feature`)
5. Create Pull Request

## Roadmap

- [ ] PWA support (offline mode)
- [ ] Export data to PDF
- [ ] Multi-language support
- [ ] Dark mode improvements
- [ ] Mobile app (React Native)

## Known Issues

- Large images (>10MB) may take longer to process
- Safari may need camera permissions for uploads

## License

MIT License - do whatever you want with it!

## Disclaimer

⚠️ **This is not medical advice!** Always consult your doctor. This app is just a tool to help you organize your health info.

## Support

Having issues?

- Check [Issues](../../issues)
- Read the [docs](#getting-an-api-key)
- Ask questions in [Discussions](../../discussions)

## Credits

Built with:
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Google Gemini AI](https://ai.google.dev)

---

Made with ❤️ • Star if you like it! ⭐
