let menuVisible = false;
let currentMenu = [];
let menuStack = [];
let currentIndex = 0;
let currentCategory = 0;
let selectedItemIndex = 0;

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
                const itemsToRender = getItemsToRender();
                const currentItem = itemsToRender[selectedItemIndex];
                
                if (currentItem && currentItem.type === 'slider') {
                    if (data.direction === 'left') {
                        const newValue = Math.max(currentItem.min, currentItem.value - currentItem.step);
                        updateSlider(currentItem, selectedItemIndex, newValue);
                    } else if (data.direction === 'right') {
                        const newValue = Math.min(currentItem.max, currentItem.value + currentItem.step);
                        updateSlider(currentItem, selectedItemIndex, newValue);
                    }
                } else {
                    if (data.direction === 'left') {
                        currentCategory = currentCategory > 0 ? currentCategory - 1 : currentMenu.length - 1;
                    } else if (data.direction === 'right') {
                        currentCategory = currentCategory < currentMenu.length - 1 ? currentCategory + 1 : 0;
                    }
                    selectedItemIndex = 0;
                    renderCategories();
                    renderMenu();
                }
            } else {
                const currentItem = currentMenu[selectedItemIndex];
                
                if (currentItem && currentItem.type === 'slider') {
                    if (data.direction === 'left') {
                        const newValue = Math.max(currentItem.min, currentItem.value - currentItem.step);
                        updateSlider(currentItem, selectedItemIndex, newValue);
                    } else if (data.direction === 'right') {
                        const newValue = Math.min(currentItem.max, currentItem.value + currentItem.step);
                        updateSlider(currentItem, selectedItemIndex, newValue);
                    }
                }
            }
            break;
            
        case 'navigateItem':
            const itemsCount = getItemsCount();
            if (data.direction === 'up') {
                selectedItemIndex = selectedItemIndex > 0 ? selectedItemIndex - 1 : itemsCount - 1;
            } else if (data.direction === 'down') {
                selectedItemIndex = selectedItemIndex < itemsCount - 1 ? selectedItemIndex + 1 : 0;
            }
            renderMenu();
            break;
            
        case 'selectItem':
            selectCurrentItem();
            break;
    }
});

function getItemsCount() {
    if (menuStack.length > 0) {
        return currentMenu.length;
    } else {
        const category = currentMenu[currentCategory];
        return category && category.submenu ? category.submenu.length : 0;
    }
}

function getItemsToRender() {
    if (menuStack.length > 0) {
        return currentMenu;
    } else {
        const category = currentMenu[currentCategory];
        return category && category.submenu ? category.submenu : [];
    }
}

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
    
    const itemsToRender = getItemsToRender();
    
    itemsToRender.forEach((item, index) => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        
        if (index === selectedItemIndex) {
            menuItem.classList.add('selected');
        }
        
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
        menuStack.push({ menu: currentMenu, index: currentIndex, category: currentCategory, selectedIndex: selectedItemIndex });
        currentMenu = item.submenu;
        currentIndex = 1;
        selectedItemIndex = 0;
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
        selectedItemIndex = previous.selectedIndex || 0;
        renderCategories();
        renderMenu();
        sendToLua('submenuClosed', {});
    }
}

function selectCurrentItem() {
    const itemsToRender = getItemsToRender();
    
    const item = itemsToRender[selectedItemIndex];
    if (!item) return;
    
    if (item.type === 'submenu') {
        openSubmenu(item, selectedItemIndex);
    } else if (item.type === 'checkbox') {
        toggleCheckbox(item, selectedItemIndex);
    } else if (item.type === 'button') {
        executeButton(item, selectedItemIndex);
    }
}

