# WashaWey Tech Repair - Landing Page Specification

## 1. Concept & Vision

WashaWey is a professional local tech repair service specializing in MSI laptops and Android devices. The website conveys **trustworthy expertise**, **fast turnaround**, and **honest pricing**. The visual identity uses a bold monochrome palette with warm amber accents—evoking the precision of skilled craftsmanship and the glow of soldering irons, without the cold corporate tech look.

## 2. Design Language

### Aesthetic Direction
Industrial-meets-warm: Clean lines and sharp typography paired with amber/orange warmth. Think premium tool brand meets friendly neighborhood repair shop.

### Color Palette
- **Primary (Background):** #0D0D0D (Rich Black)
- **Secondary (Cards/Sections):** #1A1A1A (Soft Black)
- **Accent:** #F59E0B (Amber 500)
- **Accent Hover:** #D97706 (Amber 600)
- **Text Primary:** #FFFFFF (White)
- **Text Secondary:** #A3A3A3 (Neutral 400)
- **Border/Divider:** #262626 (Neutral 800)

### Typography
- **Headlines:** Inter, 800 weight, tight tracking
- **Body:** Inter, 400 weight
- **Accent Text:** JetBrains Mono for prices/codes

### Motion Philosophy
- Subtle fade-up animations on scroll (opacity 0→1, translateY 30px→0, 600ms ease-out)
- Hover states: scale 1.02 on cards, color transitions 200ms
- No jarring or excessive animations—professional restraint

## 3. Layout & Structure

### Hero Section (Video-Led)
- Full viewport height
- Cinematic video background (muted, autoplay, loop)
- Massive headline: "Your Tech. Fixed Right."
- Subheadline with services overview
- CTA button: "Get a Quote"

### Services Section
- 4-column grid on desktop, 2 on tablet, 1 on mobile
- Service cards with icon, title, price range, brief description
- Hover: subtle lift effect with amber border accent

### Why Choose Us Section
- 3 trust indicators (Experience, Fast Turnaround, Fair Pricing)
- Clean iconography with amber accents

### Gallery/Showcase Section
- Before/after repair images or work-in-progress shots
- Masonry-style grid

### Contact/CTA Section
- Phone number, location placeholder, hours
- Simple contact form (name, email, device issue, submit)

### Footer
- Social links, copyright, quick navigation

## 4. Features & Interactions

### Core Features
- Responsive design (mobile-first)
- Smooth scroll navigation
- Contact form with validation
- Service pricing display

### Interaction Details
- Navigation: Sticky header, transparent → solid on scroll
- CTA buttons: Amber background, white text, scale + shadow on hover
- Service cards: Lift effect on hover with amber top border
- Form: Real-time validation feedback, success message on submit

## 5. Component Inventory

### Navigation Bar
- Logo (text-based: WashaWey)
- Nav links: Services, Gallery, Contact
- Mobile: Hamburger menu with slide-out drawer

### Service Card
- Icon (SVG)
- Service title
- Price range badge
- Brief description
- States: default, hover (lift + amber border)

### CTA Button
- Primary: Amber bg, white text
- Secondary: Transparent with amber border

### Contact Form
- Input fields: dark bg, subtle border, amber focus ring
- Submit button: Full-width amber

## 6. Technical Approach

- **Stack:** Pure HTML5, CSS3, vanilla JavaScript
- **No frameworks** — lightweight, fast loading
- **CSS Variables** for theming
- **Intersection Observer** for scroll animations
- **Google Fonts** via CDN (Inter, JetBrains Mono)
