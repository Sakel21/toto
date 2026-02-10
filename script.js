let menuVisible = false;
let currentMenu = [];
let menuStack = [];
let currentIndex = 0;

const menuContainer = document.getElementById('menu-container');
const menuContent = document.getElementById('menu-content');
const footerText = document.getElementById('footer-text');

window.addEventListener('message', (event) => {
    const data = event.data;
    
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
            renderMenu();
            break;
            
        case 'setFooterText':
            footerText.textContent = data.text || '';
            break;
            
        case 'setTheme':
            applyTheme(data.theme);
            break;
            
        case 'updateBreadcrumb':
            updateBreadcrumb(data.breadcrumb);
            break;
    }
});

function renderMenu() {
    menuContent.innerHTML = '';
    
    if (menuStack.length > 0) {
        const backBtn = document.createElement('div');
        backBtn.className = 'back-button';
        backBtn.textContent = '← Back';
        backBtn.onclick = () => goBack();
        menuContent.appendChild(backBtn);
    }
    
    currentMenu.forEach((item, index) => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        if (index === currentIndex - 1) {
            menuItem.classList.add('selected');
        }
        
        const label = document.createElement('span');
        label.className = 'menu-item-label';
        label.textContent = item.label;
        menuItem.appendChild(label);
        
        if (item.type === 'submenu') {
            menuItem.classList.add('submenu');
            const arrow = document.createElement('span');
            arrow.className = 'menu-item-value';
            menuItem.appendChild(arrow);
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
            
            const slider = document.createElement('div');
            slider.className = 'slider';
            
            const fill = document.createElement('div');
            fill.className = 'slider-fill';
            const percent = ((item.value - item.min) / (item.max - item.min)) * 100;
            fill.style.width = percent + '%';
            slider.appendChild(fill);
            
            const value = document.createElement('span');
            value.className = 'slider-value';
            value.textContent = item.value.toFixed(1);
            
            sliderContainer.appendChild(slider);
            sliderContainer.appendChild(value);
            menuItem.appendChild(sliderContainer);
            
            slider.onclick = (e) => {
                e.stopPropagation();
                const rect = slider.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percent = x / rect.width;
                const newValue = item.min + (item.max - item.min) * percent;
                const steppedValue = Math.round(newValue / item.step) * item.step;
                updateSlider(item, index, steppedValue);
            };
        } else if (item.type === 'button') {
            const btnLabel = document.createElement('span');
            btnLabel.className = 'menu-item-value';
            btnLabel.textContent = 'Execute';
            menuItem.appendChild(btnLabel);
            menuItem.onclick = () => executeButton(item, index);
        }
        
        menuContent.appendChild(menuItem);
    });
}

function openSubmenu(item, index) {
    if (item.submenu) {
        menuStack.push({ menu: currentMenu, index: currentIndex });
        currentMenu = item.submenu;
        currentIndex = 1;
        renderMenu();
        sendToLua('submenuOpened', { label: item.label });
    }
}

function goBack() {
    if (menuStack.length > 0) {
        const previous = menuStack.pop();
        currentMenu = previous.menu;
        currentIndex = previous.index;
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
        purple: { primary: '#8b5cf6', secondary: '#6366f1' },
        blue: { primary: '#3b82f6', secondary: '#2563eb' },
        orange: { primary: '#f97316', secondary: '#ea580c' },
        pink: { primary: '#ec4899', secondary: '#db2777' }
    };
    
    if (themes[theme]) {
        root.style.setProperty('--primary', themes[theme].primary);
        root.style.setProperty('--secondary', themes[theme].secondary);
    }
}

function updateBreadcrumb(text) {
    let breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) {
        breadcrumb = document.createElement('div');
        breadcrumb.className = 'breadcrumb';
        menuContainer.querySelector('.menu-wrapper').insertBefore(
            breadcrumb, 
            menuContent
        );
    }
    breadcrumb.textContent = text;
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuVisible) {
        sendToLua('closeMenu', {});
    }
});
