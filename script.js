let menuVisible = false;
let currentMenu = [];
let menuStack = [];
let currentIndex = 0;
let currentCategory = 0;

const menuContainer = document.getElementById('menu-container');
const menuContent = document.getElementById('menu-content');
const menuCategories = document.getElementById('menu-categories');
const footerText = document.getElementById('footer-text');

window.addEventListener('message', (event) => {
    let data = event.data;
    
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (e) {
            return;
        }
    }
    
    switch (data.action) {
        case 'setMenuVisible':
            menuVisible = data.visible;
            if (menuVisible) {
                menuContainer.classList.remove('hidden');
            } else {
                menuContainer.classList.add('hidden');
            }
            break;
            
        case 'setCurrent':
            currentMenu = data.menu || [];
            currentIndex = data.current || 1;
            renderCategories();
            renderMenu();
            break;
            
        case 'setFooterText':
            footerText.textContent = data.text || '';
            break;
            
        case 'setTheme':
            applyTheme(data.theme);
            break;
            
        case 'scroll':
            if (data.direction === 'up') {
                menuContent.scrollTop -= 50;
            } else if (data.direction === 'down') {
                menuContent.scrollTop += 50;
            }
            break;
            
        case 'navigateCategory':
            if (menuStack.length === 0) {
                if (data.direction === 'left') {
                    currentCategory = currentCategory > 0 ? currentCategory - 1 : currentMenu.length - 1;
                } else if (data.direction === 'right') {
                    currentCategory = currentCategory < currentMenu.length - 1 ? currentCategory + 1 : 0;
                }
                renderCategories();
                renderMenu();
            }
            break;
    }
});

function renderCategories() {
    if (menuStack.length > 0) {
        menuCategories.style.display = 'none';
        return;
    }
    
    menuCategories.style.display = 'flex';
    menuCategories.innerHTML = '';
    
    currentMenu.forEach((item, index) => {
        if (item.type === 'submenu') {
            const category = document.createElement('div');
            category.className = 'menu-category';
            if (index === currentCategory) {
                category.classList.add('active');
            }
            category.textContent = item.label.replace(/[🏠🔫🎯🚜🚗🤪]/g, '').trim();
            category.onclick = () => {
                currentCategory = index;
                renderCategories();
                renderMenu();
            };
            menuCategories.appendChild(category);
        }
    });
}

function renderMenu() {
    menuContent.innerHTML = '';
    
    if (menuStack.length > 0) {
        const backBtn = document.createElement('div');
        backBtn.className = 'back-button';
        const backText = document.createElement('span');
        backText.textContent = '← Back';
        backBtn.appendChild(backText);
        backBtn.onclick = () => goBack();
        menuContent.appendChild(backBtn);
    }
    
    const itemsToRender = menuStack.length > 0 ? currentMenu : (currentMenu[currentCategory]?.submenu || []);
    
    itemsToRender.forEach((item, index) => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        
        const label = document.createElement('span');
        label.className = 'menu-item-label';
        label.textContent = item.label.replace(/[🏠🔫🎯🚜🚗🤪]/g, '').trim();
        menuItem.appendChild(label);
        
        if (item.type === 'submenu') {
            menuItem.classList.add('submenu');
            menuItem.onclick = () => openSubmenu(item, index);
        } else if (item.type === 'checkbox') {
            const toggle = document.createElement('div');
            toggle.className = 'toggle-switch';
            if (item.checked) {
                toggle.classList.add('active');
            }
            menuItem.appendChild(toggle);
            menuItem.onclick = () => toggleCheckbox(item, index);
        } else if (item.type === 'slider') {
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'slider-container';
            
            const fill = document.createElement('div');
            fill.className = 'slider-fill';
            const percent = ((item.value - item.min) / (item.max - item.min)) * 100;
            fill.style.width = percent + '%';
            sliderContainer.appendChild(fill);
            
            const value = document.createElement('span');
            value.className = 'slider-value';
            value.textContent = item.value.toFixed(1);
            
            menuItem.appendChild(sliderContainer);
            menuItem.appendChild(value);
            
            sliderContainer.onclick = (e) => {
                e.stopPropagation();
                const rect = sliderContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percent = x / rect.width;
                const newValue = item.min + (item.max - item.min) * percent;
                const steppedValue = Math.round(newValue / item.step) * item.step;
                updateSlider(item, index, steppedValue);
            };
        } else if (item.type === 'button') {
            const icon = document.createElement('i');
            icon.className = 'fas fa-play';
            menuItem.appendChild(icon);
            menuItem.onclick = () => executeButton(item, index);
        }
        
        menuContent.appendChild(menuItem);
    });
}

function openSubmenu(item, index) {
    if (item.submenu) {
        menuStack.push({ menu: currentMenu, index: currentIndex, category: currentCategory });
        currentMenu = item.submenu;
        currentIndex = 1;
        renderCategories();
        renderMenu();
        sendToLua('submenuOpened', { label: item.label });
    }
}

function goBack() {
    if (menuStack.length > 0) {
        const previous = menuStack.pop();
        currentMenu = previous.menu;
        currentIndex = previous.index;
        currentCategory = previous.category;
        renderCategories();
        renderMenu();
        sendToLua('submenuClosed', {});
    }
}

function toggleCheckbox(item, index) {
    item.checked = !item.checked;
    renderMenu();
    sendToLua('checkboxToggled', { 
        label: item.label, 
        checked: item.checked,
        index: index 
    });
}

function updateSlider(item, index, value) {
    item.value = Math.max(item.min, Math.min(item.max, value));
    renderMenu();
    sendToLua('sliderChanged', { 
        label: item.label, 
        value: item.value,
        index: index 
    });
}

function executeButton(item, index) {
    sendToLua('buttonPressed', { 
        label: item.label,
        index: index 
    });
}

function sendToLua(action, data) {
    fetch(`https://${GetParentResourceName()}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

function GetParentResourceName() {
    return 'Sakel';
}

function applyTheme(theme) {
    const root = document.documentElement;
    const themes = {
        purple: '139, 92, 246',
        blue: '59, 130, 246',
        orange: '249, 115, 22',
        pink: '236, 72, 153',
        red: '200, 0, 0'
    };
    
    if (themes[theme]) {
        root.style.setProperty('--menu-color', themes[theme]);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuVisible) {
        sendToLua('closeMenu', {});
    }
});
