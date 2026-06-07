#!/usr/bin/env python3
"""Generate beautiful placeholder images for the birthday website."""

import os

# Create images directory
os.makedirs('images', exist_ok=True)

# SVG placeholder generator
def create_svg_placeholder(filename, width, height, bg_color, text, accent_color="#C9A96E"):
    svg = f'''<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{bg_color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:{accent_color};stop-opacity:0.3" />
    </linearGradient>
    <filter id="blur">
      <feGaussianBlur stdDeviation="0.5"/>
    </filter>
  </defs>
  <rect width="{width}" height="{height}" fill="url(#grad)"/>
  <rect x="20" y="20" width="{width-40}" height="{height-40}" fill="none" stroke="{accent_color}" stroke-width="1" stroke-dasharray="5,5" opacity="0.4"/>
  <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" 
        font-family="Georgia, serif" font-size="18" fill="{accent_color}" opacity="0.8">📷</text>
  <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" 
        font-family="Georgia, serif" font-size="13" fill="{accent_color}" opacity="0.7">{text}</text>
</svg>'''
    with open(f'images/{filename}', 'w') as f:
        f.write(svg)
    print(f"Created: images/{filename}")

# Hero and main photos
create_svg_placeholder('hero.jpg', 1920, 1080, '#2C1810', 'Foto Terbaik Kita ❤️')
create_svg_placeholder('family-best.jpg', 1920, 1080, '#1a0a0a', 'Foto Keluarga Terbaik')

# Meeting photos
for i in range(1, 4):
    create_svg_placeholder(f'meet{i}.jpg', 800, 600, '#3D2B1F', f'Pertemuan - Foto {i}')

# Dating photos
for i in range(1, 5):
    create_svg_placeholder(f'date{i}.jpg', 800, 600, '#2D1B0E', f'Pacaran - Foto {i}')

# Proposal photos
for i in range(1, 4):
    create_svg_placeholder(f'proposal{i}.jpg', 800, 600, '#1C1010', f'Lamaran - Foto {i}')

# Wedding photos
for i in range(1, 7):
    create_svg_placeholder(f'wedding{i}.jpg', 800, 600, '#0D0D0D', f'Pernikahan - Foto {i}')

# Baby/family photos
for i in range(1, 5):
    create_svg_placeholder(f'baby{i}.jpg', 800, 600, '#2B1A1A', f'Buah Hati - Foto {i}')

# Family gallery
for i in range(1, 10):
    heights = [400, 600, 350, 500, 450, 380, 520, 400, 470]
    create_svg_placeholder(f'family{i}.jpg', 600, heights[i-1], '#1E1010', f'Kenangan {i}')

# Video thumbnail
create_svg_placeholder('video-thumb1.jpg', 1280, 720, '#0a0a0a', '▶ Video Kenangan Kita')

# Create a simple video placeholder
with open('images/video1.mp4', 'w') as f:
    f.write('')  # placeholder

print("\n✅ All placeholder images created!")
print("📁 Replace files in /images folder with your actual photos")
