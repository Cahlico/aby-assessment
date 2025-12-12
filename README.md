## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

The application will be available at `http://localhost:5173`

### Core Functionality

#### 1. **Multi-Asset Support**
- **Images**: Load unlimited images from local files (JPG, PNG, WebP, etc.)
- **Videos**: Load and play multiple videos simultaneously with GPU-accelerated rendering (play is only automatic)

#### 2. **Transform Controls**
All assets support the following transformations with visual handles:

- ~~**Move**: Click and drag the sprite or use the center area~~
- ~~**Resize**: Drag any of the 4 corner handles (blue circles) to scale proportionally~~
- ~~**Rotate**: Drag the green rotation handle at the top to rotate around center~~
- **Delete**: Press Delete/Backspace key or click the Delete button

#### 3. **Layer Management**
- Visual layer list showing all assets
- Click to select and highlight layers
- Real-time layer count display
- Selected item highlighted in blue

#### 4. **Visual Feedback**
- **Selection Indicator**: Blue bounding box around selected items
- **Transform Handles**: 
  - 4 blue corner handles for resize
  - 1 green rotation handle for rotation
- **Grid Background**: 50px grid for spatial reference
- **Cursor Changes**: Context-aware cursors (move, resize, grab)

## What was not finished
- Videos are played automatically in loop, it can not be paused or played yet
- Images/videos can not be dragged, rotated or resized yet
- Accelerators: brightness and contrast were removed becuase of failures on rerendering that I could not fix in time
- Image selected does not go to the top
