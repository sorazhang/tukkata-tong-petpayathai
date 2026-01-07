# Champion Website - Visual Preview

This is a complete, working website you can open in your browser right now to see how it looks.

## What You're Looking At

### VISUAL DESIGN FEATURES:

**Color Scheme:**
- Dark navigation bar (black #1a1a1a)
- Red accent color (#d32f2f) for highlights and CTAs
- Clean white backgrounds with subtle grays
- Professional, minimal, focused on content

**Typography:**
- Modern sans-serif fonts (system fonts for fast loading)
- Large, readable text (18-20px body text)
- Clear hierarchy with sized headers
- Generous line spacing (1.6-1.8) for easy reading

**Layout Style:**
- Clean, spacious design with breathing room
- Maximum 800px width for article text (optimal reading)
- Card-based design for article lists
- Mobile-responsive (works on all screen sizes)

**Key Visual Elements:**
- Sticky navigation bar (stays at top when scrolling)
- Hero section with gradient background
- Article cards with hover effects (lift up slightly)
- Quote blocks with red left border
- Yellow highlight boxes for key insights
- Subtle shadows on hover for depth

## How to View It

### Option 1: Open Locally (Right Now)
```bash
# Just open index.html in your browser
# On Mac:
open index.html

# On Windows:
start index.html

# Or right-click index.html and choose "Open with Browser"
```

### Option 2: View Each Page
- `index.html` - Home page with hero section
- `about.html` - About the champion
- `wisdom.html` - Blog index (list of articles)
- `wisdom/timing-in-combat.html` - Full example article

## What Each Page Looks Like

### HOME PAGE (index.html)
```
[Black Nav Bar - Champion Name | Home About Wisdom Contact]
↓
[Dark Hero Section]
  "MUAY THAI CHAMPION & COACH"
  "Understanding the Art, Not Just the Techniques"
  "10+ years of coaching wisdom..."
↓
[White Section - Philosophy Text]
↓
[3 Cards Side by Side]
  - Fighter Intelligence
  - Training Philosophy  
  - Experience & Wisdom
↓
[Red CTA Section]
  "Start Learning"
  [White Button: "Explore Wisdom Articles"]
↓
[About Preview Section]
↓
[Black Footer]
```

### WISDOM INDEX (wisdom.html)
```
[Navigation Bar]
↓
[Page Header - Centered]
  "Muay Thai Wisdom"
  "Principles, insights, and strategic thinking..."
↓
[Article Cards - Vertical Stack]
  
  [Card 1]
  January 7, 2025
  "Understanding Timing in Combat" (large title)
  Brief excerpt...
  [Blue tag: Fighter Intelligence] [5 min read]
  
  [Card 2]
  January 10, 2025
  "Reading Your Opponent Before the Bell"
  Brief excerpt...
  [Blue tag: Fighter Intelligence] [6 min read]
  
  [...more cards]
  
Each card has subtle border, lifts up on hover
↓
[Footer]
```

### ARTICLE PAGE (timing-in-combat.html)
```
[Navigation Bar]
↓
[Article Header - Centered, Max 800px width]
  January 7, 2025 • 5 min read
  
  "Understanding Timing in Combat" (LARGE)
  
  [Gray box with red left border]
  Intro paragraph explaining the hook...
↓
[Article Content - Readable Text]
  
  "The Misunderstanding About Speed" (section header)
  Paragraph text, 18px, 1.8 line height...
  
  "Reading the Rhythm" (section header)
  More text...
  
  [Quote Block - Gray background, red left border, italic]
  "By the time they start the technique, I'm already moving..."
  
  Continue sections...
↓
[Yellow Highlight Box]
  "Key Insights"
  • Bullet point 1
  • Bullet point 2
  • Bullet point 3
↓
[Topics Tags]
  Fighter Intelligence | Combat Strategy
↓
[Related Articles Section]
  Gray background box with links
↓
[Footer]
```

## Visual Feel

**Overall Vibe:**
- Professional but approachable
- Focused on content, not flashy design
- Easy to read on phone or desktop
- Fast loading (no heavy images or scripts)
- Feels like a personal authority site, not a commercial gym

**What Makes It Different from WordPress:**
- Lighter, faster
- No bloated features
- Every line of code serves a purpose
- You control everything
- Clean HTML you can understand and modify

## Color Reference

If you want to adjust colors:
```css
Black: #1a1a1a (navigation, footer, headings)
Red: #d32f2f (accents, CTAs, highlights)
Gray Text: #555, #666, #999 (different text weights)
Background Gray: #f8f8f8 (subtle backgrounds)
Yellow: #fff9e6 (key insights box)
Blue: #e3f2fd (category tags)
```

## Mobile Responsive

The site automatically adjusts for phones:
- Navigation links stack or shrink
- Cards go full width
- Text sizes scale down appropriately
- Everything remains readable

## Next Steps

1. **Open index.html in browser** - See the home page
2. **Click through to wisdom.html** - See the blog index
3. **Click an article link** - See the full article layout
4. **Resize browser window** - See mobile responsiveness

Then customize:
- Replace "Somchai Pramuk" with champion's real name
- Update content in each page
- Adjust colors if needed (in CSS files)
- Add real photos when ready

## File Structure
```
champion-website/
├── index.html          ← Home page
├── about.html          ← About page
├── wisdom.html         ← Blog index
├── wisdom/
│   └── timing-in-combat.html  ← Example article
├── css/
│   ├── main.css       ← Global styles
│   └── article.css    ← Article-specific styles
└── README.md          ← This file
```

Simple, clean, and you understand every line of code.
