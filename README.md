# BZ Menu - FiveM DUI Menu Interface

A modern, sleek, and responsive menu interface for FiveM using DUI (Direct UI).

## Features

- 🎨 Modern glassmorphism design
- 🖱️ Mouse-driven navigation
- 📱 Responsive layout
- 🎯 Multiple item types (submenu, checkbox, slider, button)
- 🎨 Theme support (purple, blue, orange, pink)
- ⚡ Smooth animations
- 🔄 Breadcrumb navigation

## Installation

1. Upload the `bzmenu` folder to your server
2. Host it on GitHub Pages or any static hosting
3. Use the URL in your FiveM resource

## Usage

### Creating a DUI Menu

```lua
local dui = CreateDui("https://yourusername.github.io/bzmenu/", 1920, 1080)
local duiHandle = GetDuiHandle(dui)
local duiTxd = CreateRuntimeTxd("BzMenuTxd")
local duiTexture = CreateRuntimeTextureFromDuiHandle(duiTxd, "BzMenuTex", duiHandle)
```

### Sending Menu Data

```lua
SendDuiMessage(dui, json.encode({
    action = 'setCurrent',
    current = 1,
    menu = {
        {
            label = "Player Options",
            type = 'submenu',
            icon = 'fas fa-user',
            submenu = {
                {label = "God Mode", type = 'checkbox', checked = false},
                {label = "Speed", type = 'slider', min = 1.0, max = 5.0, value = 1.0, step = 0.1},
                {label = "Heal", type = 'button'}
            }
        }
    }
}))
```

### Menu Item Types

#### Submenu
```lua
{
    label = "Category Name",
    type = 'submenu',
    submenu = { ... }
}
```

#### Checkbox
```lua
{
    label = "Toggle Option",
    type = 'checkbox',
    checked = false
}
```

#### Slider
```lua
{
    label = "Value Slider",
    type = 'slider',
    min = 0,
    max = 100,
    value = 50,
    step = 1
}
```

#### Button
```lua
{
    label = "Execute Action",
    type = 'button'
}
```

### Actions

- `setMenuVisible` - Show/hide menu
- `setCurrent` - Update menu content
- `setFooterText` - Update footer text
- `setTheme` - Change theme (purple, blue, orange, pink)
- `updateBreadcrumb` - Update navigation breadcrumb

### Callbacks

The menu sends callbacks to your Lua script:

- `checkboxToggled` - When a checkbox is clicked
- `sliderChanged` - When a slider value changes
- `buttonPressed` - When a button is clicked
- `submenuOpened` - When entering a submenu
- `submenuClosed` - When going back
- `closeMenu` - When ESC is pressed

## Styling

The menu uses CSS variables for easy customization. Edit `style.css` to change colors, sizes, and animations.

## License

MIT License - Feel free to use and modify!

## Credits

Created for FiveM DUI menu systems
