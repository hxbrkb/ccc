// API基础URL
const API_URL = 'http://localhost:3000/api/characters';

// DOM元素
const roleTableBody = document.getElementById('roleTableBody');
const searchInput = document.getElementById('searchInput');
const paginationContainer = document.getElementById('paginationContainer');

// 全局变量
let currentPage = 1;
let totalPages = 1;

// 获取角色数据
async function fetchCharacters(searchTerm = '', page = 1) {
    try {
        let url = `${API_URL}?page=${page}&limit=10`;
        if (searchTerm) {
            url += `&search=${encodeURIComponent(searchTerm)}`;
        }
        
        const response = await fetch(url);
        const result = await response.json();
        
        currentPage = result.page;
        totalPages = result.totalPages;
        
        renderTable(result.data);
        renderPagination();
    } catch (error) {
        console.error('Error fetching characters:', error);
        alert('获取角色数据失败');
    }
}

// 渲染表格
function renderTable(characters) {
    roleTableBody.innerHTML = '';
    
    characters.forEach(character => {
        const row = document.createElement('tr');
        
        const abyssClass = getRatingClass(character.abyss_rating);
        const pvpClass = getRatingClass(character.pvp_rating);
        const highPressureClass = getRatingClass(character.high_pressure_rating);
        const singleTargetClass = getRatingClass(character.single_target_rating);
        const multiTargetClass = getRatingClass(character.multi_target_rating);
        const staminaClass = getRatingClass(character.stamina_rating);
        
        row.innerHTML = `
            <td>${character.name}</td>
            <td>
                ${character.image_path ? 
                    `<img src="${character.image_path}" class="character-image" alt="${character.name}">` : 
                    '<i class="fas fa-user-circle" style="font-size: 24px; color: #ccc;"></i>'}
            </td>
            <td class="${abyssClass}">${character.abyss_rating}</td>
            <td class="${pvpClass}">${character.pvp_rating}</td>
            <td class="${highPressureClass}">${character.high_pressure_rating}</td>
            <td class="${singleTargetClass}">${character.single_target_rating}</td>
            <td class="${multiTargetClass}">${character.multi_target_rating}</td>
            <td class="${staminaClass}">${character.stamina_rating}</td>
        `;
        
        roleTableBody.appendChild(row);
    });
}

// 根据评级获取CSS类
function getRatingClass(rating) {
    if (!rating) return '';
    
    // 处理像"C/B"这样的复合评级
    const primaryRating = rating.split('/')[0];
    
    switch(primaryRating) {
        case 'SS+': return 'ss-plus';
        case 'SS': return 'ss';
        case 'S+': return 's-plus';
        case 'S': return 's';
        case 'A+': return 'a-plus';
        case 'A': return 'a';
        case 'B+': return 'b-plus';
        case 'B': return 'b';
        case 'C': return 'c';
        case 'D': return 'd';
        default: return '';
    }
}

// 渲染分页
function renderPagination() {
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    
    // 上一页按钮
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.className = 'pagination-btn';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            fetchCharacters(searchInput.value.trim(), currentPage - 1);
        }
    });
    paginationContainer.appendChild(prevBtn);
    
    // 页码按钮
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        const firstPageBtn = document.createElement('button');
        firstPageBtn.textContent = '1';
        firstPageBtn.className = 'pagination-btn';
        firstPageBtn.addEventListener('click', () => {
            fetchCharacters(searchInput.value.trim(), 1);
        });
        paginationContainer.appendChild(firstPageBtn);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis';
            paginationContainer.appendChild(ellipsis);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.addEventListener('click', () => {
            fetchCharacters(searchInput.value.trim(), i);
        });
        paginationContainer.appendChild(pageBtn);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis';
            paginationContainer.appendChild(ellipsis);
        }
        
        const lastPageBtn = document.createElement('button');
        lastPageBtn.textContent = totalPages;
        lastPageBtn.className = 'pagination-btn';
        lastPageBtn.addEventListener('click', () => {
            fetchCharacters(searchInput.value.trim(), totalPages);
        });
        paginationContainer.appendChild(lastPageBtn);
    }
    
    // 下一页按钮
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.className = 'pagination-btn';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            fetchCharacters(searchInput.value.trim(), currentPage + 1);
        }
    });
    paginationContainer.appendChild(nextBtn);
    
    // 页码跳转
    const pageJumpContainer = document.createElement('div');
    pageJumpContainer.className = 'page-jump-container';
    
    const jumpInput = document.createElement('input');
    jumpInput.type = 'number';
    jumpInput.min = '1';
    jumpInput.max = totalPages;
    jumpInput.value = currentPage;
    jumpInput.className = 'page-jump-input';
    
    const jumpBtn = document.createElement('button');
    jumpBtn.textContent = '跳转';
    jumpBtn.className = 'page-jump-btn';
    jumpBtn.addEventListener('click', () => {
        const page = parseInt(jumpInput.value);
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            fetchCharacters(searchInput.value.trim(), page);
        }
    });
    
    pageJumpContainer.appendChild(document.createTextNode('跳至'));
    pageJumpContainer.appendChild(jumpInput);
    pageJumpContainer.appendChild(document.createTextNode(`页 (共 ${totalPages} 页)`));
    pageJumpContainer.appendChild(jumpBtn);
    
    paginationContainer.appendChild(pageJumpContainer);
}

// 搜索功能
function handleSearch() {
    const searchTerm = searchInput.value.trim();
    currentPage = 1; // 搜索时重置到第一页
    fetchCharacters(searchTerm, currentPage);
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// 事件监听器
searchInput.addEventListener('input', debounce(handleSearch, 300));

// 初始化
fetchCharacters();