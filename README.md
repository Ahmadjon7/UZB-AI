# UZB AI - Your Intelligent Assistant

A modern AI chat application built with Next.js 14, featuring real-time conversations with GPT-4, authentication, and multilingual support.

## Features

- 🤖 Real-time AI chat using OpenAI's GPT-4
- 🔐 Secure authentication with Supabase
- 🌐 Multilingual support (English and Uzbek)
- 🌓 Dark/Light mode
- 📱 Responsive design
- 💾 Chat history saving
- ✨ Modern UI with shadcn/ui components

## Tech Stack

- **Framework**: Next.js 14
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI Integration**: OpenAI API
- **Language Management**: Custom i18n implementation
- **Form Handling**: React Hook Form
- **Icons**: Lucide Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- OpenAI API key
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/uzb-ai.git
cd uzb-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.
![image](https://github.com/user-attachments/assets/9f2a74b2-8b01-4d0a-8e06-d50102c4f06b)
![image](https://github.com/user-attachments/assets/bc646e69-bdb2-4643-be57-3475ce62b248)



## Project Structure
![image](https://github.com/user-attachments/assets/64e13c48-7843-4759-95ab-286e696501d6)

