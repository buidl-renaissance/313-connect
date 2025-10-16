# 🧭 Product Requirements Document (PRD)

**Project:** 313 Connect

## 1. Project Overview

**Project Name:**  
313 Connect

**Summary (Elevator Pitch):**  
313 Connect is a peer-to-peer local network for Detroit that turns phone numbers into decentralized identifiers (DIDs). It allows residents to claim a 313 identity, verify it through mutual connections, and communicate directly through a community-based network that links physical locations, Wi-Fi access points, and local events.

**Owner / Maintainer:**  
John Gulbronson

**Related Documents:**
- PAD (Project Architecture Document)
- Platform Deployment Docs (PDD)
- Marketing Deployment Flow (MDF)

**Repository / Workspace:**  
github.com/detroitcommons/313connect

**Current Version:**  
v0.1 (Prototype / Proof of Concept)

---

## 2. Vision & Goals

**Mission Statement:**  
To establish a human-centered network that connects Detroiters through verified peer relationships, fostering trust, communication, and belonging in the digital and physical commons.

**Primary Goals:**
1. Create a decentralized local identity system tied to the 313 area code.
2. Enable peer-verified onboarding to promote authentic local connections.
3. Build local-first peer-to-peer communication using Wi-Fi-based verification.
4. Encourage community participation through localized events and nodes.

**Success Criteria / KPIs:**

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Verified users | 3,000+ | On-chain DID registrations |
| Connection rate | 2+ verified peers per user | Peer graph analysis |
| Active nodes | 10 community hubs | Node registration logs |
| Engagement | 25% monthly active users | App analytics |
| Local event participation | 500+ check-ins | Geo-verified interactions |

---

## 3. Problem Statement

**The Problem:**  
Detroit lacks a unified, community-owned digital network for residents to connect and verify one another without relying on centralized platforms. Existing tools fragment communication, ownership, and identity.

**Why It Matters:**  
A decentralized identity and local network empower residents to reclaim their data, strengthen community trust, and support hyperlocal economies through shared connectivity and reputation.

**Who It Affects:**
- Detroit residents seeking authentic local connections
- Artists, organizers, and small businesses promoting events
- Technologists building for civic engagement

**Current Limitations:**
- Centralized social media lacks locality and trust
- No verifiable system for community presence
- Limited access to Web3 identity tools for non-technical users

---

## 4. Target Users & Personas

**Primary Users:**
- **Local Residents** — want to connect with verified people nearby
- **Community Organizers** — use the platform to manage events and hubs
- **Local Businesses** — engage nearby audiences with offers and events

**Secondary Users:**
- **Developers** — integrate local-first APIs and DID-based auth
- **Civic Partners** — use 313 verification for community programs

**Example Persona:**  
**Name:** Tasha Walker  
**Role:** Event Organizer in Southwest Detroit  
**Goals:** Promote events to real locals, verify attendees, and form authentic collaborations  
**Pain Points:** Bots, unreliable event RSVPs, lack of local network visibility

---

## 5. Product Scope

### Core Features:

#### 1. Claim Your 313 Number:
- Choose a 3–6 digit number (e.g., "313562")
- Generate a private key tied to that number
- Store securely via wallet or cloud backup

#### 2. Peer Verification:
- Connect with one verified user to activate identity
- Optional location/Wi-Fi verification (local hotspot signature)

#### 3. Local Presence:
- Verify your "in Detroit" status by connecting to local Wi-Fi nodes (e.g., Spotlight, Assemble Sound, etc.)
- Event-based proof of presence

#### 4. Messaging & P2P Calls:
- Encrypted peer-to-peer calls between verified users
- Optional "drop zone" messaging for offline relays

#### 5. Network Map:
- Visualize local hubs, Wi-Fi-verified zones, and event hotspots

#### 6. Onboarding Flow (Marketing Flow v1):
- Visit landing page
- Enter phone number → check availability
- "Claim" → redirects to app download
- App confirms number with generated key
- Must connect with one verified user to activate

---

## 6. Technical Requirements

| Layer | Tools / Frameworks | Description |
|-------|-------------------|-------------|
| Mobile | React Native (Expo) | Cross-platform mobile app |
| Backend | Supabase / Turso | Local-first data layer |
| Wallet | Thirdweb / LUKSO | Decentralized identity management |
| Network | Nostr / Atproto (TBD) | Peer-to-peer communication |
| Auth | Beacon ID / DID (custom) | Local identity layer |
| Connectivity | Wi-Fi SSID + GPS signatures | Physical location verification |
| Marketing | Vercel landing page | Interactive number claim flow |

---

## 7. Dependencies

- Wi-Fi Node Integrations (Spotlight, Poplar Commons, etc.)
- App Store & Play Store listing
- Thirdweb / DID registry deployment
- 313 Connect subdomain via Vercel
- Detroit Commons shared infrastructure

---

## 8. Roadmap (v0.1–v1.0)

| Phase | Milestone | Description |
|-------|-----------|-------------|
| v0.1 | Landing Page | Interactive number claim system |
| v0.2 | App Prototype | Claim number + peer verification |
| v0.3 | P2P Calls & Messaging | Local-first communications |
| v0.4 | Node Verification | Wi-Fi and geolocation presence |
| v0.5 | Community Hubs | Node registry & dashboards |
| v1.0 | Full Network Launch | 3,000+ verified Detroit users |

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| User confusion about verification | In-app tutorial and invite-based onboarding |
| Privacy concerns | Optional visibility layers, zero-knowledge proofs for presence |
| Technical scalability | Modular local-first data design |
| Limited initial adoption | Start with curated "313 Hubs" (Poplar Commons, etc.) |

---

## 10. Open Questions

1. Should DID verification rely on peer graph (Web of Trust) or zero-knowledge proofs?
2. Should phone numbers be numeric-only or include vanity word handles?
3. How do we manage re-claiming abandoned numbers?
4. Will peer calls be app-to-app only or also integrate SIP/VoIP?

---

**Last Updated:** October 16, 2025  
**Status:** Active Development (v0.1)