function toggleCheckbox(item, index) {
    item.checked = !item.checked;
    
    const label = item.label.replace(/[🏠🔫🎯🚜🚗🤪]/g, '').trim();
    
    if (label === 'God Mode' && menuStack.length > 0 && menuStack[0].menu[menuStack[0].category].label.includes('PLAYER')) {
        window.godMode = item.checked;
    } else if (label === 'NoClip') {
        window.noclip = item.checked;
    } else if (label === 'Invisible') {
        window.invisible = item.checked;
    } else if (label === 'Infinite Stamina') {
        window.stamina = item.checked;
    } else if (label === 'Wallhack') {
        window.wallhack = item.checked;
    } else if (label === 'ESP Lines') {
        window.esp = item.checked;
    } else if (label === 'Anti Cuff') {
        window.anticuff = item.checked;
    } else if (label === 'No Reload') {
        window.noreload = item.checked;
    } else if (label === 'Infinite Ammo') {
        window.infammo = item.checked;
    } else if (label === 'Rapid Fire') {
        window.rapidfire = item.checked;
    } else if (label === 'One Punch Man') {
        window.onePunch = item.checked;
    } else if (label === 'Aimbot Enable') {
        window.aimbot = item.checked;
    } else if (label === 'Silent Aim') {
        window.silentAim = item.checked;
    } else if (label === 'Trigger Bot') {
        window.triggerBot = item.checked;
    } else if (label === 'Visible Check') {
        window.visibleCheck = item.checked;
    } else if (label.includes('Farm Ours')) {
        window.farm = item.checked;
    } else if (label.includes('Sell Ours')) {
        window.sell = item.checked;
    } else if (label.includes('Farm Stalag')) {
        window.stalag = item.checked;
    } else if (label === 'Nitro Boost') {
        window.nitro = item.checked;
    } else if (label === 'Engine Always On') {
        window.engineon = item.checked;
    } else if (label.includes('God Mode') && menuStack.length > 0 && menuStack[0].menu[menuStack[0].category].label.includes('VEHICLE')) {
        window.vehgod = item.checked;
    } else if (label === 'Infinite Fuel') {
        window.infuel = item.checked;
    } else if (label === 'Glue Vehicle') {
        window.glueVehicle = item.checked;
    } else if (label === 'Vacuum Totem') {
        window.vacuumTotem = item.checked;
    } else if (label === 'Vehicle Carrier') {
        window.vehicleCarrier = item.checked;
    }
    
    renderMenu();
}

function updateSlider(item, index, value) {
    item.value = Math.max(item.min, Math.min(item.max, value));
    
    const label = item.label.replace(/[🏠🔫🎯🚜🚗🤪]/g, '').trim();
    
    if (label === 'NoClip Speed') {
        window.noclipSpeed = item.value;
    } else if (label === 'Run Speed') {
        window.runSpeed = item.value;
    } else if (label === 'FOV') {
        window.aimbotFov = item.value;
    } else if (label === 'Distance') {
        window.aimbotDistance = item.value;
    } else if (label === 'Smoothing') {
        window.aimbotSmooth = item.value;
    } else if (label === 'Prediction') {
        window.aimbotPrediction = item.value;
    }
    
    renderMenu();
}

function executeButton(item, index) {
    const label = item.label.replace(/[🏠🔫🎯🚜🚗🤪]/g, '').trim();
    
    if (label === 'Heal & Armor') {
        window.healPlayer = true;
        setTimeout(() => window.healPlayer = false, 100);
    } else if (label === 'Teleport') {
        window.teleportPlayer = true;
        setTimeout(() => window.teleportPlayer = false, 100);
    } else if (label === 'Refill Ammo') {
        window.refillAmmo = true;
        setTimeout(() => window.refillAmmo = false, 100);
    } else if (label === 'Repair') {
        window.repairVehicle = true;
        setTimeout(() => window.repairVehicle = false, 100);
    } else if (label === 'Flip') {
        window.flipVehicle = true;
        setTimeout(() => window.flipVehicle = false, 100);
    } else if (label === 'Delete') {
        window.deleteVehicle = true;
        setTimeout(() => window.deleteVehicle = false, 100);
    }
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
