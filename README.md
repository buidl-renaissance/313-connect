# 313 Connect

**Your local network — verified by connection, rooted in Detroit.**

313 Connect is a peer-to-peer local network for Detroit that turns phone numbers into decentralized identifiers (DIDs). It allows residents to claim a 313 identity, verify it through mutual connections, and communicate directly through a community-based network.

## 📋 Documentation

- [**Product Requirements Document (PRD)**](./docs/PRD.md) - Full product vision, roadmap, and specifications

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `src/pages/api/hello.ts`.

The `src/pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

## 🎯 Project Vision

**Mission:** To establish a human-centered network that connects Detroiters through verified peer relationships, fostering trust, communication, and belonging in the digital and physical commons.

**Core Features:**
- 🔢 Claim unique 313 identities
- 🤝 Peer-verified onboarding
- 📍 Hyperlocal community networks
- 🔒 Privacy-first decentralized identity
- 📱 P2P messaging and calls

## 🛠 Tech Stack

- **Frontend:** Next.js, React, Styled Components
- **Backend:** Supabase / Turso (planned)
- **Identity:** Thirdweb / DID-based auth (planned)
- **Mobile:** React Native (Expo) (planned)

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🌐 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

---

**Current Version:** v0.1 (Prototype)  
**Maintainer:** John Gulbronson  
**Repository:** github.com/detroitcommons/313connect
